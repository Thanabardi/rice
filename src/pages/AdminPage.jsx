import React from 'react';
import { ethers } from 'ethers'
import RICE from '../artifacts/contracts/Token.sol/RICE.json'
import WMATIC from '../artifacts/contracts/WMatic.sol/WMATIC.json'
import PoolFactory from '../artifacts/contracts/PoolFactory.sol/PoolFactory.json'

import '../assets/Admin.css';
// import '../assets/SwapPage.css';
import getSessionAddress from '../utils/FetchVoteSession';

import voteExchange from '../artifacts/contracts/vote/VoteExchange.sol/VoteExchange.json'
import voteFactory from '../artifacts/contracts/vote/VoteFactory.sol/VoteFactory.json'
import voteSession from '../artifacts/contracts/vote/VoteSession.sol/VoteSession.json'
import h2d from '../utils/H2D';


const exchangeAddress = "0x965D83c58c06CE1C011d036e63Be3D1bBabdB3cb"
const factoryAddress = "0x434Cbdedc7A8069C5F2426C617C3858Bc88014d3"
const tokenAddress = '0x87C2EBffe6C50eE034b4D05D2d3c2EC7b325e346'
const poolFactoryAddress = '0x4D03044Ee7f8f228a7A9D1C6f33d361C08CfBD61'
  const wMaticAddress ='0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'

const AdminPage = () => {

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchPool(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
      console.log({ provider })
      const contract = new ethers.Contract(poolFactoryAddress, PoolFactory.abi, provider)
      try {
        const data = await contract.getTotalAmountInPool(tokenAddress,wMaticAddress)

        console.log('RICE: ',h2d(data[0]._hex)/10**18,'wMatic: ',h2d(data[1]._hex))
      } catch (err) {
        console.log("Error: ", err)
      }
    }  
  }

  async function onCreateSession(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()
     
        const contract = new ethers.Contract(factoryAddress, voteFactory.abi, signer)
        const transaction = contract.createVoteSession()
    }
  }

  async function onVote(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const sessionAddress = getSessionAddress(factoryAddress)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()
     
        const contract = new ethers.Contract(sessionAddress, voteSession.abi, signer)
        const transaction = contract.vote(e.target[0].value, e.target[1].value)
    }
}


async function onEndVote(e){
  e.preventDefault()
  if (typeof window.ethereum !== 'undefined') {
    await requestAccount()
    const sessionAddress = getSessionAddress(factoryAddress)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider })
      const signer = provider.getSigner()
   
      const contract = new ethers.Contract(sessionAddress, voteSession.abi, signer)
      const transaction = contract.endVote()
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

async function onOpen(e){
  e.preventDefault()
  if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()
     
        const contract = new ethers.Contract(exchangeAddress, voteExchange.abi, signer)
        const transaction = contract.openExchange()
    }
}

function onGetSessionAddress(e){
  e.preventDefault()
  getSessionAddress(factoryAddress).then((data)=>{
    console.log(data)
  })
  
}

  async function createPool(e){
    e.preventDefault();
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()
     
      const rice = new ethers.Contract(tokenAddress, RICE.abi, signer)
      await rice.approve(poolFactoryAddress, '500000000000000000000000')

      const wMatic = new ethers.Contract(wMaticAddress, WMATIC.abi, signer)
      await wMatic.approve(poolFactoryAddress, '5000000000000000000')

      setTimeout(function () {
        const contract = new ethers.Contract(poolFactoryAddress, PoolFactory.abi, signer)
        const transaction = contract.createNewPool(
          tokenAddress, //rice
          wMaticAddress, // matic
              '500000000000000000000000',
              '5000000000000000000')
      }, 20000);
    }
  }

  return (
    <div className='admin'>
      ADMIN's THING
      <form onSubmit={createPool}>
        create pool<br/>

        <button className='adminSubmit'>submit</button>
      </form>
      <form onSubmit={fetchPool}>
          fetch pool<br/>

          <button className='adminSubmit'>submit</button>
        </form>


        Vote

Open
<form onSubmit={onOpen}>
   <button type='submit' className='adminSubmit'> Open</button>
</form>

EndVote
<form onSubmit={onEndVote}>
   <button type='submit'> End</button>
</form>
getSessionAddress
<form onSubmit={onGetSessionAddress}>
   <button type='submit'> get</button>
</form>




<form onSubmit={onCreateSession}>
   
    <button type='submit'> create vote session</button>
</form>


    </div>
  );
}
export default AdminPage;