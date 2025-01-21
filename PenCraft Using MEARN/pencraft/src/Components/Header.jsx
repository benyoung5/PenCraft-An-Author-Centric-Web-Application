import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext';

const Header = () => {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [avatarUrl, setAvatarUrl] = useState('default_placeholder.jpg'); // Initial placeholder
    const navigate = useNavigate();
    const token = currentUser?.token;

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        let isMounted = true;

        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const { avatar } = response.data;
                if (isMounted) {
                    setCurrentUser(prev => ({ ...prev, avatar }));
                    setAvatarUrl(`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Failed to fetch user data:', error);
                }
            }
        };

        if (currentUser?.id) {
            fetchUserDetails();
        }

        return () => {
            isMounted = false;
        };
    }, [currentUser?.id, token, setCurrentUser, navigate]);

    return (
        <nav>
            <div className="container nav_container">
                <Link to="/" className="nav_logo">PENCRAFT</Link>
                <ul className="nav_menu">
                    {currentUser?.id ? (
                        <>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/create">Write Article</Link></li>
                            <li><Link to="/authors">Authors List</Link></li>
                            <li><Link to="/logout">Logout</Link></li>
                            <li><Link className='force_name' to={`/profile/${currentUser.id}`}>{currentUser.name}</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/authors">Authors</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </>
                    )}
                </ul>
                {currentUser?.id && (
                    <div className='dashhead_Image nav_profile'>
                        <img src={avatarUrl} alt={`${currentUser.name}'s Avatar`} />
                        {/* The input and onChange handling here is simplified and corrected */}
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            onChange={e => {
                                const file = e.target.files[0];
                                if (file) {
                                    const formData = new FormData();
                                    formData.append('avatar', file);
                                    axios.post(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}/avatar`, formData, {
                                        withCredentials: true,
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                            'Content-Type': 'multipart/form-data'
                                        }
                                    }).then(response => {
                                        console.log('Avatar uploaded successfully');
                                        setAvatarUrl(`${process.env.REACT_APP_ASSETS_URL}/uploads/${response.data.avatar}`);
                                    }).catch(error => {
                                        console.error('Failed to upload avatar:', error);
                                    });
                                }
                            }}
                            accept='image/png, image/jpeg, image/jpg'
                        />
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Header;
