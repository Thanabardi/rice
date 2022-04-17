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
  let [select, setSelect] = useState()
  let [current, setCurrent] = useState(0)


  let [errorMsg, setErrorMsg] = useState("")
  let [loadStatus, setLoadStatus] = useState(true)
  let [status, setStatus] = useState(checkMetaMask())

  useEffect(() => {

  fetchNftList(0)
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

      const provider2 = new ethers.providers.AlchemyProvider("maticmum")
      
      const contract = new ethers.Contract(network.nftAddress, riceNFT.abi, provider2)
     
      
      try {
        const data = await contract.getInventory(address)
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
        const provider = new ethers.providers.AlchemyProvider("maticmum")
      
        
        const contract = new ethers.Contract(network.nftAddress, riceNFT.abi, provider)
        try {
          let data = await contract.ownerOf(number)
          setOwner(data)
          let url = await contract.tokenURI(number)
          fetch(url).then(res => res.json())
          .then((out) =>{
          
            setInventoryImg(oldArray => [ out.image, ...oldArray]);
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
        temp.push({"metadata":e.metadata, "id":e.id})
      })
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
      if (number !== 0){
        setErrorMsg("NFT Not found")
      }
      setImage()
      setLoadStatus(false)
    }else{
      setImage(response.data.metadata.image)
            setName(response.data.metadata.name)
            setDescription(response.data.metadata.description)
          setLoadStatus(false)
      }
    })
  .catch((error) => {
    console.log(error)
    if (number !== 0){
      setErrorMsg("NFT Not found")
    }
   
   setImage()
   setLoadStatus(false)
  });


  const provider = new ethers.providers.AlchemyProvider("maticmum")
      
      
      const contract = new ethers.Contract(network.nftAddress, riceNFT.abi, provider)
      try {
        let data = await contract.ownerOf(number)
        // console.log('owner: ',data)
        setOwner(data)
      }catch{
          setOwner()
      }

}


