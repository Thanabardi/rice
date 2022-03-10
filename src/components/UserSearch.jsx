import React, { useState } from 'react';
import axios from 'axios';

import ShowUser from './ShowUser'

import '../assets/UserSearch.css';

const Home = (props) => {
	const bearerToken = process.env.REACT_APP_TWITTER_API_KEY
	
  let [inputs, setInputs] = useState({});
	let [twitterAccount, setTwitterAccount] = useState([]); //list of account object from search

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
		
		handleSearch(event)	// call search API on user input
  }

  async function handleSearch(event) {
		event.preventDefault();
		if (inputs.account !== "" && typeof inputs.account !== "undefined") {
			await axios.get(`/1.1/users/search.json?q=${inputs.account.replace("/", "")}`, {
				"headers": {
					'Authorization': `Bearer ${bearerToken}`
				}
			})
				.then(response => {
					// console.log(response.data)
					setTwitterAccount(response.data) //update search result
				})
				.catch(error => {
					window.alert(error)
					// console.log(error)
				})
		} else {
			setTwitterAccount([]) //clear search result
		}
  }

	function addCandidate(account) {
		props.sendData(account);
		setTwitterAccount([])
	}

  return (
    <div>
			{/* user input form */}
			<form onSubmit={handleSearch}>
				<input
					className="search-input"
					type="text" 
					name="account" 
					placeholder="Twitter Account Name"
					value={inputs.account || ""} 
					onChange={handleChange}
					/>
			</form>
			{/* list of account from search result */}
			<div className='search-popup'>
				{twitterAccount.length > 0 &&
					<table className="search-table">
						<tbody>
							{/* filter out best 5 account with followers >= 1000 */}
							{twitterAccount.filter(account => account.followers_count >= 1000).slice(0, 5).map((account, index) => {
								const profile_image = account.profile_image_url_https.replace("_normal", "")
								return (
									<tr key={index}>
										{/* profile image */}
										<td className="search-table-td"><img src={profile_image} 
											alt="Account Profile" style={{borderRadius: "100%", width: "50px"}}/></td>
										<td>
											{/* account name that add into a candidate list when user click*/}
											<div style={{fontSize: "15px", color: "white"}}>
												<button className='search-button' value={account} onClick={() => addCandidate(account)}>{account.name}</button>
											</div>
											{/* account screen name that show the account details on mouse hover */}
											<div><ShowUser accountProfile={[account.id, account.name, account.screen_name, account.followers_count, profile_image]} /></div>
										</td>
									</tr>	
								);
							})}
						</tbody>
					</table>
				}
			</div>
    </div>
  );
}
export default Home;