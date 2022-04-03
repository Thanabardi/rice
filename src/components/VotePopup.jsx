import React, { useEffect, useState, useContext } from 'react';
import { ethers } from 'ethers'

import '../assets/VotePopup.css';
import getSessionAddress from '../utils/FetchVoteSession';
import followerFormatter from '../utils/FollowerFormat';
import voteSession from '../artifacts/contracts/vote/VoteSession.sol/VoteSession.json'

import checkMetaMask from '../utils/CheckMetaMask';
import { AddressContext } from '../context/AddressContextProvider';



const VotePopup = ({ voteAccount }) => {
  
	const [votePopup, setUserPopup] = useState(false);
  let [inputs, setInputs] = useState({account: ""});
  let [voteAmount, setVoteAmount] = useState("0")
  let [voteCheck, setVoteCheck] = useState(false)
  const {network} = useContext(AddressContext);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  useEffect(() => {
		onfetchVote()
  }, []);


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

  async function onfetchVote(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const sessionAddress = getSessionAddress(network.factoryAddress)
			const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
			try {
				const data = await contractVote.remainingVote(signer.getAddress())
				// fix this to decimal
        setVoteAmount(parseInt(data._hex,16))
        return parseInt(data._hex,16)
      } catch (err) {
        console.log("Error: ", err)
			}
		}
	}  

  async function onVote(amount,twitterId){
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const sessionAddress = getSessionAddress(network.factoryAddress)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
    
      const contract = new ethers.Contract(sessionAddress, voteSession.abi, signer)
      const transaction = contract.vote(amount,twitterId).then(()=>{const interval = setInterval(() => {
        onfetchVote().then(function(result) {
          // console.log(result, voteAmount)
          if (result < voteAmount) {
            clearInterval(interval);
            window.location.reload()
          }
        })
      }, 3000);})
      .catch(error => {
        // console.log(error)
        window.alert(error.message)
        window.location.reload()
      })
    }
  }

  async function vote() {
    if (inputs.rice > 0 ) {
      if(inputs.rice <= voteAmount){
        if (window.confirm(`Vote ${voteAccount.name} (@${voteAccount.screen_name}) for ${inputs.rice} Rice?`) === true) {
          // console.log(`voted user ID ${voteAccount.id_str} with ${inputs.rice}`)
          let account = voteAccount.id_str
          if (account !== '') onVote(inputs.rice,account.toString())
          setInputs("")
          setVoteCheck(true)
          // setUserPopup(false)
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
        disabled={checkMetaMask() === "Connected" ? false:true}
        // show confirm popup
        onClick={e => {
          if (checkMetaMask() === "Connected")
            if (voteAccount.id !== undefined) { setUserPopup(true) } 
            else {window.alert(`Please select your candidate.`)}}}>Vote</button>
      {votePopup &&
        <div className='vote-popup'>
          <div className='vote-popup-div'>
            <div style={{fontSize: "30px", paddingBottom: "20px"}}>Vote</div>
            <div className='vote-popup-div-account'>
              {/* show user profile picture */}
              <img src={voteAccount.profile_image_url_https.replace("_normal", "")} alt="Account Profile" 
                style={{borderRadius: "100%", width: "200px", height: "200px"}}/>
              {/* show user name */}
              <p style={{fontSize: "25px", lineHeight: "10px", fontWeight: "bolder"}}>{voteAccount.name}</p>
              {/* show user screen name */}
              <p style={{fontSize: "16px", lineHeight: "0", color: "rgb(255, 255, 255, 0.6)"}}>@{voteAccount.screen_name}</p>
              {/* show Followers count */}
              <div style={{fontSize: "14px", color: "rgb(255, 255, 255, 0.6)"}}> {followerFormatter(voteAccount.followers_count)} Followers</div>
            </div>
            {!voteCheck ? <div>
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
            </div>:<div style={{fontSize: "18px", opacity: "50%"}}>
              Vote pending...</div>}
          </div>
        </div>
      }
    </div>
  );
}
export default VotePopup;