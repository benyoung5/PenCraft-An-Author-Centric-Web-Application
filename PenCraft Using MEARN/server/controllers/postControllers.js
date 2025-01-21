const Post = require('../models/postModel');
const User = require("../models/userModel");
const path = require('path');
const fs = require('fs');
const uuid = require('uuid').v4;
const HttpError = require('../models/errorModel'); 











// Create a post
// POST: api/posts
// PROTECTED
const createPost = async (req, res, next) => {
    try {
        const { title, category, description } = req.body;  // Ensure these variables are destructured from req.body

        if (!title || !category || !description || !req.files || !req.files.thumbnail) {
            return next(new HttpError("Fill in all fields and choose a thumbnail.", 422));
        }

        const { thumbnail } = req.files;

        // Check the file size
        if (thumbnail.size > 2000000) {  // 2MB size limit check
            return next(new HttpError("Thumbnail too big. File should be less than 2MB.", 422));
        }

        const uploadsDir = path.join(__dirname, '..', 'uploads');
        // Ensure the directory exists
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        let fileName = thumbnail.name;
        let splittedFilename = fileName.split('.');
        let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];

        thumbnail.mv(path.join(uploadsDir, newFilename), async (err) => {
            if (err) {
                return next(new HttpError("Failed to move file.", 500));
            }        

            try {
                const newPost = await Post.create({
                    title,
                    category,
                    description,
                    thumbnail: newFilename,
                    creator: req.user.id
                });

                if (!newPost) {
                    return next(new HttpError("Post couldn't be created.", 422));
                }

                // Find user and increase post count by 1
                const currentUser = await User.findById(req.user.id);
                if (currentUser) {  // Check if user exists before updating
                    const userPostCount = currentUser.posts + 1;
                    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
                }

                res.status(201).json(newPost);
            } catch (error) {
                next(new HttpError("Error creating post: " + error.message, 500));
            }
        });
    } catch (error) {
        next(new HttpError("Error processing request: " + error.message, 500)); // Improved error message for clarity
    }
};












// Get all posts
// Get : api/posts
// UNPROTECTED
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error)); 
    }};












// Get single post
// Get : api/posts/:id
// UNPROTECTED
const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) { // Added missing curly braces for if statement
            return next(new HttpError("Post not found.", 404));
        }
        res.status(200).json(post); // Added missing semicolon and replaced bullet point with dot in json method
    } catch (error) {
        return next(new HttpError(error)); // Added missing semicolon and fixed HttpError instantiation
    }
};









// Get posts by Category
// Get : api/posts/categories/:category
// UNPROTECTED
const getCatPosts = async (req, res, next) => {
    try {
        const { category } = req.params;
        const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
        res.status(200).json(catPosts);
    } catch (error) {
        return next(new HttpError(error));
    }
};



// Get Author Posts
// Get : api/posts/users/:id
// UNPROTECTED
const getUserPosts = async (req, res, next) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }};


// EDIT POST
// PATCH: api/posts/:id
// PROTECTED
const editPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { title, category, description } = req.body;

        if (!title || !category || description.length < 12) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const oldPost = await Post.findById(postId);
        if (!oldPost) {
            return next(new HttpError("Post not found.", 404));
        }

        // Authorization check to ensure the requester is the creator of the post
        if (req.user.id !== oldPost.creator.toString()) {
            return next(new HttpError("Unauthorized to edit this post.", 403));
        }

        let updatedPost;

        if (!req.files || !req.files.thumbnail) {
            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true });
        } else {
            // Delete old thumbnail if it exists
            if (oldPost.thumbnail) {
                fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), err => {
                    if (err) {
                        console.error("Failed to delete old thumbnail:", err);
                        // Continue even if there is an error deleting the old thumbnail
                    }
                });
            }

            const { thumbnail } = req.files;
            if (thumbnail.size > 2000000) {
                return next(new HttpError("Thumbnail too big. Should be less than 2MB", 422));
            }

            const fileName = thumbnail.name;
            const splittedFilename = fileName.split('.');
            const newFilename = `${splittedFilename[0]}-${uuid()}.${splittedFilename[splittedFilename.length - 1]}`;

            await new Promise((resolve, reject) => {
                thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), err => {
                    if (err) {
                        reject(new HttpError("Failed to move file.", 500));
                    }
                    resolve();
                });
            });

            updatedPost = await Post.findByIdAndUpdate(postId, {
                title,
                category,
                description,
                thumbnail: newFilename
            }, { new: true });
        }

        if (!updatedPost) {
            return next(new HttpError("Couldn't update post.", 400));
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        next(new HttpError("Error updating post: " + error.message, 500));
    }
};











// DELETE POST
// DELETE : api/posts/:id
// PROTECTED
const deletePost = async (req, res, next) => {
    const postId = req.params.id;
    if (!postId) {
        return next(new HttpError("Post unavailable.", 400));
    }

    const post = await Post.findById(postId);
    if (!post) {
        return next(new HttpError("Post not found.", 404));
    }

    if (req.user.id === post.creator.toString()) { 
        const fileName = post.thumbnail;

        // delete thumbnail from uploads folder
        if (fileName) {
            fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
                if (err) {
                    return next(new HttpError("Failed to delete file.", 500));
                }
                await deletePostAndAdjustUser(postId, req, res, next);
            });
        } else {
            await deletePostAndAdjustUser(postId, req, res, next);
        }
    } else {
        next(new HttpError("Unauthorized to perform this action.", 403));
    }
};

async function deletePostAndAdjustUser(postId, req, res, next) {
    try {
        await Post.findByIdAndDelete(postId);

        const currentUser = await User.findById(req.user.id);
        if (currentUser && currentUser.posts > 0) {
            const userPostCount = currentUser.posts - 1;
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
        }

        res.status(200).json({ message: `Post ${postId} deleted successfully.` });
    } catch (error) {
        next(new HttpError("Error updating post count: " + error.message, 500));
    }
};





module.exports = { createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost };

