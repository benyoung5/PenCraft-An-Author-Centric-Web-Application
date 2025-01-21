import React from 'react';
import LoadingGif from '../Images/Loader.gif';

const Loader = () => {
  return (
    <div className='loader'>
      <div className="loader-image">
        <img src={Loader} alt="Loading..." />
      </div>
    </div>
  );
};

export default Loader;
