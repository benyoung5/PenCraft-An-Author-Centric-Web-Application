import React, { useState, useEffect } from 'react';
import PostItem from '../Components/PostItem';
import Loader from '../Components/Loader';
import { useParams } from 'react-router-dom';
import axios  from 'axios'

const AuthorPosts = () => {
    const [posts, setPosts] = useState(/*DUMMY_POSTS*/ []);
    const [isLoading, setIsLoading] = useState(false); // State to handle loading


    const {id} = useParams(); 
    
      useEffect(() => {
        const fetchPosts = async () => {
          setIsLoading(true);  // Start loading
          try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`);
            setPosts(response.data);  // Assuming the data is directly accessible in the response
            setIsLoading(false);  // End loading
          } catch (err) {
            console.log(err);  // Log any errors
          }
    
          setIsLoading(false);  // End loading even if there's an error
        };
    
        fetchPosts();  // Call the async function to fetch posts
      }, [id]); // Dependency array is empty, so this effect runs only once after the component mounts
    
    
      return (
        <section className="posts">
            {posts.length > 0 ? (
                <div className="container posts-container">
                    {posts.map(({_id: id, thumbnail, category, title, description, creator, createdAt }) => (
                        <PostItem
                            key={id}
                            postID={id}
                            thumbnail={thumbnail}
                            category={category}
                            title={title}
                            description={description}
                            authorID={creator}
                            createdAt={createdAt}
                        />
                    ))}
                </div>
            ) : (
                <h2 className='center'>No Posts Found</h2>
            )}
        </section>
    
      );
    }
    

export default AuthorPosts



