import React from 'react';
import { ethers } from 'ethers'
import RICE from '../artifacts/contracts/Token.sol/RICE.json'
import WMATIC from '../artifacts/contracts/WMatic.sol/WMATIC.json'
import PoolFactory from '../artifacts/contracts/PoolFactory.sol/PoolFactory.json'

import '../assets/SwapPage.css';
import getSessionAddress from '../utils/FetchVoteSession';

import voteExchange from '../artifacts/contracts/vote/VoteExchange.sol/VoteExchange.json'
import voteFactory from '../artifacts/contracts/vote/VoteFactory.sol/VoteFactory.json'
import voteSession from '../artifacts/contracts/vote/VoteSession.sol/VoteSession.json'


const exchangeAddress = "0x735bF360270EB4F34EF4D00F5CC5c3850C4f48dC"
const factoryAddress = "0x7Dfbea4e09C899343B6C1b615Ff107a905FcBd77"
const tokenAddress = '0x87C2EBffe6C50eE034b4D05D2d3c2EC7b325e346'

const AdminPage = () => {
  // const tokenAddress = 'address'
  const poolFactoryAddress = 'address'
  const wMaticAddress ='address'

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
        const data = await contract.getTotalAmountInPool(e.target[0].value,e.target[1].value)

        console.log('Total: ',data[0],data[1])
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
    console.log("going to create pool with token0 address ",e.target[0].value," and token1 address ", e.target[1].value)
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()
     
      const rice = new ethers.Contract(tokenAddress, RICE.abi, signer)
      await rice.approve(poolFactoryAddress, '10000000000000000000')

      const wMatic = new ethers.Contract(wMaticAddress, WMATIC.abi, signer)
      await wMatic.approve(poolFactoryAddress, '10000000000000000')

      setTimeout(function () {
        const contract = new ethers.Contract(poolFactoryAddress, PoolFactory.abi, signer)
        const transaction = contract.createNewPool(
              e.target[0].value, //rice
              e.target[1].value, // matic
              '10000000000000000000',
              '10000000000000000')
      }, 20000);
    }
  }

  return (
    <div className='admin'>
      ADMIN's THING
      <form onSubmit={createPool}>
        create pool<br/>
        <input placeholder='address token0'></input><br/>
        <input placeholder='address token1'></input><br/>

        <button>submit</button>
      </form>
      <form onSubmit={fetchPool}>
          fetch pool<br/>
          <input placeholder='address token0'></input><br/>
          <input placeholder='address token1'></input><br/>

          <button>submit</button>
        </form>


        Vote

Open
<form onSubmit={onOpen}>
   <button type='submit'> Open</button>
</form>

EndVote
<form onSubmit={onEndVote}>
   <button type='submit'> End</button>
</form>
getSessionAddress
<form onSubmit={onGetSessionAddress}>
   <button type='submit'> get</button>
</form>


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


<form onSubmit={onCreateSession}>
   
    <button type='submit'> create vote session</button>
</form>

<form onSubmit={onVote}>

    <input type='number' min='1' max='100' placeholder='amount 1-100' required/>
    <input type='text' required placeholder='twitter'/>
   <button type='submit'> vote</button>
</form>

    </div>
  );
}
export default AdminPage;