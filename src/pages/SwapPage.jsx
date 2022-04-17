import React, { useState, useEffect, useContext  } from 'react';
import { ethers } from 'ethers'
import RICE from '../artifacts/contracts/Token.sol/RICE.json'
import WMATIC from '../artifacts/contracts/WMatic.sol/WMATIC.json'
import Swap from '../artifacts/contracts/Swap.sol/Swap.json'
import h2d from '../utils/H2D';
import checkMetaMask from '../utils/CheckMetaMask';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import '../assets/SwapPage.css';

import matic from '../assets/images/matic.png';
import rice from '../assets/images/rice.png';
import { unstable_composeClasses } from '@mui/material';
import { AddressContext } from '../context/AddressContextProvider';



const SwapPage = () => {
  const {network} = useContext(AddressContext);
  const [riceAddress,setRiceAddress] = useState() 

  // TODO: change address Rice and Matic
  const coinOption  = [
    {value: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889", label: "Matic", img:matic},
    {value: "0x87C2EBffe6C50eE034b4D05D2d3c2EC7b325e346", label: "Rice", img:rice}
  ]
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  function onClickRiceAddress(e){
    e.preventDefault()
    setRiceAddress(riceAddress === coinOption[1].value? null : coinOption[1].value)
    window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20', // Initially only supports ERC20, but eventually more!
      options: {
        address: coinOption[1].value, // The address that the token is at.
        symbol: "RICE", // A ticker symbol or shorthand, up to 5 chars.
        decimals: 18, // The number of decimals in the token
        image: "https://i.imgur.com/wrYftrf.png", // A string url of the token logo
      },
  }})
}

  function onClickMaticAddress(e){
    e.preventDefault()
    setRiceAddress((riceAddress ===coinOption[0].value)? null : coinOption[0].value)
    window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: coinOption[0].value, // The address that the token is at.
          symbol: "wMatic", // A ticker symbol or shorthand, up to 5 chars.
          decimals: 18, // The number of decimals in the token
          image: "https://i.imgur.com/lezATCj.png", // A string url of the token logo
        },
    }})
  }



  async function onSwap(e){
    e.preventDefault()
  
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        const signer = provider.getSigner()
     
      const token1 = new ethers.Contract(coinState1, RICE.abi, signer)
      await token1.approve(network.swapAddress, e.target[0].value*100000 + "0000000000000")



      setTimeout(function () {
        const contract = new ethers.Contract(network.swapAddress, Swap.abi, signer)
  
        const transaction = contract.swap(
            coinState1,coinState2,
              e.target[0].value*100000 + "0000000000000"
            )
      }, 20000);
    }
  }

  async function  onGetOdds(amount){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.AlchemyProvider("maticmum")
      
      const contract = new ethers.Contract(network.swapAddress, Swap.abi, provider)
          try {
            const data = await contract.getTokenOdds(coinState1, coinState2,  amount*100000 + "0000000000000")
            setHex(data._hex);
            const hexToDec = h2d(data._hex);
            if (data._hex==="0x00"){
              document.getElementById("Alert").innerHTML = "Error Insufficient Amount"
            }
            else {
              document.getElementById("Alert").innerHTML = ""
            }
            setCalculateState((hexToDec/Math.pow(10, 18)).toFixed(4));
          } catch (err) {
            console.log("Error: ", err)
          }
    }  
  }

  // function isSufficient(){
  //   // const ele = document.getElementById("value").value
  //   // console.log("insuffiecient ", amountHex)
  //   if (amountHex==='0x00'){
  //     document.getElementById("Summit").disabled = true;
  //   } else {
  //     document.getElementById("Summit").disabled = false;
  //   }
  // }

  const [coinState1, setState1] = useState("0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889");
  const [coinState2, setState2] = useState("0x87C2EBffe6C50eE034b4D05D2d3c2EC7b325e346");
  // const [amountState, setAmountState] = useState('0');
  const [amountHex, setHex] = useState('0');
  const [amountCalculation, setCalculateState] = useState('0');

  let [status, setStatus] = useState(checkMetaMask())
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(checkMetaMask())
      if (checkMetaMask() === "Connected") {
        clearInterval(interval);
      }
    }, 3000);
  }, []);

  const handleChange1 = (event) => {
    setState1(event.target.value);
  };

  const handleChange2 = (event) => {
    setState2(event.target.value);
    // console.log(event.target.value)
  };

  const handleChange3 = (event) => {
    // setAmountState(event.target.value);
    // console.log(event.target.value);
    onGetOdds(event.target.value);
  }

  return (
    // <input className='swapInput' type="hidden" value={coinState1} disabled={coinState1===""}></input>
    // <input className='swapInput' type="hidden" value={coinState2} disabled={coinState1===""}></input>
    <div>
      {(status !== "Connected") &&
      <div className='swap-inform'>
				<div style={{fontSize: "25px"}}>
          {(status === "Connect MetaMask") ? "MetaMask account required":"MetaMask installation required"}
        </div>
			</div>}
      <p />
      {(status !== "Install MetaMask") &&
      <div>
      <div className='swap'> 
        <div style={{padding: "20px", fontSize: "30px"}}>Swap</div>
        <form onSubmit={onSwap}> 
          <div className='swap-div'>
            <input className='swap-input' id='value' placeholder='amount token' type='number' step=".0001" onInput={handleChange3}></input>
            <div className='swap-input-select'>
              <Box sx={{ width:"130px"}}>
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">COIN</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={coinState1}
                    label="Coin"
                    onChange={handleChange1}
                    sx={{
                      bgcolor:"white"
                    }}
                  >
                    <MenuItem sx={{display: "flex", justifyContent: "space-between"}} value={coinOption[0].value}>wMatic <img className='swap-img' src={coinOption[0].img} alt="Matic"/></MenuItem>
                    <MenuItem sx={{display: "flex", justifyContent: "space-between"}} value={coinOption[1].value}>Rice <img className='swap-img' src={coinOption[1].img} alt="Rice"/></MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
          </div>
          <div style={{opacity: "50%", fontSize: "15px", fontWeight: "bold", lineHeight: "8px"}}>To</div>
          <div className='swap-div'>
            <input className='swap-input' value={amountCalculation} placeholder='amount token' type='number' step=".0001" disabled></input>
            <div className='swap-input-select'>
              <Box sx={{ width:"130px"}}>
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">COIN</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={coinState2}
                    label="Coin"
                    onChange={handleChange2}
                    sx={{
                      bgcolor:"white"
                    }}
                  >
                    <MenuItem sx={{display: "flex", justifyContent: "space-between"}} value={coinOption[0].value}>wMatic <img className='swap-img' src={coinOption[0].img} alt="Matic"/></MenuItem>
                    <MenuItem sx={{display: "flex", justifyContent: "space-between"}} className='swap-select' value={coinOption[1].value}>Rice <img className='swap-img' src={coinOption[1].img} alt="Rice"/></MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
          </div>
          <button className={amountHex==="0x00" || status !== "Connected" ? 'swap-button-dis':'swap-button'} id="Summit" 
            disabled={amountHex==="0x00" || status !== "Connected"?true :false}>Swap</button>
        </form>
        <p className='swap-alert' id="Alert"></p>
      </div>

      <br/><br/>
      <div get-address>
        <img className='rice-address-icon' alt='rice address icon' src={rice} onClick={onClickRiceAddress}/>
        <img className='wmatic-address-icon'alt='wmatic address icon' src={matic} onClick={onClickMaticAddress}/><br/>
      </div>
        {riceAddress && <p className='rice-address'>{riceAddress===coinOption[0].value? "Matic: " : "Rice: "}{riceAddress}</p>}
      </div>}
    </div>
  );
}
export default SwapPage;