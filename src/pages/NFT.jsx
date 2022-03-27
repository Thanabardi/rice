import React, { useEffect, useState } from 'react'

import { ethers } from 'ethers'
import riceNFT from '../artifacts/contracts/nft/RiceNFT.sol/RiceNFT.json'

const nftAddress = "0x1D32c7FC542105B536CA3D9Fb452dD11Fc79310F"

const NFT = () => {

    const [image, setImage] = useState(null)

    useEffect(() => {
		// create candidate details list from candidate id
		fetchNftList(2)
		

  }, []);



  async function fetchNftList(number){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
      console.log({ provider })
      const contract = new ethers.Contract(nftAddress, riceNFT.abi, provider)
      try {
        let data = await contract.ownerOf(number)
        console.log('owner: ',data)
        let url = await contract.tokenURI(number)
        console.log('award: ',url)
        
  
      fetch(url).then(res => res.json())
      .then((out) =>{
        // console.log('Checkout this JSON! ', out)
        setImage(out.image)
        console.log(out.name)
        console.log(out.description)
      }
        )
     
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
    <div>NFT


<form onSubmit={onFetch}>
          fetch nft list<br/>
            <input type="number" min="1"/>
          <button className='adminSubmit'>fetch list</button>
        </form>

        <img src={image} alt="preview image" /> 


    </div>




  )
}

export default NFT