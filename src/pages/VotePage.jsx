import React, { useContext, useEffect, useState } from 'react';

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
import { AddressContext } from '../context/AddressContextProvider';


const Vote = () => {
	const {network} = useContext(AddressContext);


	let [candidateIDs, setCandidateIDs] = useState(["."]) //list of candidate id
	let [newCandidateList, setNewCandidateList] = useState([]) //list of new candidate id
	let [candidateList, setCandidateList] = useState([]) // list candidate details(id, name, screen name, followers, profile image)
	let [candidateVote, setCandidateVote] = useState(["0"]) //list of candidate id and vote count
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




  async function fetchVoteCandidate(id){
	if (typeof window.ethereum !== 'undefined') {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		
		const signer = provider.getSigner();
		const sessionAddress = getSessionAddress(network.factoryAddress)
		  const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
		  try{
			  const data = await contractVote.candidate(id)
			  return parseInt(data._hex,16)
		  }catch (err) {
		  console.log("Error: ", err)
	  }
	}
  }

  async function findAward(){
	if (typeof window.ethereum !== 'undefined') {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();
		const sessionAddress = getSessionAddress(network.factoryAddress)
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
      const provider = new ethers.providers.AlchemyProvider("maticmum")
      const sessionAddress = getSessionAddress(network.factoryAddress)

			const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
			try {
				await contractVote.getCandidateName().then((data)=>{
					console.log(data)
					setCandidateIDs(data)
					getAccountProfile(data)
					getVoteCount(data)
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
      const sessionAddress = getSessionAddress(network.factoryAddress)
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
      const sessionAddress = getSessionAddress(network.factoryAddress)
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
		if (IDs.length > 0) {
 		 await axios.get(`https://limitless-escarpment-03632.herokuapp.com/get-account-profile/${IDs.toString()}`
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
  }


	function addCandidate(account) {
		// console.log(account)
		if (candidateIDs.includes(account.id_str)) {
			window.alert(`${account.name}(@${account.screen_name}) is already existed in candidate list`)
		} else {
			// add accountID into database
			let temp = candidateIDs.concat(account.id_str)
			setCandidateIDs(temp)
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

	function getVoteCount(IDs) {
		if (IDs.length > 0) {
			let temp = []
			for (let i = 0; i < IDs.length; i++) {
				fetchVoteCandidate(IDs[i]).then(function(result) {
					if(result === 1) {
						temp = temp.concat({"id_str": IDs[i], "vote": result})
					} else {
						temp = temp.concat({"id_str": IDs[i], "vote": result})
					}
					setCandidateVote(temp.slice(0).sort(function(a,b) {
						return b.vote - a.vote;
					}))
				})
			}
		} else {
			setCandidateVote([])
		}
	}

  return (
		<div className='vote'>
			{checkMetaMask() !== "Install MetaMask" ? <div>
			{candidateVote[0] !== "0" & candidateVote.length === candidateList.length ? <div>
			<div className='vote-inform'>
				<div style={{fontSize: "30px"}}>
					{(!winner & checkMetaMask() === "Connected") ? <div>You have {voteAmount} RICE</div>:<div />}
					{(!winner & checkMetaMask() !== "Connected") ? 
						<div style={{fontSize: "25px"}}>
            	MetaMask account required
          	</div>:<div />}
					{winner && "Vote Result"}
				</div>
				<div style={{fontSize: "18px"}}>
					{!winner ?
					<div style={{opacity: "90%", padding: "10px 0 10px 0"}}>
						<div style={{fontSize: "20px"}}>The winner takes all!!</div>
						<div style={{fontSize: "16px", opacity: "80%"}}>Support your favorite activist without losing any Rice</div>
						<div style={{fontSize: "16px", opacity: "80%", lineHeight: "5px"}}>and have a chance to win a NFT!</div>
					</div>
					:<div style={{opacity: "50%"}}>Session has ended</div>}
					{winner && 
					<div>
						<div style={{fontSize: "25px", opacity: "80%", paddingTop: "15px"}}>Winner</div>
						<div className='vote-winner'>
							{/* show user profile picture */}
							<img src={findWinner()[4]} alt="Account Profile" style={{borderRadius: "100%", width: "200px", height: "200px"}}/>
							{/* show user name */}
							<p style={{fontSize: "25px", lineHeight: "10px", fontWeight: "bolder"}}>{findWinner()[1]}</p>
							{/* show user screen name */}
							<p className='vote-winner-button' style={{fontSize: "16px", lineHeight: "0"}} onClick={e => redirect(findWinner()[0]) }>@{findWinner()[2]}</p>
							{/* show Followers count */}
							<div style={{fontSize: "14px", color: "rgb(0, 0, 0, 0.5)"}}> {followerFormatter(findWinner()[3])} Followers</div>
						</div>
						<div style={{opacity: "80%"}}>
							{candidateVote.find(data => data.id_str === findWinner()[0]) !== undefined &&
							<div style={{fontSize: "18px", paddingBottom: "10px", opacity: "70%"}}>
								With {candidateVote.find(data => data.id_str === findWinner()[0]).vote} Rice
							</div>}
							<div style={{fontSize: "20px"}}>Award Goes To</div>
							<div style={{textShadow: "10px 0px 10px black", fontSize: "15px"}}>{award}</div>
						</div>
					</div>}
				</div>
			</div>
			{ checkMetaMask() !== "Install MetaMask" & !winner ? <div>
				{candidateList.length > 0 &&
				<div>
					<div style={{padding: "20px", fontSize: "30px"}}>Vote</div>
					<div className='vote-div'>
						<table className='vote-table'>
							<tbody>
								{candidateVote.map((voteC, index) => {
									// const profile_image = candidate.profile_image_url_https.replace("_normal", "")
									// const vote_count = candidateVote.find(data => data.id_str === candidate.id_str)
									const candidate = candidateList.find(data => data.id_str === voteC.id_str)
									const profile_image = candidate.profile_image_url_https.replace("_normal", "")
									return (
										<tr key={index} className={candidate.id_str === select.id_str ? "vote-select" : "vote-tr"} 
											onClick={() => handleSelect(candidate)}>
											<td className='vote-td'><img src={profile_image} alt="Account Profile" style={{borderRadius: "100%", width: "50px", height: "50px"}} /></td>
											<td className='vote-td'>{candidate.name}
											<ShowUser accountProfile={[candidate.id_str, candidate.name, candidate.screen_name, candidate.followers_count, profile_image, true]} /></td>
											<td className='vote-td' style={{textAlign: "right", verticalAlign: "middle", opacity: "50%", fontSize: "18px"}}>
												{voteC.vote} Rice</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>}
				<div style={{padding: "20px", fontSize: "20px"}}>Add Your New Candidate</div>
				<div className='vote-div'>
					<table className='vote-table'>
						<tbody>
							{newCandidateList.map((candidate, index) => {
								const profile_image = candidate.profile_image_url_https.replace("_normal", "")
								return (
									<tr key={index} className={candidate.id_str === select.id_str ? "vote-select" : "vote-tr"} 
										onClick={() => handleSelect(candidate)}>
										<td className='vote-td'><img src={profile_image} alt="Account Profile" style={{borderRadius: "100%", width: "50px", height: "50px"}} /></td>
										<td className='vote-td' >{candidate.name}
										<ShowUser accountProfile={[candidate.id_str, candidate.name, candidate.screen_name, candidate.followers_count, profile_image, false]} /></td>
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
				</div>:<div />}
			</div>:
				<div className='vote-inform' style={{fontSize: "25px"}}>
					{window.ethereum.networkVersion === '80001' ? 
						<div style={{opacity: "80%"}}>Loading...</div>:
						<div style={{fontSize: "22px"}}>Connect Polygon Mumbai required</div>}
				</div>}
			</div>:<div className='vote-inform' style={{fontSize: "25px"}}>MetaMask installation required</div>}
		</div>
  );
}
export default Vote;