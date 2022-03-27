import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'


import '../assets/VotePopup.css';
import getSessionAddress from '../utils/FetchVoteSession';
import voteFactory from '../artifacts/contracts/vote/VoteFactory.sol/VoteFactory.json'
import voteSession from '../artifacts/contracts/vote/VoteSession.sol/VoteSession.json'

const factoryAddress = "0x2AFdd75605F8369C509Be138A6f3086E8b9A2660"

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
    if (inputs.rice > 0) {
      if (window.confirm(`Vote ${voteAccount.name} (@${voteAccount.screen_name}) for ${inputs.rice} Rice?`) == true) {
        console.log(`voted user ID ${voteAccount.id_str} with ${inputs.rice}`)
        let account = voteAccount.id_str
        if (account !== '') onVote(inputs.rice,account.toString())
        setInputs("")
        setUserPopup(false)
      }
    } else {
      window.alert("Please input the amount of Rice to vote.")
    }
	}

  return (
    <div>
      <button
        className='vote-popup-button'
        // show confirm popup
        onClick={e => {
          if (voteAccount.id !== undefined) { setUserPopup(true) } 
          else {window.alert(`Please select your candidate.`)}}}>Vote</button>
      {votePopup &&
        <div className='vote-popup'>
          <div className='vote-popup-div'>
            <div style={{fontSize: "30px", paddingBottom: "20px"}}>Vote</div>
            <div style={{paddingBottom: "20px"}}>
              {/* show user profile picture */}
              <img src={voteAccount.profile_image_url_https.replace("_normal", "")} alt="Account Profile" style={{borderRadius: "100%", width: "200px"}}/>
              {/* show user name */}
              <p style={{fontSize: "25px", lineHeight: "10px", fontWeight: "bolder"}}>{voteAccount.name}</p>
              {/* show user screen name */}
              <p style={{fontSize: "16px", lineHeight: "0", color: "rgb(0, 0, 0, 0.6)"}}>@{voteAccount.screen_name}</p>
              {/* show Followers count */}
              <div style={{fontSize: "14px", color: "rgb(0, 0, 0, 0.6)"}}> {followerFormatter(voteAccount.followers_count)} Followers</div>
            </div>
            <input
              className="vote-popup-input"
              type="number"
              step="1"
              min="1"
              max="100"
              name="rice" 
              placeholder="Amount"
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