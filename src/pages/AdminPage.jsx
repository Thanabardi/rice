import React, { useContext, useState } from 'react';
import { ethers } from 'ethers'
import RICE from '../artifacts/contracts/Token.sol/RICE.json'
import WMATIC from '../artifacts/contracts/WMatic.sol/WMATIC.json'
import PoolFactory from '../artifacts/contracts/PoolFactory.sol/PoolFactory.json'
import MoneyBall from '../artifacts/contracts/MoneyBall.sol/MoneyBall.json'
import axios from 'axios';

import '../assets/Admin.css';
// import '../assets/SwapPage.css';
import getSessionAddress from '../utils/FetchVoteSession';

import voteExchange from '../artifacts/contracts/vote/VoteExchange.sol/VoteExchange.json'
import voteFactory from '../artifacts/contracts/vote/VoteFactory.sol/VoteFactory.json'
import voteSession from '../artifacts/contracts/vote/VoteSession.sol/VoteSession.json'
import riceNFT from '../artifacts/contracts/nft/RiceNFT.sol/RiceNFT.json'
import h2d from '../utils/H2D';

import { NFTStorage, Blob } from 'nft.storage'
// const client = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwMWMwQjY3ZDRmMjM4OTM2ZjYxMTI3MDQxQjc5RDU0OGQ4NjEyMDciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0ODMwOTUwOTA1MSwibmFtZSI6InRlc3QifQ.Yv6GxXbPirOLm8mSzxVokQtHP9VglIPswqfKK3IAM0Y" })

import { create as ipfsHttpClient } from 'ipfs-http-client'
import { AddressContext } from '../context/AddressContextProvider';


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


const AdminPage = () => {

  const [image, setImage] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [nftUploadStatus, setNftUploadStatus,l] = useState(false)
  const {network} = useContext(AddressContext);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchPool(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.AlchemyProvider("maticmum")
      
      
      const contract = new ethers.Contract(network.poolFactoryAddress, PoolFactory.abi, provider)
      try {
        const data = await contract.getTotalAmountInPool(network.tokenAddress,network.wMaticAddress)

        console.log('RICE: ',h2d(data[0]._hex),'wMatic: ',h2d(data[1]._hex))
      } catch (err) {
        console.log("Error: ", err)
      }

    }  
  }
  async function fetchMoneyBall(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.AlchemyProvider("maticmum")
      
      
      const contract = new ethers.Contract(network.moneyballAddress, MoneyBall.abi, provider)
      try {
        const data1 = await contract.getTotal(network.tokenAddress)
        const data2 = await contract.getTotal(network.wMaticAddress)
        console.log('RICE: ',h2d(data1._hex)/10**18)
        console.log('wMatic: ',h2d(data2._hex)/10**18)
      } catch (err) {
        console.log("Error: ", err)
      }


    }  
  }


  async function sendMoneyBall(e){
    e.preventDefault()

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        const signer = provider.getSigner()
    
        const contract = new ethers.Contract(network.moneyballAddress, MoneyBall.abi, signer)
        const transaction = contract.send(e.target.value)

    }

    }  





  async function fetchAward(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.AlchemyProvider("maticmum")
      
      
      const contract = new ethers.Contract(network.nftAddress, riceNFT.abi, provider)
      try {
        const data = await contract.recentAward()
        console.log('award: ',data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }  
  }


  async function fetchNFT(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const address = await  signer.getAddress()

      const provider2 = new ethers.providers.AlchemyProvider("maticmum")
      
      const contract = new ethers.Contract(network.nftAddress, riceNFT.abi, provider2)
     
      
      try {
        const data = await contract.getInventory(address)
        console.log('Have NFT: ',data)
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
        
        const signer = provider.getSigner()
    
        const contract = new ethers.Contract(network.factoryAddress, voteFactory.abi, signer)
        const transaction = contract.createVoteSession()

    }
  }


async function onEndVote(e){
  e.preventDefault()
  if (typeof window.ethereum !== 'undefined') {
    await requestAccount()
    const sessionAddress = getSessionAddress(network.factoryAddress)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      const signer = provider.getSigner()

      const link = new ethers.Contract(network.linkAddress, RICE.abi, signer)
      await link.approve(sessionAddress, "100000000000000")

      setTimeout(function () {
        const contract = new ethers.Contract(sessionAddress, voteSession.abi, signer)
        const transaction = contract.endVote()
      }, 20000);
  }
}







async function onOpen(e){
  e.preventDefault()
  if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        const signer = provider.getSigner()
     
        const contract = new ethers.Contract(network.exchangeAddress, voteExchange.abi, signer)
        const transaction = contract.openExchange()
    }
}

