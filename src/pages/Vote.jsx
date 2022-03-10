import React, { useEffect, useState } from 'react';

import axios from 'axios';

import UserSearch from '../components/UserSearch'
import ShowUser from '../components/ShowUser'

import '../assets/Vote.css';

const Vote = () => {
	const bearerToken = process.env.REACT_APP_TWITTER_API_KEY

	let [candidateIDs, setCandidateID] = useState([]) //list of candidate id
	let [candidateList, setCandidateList] = useState([]) // list candidate details(id, name, screen name, followers, profile image)
	let [select, setSelect] = useState({}) // a candidate that user selected

  // useEffect(() => {
	// 	// create candidate details list from candidate id
  //   for (let i = 0; i < candidateIDs.length; i++) {
	// 		getAccountProfile(candidateIDs[i])
	// 	}
  // });

	// async function getAccountProfile(accountID) {
 	// 	await axios.get(`/1.1/users/show.json?user_id=${accountID}`, {
	// 		"headers": {
	// 			'Authorization': `Bearer ${bearerToken}`
	// 		}
	// 	})
	// 	.then(response => {
	// 		// console.log(response.data)
	// 		const temp = {
	// 			id_str: response.data.id_str, 
	// 			name: response.data.name, 
	// 			screen_name: response.data.screen_name,
	// 			followers: response.data.followers_count,
	// 			profile_image: response.data.profile_image_url_https.replace("_normal", "") // to make original size profile image
	// 		}
	// 		let newList = candidateList.concat(temp)
	// 		setCandidateList(newList)
	// 	})
	// 	.catch(error => {
	// 		window.alert(error)
	// 		// console.log(error)
	// 	})
  // }

	function addCandidate(account) {
		// console.log(account)
		if (candidateIDs.includes(account.id_str)) {
			window.alert(`${account.name}(@${account.screen_name}) is already existed in candidate list`)
		} else {
			// add accountID into database
			let temp = candidateIDs.concat(account.id_str)
			setCandidateID(temp)
			// add Candidate's account profile into CandidateList
			temp = {
				id_str: account.id_str, 
				name: account.name, 
				screen_name: account.screen_name,
				followers: account.followers_count,
				profile_image: account.profile_image_url_https.replace("_normal", "")
			}
			const newList = candidateList.concat(temp)
			setCandidateList(newList)
		}
	}

	function vote() {
		if (select !== {}) {
			window.alert(`Vote ${select.name} (@${select.screen_name})?`)
			console.log(`voted user ID ${select.id_str}`)
		} else {
			window.alert(`Please select your candidate.`)
		}
	}

  return (
    <div>
      <table className='vote-table'>
        <thead >
					<tr><td colSpan="2" style={{fontSize: "25px", fontWeight: "bold", textAlign: "center"}}>Vote</td></tr>
        </thead>
				<tbody>
					{candidateList.map((candidate, index) => {
            return (
              <tr key={index} className={candidate.id_str === select.id_str ? "select" : "table"}>
								<td className='vote-td'><button className='vote-select-button' value={candidate} onClick={() => setSelect(candidate)}>select</button></td>
                <td className='vote-td'>{candidate.name}
								<ShowUser accountProfile={[candidate.id_str, candidate.name, candidate.screen_name, candidate.followers, candidate.profile_image]} /></td>
              </tr>
            );
          })}
					<tr style={{lineHeight: "50px"}}>
						<td className='vote-td' style={{borderBottom: "0px"}}>Other:</td>
						<td className='vote-td' style={{borderBottom: "0px"}}><UserSearch sendData={addCandidate} /></td>
					</tr>
				</tbody>
      </table>
			<button className='vote-button' onClick={vote}>Vote</button>
    </div>
  );
}
export default Vote;