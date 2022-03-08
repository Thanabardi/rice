import React, { useState } from 'react';
import axios from 'axios';

import '../assets/ShowUser.css';

const ShowAccount = ({ accountName }) => {
	const [userPopup, setUserPopup] = useState(false);

  function redirect() {
    window.open(`https://twitter.com/${accountName}`, `_blank`);
  }

  return (
    <div>
      <button
        className='show-button'
        onMouseEnter={e => {setUserPopup(true)}}	
        onMouseLeave={e => {setUserPopup(false)}}
        onClick={e => redirect() }>@{accountName}</button>
      {userPopup && 
        <div className='show-popup'>
          <img src='https://picsum.photos/150' style={{borderRadius: "100%"}}/>
          <p style={{fontSize: "25px", lineHeight: "10px", fontWeight: "bolder"}}>{accountName}</p>
          <p style={{fontSize: "15px", lineHeight: "0", color: "rgb(255, 255, 255, 0.5)"}}>@{accountName}</p>
          {/* <div style={{justifyContent: "space-around", display: "flex"}}>
            <div>117 Following</div>
            <div>1.4M Followers</div>
          </div> */}
        </div>
      }
    </div>
  );
}
export default ShowAccount;