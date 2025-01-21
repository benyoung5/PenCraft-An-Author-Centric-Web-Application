import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './imageSlider.css';
import img1 from '../Images/img1.jpg';
import img2 from '../Images/img2.jpg';
import img3 from '../Images/img3.jpg';
import img4 from '../Images/img4.jpg';

const initialImages = [
    { src: img1, title: 'WELCOME TO', type: 'PENCRAFT', description: 'where your words find a home and your stories come to life. Developed with the needs of authors in mind, our app provides a suite of tools designed to enhance your writing journey, from the first draft to publication....' },
    { src: img2, title: 'OUR MISSION', type: 'EMPOWERMENT', description: 'Our mission is to empower authors of all genres and experience levels by providing innovative tools that simplify the writing process, enhance productivity, and foster a supportive community of like-minded creatives. Whether you are penning your first short story or are a seasoned novelist, [App Name] is here to support your creative endeavors...' },
    { src: img3, title: 'JOIN OUR', type: 'COMMUNITY', description: 'Become a part of PENCRAFT today and transform the way you write, share, and connect Let us write the future, together....' },
    { src: img4, title: 'OUR LOVELY', type: 'TEAM', description: 'Our team comprises former authors, editors, and technology enthusiasts who are united by a common goal: to make writing more accessible and enjoyable. We understand the nuances of creative work and are dedicated to providing service that respects the art and craft of writing....' }
];

function ImageSlider() {
    const [images, setImages] = useState(initialImages);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animationClass, setAnimationClass] = useState('');

    const handleTransitionEnd = () => {
        setAnimationClass('');
    };

    const nextSlide = () => {
        const nextIndex = (currentIndex + 1) % images.length;
        const updatedImages = [...images.slice(nextIndex), ...images.slice(0, nextIndex)];
        setImages(updatedImages);
        setAnimationClass('next animating');
        setTimeout(() => {
            setAnimationClass('next');
            setCurrentIndex(0); // Reset currentIndex to 0 after reordering images
            setTimeout(() => {
                setAnimationClass('');
            }, 1000); // Assuming the animation duration is 1000ms
        });
    };

    const prevSlide = () => {
        const lastIndex = (currentIndex - 1 + images.length) % images.length;
        const updatedImages = [images[lastIndex], ...images.slice(0, lastIndex)];
        setImages(updatedImages);
        setAnimationClass('prev animating');
        setTimeout(() => {
            setAnimationClass('prev');
            setCurrentIndex(0); // Reset currentIndex to 0 after reordering images
            setTimeout(() => {
                setAnimationClass('');
            }, 1000); // Assuming the animation duration is 1000ms
        });
    };

    useEffect(() => {
        const slider = document.querySelector('.slider');
        slider.addEventListener('animationend', handleTransitionEnd);
        return () => {
            slider.removeEventListener('animationend', handleTransitionEnd);
        };
    }, []);

    useEffect(() => {
        const autoSlide = setInterval(nextSlide, 5000);
        return () => clearInterval(autoSlide);
    }, [currentIndex, images]);  // The dependencies ensure the interval is reset properly if images or currentIndex changes

    return (
        <div className={`slider ${animationClass}`}>
            <div className="list">
                {images.map((img, i) => (
                    <div className={`item ${i === currentIndex ? 'active' : ''} ${animationClass ? 'animating' : ''}`} key={i}>
                        <img src={img.src} alt={img.type} />
                        <div className="content">
                            <div className="title">{img.title}</div>
                            <div className="type">{img.type}</div>
                            <div className="description">{img.description}</div>
                            <Link to="/login" className="button"><button>Get Started</button></Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="thumbnail">
                {images.map((img, i) => (
                    <div className={`item ${i === currentIndex ? 'active' : ''}`} key={i} onClick={() => setCurrentIndex(i)}>
                        <img src={img.src} alt={img.type} />
                    </div>
                ))}
            </div>
            <div className="nextPrevArrows">
                <button className="prev" onClick={prevSlide}>&lt;</button>
                <button className="next" onClick={nextSlide}>&gt;</button>
            </div>
            <div>
                <h1 className='recent_posts'>Recent Posts</h1>
            </div>
        </div>
    );
}

export default ImageSlider;
