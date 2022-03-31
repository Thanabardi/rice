import React, { useState } from 'react';

import followerFormatter from '../utils/FollowerFormat';
import '../assets/ShowUser.css';

const ShowAccount = ({ accountProfile }) => {
	const [userPopup, setUserPopup] = useState(false);

  function redirect() {
    window.open(`https://twitter.com/i/user/${accountProfile[0]}`, `_blank`);
  }

  return (
    <div style={{position: "relative"}}>
      <button
        className='show-button'
        onMouseEnter={e => {setUserPopup(true)}}	
        onMouseLeave={e => {setUserPopup(false)}}
        // redirect to account profile
        onClick={e => redirect() }>@{accountProfile[2]}</button>
      {userPopup && 
        <div className='show-popup'style={!accountProfile[5]? {bottom: "0"}: {}}>
          {/* show user profile picture */}
          <img src={accountProfile[4]} alt="Account Profile" style={{borderRadius: "100%", width: "200px", height: "200px"}}/>
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