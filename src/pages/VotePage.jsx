import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers'


import axios from 'axios';

import UserSearch from '../components/UserSearch'
import ShowUser from '../components/ShowUser'
import VotePopup from '../components/VotePopup'

import '../assets/VotePage.css';
import getSessionAddress from '../utils/FetchVoteSession';
import checkMetaMask from '../utils/CheckMetaMask';
import voteFactory from '../artifacts/contracts/vote/VoteFactory.sol/VoteFactory.json'
import voteSession from '../artifacts/contracts/vote/VoteSession.sol/VoteSession.json'

const factoryAddress = "0x434Cbdedc7A8069C5F2426C617C3858Bc88014d3"

const Vote = () => {
	const bearerToken = process.env.REACT_APP_TWITTER_API_KEY

	let [candidateIDs, setCandidateID] = useState([]) //list of candidate id
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


	async function getAccountProfile(IDs) {
		console.log(IDs)
		if (IDs.length > 0) {
			await axios.get(`/1.1/users/lookup.json?user_id=${IDs}`, {
				"headers": {
					'Authorization': `Bearer ${bearerToken}`
				}
			})
			.then(response => {
				// console.log(response.data)
				setCandidateList(response.data)
			})
			.catch(error => {
				window.alert(error)
				// console.log(error)
			})
		}
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

  return (
		<div className='vote'>
			<div className='vote-inform'>
				<div style={{fontSize: "25px"}}>
					{(!award & checkMetaMask() === "Connected") ? <div>You have {voteAmount} RICE</div>:<div>MetaMask account required.</div>}
					{award && "Session is ended!!"}
				</div>
				<div style={{fontSize: "18px", opacity: "50%"}}>
					{!award && "Session is on going"}
					<div>{award && "Winner is "+ winner}</div>
					<div>{award && "Wins "+ award}</div>
				</div>
			</div>
			{ checkMetaMask() !== "Install MetaMask" && <div>
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