import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AboutUs.css'; 
import tent1 from  "../Images/tent-1.jpg";
import tent2 from  "../Images/tent-2.jpg";

const About = () => {
    return (
        <div className="about_container about-us">
            <div className="container__left">
                <h1>Learn About Who We Are</h1>
                <div className="container__btn">
                <Link to="/login">
                     <button className="about_btn">Get Started</button>
                </Link>
                </div>
            </div>
            <div className="container__right">
                <div className="images">
                    <img src={tent1} alt="tent-1" className="tent-1" />
                    <img src={tent2} alt="tent-2" className="tent-2" />
                </div>
                <div className="content">
                    <h2>Our Vision</h2>
                    <h3>PENCRAFT LIMITED</h3>
                    <p>At PENCRAFT, we envision a world where every author can freely express their ideas and have 
                        access to the resources they need to succeed. We are committed to continuously evolving and 
                        adapting to the needs of writers everywhere, helping bring diverse and compelling stories into 
                        the light.</p>
                </div>
            </div>
        </div>
    );
}

export default About;
