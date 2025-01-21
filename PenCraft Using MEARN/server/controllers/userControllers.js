// Import necessary libraries
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid').v4;
const User = require("../models/userModel");
const HttpError = require("../models/errorModel");




// Register a new user
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;

        if (!name || !email || !password || !password2) {
            return next(new HttpError("Fill in all fields.", 422));
        }
        
        const newEmail = email.toLowerCase();
        
        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return next(new HttpError("Email already exists.", 422));
        }

        if (password.trim().length < 6) {
            return next(new HttpError("Password should be at least 6 characters long.", 422));
        }
        
        if (password !== password2) {
            return next(new HttpError("Passwords do not match.", 422));
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email: newEmail, password: hashedPass });
        res.status(201).json(`New User ${newUser.email} registered.`);
        
    } catch (error) {
        return next(new HttpError("User Registration Failed.", 500));
    }
};

// Login a registered user
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const newEmail = email.toLowerCase();
        const user = await User.findOne({ email: newEmail });

        if (!user) {
            return next(new HttpError("Invalid credentials.", 422));
        }

        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            return next(new HttpError("Invalid credentials.", 422));
        }

        const {_id: id, name} = user;
        const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token, id, name });

    } catch (error) {
        return next(new HttpError("Login failed. Please check your credentials.", 422));
    }
};

// Get a registered user
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return next(new HttpError("User not found.", 404));
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError("Error retrieving user.", 500));
    }
};

// Change user avatar
const changeAvatar = async (req, res, next) => {
    try {
        if (!req.files || !req.files.avatar) {
            return next(new HttpError("Please choose an image.", 422));
        }

        const { avatar } = req.files;
        if (avatar.size > 500000) { // 500 KB size limit
            return next(new HttpError("Profile picture too big. Should be less than 500kb", 422));
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError("User not found.", 404));
        }

        const fileName = avatar.name;
        const fileParts = fileName.split('.');
        const fileExtension = fileParts.pop();
        const newFilename = `${uuid()}.${fileExtension}`;

        avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
            if (err) {
                return next(new HttpError("Failed to update avatar.", 500));
            }

            if (user.avatar) {
                fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), err => {
                    if (err) console.error("Failed to delete old avatar:", err);
                });
            }

            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, { avatar: newFilename }, { new: true });
            if (!updatedAvatar) {
                return next(new HttpError("Avatar couldn't be changed.", 422));
            }

            res.status(200).json(updatedAvatar);
        });
    } catch (error) {
        return next(new HttpError("Error in changeAvatar.", 500));
    }
};

// Edit user details
const editUser = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!name || !name.trim() || !email || !email.trim() || !currentPassword || !currentPassword.trim() ||
            !newPassword || !newPassword.trim() || !confirmNewPassword || !confirmNewPassword.trim()) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError("User not found.", 404));
        }

        const normalizedEmail = email.trim().toLowerCase();
        const emailExist = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
        if (emailExist) {
            return next(new HttpError("Email already exists with another user.", 422));
        }

        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validateUserPassword) {
            return next(new HttpError("Invalid current password.", 422));
        }

        if (newPassword !== confirmNewPassword) {
            return next(new HttpError("New passwords do not match.", 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        }, { new: true, select: '-password' });

        res.status(200).json(updatedUser);

    } catch (error) {
        return next(new HttpError("User update failed: " + error.message, 500));
    }
};

// Get authors (all users)
const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password');
        res.json(authors);
    } catch (error) {
        return next(new HttpError("Failed to retrieve authors.", 500));
    }
};

module.exports = { registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors };
