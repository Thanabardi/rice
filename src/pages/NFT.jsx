import React, { useEffect, useState } from 'react'

import { ethers } from 'ethers'
import riceNFT from '../artifacts/contracts/nft/RiceNFT.sol/RiceNFT.json'

import checkMetaMask from '../utils/CheckMetaMask';

import '../assets/NFT.css';
const nftAddress = "0xbcEE5365B749cd4A0c25DBecCAA6a840D12fCC9D"


const NFT = () => {
  const [image, setImage] = useState()
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [owner, setOwner] = useState()
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
      const contract = new ethers.Contract(nftAddress, riceNFT.abi, provider)
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
        })
          .catch(err => console.log(err));
      } catch (err) {
        console.log("Error: ", err)
        setImage()
      }
    }  
  }

  function onFetch(e){
      e.preventDefault()
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
          <form onSubmit={onFetch}>
            <div style={{paddingBottom: "20px", fontSize: "25px"}}>Search NFT</div>
            <input type="search" min="1" placeholder='NFT ID' className='nft-input'/>
            {/* <button className='nft-button-con'>Search</button> */}
          </form>
        </div>
        {image ?
        <div>
          <div className='nft-name'>{name}</div>
          <div className='nft-div-img'>
            <img className='nft-img' src={image} alt="preview image" /> 
          </div>
          <div>
            <div className='nft-des'>"{description}"</div>
            <div className='nft-owner'>-Own by {owner}-</div>
          </div>
        </div>:<div className='nft-alert'>NFT Not found</div>}
      </div>}
    </div>
  )
}

export default NFT