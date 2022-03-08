import React, { useEffect, useState } from 'react';

import UserSearch from '../components/UserSearch'
import ShowUser from '../components/ShowUser'

import '../assets/Vote.css';

const Vote = () => {
	let [candidate, setCandidate] = useState([{Name: "นายอาร์ม", Username: "castby9arm"}, {Name: "จิตร์ทัศน์", Username: "jittat"}, {Name: "Gawr Gura🔱holoEN", Username: "gawrgura"}])
	let [select, setSelect] = useState("")

	function addCandidate(account) {
		// console.log("account", account)
		if (JSON.stringify(candidate).includes(JSON.stringify(account))) {
			window.alert(`${account.Name} is already existed in candidate list`)
		} else {
			const newList = candidate.concat(account)
			setCandidate(newList)
		}
	}

	function toggle(candidate) {
		setSelect(candidate)
	}

	function vote() {
		if (select !== "") {
			window.alert(`Vote ${select}?`)
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
					{candidate.map((candidate, index) => {
            return (
              <tr key={index} className={candidate.Username == select ? "select" : "table"}>
								<td className='vote-td'><button className='button-select' value={candidate.Username} onClick={() => toggle(candidate.Username)}>select</button></td>
                <td className='vote-td'>{candidate.Name}
								<ShowUser accountName={candidate.Username} /></td>
              </tr>
            );
          })}
					<tr style={{lineHeight: "50px"}}>
						<td className='vote-td' style={{borderBottom: "0px"}}>Other:</td>
						<td className='vote-td' style={{borderBottom: "0px"}}><UserSearch sendData={addCandidate} /></td>
					</tr>
				</tbody>
				
      </table>
			<button className='button-vote' onClick={vote}>Vote</button>
    </div>
  );
}
export default Vote;