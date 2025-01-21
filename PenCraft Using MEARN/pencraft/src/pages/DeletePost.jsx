// import React, { useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserContext } from '../context/userContext';

// const DeletePost = () => {
  //  const handleDelete = async () => {
     //   if (!window.confirm("Are you sure you want to delete this post?")) {
      //      return; // Do nothing if user cancels the confirmation
       // }

     //   try {
       //     const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${postId}`, {
      //          headers: { Authorization: `Bearer ${token}` }
         //   });
        ///    if (response.status === 200) {
    //            alert('Post deleted successfully');
         //       navigate('/'); // Redirect somewhere relevant after deletion
          //  }
       // } catch (error) {
      //      console.error('Failed to delete post:', error);
     //       alert('Failed to delete post');
//       }
 //   };

//   const navigate = useNavigate();

//     const { currentUser } =  useContext(UserContext)
//     const token = currentUser?.token;

//     //redirect to login page for any user who isn't loggedin
//     useEffect(() => {
//         if (!token) {
//             navigate('/login')
//         }
//     }, []);

//   return (
//     <link className='btn sm danger'>Delete</link>
//   )
// }

// export default DeletePost


import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';  // Assuming you use axios for HTTP requests
import Loader from '../Components/Loader';

const DeletePost = ({ postId: id }) =>{
    const navigate = useNavigate();
    const location = useLocation() 
    const [isLoading, setIsLoading] = useState(false)


    const { currentUser } = useContext(UserContext);
    const token = currentUser?.token;

    // Redirect to login page if no user is logged in
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]); // Adding dependencies to useEffect

    const removePost = async () => {
        setIsLoading(true)
        try{ 
            const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`,{withCredentials:
                true, headers:  {Authorization: `Bearer ${token}`}})
                if(response.status == 201) {
                    if(location.pathname == `/myposts/${currentUser.id}`)
                    navigate(0)
                }else{
                    navigate('/')
                }
                setIsLoading(false);
        } catch (error) { 
            console.log("Couldn't delete post.")
            
        }

    }

    if(isLoading) {
        return <Loader/>
    }

    return (
        <Link className='btn sm danger' onClick={() => removePost(id)}>Delete</Link >
    );
}

export default DeletePost;

