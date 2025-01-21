import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaCheck } from "react-icons/fa";
import axios from 'axios';
import { UserContext } from '../context/userContext';

const UserProfile = () => {
  const [file, setFile] = useState(null); // State for the file object
  const [avatarUrl, setAvatarUrl] = useState(''); // State for the avatar URL
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');

  const [isAvatarTouched, setIsAvatarTouched] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page if no user is logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        const { name, email, avatar } = response.data;
        setName(name);
        setEmail(email);
        setAvatarUrl(`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError(error.message);
      }
    };

    if (token && currentUser.id) {
      getUser();
    }
  }, [token, currentUser.id, navigate]);

  const changeAvatarHandler = async () => {
    if (!file) {
      setError('No file selected.');
      return;
    }
    setIsAvatarTouched(false);
    const postData = new FormData();
    postData.append('avatar', file);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, postData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvatarUrl(`${process.env.REACT_APP_ASSETS_URL}/uploads/${response.data.avatar}`);
      setFile(null); // Clear the file state after upload
    } catch (error) {
      console.error('Failed to update avatar:', error);
      setError(error.response.data.message);
    }
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();
    if (!name || !email || !currentPassword || !newPassword || !confirmNewPassword) {
      setError('All fields must be filled out.');
      return;
    }
    const userData = new FormData();
    userData.append('name', name);
    userData.append('email', email);
    userData.append('currentPassword', currentPassword);
    userData.append('newPassword', newPassword);
    userData.append('confirmNewPassword', confirmNewPassword);

    try {
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`, userData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        navigate('/logout');
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <section className="profile">
      <div className="container profile_container">
        <Link to={`/myposts/${currentUser.id}`} className="btn">My Posts</Link>
        <div className="profile_details">
          <div className="avatar_wrapper">
            <div className="profile_avatar">
              <img src={avatarUrl || 'default_avatar.png'} alt="Profile" />
            </div>
            <form className="avatar_form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={e => setFile(e.target.files[0])}
                accept='image/png, image/jpeg, image/jpg'
              />
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}><FaEdit /></label>
            </form>
            {isAvatarTouched && <button className="profile__avatar-btn" onClick={changeAvatarHandler}><FaCheck /></button>}
          </div>
          <h1>{currentUser.name}</h1>
          <form className="form profile_form" onSubmit={updateUserDetails}>
            {error && <p className="form_error-message">{error}</p>}
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            <input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirm new password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
            <button type="submit" className="btn primary">Update details</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
