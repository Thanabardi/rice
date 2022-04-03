import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers'

import Stake from '../artifacts/contracts/Stake.sol/Stake.json'
import RICE from '../artifacts/contracts/Token.sol/RICE.json'
import WMATIC from '../artifacts/contracts/WMatic.sol/WMATIC.json'

import voteExchange from '../artifacts/contracts/vote/VoteExchange.sol/VoteExchange.json'
import voteSession from '../artifacts/contracts/vote/VoteSession.sol/VoteSession.json'
import PoolFactory from '../artifacts/contracts/PoolFactory.sol/PoolFactory.json'
import Pool from '../artifacts/contracts/Pool.sol/Pool.json'

import '../assets/StakePage.css';
import h2d from '../utils/H2D';
import checkMetaMask from '../utils/CheckMetaMask';

import matic from '../assets/images/matic.png';
import rice from '../assets/images/rice.png';
import getSessionAddress from '../utils/FetchVoteSession';
import { AddressContext } from '../context/AddressContextProvider';





const StakePage = () => {
  const coinOption  = [
    {value: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889", label: "Matic", img:matic},
    {value: "0x87C2EBffe6C50eE034b4D05D2d3c2EC7b325e346", label: "Rice", img:rice}
  ]

  let [token0Need , setToken0Need] = useState(0)
  let [amountMatic,setAmountMatic] = useState(0)
  let [amountRice,setAmountRice] = useState(0)
  let [coinState1, setState1] = useState("");
  let [coinState2, setState2] = useState("");
  let [voteAmount, setVoteAmount] = useState("0") 
  const {network} = useContext(AddressContext);


  let [status, setStatus] = useState(checkMetaMask())
  let [voteStatus, setVoteStatus] = useState(false)

  useEffect(() => {
		// create candidate details list from candidate id
		getStakeAmount()
    onfetchVote()
		
    onfetchStatus()

  }, []);

  
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(checkMetaMask())
      if (checkMetaMask() === "Connected") {
        clearInterval(interval);
      }
    }, 3000);
  }, []);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }



  async function onStake(e){
    e.preventDefault()
    // console.log("going to stake with token0 address ",coinState1," amount ",e.target[0].value*100000 + "0000000000000",
    // " and token1 address ", coinState2, " amount ", e.target[1].value*100000 + "0000000000000",)

    if (typeof window.ethereum !== 'undefined') {
      // await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      const signer = provider.getSigner()

      const rice = new ethers.Contract(network.wMaticAddress, RICE.abi, signer)
      await rice.approve(network.stakeAddress, e.target[0].value*100000 + "0000000000000")

      const wMatic = new ethers.Contract(network.tokenAddress, WMATIC.abi, signer)
      await wMatic.approve(network.stakeAddress,  e.target[1].value*100000 + "0000000000000")


      setTimeout(function () {
        const contract = new ethers.Contract(network.stakeAddress, Stake.abi, signer)
        const transaction =  contract.stake(network.wMaticAddress,network.tokenAddress,
              e.target[0].value*100000 + "0000000000000",
              e.target[1].value*100000 + "0000000000000"
              ).then(()=>{const interval = setInterval(() => {
                getStakeAmount().then(function(result) {
                  // console.log("onStake Rice", result[0], amountRice)
                  // console.log("onStake Matic", result[1], amountMatic)
                  if (result[0] > amountRice) {
                    clearInterval(interval);
                    // console.log("onStake complete")
                    setAmountRice(result[0])
                    setAmountMatic(result[1])
                    // window.location.reload()
                  }
                })
              }, 3000);}).catch(error => {
                // console.log(error)
                window.alert(error.message)
                window.location.reload()
              })
      }, 20000);
    }
  }

  const handleChange1 = (event) => {
    setState1(event.target.value);
  };

  const handleChange2 = (event) => {
    setState2(event.target.value);
  };

  async function onfetchStatus(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const sessionAddress = getSessionAddress(network.factoryAddress)
			const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
			try {
				const data = await contractVote.status()
				if (data === 1) {
					setVoteStatus(true)
					// setTimeout(function () {
					// 	findWinner()
					// }, 10000);		 
				}
      } catch (err) {
        console.log("Error: ", err)
			}
		}
	}  


  async function unstake(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      const signer = provider.getSigner()
      const contract = new ethers.Contract(network.stakeAddress, Stake.abi,signer)
      try {
        const data = await contract.unstake(network.tokenAddress,network.wMaticAddress,e.target[0].value).then(()=>{const interval = setInterval(() => {
          getStakeAmount().then(function(result) {
            // console.log("unstake Rice", result[0], amountRice)
            // console.log("unstake Matic", result[1], amountMatic)
            if (result[0] < amountRice) {
              clearInterval(interval);
              // console.log("unstake complete")
              setAmountRice(result[0])
              setAmountMatic(result[1])
              // window.location.reload()
            }
          })
        }, 3000);}).catch(error => {
          // console.log(error)
          window.alert(error.message)
          window.location.reload()
        })
      } catch (err) {
        console.log("Error: ", err)
      }
    }  
  }

  async function getStakeAmount(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      const signer = provider.getSigner()
      const contract = new ethers.Contract(network.stakeAddress, Stake.abi, signer)
      try {
        const data = await contract.getStakeAmount(network.tokenAddress,network.wMaticAddress)
        setAmountRice(h2d(data[0]._hex)/10**18)
        setAmountMatic(h2d(data[1]._hex)/10**18)
        return [h2d(data[0]._hex)/10**18, h2d(data[1]._hex)/10**18]
      } catch (err) {
        console.log("Error: ", err)
      }
    }  
  }


  async function onDeposit(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner()
  
          const rice = new ethers.Contract(network.tokenAddress, RICE.abi, signer)
          await rice.approve(network.exchangeAddress, e.target[0].value*100000 + "0000000000000")
  
          setTimeout(function () {
            const contract = new ethers.Contract(network.exchangeAddress, voteExchange.abi, signer)
            const transaction = contract.deposit( e.target[0].value*100000 + "0000000000000").then(()=>{const interval = setInterval(() => {
              onfetchVote().then(function(result) {
                // console.log("onDeposit", result, voteAmount)
                if (result > voteAmount) {
                  clearInterval(interval);
                  // console.log("onDeposit complete")
                  setVoteAmount(result)
                  // window.location.reload()
                }
              })
            }, 3000);}).catch(error => {
              // console.log(error)
              window.alert(error.message)
              window.location.reload()
            })
        }, 20000);
      }
  }
  
  async function onWithdraw(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          
          const signer = provider.getSigner()
        const contract = new ethers.Contract(network.exchangeAddress, voteExchange.abi, signer)
        const transaction = contract.withdraw(e.target[0].value + "000000000000000000").then(()=>{const interval = setInterval(() => {
          onfetchVote().then(function(result) {
            // console.log("onWithdraw", result, voteAmount)
            if (result < voteAmount) {
              clearInterval(interval);
              // console.log("onWithdraw complete")
              setVoteAmount(result)
              // window.location.reload()
            }
          })
        }, 3000);}).catch(error => {
        // console.log(error)
        window.alert(error.message)
        window.location.reload()
        })
      }
  }

  async function onfetchVote(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
        const contractVote = new ethers.Contract( network.exchangeAddress, voteExchange.abi, provider)
        try{
          const data = await contractVote.voteExchange(signer.getAddress())
			    // fix this to decimal
          setVoteAmount(parseInt(data._hex,16)/10**18)
          return parseInt(data._hex,16)/10**18
        }catch (err) {
        console.log("Error: ", err)
    }
  }
} 

