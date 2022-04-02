import React, { useContext, useEffect, useState } from 'react'

import { ethers } from 'ethers'
import riceNFT from '../artifacts/contracts/nft/RiceNFT.sol/RiceNFT.json'

import checkMetaMask from '../utils/CheckMetaMask';
// import NFTHover from '../components/NFTHover';

import '../assets/NFT.css';
import { AddressContext } from '../context/AddressContextProvider';
import h2d from '../utils/H2D';
import axios from 'axios';


const NFT = () => {
  const [image, setImage] = useState()
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [owner, setOwner] = useState()
  const {network} = useContext(AddressContext);
  const [inventory, setInventory] = useState([]);
  const [inventoryImg, setInventoryImg] = useState([]);


  let [errorMsg, setErrorMsg] = useState("")
  let [loadStatus, setLoadStatus] = useState(true)
  let [status, setStatus] = useState(checkMetaMask())

  useEffect(() => {

  fetchNftList(1)
  testAlchemy();
 

 
 
  }, []);
  
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }


  useEffect(() => {

    const interval = setInterval(() => {
      setStatus(checkMetaMask())



      if (checkMetaMask() === "Connected") {
        clearInterval(interval);
      }
    }, 3000);
  }, []);

  async function fetchNFT(){
    if (typeof window.ethereum !== 'undefined') {
      // await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const address = await  signer.getAddress()

      const provider2 = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
      const contract = new ethers.Contract(network.nftAddress, riceNFT.abi, provider2)
     
      
      try {
        const data = await contract.getInventory(address)
        console.log('Have NFT: ',data)
        let list = []
        data.forEach(element => {
          list.push(h2d(element._hex))
        });
        setInventory(list)
        return list  
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }





  async function fetchNftInventory(number){
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
        console.log({ provider })
        const contract = new ethers.Contract(network.nftAddress, riceNFT.abi, provider)
        console.log("n",number)
        try {
          let data = await contract.ownerOf(number)
          // console.log('owner: ',data)
          setOwner(data)
          let url = await contract.tokenURI(number)
          // console.log('award: ',url)
          fetch(url).then(res => res.json())
          .then((out) =>{
            // inventoryImg.push(out.image);
          
            setInventoryImg(oldArray => [ out.image, ...oldArray]);
            console.log("time",inventoryImg)
          })
        }catch (err) {
          console.log("Error: ", err)
        }
      }

  }


  async function testAlchemy(){
    if (typeof window.ethereum !== 'undefined') {
      // await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      

    const baseURL = `${process.env.REACT_APP_ALCHEMY}/getNFTs/`
    // replace with the wallet address you want to query for NFTs
    const ownerAddr = await  signer.getAddress()
  
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
      setInventory(temp)
    
    })
    .catch(error => console.log(error));
  }







}

async function fetchNftList(number){
  const baseURL = `${process.env.REACT_APP_ALCHEMY}/getNFTMetadata`;
  const tokenId = number;
  const tokenType = "erc721";
  
  var config = {
    method: 'get',
    url: `${baseURL}?contractAddress=${network.nftAddress}&tokenId=${tokenId}&tokenType=${tokenType}`,
    headers: { }
  };
  
  axios(config)
  .then((response) => {
    if (response.data.error){
      console.log(response.data.error)
      setErrorMsg("NFT Not found")
      setImage()
      setLoadStatus(false)
    }else{
      console.log(JSON.stringify(response.data.metadata, null, 2))
      setImage(response.data.metadata.image)
            setName(response.data.metadata.name)
            setDescription(response.data.metadata.description)
          setLoadStatus(false)
      }
    })
  .catch((error) => {
    console.log(error)
   setErrorMsg("NFT Not found")
   setImage()
   setLoadStatus(false)
  });

  if (typeof window.ethereum !== 'undefined') {
  const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
  const contract = new ethers.Contract(network.nftAddress, riceNFT.abi, provider)
      let data = await contract.ownerOf(number)
          // console.log('owner: ',data)
          setOwner(data)
  }

}




async function onSending(e){
  e.preventDefault()
  if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()

        const address = await  signer.getAddress()
     

        const contract = new ethers.Contract(network.nftAddress, riceNFT.abi, signer)
          const transaction = contract.approve(e.target[1].value,1)

        setTimeout(function () {
          const contract = new ethers.Contract(network.nftAddress, riceNFT.abi, signer)
          const transaction = contract.transferFrom(address,e.target[0].value,e.target[1].value)
        }, 20000);
       
    }
}

  function onFetch(e){
      e.preventDefault()
      setLoadStatus(true)
      setImage()
      fetchNftList(e.target[0].value)
  }

  return (
    <div>
      {(status === "Install MetaMask") ?
        <div className='stake-inform'>
          <div style={{fontSize: "25px"}}>MetaMask installation required</div>
      </div>
      : 
      <div>
        <div className='nft-div'>
        {!loadStatus ?
          <form onSubmit={onFetch}>
            <div style={{paddingBottom: "20px", fontSize: "25px"}}>Search NFT</div>
            <input type="number" min="1" placeholder='NFT ID' className='nft-input'/>
            {/* <button className='nft-button-con'>Search</button> */}
          </form>
          :<div style={{paddingTop: "35px", fontSize: "20px", opacity: "50%"}}>Loading NFT...</div>}
        </div>
        {image ?
        <div>
          <div className='nft-name'>{name}</div>
          <div className='nft-div-img'>
            <img className='nft-img' src={image} alt="preview image" /> 
            {/* <NFTHover nft={image}/> */}
          </div>
          <div>
            <div className='nft-des'>"{description}"</div>
            <div className='nft-owner'>-Own by {owner}-</div>
          </div>
        </div>:<div className='nft-alert'>{errorMsg}</div>}
      </div>}


      {inventory && inventory.map((index, i) => {         
           const img = index.image         
           // Return the element. Also pass key     
           return (<img src={img}/>) 
        })}




      <form onSubmit={onSending}>
          sending<br/>
          to: <input placeholder='address'></input>
          id: <input type='number' placeholder='id NFT'></input>
          <button className='adminSubmit'>send</button>
        </form>
      
    </div>
  )
}

export default NFT