import { Navigate, Route, Routes } from 'react-router-dom'

// import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import SwapPage from './pages/SwapPage'
import Vote from './pages/Vote'

import PoolFactory from './artifacts/contracts/PoolFactory.sol/PoolFactory.json'
import Stake from './artifacts/contracts/Stake.sol/Stake.json'
// import Test from './artifacts/contracts/Test.sol/Test.json'
import RICE from './artifacts/contracts/Token.sol/RICE.json'
import WMATIC from './artifacts/contracts/WMatic.sol/WMATIC.json'
import Swap from './artifacts/contracts/Swap.sol/Swap.json'



const tokenAddress = 'address'
const poolFactoryAddress = 'address'
const stakeAddress = 'address'
const swapAddress = 'address'
const wMaticAddress ='address'



function App() {

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



  async function createPool(e){
    e.preventDefault();
    console.log("going to create pool with token0 address ",e.target[0].value," and token1 address ", e.target[1].value, )
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
    <div className="App">
      <header className="App-header">




        ADMIN's THING
        <form onSubmit={createPool}>
          create pool<br/>
          <input placeholder='address token0'></input><br/>
          <input placeholder='address token1'></input><br/>

          <button>submit</button>
        </form>




        USER's THING<br/>
        Stake
        <form onSubmit={onStake}>
          <input placeholder='address token0'></input>
          <input placeholder='amount token0' type='number' step=".0001"></input><br/>
          <input placeholder='address token1'></input>
          <input placeholder='amount token1' type='number' step=".0001"></input><br/>

          <button>submit</button>
        </form>
        <form onSubmit={fetchPool}>
          fetch pool<br/>
          <input placeholder='address token0'></input><br/>
          <input placeholder='address token1'></input><br/>

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



        
    


      </header>
      <Routes>
        <Route path="/swap" element={<SwapPage />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="*" element={<Navigate to="swap" />} />
      </Routes>
    </div>
  );
}

export default App;
