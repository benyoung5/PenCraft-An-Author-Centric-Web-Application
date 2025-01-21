import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactTimeAgo from  'react-time-ago';
import TimeAgo from  'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ru from 'javascript-time-ago/locale/ru';


TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);



const PostAuthor = ({authorID,createdAt}) => {
  const [author, setAuthor] = useState(null); // Initialize author state

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${authorID}`);
        setAuthor(response.data); // Assuming the data is in response.data
      } catch (error) {
        console.log(error); // Log any errors
      }
    };

    getAuthor();
  }, [authorID]);
  return (
    <Link to={`/posts/users/${authorID}`} className="post-author"> 
      <div className="post-author-avatar">
      <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${author?.avatar}`} alt="Author Avatar" />
      </div>
      <div className="post-author-details">
        <h5>By: {author?.name}</h5>
        <small><ReactTimeAgo date={new Date(createdAt)} locale='en-US' /></small>
      </div>
    </Link>
  );
}

export default PostAuthor
