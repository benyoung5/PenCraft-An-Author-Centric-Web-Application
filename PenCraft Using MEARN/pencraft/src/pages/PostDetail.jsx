import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Components/Loader';
import DeletePost from './DeletePost';
import { UserContext } from '../context/userContext';
import PostAuthor from '../Components/PostAuthor';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        const getPost = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);

                console.log(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);

                setPost(response.data);
                setIsLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || error.message || "An unexpected error occurred");
                setIsLoading(false);
            }
        };

        getPost();
    }, [id]);

    if (isLoading) return <Loader />;
    if (error) return <p className='error'>{error}</p>;
    if (!post) return <p>No post found.</p>;

    return (
        <section className="post-detail">
            <div className="container post-detail-container">
                <div className="post-detail-header">
                  <PostAuthor authorID={post.creator} createdAt={post.createdAt}/>
                    {currentUser?.id === post.creator && (
                        <div className="post-detail-buttons">
                            <Link to={`/posts/${post?._id}/edit`} className="btn sm primary">Edit</Link>
                            <DeletePost postId={id}/>
                        </div>
                    )}
                </div>
                <h1>{post.title}</h1>
                <div className="post-detail-thumbnail">
                    <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="Post Thumbnail" />
                </div>
                <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
            </div>
        </section>
    );
};

export default PostDetail;
