import React, { useEffect, useState } from 'react';

import axios from 'axios';

import UserSearch from '../components/UserSearch'
import ShowUser from '../components/ShowUser'
import VotePopup from '../components/VotePopup'

import '../assets/VotePage.css';

const Vote = () => {
	const bearerToken = process.env.REACT_APP_TWITTER_API_KEY

	let [candidateIDs, setCandidateID] = useState(['9366932', '2864086918', '1283657064410017793']) //list of candidate id
	let [newCandidateList, setNewCandidateList] = useState([]) //list of new candidate id
	let [candidateList, setCandidateList] = useState([]) // list candidate details(id, name, screen name, followers, profile image)
	let [select, setSelect] = useState({}) // a candidate that user selected

  useEffect(() => {
		// create candidate details list from candidate id
		getAccountProfile(candidateIDs)
  }, []);

	async function getAccountProfile() {
 		await axios.get(`/1.1/users/lookup.json?user_id=${candidateIDs.toString()}`, {
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

  return (
		<div className='vote'>
			<div style={{padding: "20px", fontSize: "30px"}}>Vote</div>
			<div className='vote-div'>
				<table className='vote-table'>
					{/* <thead >
						<tr><td colSpan="2" style={{fontSize: "25px", fontWeight: "bold", textAlign: "center"}}>Vote</td></tr>
					</thead> */}
					<tbody>
						{candidateList.map((candidate, index) => {
							const profile_image = candidate.profile_image_url_https.replace("_normal", "")
							return (
								<tr key={index} className={candidate.id_str === select.id_str ? "select" : "table"}>
									<td className='vote-td'><img src={profile_image} alt="Account Profile" style={{borderRadius: "100%", width: "50px"}} 
										onClick={() => setSelect(candidate)} className='vote-select-button'/></td>
									<td className='vote-td' ><button className='vote-select-button' value={candidate} 
										onClick={() => setSelect(candidate)}>{candidate.name}</button>
									<ShowUser accountProfile={[candidate.id_str, candidate.name, candidate.screen_name, candidate.followers_count, profile_image]} /></td>
								</tr>
							);
						})}
						{/* <tr style={{lineHeight: "50px"}}>
							<td className='vote-td' style={{borderBottom: "0px"}}>Other:</td>
							<td className='vote-td' style={{borderBottom: "0px"}}><UserSearch sendData={addCandidate} /></td>
						</tr> */}
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
								<tr key={index} className={candidate.id_str === select.id_str ? "select" : "table"}>
									<td className='vote-td'><img src={profile_image} alt="Account Profile" style={{borderRadius: "100%", width: "50px"}} 
										onClick={() => setSelect(candidate)} className='vote-select-button'/></td>
									<td className='vote-td' ><button className='vote-select-button' value={candidate} 
										onClick={() => setSelect(candidate)}>{candidate.name}</button>
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
		</div>
  );
}
export default Vote;