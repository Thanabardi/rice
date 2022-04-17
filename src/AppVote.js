import React from 'react'
import { ethers } from 'ethers'


import voteExchange from './artifacts/contracts/vote/VoteExchange.sol/VoteExchange.json'
import voteFactory from './artifacts/contracts/vote/VoteFactory.sol/VoteFactory.json'
import voteSession from './artifacts/contracts/vote/VoteSession.sol/VoteSession.json'
import RICE from './artifacts/contracts/Token.sol/RICE.json'

const exchangeAddress = "0xA668F28E30179e4D4400efFFC19fa4f85004e687"
const factoryAddress = "0x7C1CC7d5B1BBAD6d059aeed8621dD0c7A62740Ba"
const tokenAddress = '0x87C2EBffe6C50eE034b4D05D2d3c2EC7b325e346'


const AppVote = () => {

async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
}

async function onCreateSession(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        const signer = provider.getSigner()
     
        const contract = new ethers.Contract(factoryAddress, voteFactory.abi, signer)
        const transaction = contract.createVoteSession()
    }
  }

  async function onVote(e){
      e.preventDefault()
      if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
        const sessionAddress = getSessionAddress()
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          
          const signer = provider.getSigner()
       
          const contract = new ethers.Contract(sessionAddress, voteSession.abi, signer)
          const transaction = contract.vote(e.target[0].value, e.target[1].value)
      }
  }

  async function onEndVote(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const sessionAddress = getSessionAddress()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
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
            const transaction = contract.deposit(e.target[0].value + "000000000000000000")
        }, 20000);
         
      }
}

async function onWithdraw(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          
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
          
          const signer = provider.getSigner()
       
          const contract = new ethers.Contract(exchangeAddress, voteExchange.abi, signer)
          const transaction = contract.openExchange()
      }
}

async function getSessionAddress(){
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.AlchemyProvider("maticmum")
        
        const contract = new ethers.Contract(factoryAddress, voteFactory.abi, provider)
        try {
          const data = await contract.getLatestSession()
  
          console.log('lastest session address: ',data)
          return data
        } catch (err){
            return err
        }
}
}

async function onfetchVote(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.AlchemyProvider("maticmum")
      
      
      const sessionAddress = getSessionAddress()
      const contract = new ethers.Contract(factoryAddress, voteFactory.abi, provider)
        const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
        try{
            const data = await contractVote.remainingVote(e.target[0].value)
            console.log('amount of vote left: ',data)
            const data2 = await contractVote.winner()
            console.log('winner is: ',data2)
        }catch (err) {
        console.log("Error: ", err)
    }
}  

  }





  return (
    <div>

        Vote

        Open
        <form onSubmit={onOpen}>
           <button type='submit'> Open</button>
       </form>

       EndVote
        <form onSubmit={onEndVote}>
           <button type='submit'> End</button>
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

       check vote
       <form onSubmit={onfetchVote}>
       <input placeholder='your address' required/>
           <button type='submit'> fetch</button>
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
  )
}

export default AppVote