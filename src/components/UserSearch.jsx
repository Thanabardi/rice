import React, { useEffect, useState } from 'react';
import axios from 'axios';

import ShowUser from './ShowUser'

import '../assets/UserSearch.css';

const Home = (props) => {
	
  let [inputs, setInputs] = useState({account: ""});
	let [twitterAccount, setTwitterAccount] = useState([]); //list of account object from search

  useEffect(() => {
    // console.log(inputs.account)
		const timer = setTimeout(() => {
			handleSearch(inputs.account) 	// call search API on user input after 400 ms
		}, 400);
		return () => clearTimeout(timer);
  }, [inputs.account]);

  const handleChange = (event) => {
    const name = event.target.name;
	const value = event.target.value.replace(/[^a-zA-Z0-9 ]/ig, '')

    setInputs(values => ({...values, [name]: value}))
	
  }

	function handleSubmit(event) {
		event.preventDefault();
		handleSearch(inputs.account)
	}
	
  async function handleSearch(accountName) {
		if (accountName !== "" && accountName !== "/" && accountName !== undefined) {
			await axios.get(`https://limitless-escarpment-03632.herokuapp.com/handle-search/${accountName.replace("/", "")}`
				)
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
		setInputs('')
	}

  return (
    <div>
			{/* user input form */}
			<form onSubmit={handleSubmit}>
				<input
					className="search-input"
					type="search"
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
								{twitterAccount!== [] && twitterAccount.filter(account => account.followers_count >= 1000).slice(0, 5).map((account, index) => {
									const profile_image = account.profile_image_url_https.replace("_normal", "")
								return (
									// add account when user click
									<tr key={index} className="search-user-tr" onClick={() => addCandidate(account)}>
										{/* profile image */}
										<td className="search-table-td">
											<img src={profile_image} alt="Account Profile" style={{borderRadius: "100%", width: "50px", height: "50px"}}/>
										</td>
										<td className="search-table-td">
											{/* account name */}
											<div style={{fontSize: "18px"}}>{account.name}
											</div>
											{/* account screen name that show the account details on mouse hover */}
											<div style={{bottom: "10px"}}>
												<ShowUser accountProfile={[account.id_str, account.name, account.screen_name, account.followers_count, profile_image, false]} />
											</div>
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