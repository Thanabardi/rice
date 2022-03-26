import React from 'react';
import { ethers } from 'ethers'

import Stake from '../artifacts/contracts/Stake.sol/Stake.json'
import RICE from '../artifacts/contracts/Token.sol/RICE.json'
import WMATIC from '../artifacts/contracts/WMatic.sol/WMATIC.json'

import '../assets/SwapPage.css';

const StakePage = () => {
  const tokenAddress = 'address'
  const stakeAddress = 'address'
  const wMaticAddress = 'address'

  async function onStake(e){
    e.preventDefault()
    console.log("going to stake with token0 address ",e.target[0].value," amount ",e.target[1].value*100000 + "0000000000000",
    " and token1 address ", e.target[2].value, " amount ", e.target[3].value*100000 + "0000000000000",)

    console.log(e.target[3].value*100000 + "0000000000000")

    if (typeof window.ethereum !== 'undefined') {
      // await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider })
      const signer = provider.getSigner()

      const rice = new ethers.Contract(tokenAddress, RICE.abi, signer)
      await rice.approve(stakeAddress, e.target[1].value*100000 + "0000000000000")

      const wMatic = new ethers.Contract(wMaticAddress, WMATIC.abi, signer)
      await wMatic.approve(stakeAddress,  e.target[3].value*100000 + "0000000000000")


      setTimeout(function () {
        const contract = new ethers.Contract(stakeAddress, Stake.abi, signer)
        const transaction =  contract.stake(
              e.target[0].value,
              e.target[2].value,
              e.target[1].value*100000 + "0000000000000",
              e.target[3].value*100000 + "0000000000000"
              )
      }, 20000);
    }
  }


  async function unstake(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider })
      const signer = provider.getSigner()
      const contract = new ethers.Contract(stakeAddress, Stake.abi,signer)
      try {
        const data = await contract.unstake(e.target[0].value,e.target[1].value,e.target[2].value)

        console.log('Total: ',data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }  
  }

  async function getStakeAmount(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider })
      const signer = provider.getSigner()
      const contract = new ethers.Contract(stakeAddress, Stake.abi, signer)
      try {
        const data = await contract.getStakeAmount(e.target[0].value,e.target[1].value)

        console.log('Total: ',data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }  

  }

  return (
    <div className='stake'>
      Stake
      <form onSubmit={onStake}>
        <input placeholder='address token0'></input>
        <input placeholder='amount token0' type='number' step=".0001"></input><br/>
        <input placeholder='address token1'></input>
        <input placeholder='amount token1' type='number' step=".0001"></input><br/>
        
        <button>submit</button>
      </form>
      <form onSubmit={getStakeAmount}>
        get stake amount<br/>
        <input placeholder='address token0'></input><br/>
        <input placeholder='address token1'></input><br/>

        <button>submit</button>
      </form>
      <form onSubmit={unstake}>
        unstake<br/>
        <input placeholder='address token0'></input><br/>
        <input placeholder='address token1'></input><br/>
        <input placeholder='amount token1' type='number' min='1' max='100'></input><br/>
        <button>submit</button>
      </form>
    </div>
  );
}
export default StakePage;