import React, { useContext, useEffect, useState } from 'react'

import { ethers } from 'ethers'
import riceNFT from '../artifacts/contracts/nft/RiceNFT.sol/RiceNFT.json'

import checkMetaMask from '../utils/CheckMetaMask';
// import NFTHover from '../components/NFTHover';

import '../assets/NFT.css';
import { AddressContext } from '../context/AddressContextProvider';


const NFT = () => {
  const [image, setImage] = useState()
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [owner, setOwner] = useState()
  const {network} = useContext(AddressContext);


  let [errorMsg, setErrorMsg] = useState("")
  let [loadStatus, setLoadStatus] = useState(true)
  let [status, setStatus] = useState(checkMetaMask())

  useEffect(() => {
  // create candidate details list from candidate id
  fetchNftList(1)
  }, []);
 

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(checkMetaMask())
      if (checkMetaMask() === "Connected") {
        clearInterval(interval);
      }
    }, 3000);
  }, []);


  async function fetchNftList(number){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
      console.log({ provider })
      const contract = new ethers.Contract(network.nftAddress, riceNFT.abi, provider)
      try {
        let data = await contract.ownerOf(number)
        // console.log('owner: ',data)
        setOwner(data)
        let url = await contract.tokenURI(number)
        // console.log('award: ',url)

        fetch(url).then(res => res.json())
        .then((out) =>{
          // console.log('Checkout this JSON! ', out)
          // console.log(out.name)
          // console.log(out.description)
          setImage(out.image)
          setName(out.name)
          setDescription(out.description)
          setLoadStatus(false)
        })
          .catch(err => console.log(err));
      } catch (err) {
        console.log("Error: ", err)
        setErrorMsg("NFT Not found")
        setLoadStatus(false)
        setImage()
      }
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
            <input type="search" min="1" placeholder='NFT ID' className='nft-input'/>
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
      
    </div>
  )
}

export default NFT