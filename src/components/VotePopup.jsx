import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'

import '../assets/VotePopup.css';
import getSessionAddress from '../utils/FetchVoteSession';
import followerFormatter from '../utils/FollowerFormat';
import voteFactory from '../artifacts/contracts/vote/VoteFactory.sol/VoteFactory.json'
import voteSession from '../artifacts/contracts/vote/VoteSession.sol/VoteSession.json'

import checkMetaMask from '../utils/CheckMetaMask';
import { isDisabled } from '@testing-library/user-event/dist/utils';

const factoryAddress = "0xa674321C98C13889936113Aac266227ab8E0c21a"


const VotePopup = ({ voteAccount }) => {
  
	const [votePopup, setUserPopup] = useState(false);
  let [inputs, setInputs] = useState({account: ""});

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }


  const handleChange = (event) => {
    const name = event.target.name;
    if (event.target.value <= 100) {
      const value = event.target.value | 0 ;
      setInputs(values => ({...values, [name]: value}))
    } else {
      setInputs(values => ({...values, [name]: 100}))
      // window.alert('Rice value must under 100.')
    }
  }

  async function onVote(amount,twitterId){
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const sessionAddress = getSessionAddress(factoryAddress)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
    
      const contract = new ethers.Contract(sessionAddress, voteSession.abi, signer)
      const transaction = contract.vote(amount,twitterId).then(()=>{const timer = setTimeout(() => {
        window.location.reload()
      }, 8000);})
    }
  }

  async function vote() {
    if (inputs.rice > 0 ) {
      if(inputs.rice <= voteAccount[1]){
        if (window.confirm(`Vote ${voteAccount[0].name} (@${voteAccount[0].screen_name}) for ${inputs.rice} Rice?`) == true) {
          console.log(`voted user ID ${voteAccount[0].id_str} with ${inputs.rice}`)
          let account = voteAccount[0].id_str
          if (account !== '') onVote(inputs.rice,account.toString())
          setInputs("")
          setUserPopup(false)
        }
      }else{
        window.alert("You don't have that amount of rice!!") 
      }
    } else {
      window.alert("Please input the amount of Rice to vote.")
    }
	}

  return (
    <div>
      <button
        className={checkMetaMask() === "Connected" ? 'vote-popup-button-con':'vote-popup-button-dis'}
        // show confirm popup
        onClick={e => {
          if (checkMetaMask() === "Connected")
            if (voteAccount[0].id !== undefined) { setUserPopup(true) } 
            else {window.alert(`Please select your candidate.`)}}}>Vote</button>
      {votePopup &&
        <div className='vote-popup'>
          <div className='vote-popup-div'>
            <div style={{fontSize: "30px", paddingBottom: "20px"}}>Vote</div>
            <div style={{paddingBottom: "20px"}}>
              {/* show user profile picture */}
              <img src={voteAccount[0].profile_image_url_https.replace("_normal", "")} alt="Account Profile" style={{borderRadius: "100%", width: "200px"}}/>
              {/* show user name */}
              <p style={{fontSize: "25px", lineHeight: "10px", fontWeight: "bolder"}}>{voteAccount[0].name}</p>
              {/* show user screen name */}
              <p style={{fontSize: "16px", lineHeight: "0", color: "rgb(0, 0, 0, 0.6)"}}>@{voteAccount[0].screen_name}</p>
              {/* show Followers count */}
              <div style={{fontSize: "14px", color: "rgb(0, 0, 0, 0.6)"}}> {followerFormatter(voteAccount[0].followers_count)} Followers</div>
            </div>
            <input
              className="vote-popup-input"
              type="number"
              step="1"
              min="1"
              max="100"
              name="rice" 
              placeholder="Amount 1-100"
              value={inputs.rice || ""} 
              onChange={handleChange}
            /> Rice
            <div style={{justifyContent: "space-around", display: "flex"}}>
              <button className='vote-popup-button-con'
              onClick={e => vote()}>Confirm</button>
              <button className='vote-popup-button-can'
              onClick={e => {setUserPopup(false); setInputs("");}}>Cancel</button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
export default VotePopup;