async function onSending(e){
  e.preventDefault()
  if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        const signer = provider.getSigner()

        const address = await  signer.getAddress()
     
        const contract = new ethers.Contract(network.nftAddress, riceNFT.abi, signer)
          const transaction = contract.approve(network.nftAddress,select.id.tokenId)

        setTimeout(function () {
          const contract = new ethers.Contract(network.nftAddress, riceNFT.abi, signer)
          const transaction = contract.transferFrom(address,e.target[0].value,select.id.tokenId)
        }, 20000);
       
    }
}

  function onFetch(e){
      e.preventDefault()
      setLoadStatus(true)
      setImage()
      fetchNftList(e.target[0].value)
  }

  async function getAccountAddress() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    return address
  }

  function handleSelect(nft) {
		if (nft !== select) {
      console.log(nft)
			setSelect(nft)
		} else {
			setSelect()
		}
	}

  return (
    <div>
      {(status === "Install MetaMask") ?
        <div className='stake-inform'>
          <div style={{fontSize: "25px"}}>MetaMask installation required</div>
      </div>
      : 
      <div>
        {inventory.length > 0 &&
      <div>
        <div style={{paddingTop: "40px", fontSize: "30px"}}>Your NFT{inventory.length>1 ? "s":""} ({inventory.length})</div>
        <table className='nft-table'>
          <tr>
          {/* current > 0 && */}
          <td>{inventory.length > 1 &&  <button className='nft-inventory-button-left' onClick={() => setCurrent((current-1+inventory.length)%(inventory.length))}>{"<"}</button>}</td>
          <td style={{position: "relative"}}>
          {(inventory[(current-1+inventory.length)%(inventory.length)] )&& inventory.length!= 1&&
          <div className='nft-inventory-0'>
            <div className='nft-name'>{inventory[(current-1+inventory.length)%(inventory.length)].metadata.name}</div>
            <div className={inventory[(current-1+inventory.length)%(inventory.length)] === select ? 'nft-div-img-select':'nft-div-img-in'} onClick={() => handleSelect(inventory[current-1])} style={{cursor: "pointer"}}>
              <img className='nft-img' src={inventory[(current-1+inventory.length)%(inventory.length)].metadata.image} alt="preview image"/>
            </div>
            <div>
              <div className='nft-des'>"{inventory[(current-1+inventory.length)%(inventory.length)].metadata.description}"</div>
              <div className='nft-owner'>ID {h2d(inventory[(current-1+inventory.length)%(inventory.length)].id.tokenId)}</div>
            </div>
          </div>}
          </td>
          <td>
          {inventory[(current+inventory.length)%(inventory.length)] &&
          <div className='nft-inventory-1'>
            <div className='nft-name'>{inventory[(current+inventory.length)%(inventory.length)].metadata.name}</div>
            <div className={inventory[(current+inventory.length)%(inventory.length)] === select ? 'nft-div-img-select':'nft-div-img-in'} onClick={() => handleSelect(inventory[current])} style={{cursor: "pointer"}}>
              <img className='nft-img' src={inventory[(current+inventory.length)%(inventory.length)].metadata.image} alt="preview image" style={{}}/>
            </div>
            <div>
              <div className='nft-des'>"{inventory[(current+inventory.length)%(inventory.length)].metadata.description}"</div>
              <div className='nft-owner'>ID {h2d(inventory[(current+inventory.length)%(inventory.length)].id.tokenId)}</div>
            </div>
          </div>}
          </td>
          <td>
          {inventory[(current+1+inventory.length)%(inventory.length)] && inventory.length!= 1 &&
          <div className='nft-inventory-2'>
            <div className='nft-name'>{inventory[(current+1+inventory.length)%(inventory.length)].metadata.name}</div>
            <div className={inventory[(current+1+inventory.length)%(inventory.length)] === select ? 'nft-div-img-select':'nft-div-img-in'} onClick={() => handleSelect(inventory[current+1])} style={{cursor: "pointer"}}>
              <img className='nft-img' src={inventory[(current+1+inventory.length)%(inventory.length)].metadata.image} alt="preview image"/>
            </div>
            <div>
              <div className='nft-des'>"{inventory[(current+1+inventory.length)%(inventory.length)].metadata.description}"</div>
              <div className='nft-owner'>ID {h2d(inventory[(current+1+inventory.length)%(inventory.length)].id.tokenId)}</div>
            </div>
          </div>}
          </td>
          <td>{ inventory.length > 1 && <button className='nft-inventory-button-right' onClick={() => setCurrent((current+1+inventory.length)%(inventory.length))}>{">"}</button>}</td>
          </tr>
        </table>
      {/* {inventory.map((index, i) => {         
        return (
          <div>
            <div className='nft-name'>{index.metadata.name}</div>
            <div className={index === select ? 'nft-div-img-select':'nft-div-img-in'} onClick={() => handleSelect(index)} style={{cursor: "pointer"}}>
              <img className='nft-img' src={index.metadata.image} alt="preview image"/>
            </div>
            <div>
              <div className='nft-des'>"{index.metadata.description}"</div>
              <div className='nft-owner'>ID {h2d(index.id.tokenId)}</div>
            </div>
          </div>
          ) 
        })} */}
      <div className='nft-div'>
        <form onSubmit={onSending}>
          <div style={{paddingBottom: "20px", fontSize: "25px"}}>Send NFT</div>
          <div style={{display: "flex", justifyContent: "space-around", paddingBottom: "20px"}}>
            <div>Id: {select && h2d(select.id.tokenId)}</div>
            <div>Name: {select && select.metadata.name}</div>
          </div>
          <div style={{display: "flex", justifyContent: "space-between"}}>to <input type="text" placeholder='Address' className='nft-input' required style={{minWidth: "90%"}} /></div>
          <button className='nft-button-con'>Send</button>
        </form>
      </div>
      </div>}
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
            <div className='nft-owner'>-Own by {getAccountAddress() === owner? "You": owner}-</div>
          </div>
        </div>:<div className='nft-alert'>{errorMsg}</div>}
      </div>}
    </div>
  )
}

export default NFT