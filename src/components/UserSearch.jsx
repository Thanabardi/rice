import React, { useEffect, useState } from 'react';
import axios from 'axios';

import '../assets/UserSearch.css';

const Home = (props) => {
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  async function handleSearch(event) {
		event.preventDefault();
		props.sendData({Name: inputs.account, Username: inputs.account});

    // await axios.get(`https://api.twitter.com/1.1/users/search.json?q=${inputs.account}`)
    //   .then(response => {
    //     console.log(response.data)
		// 		location.state.sendData(response.data);
    //     // setTwitterAccount(response.data)
    //   })
    //   .catch(error => {
    //     window.alert(error)
    //     // console.log(error)
    //   })
  }

  return (
    <div>
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
			{/* {twitterAccount &&
				<tbody>
					{twitterAccount.slice(0, 10).map((account, index) => {
						return (
							<tr key={index}>
								<td>{account}</td>
							</tr>
						);
					})}
				</tbody>} */}
    </div>
  );
}
export default Home;