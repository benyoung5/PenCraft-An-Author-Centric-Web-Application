import React from 'react';
import Posts from  '../Components/Posts';
// import Pagination from '../Components/Pagination';
// import { usePopularPost, usePosts } from '../hooks/post_hooks';


const Home = () => {

  // const { posts, numOfPages, setPage } = usePosts({
  //   writerId: "",
  // });
  // const popular = usePopularPost();

  // const handlePageChange = (val) => {
  //   setPage(val);
  // };

  // const randomIndex = Math.floor(Math.random() * posts?.length);

  // if (posts?.length < 1)
  //   return (
  //     <div className='w-full h-full py-8 flex items-center justify-center'>
  //       <span className='text-lg text-slate-500'>No Post Available</span>
  //     </div>
  //   );


  return (
    <div>
    <h2 className='recent_posts'>Recent Articles</h2>
    <Posts />
    {/* <Pagination
        totalPages={numOfPages}
        onPageChange={handlePageChange}
    /> */}
  </div>
  );
}

export default Home;
