import React, { useState } from 'react';

import '../assets/ShowUser.css';

const ShowAccount = ({ accountProfile }) => {
	const [userPopup, setUserPopup] = useState(false);

  function redirect() {
    window.open(`https://twitter.com/i/user/${accountProfile[0]}`, `_blank`);
  }

  function followerFormatter(follower) {
    // format raw int number into form of thousand and million
    if (follower > 999 && follower < 1000000){
      return (follower/1000).toFixed(1) + 'K'; 
    }else if (follower > 1000000){
      return (follower/1000000).toFixed(1) + 'M';  
    }else if (follower < 900){
      return follower
    }
  }

  return (
    <div>
      <button
        className='show-button'
        onMouseEnter={e => {setUserPopup(true)}}	
        onMouseLeave={e => {setUserPopup(false)}}
        // redirect to account profile
        onClick={e => redirect() }>@{accountProfile[2]}</button>
      {userPopup && 
        <div className='show-popup'>
          {/* show user profile picture */}
          <img src={accountProfile[4]} alt="Account Profile" style={{borderRadius: "100%", width: "200px"}}/>
          {/* show user name */}
          <p style={{fontSize: "25px", lineHeight: "10px", fontWeight: "bolder"}}>{accountProfile[1]}</p>
          {/* show user screen name */}
          <p style={{fontSize: "16px", lineHeight: "0", color: "rgb(255, 255, 255, 0.5)"}}>@{accountProfile[2]}</p>
          {/* show Followers count */}
          <div style={{fontSize: "14px", color: "rgb(255, 255, 255, 0.5)"}}> {followerFormatter(accountProfile[3])} Followers</div>
        </div>
      }
    </div>
  );
}
export default ShowAccount;