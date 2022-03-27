import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers'


import axios from 'axios';

import UserSearch from '../components/UserSearch'
import ShowUser from '../components/ShowUser'
import VotePopup from '../components/VotePopup'

import '../assets/VotePage.css';

import getSessionAddress from '../utils/FetchVoteSession';
import checkMetaMask from '../utils/CheckMetaMask';
import followerFormatter from '../utils/FollowerFormat';
import voteFactory from '../artifacts/contracts/vote/VoteFactory.sol/VoteFactory.json'
import voteSession from '../artifacts/contracts/vote/VoteSession.sol/VoteSession.json'

const factoryAddress = "0x2AFdd75605F8369C509Be138A6f3086E8b9A2660"

const Vote = () => {

	let [candidateIDs, setCandidateID] = useState(["."]) //list of candidate id
	let [newCandidateList, setNewCandidateList] = useState([]) //list of new candidate id
	let [candidateList, setCandidateList] = useState([]) // list candidate details(id, name, screen name, followers, profile image)
	let [select, setSelect] = useState({}) // a candidate that user selected
	let [voteAmount, setVoteAmount] = useState("0") 
	let [winner,setWinner] = useState()
	let [award, setAward] = useState()

  useEffect(() => {
		// create candidate details list from candidate id
		getCandidateList()
		onfetchVote()

		onfetchStatus()
  }, []);

	// async function getAccountProfile() {
	// 	if (candidateIDs.length > 0) {
	// 		await axios.get(`/1.1/users/lookup.json?user_id=${candidateIDs.toString()}`, {
	// 			"headers": {
	// 				'Authorization': `Bearer ${bearerToken}`
	// 			}
	// 		})
	// 		.then(response => {
	// 			// console.log(response.data)
	// 			setCandidateList(response.data)
	// 		})
	// 		.catch(error => {
	// 			window.alert(error)
	// 			// console.log(error)
	// 		})
	// 	}


//   async function findWinner(){
// 	  let winner = 0;
// 	  let maxVote = 0;
// 	await candidateIDs.forEach((id)=>{
// 		fetchVoteCandidate(id).then((temp_vote)=>{
// 			if (temp_vote > maxVote){
// 				 winner = id;
// 				 maxVote = temp_vote
// 				 setWinner(winner)
// 			}
// 		})	
// 	})
//   }

//   async function fetchVoteCandidate(id){
// 	if (typeof window.ethereum !== 'undefined') {
// 		const provider = new ethers.providers.Web3Provider(window.ethereum)
// 		console.log({ provider })
// 		const signer = provider.getSigner();
// 		const sessionAddress = getSessionAddress(factoryAddress)
// 		  const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
// 		  try{
// 			  const data = await contractVote.candidate(id)
// 			  return parseInt(data._hex,16)
// 		  }catch (err) {
// 		  console.log("Error: ", err)
// 	  }
// 	}
//   }

  async function findAward(){
	if (typeof window.ethereum !== 'undefined') {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();
		const sessionAddress = getSessionAddress(factoryAddress)
		  const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
		  try{
			  const aw = await contractVote.award()
			  setAward(aw)
			  const win = await contractVote.winner()
			  setWinner(win)
		  }catch (err) {
		  console.log("Error: ", err)
	  }
	}
  }

  async function getCandidateList(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
      const sessionAddress = getSessionAddress(factoryAddress)
      const contract = new ethers.Contract(factoryAddress, voteFactory.abi, provider)
			const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
			try {
				await contractVote.getCandidateName().then((data)=>{
					setCandidateID(data)
					getAccountProfile(data)
				})
      } catch (err) {

        console.log("Error: ", err)
    	}
		}  
  }

  async function onfetchStatus(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const sessionAddress = getSessionAddress(factoryAddress)
			const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
			try {
				const data = await contractVote.status()
				if (data === 1) {
					findAward()
					// setTimeout(function () {
					// 	findWinner()
					// }, 10000);		 
				}
      } catch (err) {
        console.log("Error: ", err)
			}
		}
	}  

  async function onfetchVote(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const sessionAddress = getSessionAddress(factoryAddress)
			const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
			try {
				const data = await contractVote.remainingVote(signer.getAddress())
				// fix this to decimal
				setVoteAmount(parseInt(data._hex,16))
      } catch (err) {
        console.log("Error: ", err)
			}
		}
	}  

