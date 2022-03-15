import React from 'react';
import { ethers } from 'ethers'
import WMATIC from '../artifacts/contracts/WMatic.sol/WMATIC.json'
import Swap from '../artifacts/contracts/Swap.sol/Swap.json'


import '../assets/SwapPage.css';

const SwapPage = () => {
  const swapAddress = 'address'

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function onSwap(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()
     
      // const token = new ethers.Contract(e.target[0].value, RICE.abi, signer)
      // await token.approve(swapAddress, e.target[2].value*100000 + "0000000000000")

      const token = new ethers.Contract(e.target[0].value, WMATIC.abi, signer)
      await token.approve(swapAddress, e.target[2].value*100000 + "0000000000000")

      // const wMatic = new ethers.Contract(wMaticAddress, WMATIC.abi, signer)
      // await wMatic.approve(poolFactoryAddress, '1000000000000000')

      setTimeout(function () {
        const contract = new ethers.Contract(swapAddress, Swap.abi, signer)
  
        const transaction = contract.swap(
              e.target[0].value, //rice
              e.target[1].value, // matic
              e.target[2].value*100000 + "0000000000000",
            )
      }, 20000);
    }
  }

  async function  onGetOdds(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
      console.log({ provider })
      const contract = new ethers.Contract(swapAddress, Swap.abi, provider)
      try {
        const data = await contract.getTokenOdds(e.target[0].value,e.target[1].value,  e.target[2].value*100000 + "0000000000000",)

        console.log('Total: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }  
  }

  
  return (
    <div className='swap'>
      GetOdds
      <form onSubmit={onGetOdds}>
        <input placeholder='Swap from (token address)'></input><br/>
        <input placeholder='To (token address)'></input><br/>
        <input placeholder='amount token' type='number' step=".0001"></input><br/>

        <button>submit</button>
      </form>
      Swap
      <form onSubmit={onSwap}>
        <input placeholder='Swap from (token address)'></input><br/>
        <input placeholder='To (token address)'></input><br/>
        <input placeholder='amount token' type='number' step=".0001"></input><br/>

        <button>submit</button>
      </form>
    </div>
  );
}
export default SwapPage;