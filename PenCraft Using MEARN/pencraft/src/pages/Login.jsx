// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';


// const Login = () => {
//   const [userData, setUserData] = useState({
//     email: '',
//     password: '',
//   });

//   const changeInputHandler = (e) => {
//     setUserData(prevState => ({
//       ...prevState,
//       [e.target.name]: e.target.value
//     }));
//   };

//   return (
//     <section className="login">
//       <div className="container">
//         <h2>Sign In</h2>
//         <form className="form login_form">
//           <p className="form_error-message">This is an error message</p>
//           <input type="email" placeholder='Email' name='email' value={userData.email} onChange={changeInputHandler} autoFocus />
//           <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler} />
//           <button type="submit" className='btn primary'>Login</button>
//         </form>
//         <small> Don't have an account? <Link to="/register">Sign Up</Link></small>
//       </div>
//     </section>
//   );
// };

// export default Login;


import React, { useState, useContext } from 'react';
import * as Components from '../Components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

function Login() {
    const [signIn, toggle] = useState(true);
    const [error, setError] = useState('');
    const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '', password2: '' });
    const [signInData, setSignInData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
        
    const changeInputHandler = (e, isSignUp) => {
        const { name, value } = e.target;
        if (isSignUp) {
            setSignUpData(prevState => ({ ...prevState, [name]: value }));
        } else {
            setSignInData(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const registerUser = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, signUpData);
            if (response.status === 201 || response.status === 200) { // Ensure the status code reflects a successful registration
                console.log("Registration successful: ", response.data);
                // Use window.location to navigate, which will cause the page to refresh
                window.location.href = '/login'; 
            } else {
                setError("Couldn't register user. Please try again.");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred during registration.';
            setError(errorMessage);
            console.error("Registration error: ", errorMessage);
        }
    };
    
    

    const { setCurrentUser } = useContext(UserContext);
    const loginUser = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, signInData);
            const user = response.data;
            console.log(user);
            setCurrentUser(user);
            navigate('/');
        } catch (err) {
            setError(err.response.data.message) //|| err.message || 'An error occurred during login.');
        }
    };

    return(
        <Components.Container>
            <Components.SignUpContainer signinIn={signIn}>
                <Components.Form onSubmit={registerUser}>
                    <Components.Title>Create Account</Components.Title>
                    {error && <div><p className="form_error-message">{error}</p></div>}
                    <Components.Input type='text' placeholder='Full Name' name='name' value={signUpData.name} onChange={(e) => changeInputHandler(e, true)} />
                    <Components.Input type='email' placeholder='Email' name='email' value={signUpData.email} onChange={(e) => changeInputHandler(e, true)} />
                    <Components.Input type='password' placeholder='Password' name='password' value={signUpData.password} onChange={(e) => changeInputHandler(e, true)} />
                    <Components.Input type='password' placeholder='Confirm Password' name='password2' value={signUpData.password2} onChange={(e) => changeInputHandler(e, true)} />
                    <Components.Button>Sign Up</Components.Button>
                </Components.Form>
            </Components.SignUpContainer>

            <Components.SignInContainer signinIn={signIn}>
                <Components.Form onSubmit={loginUser}>
                    <Components.Title>Sign in</Components.Title>
                    {error && <div><p className="form_error-message">{error}</p></div>}
                    <Components.Input type='email' placeholder='Email' name='email' value={signInData.email} onChange={(e) => changeInputHandler(e, false)} autoFocus />
                    <Components.Input type='password' placeholder='Password' name='password' value={signInData.password} onChange={(e) => changeInputHandler(e, false)} />
                    <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                    <Components.Button>Sign In</Components.Button>
                </Components.Form>
            </Components.SignInContainer>

            <Components.OverlayContainer signinIn={signIn}>
                <Components.Overlay signinIn={signIn}>
                    <Components.LeftOverlayPanel signinIn={signIn}>
                        <Components.OverlayTitle>Hello Friend!</Components.OverlayTitle>
                        <Components.Paragraph>
                            Is this your first time visiting us?<br/>
                            You're just a few clicks away.
                        </Components.Paragraph>
                        <Components.GhostButton onClick={() => toggle(true)}>Sign In</Components.GhostButton>
                    </Components.LeftOverlayPanel>

                    <Components.RightOverlayPanel signinIn={signIn}>
                        <Components.OverlayTitle>Welcome Back!</Components.OverlayTitle>
                        <Components.Paragraph>
                            We've missed you <br/>
                            Login to stay updated.
                        </Components.Paragraph>
                        <Components.GhostButton onClick={() => toggle(false)}>Sign Up</Components.GhostButton>
                    </Components.RightOverlayPanel>
                </Components.Overlay>
            </Components.OverlayContainer>
        </Components.Container>
    )
}

export default Login;