function onGetSessionAddress(e){
  e.preventDefault()
  getSessionAddress(network.factoryAddress).then((data)=>{
    console.log(data)
  })
  
}

  async function createPool(e){
    e.preventDefault();
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        const signer = provider.getSigner()
     
      const rice = new ethers.Contract(network.tokenAddress, RICE.abi, signer)
      await rice.approve(network.poolFactoryAddress, '5000000000000000000000')

      const wMatic = new ethers.Contract(network.wMaticAddress, WMATIC.abi, signer)
      await wMatic.approve(network.poolFactoryAddress, '5000000000000000000')

      setTimeout(function () {
        const contract = new ethers.Contract(network.poolFactoryAddress, PoolFactory.abi, signer)
        const transaction = contract.createNewPool(
          network.tokenAddress, //rice
          network.wMaticAddress, // matic
          '5000000000000000000000',
          '5000000000000000000')
      }, 20000);
    }
  }


  async function onChange(e) {
    /* upload image to IPFS */
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
      console.log('url',added.path)
      document.getElementById("upload-nft-btn").disabled = false;

    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function mintSendNft(e){
    e.preventDefault();
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        const signer = provider.getSigner()
     
        const contract = new ethers.Contract(network.nftAddress, riceNFT.abi, signer)
        const transaction = contract.award(uploadJson(e.target[0].value.toUpperCase(),e.target[1].value))
    }
  }

  async function uploadJson(e1,e2) {
        const content = JSON.stringify(
            {
                "name": e1,
                "description": e2,
                "image": fileUrl
            }
        )

        try {
          const added = await client.add(content)
          const url = `https://ipfs.infura.io/ipfs/${added.path}`
          /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
          console.log(url)
          return url
        } catch (error) {
          console.log('Error uploading file: ', error)

    }
}



function testAlchemy(e){
  e.preventDefault()
  const baseURL = `${process.env.REACT_APP_ALCHEMY}/getNFTs/`
  // replace with the wallet address you want to query for NFTs
  const ownerAddr = "0xbb78Ebf787951CF921783163Be1B8423A4Dc752e";

  var config = {
    method: 'get',
    url: `${baseURL}?owner=${ownerAddr}&contractAddresses[]=${network.nftAddress}`
  };

  axios(config)
  .then((response) => {
    let temp =[]
    response.data.ownedNfts.forEach((e)=>{
      temp.push(e.metadata)
    })
    // console.log(JSON.stringify(response.data.ownedNfts[0].metadata, null, 2))
    console.log(temp)
  
  
  })
  .catch(error => console.log(error));
}






  return (
    <div className='admin'>
  
      <h1>ADMIN's Panel</h1>


      <form onSubmit={createPool}>
      create pool<br/>

        <button className='adminSubmit'>create</button>
      </form>


 
      <form onSubmit={fetchAward}>
          fetch award<br/>

          <button className='adminSubmit'>fetch</button>
        </form>

        <form onSubmit={fetchMoneyBall}>
          fetch MoneyBall<br/>

          <button className='adminSubmit'>fetch</button>
        </form>

        <form onSubmit={sendMoneyBall}>
          send Prize<br/>
          <input placeholder='address'></input><br/><br/>
          <button className='adminSubmit'>send</button>
        </form>
    



      <form onSubmit={fetchPool}>
          fetch pool<br/>

          <button className='adminSubmit'>fetch</button>
        </form>



{/* Open
<form onSubmit={onOpen}>
   <button type='submit' className='adminSubmit'> Open</button>
</form> */}

EndVote
<form onSubmit={onEndVote}>
   <button type='submit' className='adminSubmit'> End</button>
</form>




<form onSubmit={onCreateSession}>
   Create Vote Session <br/>
    <button type='submit' className='adminSubmit'> create vote session</button>
</form>



<form onSubmit={mintSendNft}>
    Mint NFT<br/>
     
<input type="text" placeholder='name'required/><br/>
<input type="text" name="" id=""  placeholder='desc' required/><br/>
<input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />

<br/><br/>
<button  id="upload-nft-btn" disabled>
          Create NFT
        </button>
    </form>



    </div>
  );
}
export default AdminPage;