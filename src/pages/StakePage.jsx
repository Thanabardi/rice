import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'

import Stake from '../artifacts/contracts/Stake.sol/Stake.json'
import RICE from '../artifacts/contracts/Token.sol/RICE.json'
import WMATIC from '../artifacts/contracts/WMatic.sol/WMATIC.json'

import voteExchange from '../artifacts/contracts/vote/VoteExchange.sol/VoteExchange.json'
import voteSession from '../artifacts/contracts/vote/VoteSession.sol/VoteSession.json'
import PoolFactory from '../artifacts/contracts/PoolFactory.sol/PoolFactory.json'
import Pool from '../artifacts/contracts/Pool.sol/Pool.json'

import '../assets/SwapPage.css';
import h2d from '../utils/H2D';

import matic from '../assets/images/matic.png';
import rice from '../assets/images/rice.jpg';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import getSessionAddress from '../utils/FetchVoteSession';



  const exchangeAddress = "0x965D83c58c06CE1C011d036e63Be3D1bBabdB3cb"
  const tokenAddress = '0x87C2EBffe6C50eE034b4D05D2d3c2EC7b325e346'
  const stakeAddress = '0x3Cb07efDBAfbc1BEb470d7B761eac8BacF428CF8'
  const wMaticAddress = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
  const factoryAddress = "0x434Cbdedc7A8069C5F2426C617C3858Bc88014d3"
  const poolFactoryAddress = "0x4D03044Ee7f8f228a7A9D1C6f33d361C08CfBD61"


const StakePage = () => {
  const coinOption  = [
    {value: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889", label: "Matic", img:matic},
    {value: "0x87C2EBffe6C50eE034b4D05D2d3c2EC7b325e346", label: "Rice", img:rice}
  ]

  
  let [amountMatic,setAmountMatic] = useState(0)
  let [amountRice,setAmountRice] = useState(0)
  let [coinState1, setState1] = useState("");
  let [coinState2, setState2] = useState("");
  let [voteAmount, setVoteAmount] = useState("0") 

  useEffect(() => {
		// create candidate details list from candidate id
		getStakeAmount()
    onfetchVote()
		

  }, []);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }



  async function onStake(e){
    e.preventDefault()
    console.log("going to stake with token0 address ",coinState1," amount ",e.target[0].value*100000 + "0000000000000",
    " and token1 address ", coinState2, " amount ", e.target[1].value*100000 + "0000000000000",)

    if (typeof window.ethereum !== 'undefined') {
      // await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider })
      const signer = provider.getSigner()

      const rice = new ethers.Contract(wMaticAddress, RICE.abi, signer)
      await rice.approve(stakeAddress, e.target[0].value*100000 + "0000000000000")

      const wMatic = new ethers.Contract(tokenAddress, WMATIC.abi, signer)
      await wMatic.approve(stakeAddress,  e.target[1].value*100000 + "0000000000000")


      setTimeout(function () {
        const contract = new ethers.Contract(stakeAddress, Stake.abi, signer)
        const transaction =  contract.stake(wMaticAddress,tokenAddress,
              e.target[0].value*100000 + "0000000000000",
              e.target[1].value*100000 + "0000000000000"
              )
      }, 20000);
    }
  }

  const handleChange1 = (event) => {
    setState1(event.target.value);
    console.log(event.target.value)
  };

  const handleChange2 = (event) => {
    setState2(event.target.value);
    console.log(event.target.value)
  };


  async function unstake(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider })
      const signer = provider.getSigner()
      const contract = new ethers.Contract(stakeAddress, Stake.abi,signer)
      console.log(e.target[0].value)
      try {
        const data = await contract.unstake(tokenAddress,wMaticAddress,e.target[0].value)
       
        console.log('Total: ',data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }  
  }

  async function getStakeAmount(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider })
      const signer = provider.getSigner()
      const contract = new ethers.Contract(stakeAddress, Stake.abi, signer)
      try {
        const data = await contract.getStakeAmount(tokenAddress,wMaticAddress)

        console.log('Total: ',data)
        setAmountRice(h2d(data[0]._hex)/10**18)
        setAmountMatic(h2d(data[1]._hex)/10**18)
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
  
          const rice = new ethers.Contract(tokenAddress, RICE.abi, signer)
          await rice.approve(exchangeAddress, e.target[0].value*100000 + "0000000000000")
  
          setTimeout(function () {
            const contract = new ethers.Contract(exchangeAddress, voteExchange.abi, signer)
            const transaction = contract.deposit( e.target[0].value*100000 + "0000000000000")
        }, 20000);
         
      }
  }
  
  async function onWithdraw(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          console.log({ provider })
          const signer = provider.getSigner()
        const contract = new ethers.Contract(exchangeAddress, voteExchange.abi, signer)
        const transaction = contract.withdraw(e.target[0].value + "000000000000000000")
  
         
      }
  }

  async function onfetchVote(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const sessionAddress = getSessionAddress(factoryAddress)
        const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
        try{
            const data = await contractVote.remainingVote(signer.getAddress())
			// fix this to decimal
            setVoteAmount(parseInt(data._hex,16))
        }catch (err) {
        console.log("Error: ", err)
    }
  }
} 

async function fetchAddress(){
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
      const contractVote = new ethers.Contract( poolFactoryAddress, PoolFactory.abi, provider)
      try{
          const data = await contractVote.getPoolAddress(tokenAddress,wMaticAddress)
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
          console.log(e.target.value)
          const data = await contractVote.token0NeedForStake(e.target.value * 10000 + "00000000000000")
          console.log(Math.round(h2d(data._hex)/10**18)+1)
      }catch (err) {
      console.log("Error: ", err)
  }
}
} 






  return (
    <div>
        



      
      Stake
      <form onSubmit={onStake}>
        <img src={matic} style={{width:"30px"}}></img>
        <input placeholder='amount token0' type='number' onChange={getToken0Need} step=".0001"></input><br/>
        <img src={rice} style={{width:"30px"}}></img>
        <input placeholder='amount token1' type='number' step=".0001"></input><br/>
        <button>submit</button>
      </form>     
      Matic:{amountMatic}<br/>
      Rice:{amountRice}<br/>
      
      <form onSubmit={unstake}>
        unstake<br/>
        <input placeholder='percent' type='number' min='1' max='100'></input>%<br/>
        <button>submit</button>
        </form>



    <div className='stake'>
     
    </div>
    <div className='rice-stake'>
      <h2>RICE - STAKE</h2>
      Current Rice: {voteAmount}<br/>

      deposit
<form onSubmit={onDeposit}>
    <input type='number' min='1' max='100' placeholder='amount 1-100' required/>
   <button type='submit'> deposit</button>
</form>

withdraw
<form onSubmit={onWithdraw}>
    <input type='number' min='1' max='100' placeholder='amount 1-100' required/>
   <button type='submit'> withdraw</button>
</form>

    </div>
</div>


  );
}
export default StakePage;