// async function testTwitter(e) {
// 	e.preventDefault()
// 	console.log(e.target[0].value)
// 	 await axios.get(`http://localhost:9000/get-account-profile/${e.target[0].value}`, {
// 		"headers": {
// 			'Authorization': `Bearer ${bearerToken}`
// 		}
// 	})
// 	.then(response => {
// 		console.log(response.data)
// 		// setCandidateList(response.data)
// 	})
// 	.catch(error => {
// 		window.alert(error)
// 		console.log(error)
// 	})
// }


	async function getAccountProfile(IDs) {
		console.log(IDs)
 		await axios.get(`https://limitless-escarpment-03632.herokuapp.com/get-account-profile/${IDs}`
		)
		.then(response => {
			// console.log(response.data)
			setCandidateList(response.data)
		})
		.catch(error => {
			window.alert(error)
			// console.log(error)
		})
  }


	function addCandidate(account) {
		// console.log(account)
		if (candidateIDs.includes(account.id_str)) {
			window.alert(`${account.name}(@${account.screen_name}) is already existed in candidate list`)
		} else {
			// add accountID into database
			let temp = candidateIDs.concat(account.id_str)
			setCandidateID(temp)
			// add Candidate's account profile into NewCandidateList
			temp = newCandidateList.concat(account)
			setNewCandidateList(temp)
		}
	}

	function handleSelect(candidate) {
		if (candidate !== select) {
			setSelect(candidate)
		} else {
			setSelect({})
		}
	}

	function findWinner() {
		const winnerAccount = candidateList.find(candidate => candidate.id_str === winner)
		const profile_image = winnerAccount.profile_image_url_https.replace("_normal", "")
		return [winnerAccount.id_str, winnerAccount.name, winnerAccount.screen_name, winnerAccount.followers_count, profile_image]
	}

	function redirect(ID) {
    window.open(`https://twitter.com/i/user/${ID}`, `_blank`);
  }

  return (
		<div className='vote'>

			<div className='vote-inform'>
				<div style={{fontSize: "30px"}}>
					{(!award & checkMetaMask() === "Connected") ? <div>You have {voteAmount} RICE</div>:<div />}
					{(!award & checkMetaMask() !== "Connected") ? <div style={{fontSize: "25px"}}>MetaMask account required</div>:<div />}
					{award && "Vote Result"}
				</div>
				<div style={{fontSize: "18px"}}>
					<div style={{opacity: "50%"}}>{!award ? "Session is on going": "Session has ended"}</div>
					{winner && 
						<div>
							<div style={{fontSize: "25px", opacity: "80%"}}>Winner</div>
							<div className='vote-winner'>
								{/* show user profile picture */}
								<img src={findWinner()[4]} alt="Account Profile" style={{borderRadius: "100%", width: "200px"}}/>
								{/* show user name */}
								<p style={{fontSize: "25px", lineHeight: "10px", fontWeight: "bolder"}}>{findWinner()[1]}</p>
								{/* show user screen name */}
								<p className='vote-winner-button' style={{fontSize: "16px", lineHeight: "0"}} onClick={e => redirect(findWinner()[0]) }>@{findWinner()[2]}</p>
								{/* show Followers count */}
								<div style={{fontSize: "14px", color: "rgb(0, 0, 0, 0.5)"}}> {followerFormatter(findWinner()[3])} Followers</div>
							</div>
						</div>
					}
					{award && 
					<div style={{opacity: "80%"}}>
						<div style={{fontSize: "20px"}}>Award Goes To</div>
						<div style={{textShadow: "10px 0px 10px black", fontSize: "15px"}}>{award}</div>
					</div>}

				</div>
			</div>
			{ checkMetaMask() !== "Install MetaMask" || award && <div>
				<div style={{padding: "20px", fontSize: "30px"}}>Vote</div>
				<div className='vote-div'>
					<table className='vote-table'>
						<tbody>
							{candidateList.map((candidate, index) => {
								const profile_image = candidate.profile_image_url_https.replace("_normal", "")
								return (
									<tr key={index} className={candidate.id_str === select.id_str ? "vote-select" : "vote-tr"} 
										onClick={() => handleSelect(candidate)}>
										<td className='vote-td'><img src={profile_image} alt="Account Profile" style={{borderRadius: "100%", width: "50px"}} /></td>
										<td className='vote-td' >{candidate.name}
										<ShowUser accountProfile={[candidate.id_str, candidate.name, candidate.screen_name, candidate.followers_count, profile_image]} /></td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				<div style={{padding: "20px", fontSize: "20px"}}>Add Your New Candidate</div>
				<div className='vote-div'>
					<table className='vote-table'>
						<tbody>
							{newCandidateList.map((candidate, index) => {
								const profile_image = candidate.profile_image_url_https.replace("_normal", "")
								return (
									<tr key={index} className={candidate.id_str === select.id_str ? "vote-select" : "vote-tr"} 
										onClick={() => handleSelect(candidate)}>
										<td className='vote-td'><img src={profile_image} alt="Account Profile" style={{borderRadius: "100%", width: "50px"}} /></td>
										<td className='vote-td' >{candidate.name}
										<ShowUser accountProfile={[candidate.id_str, candidate.name, candidate.screen_name, candidate.followers_count, profile_image]} /></td>
									</tr>
								);
							})}
						</tbody>
					</table>
					<div style={{paddingTop: newCandidateList.length > 0 ? "20px": "0"}}>
						<UserSearch sendData={addCandidate} />
					</div>
				</div>
				<VotePopup voteAccount={select}/>
			</div>}
		</div>
  );
}
export default Vote;