async function fetchAddress(){
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
      const contractVote = new ethers.Contract( network.poolFactoryAddress, PoolFactory.abi, provider)
      try{
          const data = await contractVote.getPoolAddress(network.tokenAddress,network.wMaticAddress)
          return data
      }catch (err) {
      console.log("Error: ", err)
  }
}
} 

async function getToken0Need(e){
  e.preventDefault()
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const poolAddress = fetchAddress()
      const contractVote = new ethers.Contract(poolAddress , Pool.abi, provider)
      try{
          const data = await contractVote.token0NeedForStake(e.target.value * 10000 + "00000000000000")
          setToken0Need(Math.round(h2d(data._hex)/10**18)+1)
      }catch (err) {
      console.log("Error: ", err)
  }
}
} 

  return (
    <div className='stake'>
      {(status !== "Connected") &&
        <div className='stake-inform'>
          <div style={{fontSize: "25px"}}>
            {(status === "Connect MetaMask") ? "MetaMask account required":"MetaMask installation required"}
          </div>
        </div>}
        <p />
      {(status !== "Install MetaMask") &&
      <div>
        <div className='stake-div'>
          <div style={{padding: "20px", fontSize: "25px"}}>Stake</div>
          <form onSubmit={onStake}>
            <div style={{display: "flex", width: "100%"}}>
              <input className='stake-input-stake' style={{marginLeft: "12px"}}
                placeholder='wMatic Amount' type='number' min='0.0001' onChange={getToken0Need} step=".0001"></input>
              <img className='stake-img' src={matic} alt="wMatic" style={{paddingRight: "12px"}}/>
            </div>
            <div style={{display: "flex", width: "100%"}}>
              <input className='stake-input-stake' style={{marginLeft: "12px"}}
                value={token0Need} type='number' step=".0001" disabled></input>
              <img className='stake-img' src={rice} alt="Rice" style={{paddingRight: "12px"}}/>
            </div>
            <button className={(status === "Connected") ? 'stake-button':'stake-button-dis'}
                    disabled={(status === "Connected") ? false:true}>Stake</button>
          </form>
        </div>
        <p />
        <div className='stake-div'>
          <div style={{padding: "20px", fontSize: "25px"}}>Unstake</div>
          <table style={{width: "100%", padding: "0 30px 10px 30px", fontSize: "18px"}}>
            <tr style={{borderCollapse: "collapse"}}>
              <td rowSpan="2" style={{verticalAlign: "top",textAlign: "left"}}>You have</td>
              <td style={{textAlign: "right",paddingBottom: "10px"}}> {amountMatic}</td>
              <td style={{paddingBottom: "10px"}}> wMatic</td>
            </tr>
            <tr>
              <td style={{textAlign: "right"}}> {amountRice}</td>
              <td> Rice</td>
            </tr>
          </table>
          <form onSubmit={unstake}>
            <input className='stake-input-stake' placeholder='Amount' type='number' min='1' max='100' style={{marginLeft: "12px"}}/> %
            <button className={(status === "Connected") ? 'stake-button':'stake-button-dis'}
                    disabled={(status === "Connected") ? false:true}>Unstake</button>
          </form>
        </div>
        <div style={{paddingTop: "40px", fontSize: "30px"}}>Stake Rice</div>
        <div className='stake-div'>
          <div className='rice-stake'>
              <div style={{paddingTop: "10px", fontSize: "20px"}}>You have {voteAmount} Rice</div>
              <div style={{padding: "20px", fontSize: "25px"}}>deposit</div>
            <form onSubmit={onDeposit}>
              <input className='stake-input' type='number' min='1' placeholder='Amount' required/>
              <button className={(status === "Connected") ? 'stake-button':'stake-button-dis'}
                      disabled={(status === "Connected") ? false:true}> Deposit</button>
            </form>
          </div>
            {voteStatus ?
            <div>
              <div style={{padding: "20px", fontSize: "25px"}}>withdraw</div>
              <form onSubmit={onWithdraw}>
                <input className='stake-input' type='number' min='1' placeholder='Amount' required/>
                <button className={(status === "Connected") ? 'stake-button':'stake-button-dis'}
                        disabled={(status === "Connected") ? false:true}> Withdraw</button>
              </form>
            </div>:
              <div style={{padding: "10px 0 10px 0", fontSize: "18px", opacity: "50%"}}>
                <div>Vote session is ongoing</div>
                <div>withdrawal is unavailable right now</div>
              </div>}
        </div>
      </div>}
    </div>
  );
}
export default StakePage;