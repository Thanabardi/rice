import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

import '../assets/NavBar.css';

const NavBar = ({}) => {
  const navigate = useNavigate();
  const path = window.location.pathname;

  useEffect(() => {
  // ask for permission to go to mumbai network
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: "0x13881",
        rpcUrls: ["https://rpc-mumbai.matic.today"],
        chainName: "Polygon Mumbai",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18
        },
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
      }]
    });
  }
},[]);


  return (
    <div>
      <div className='nav-bar'>
        <button onClick={()=>{localStorage.state="swap";  navigate('/swap')}} 
          className={path === "/swap" ? 'nav-select' : 'nav-not-select'}>Swap</button>
        <button onClick={()=>{localStorage.state="stake"; navigate('/stake')}} 
          className={path === "/stake" ? 'nav-select' : 'nav-not-select'}>Stake</button>
        <button onClick={()=>{localStorage.state="vote"; navigate('/vote')}} 
          className={path === "/vote" ? 'nav-select' : 'nav-not-select'}>Vote</button>
        <button onClick={()=>{localStorage.state="nft"; navigate('/nft')}} 
          className={path === "/nft" ? 'nav-select' : 'nav-not-select'}>NFT</button>
      </div>
    </div>
  );
}
export default NavBar;