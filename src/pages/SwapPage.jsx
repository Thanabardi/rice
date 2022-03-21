import React from 'react';
import { Link } from 'react-router-dom';

import '../assets/SwapPage.css';

const Home = () => {
  return (
    <div className='home'>
        <h1>Home</h1>
        <Link to={'/vote'}>vote</Link>
    </div>
  );
}
export default Home;