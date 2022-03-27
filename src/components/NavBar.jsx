import React from 'react';
import { useNavigate } from 'react-router-dom'

import '../assets/NavBar.css';

const NavBar = ({}) => {
  const navigate = useNavigate();
  const path = window.location.pathname;

  return (
    <div>
      <div className='nav-bar'>
        <button onClick={()=>{localStorage.state="swap";  navigate('/swap')}} 
          className={path === "/swap" ? 'nav-select' : 'nav-not-select'}>Swap</button>
        <button onClick={()=>{localStorage.state="stake"; navigate('/stake')}} 
          className={path === "/stake" ? 'nav-select' : 'nav-not-select'}>Stake</button>
        <button onClick={()=>{localStorage.state="vote"; navigate('/vote')}} 
          className={path === "/vote" ? 'nav-select' : 'nav-not-select'}>Vote</button>
        <button onClick={()=>{localStorage.state="admin"; navigate('/admin')}} 
          className={path === "/admin" ? 'nav-select' : 'nav-not-select'}>Admin</button>
      </div>
    </div>
  );
}
export default NavBar;