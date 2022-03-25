import React from 'react';
import { useNavigate } from 'react-router-dom'

import '../assets/NavBar.css';

const NavBar = ({}) => {
  const navigate = useNavigate();
  const path = localStorage.state;

  return (
    <div className='nav-bar'>
      <div onClick={()=>{localStorage.state="swap";  navigate('/swap')}} 
        className={path === "swap" ? 'nav-select' : 'nav-not-select'}>Swap</div>
      <div onClick={()=>{localStorage.state="stake"; navigate('/stake')}} 
        className={path === "stake" ? 'nav-select' : 'nav-not-select'}>Stake</div>
      <div onClick={()=>{localStorage.state="vote"; navigate('/vote')}} 
        className={path === "vote" ? 'nav-select' : 'nav-not-select'}>Vote</div>
      <div onClick={()=>{localStorage.state="admin"; navigate('/admin')}} 
        className={path === "admin" ? 'nav-select' : 'nav-not-select'}>Admin</div>
    </div>
  );
}
export default NavBar;