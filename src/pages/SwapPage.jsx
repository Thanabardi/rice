import React, { useState } from 'react';
import { ethers } from 'ethers'
import WMATIC from '../artifacts/contracts/WMatic.sol/WMATIC.json'
import Swap from '../artifacts/contracts/Swap.sol/Swap.json'
import matic from '../assets/images/matic.png';
import rice from '../assets/images/rice.jpg';
import '../assets/SwapPage.css';
// import Box from '@mui/material/Box';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

const SwapPage = () => {
  const swapAddress = '0x9DDe8618a3713aE483E4976Ae8427A040d9f931B'

  // TODO: change address Rice and Matic
  const coinOption  = [
    {value: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889", label: "Matic", img:matic},
    {value: "0x87C2EBffe6C50eE034b4D05D2d3c2EC7b325e346", label: "Rice", img:rice}
  ]
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

  async function  onGetOdds(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
      console.log({ provider })
      const contract = new ethers.Contract(swapAddress, Swap.abi, provider)
      try {
        const data = await contract.getTokenOdds(coinState1, coinState2,  e.target[2].value*100000 + "0000000000000",)

        console.log('Total: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }  
  }

  const [coinState1, setState1] = useState("");
  const [coinState2, setState2] = useState("");
  const [amountState, setAmountState] = useState("");

  const handleChange1 = (event) => {
    setState1(event.target.value);
    console.log(event.target.value)
  };

  const handleChange2 = (event) => {
    setState2(event.target.value);
    console.log(event.target.value)
  };

  const handleChange3 = (event) => {
    // TODO: set CalculateCoin
    setAmountState(event.target.value);
    console.log(event.target.value)
  };

  return (
    <div className='swap'>
      Swap
      <center>
        {/* <Box sx={{ maxWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">COIN</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={coinState1}
              label="Coin"
              onChange={handleChange1}
            >
              <MenuItem value={coinOption[0].value}>Matic <img src={coinOption[0].img}/></MenuItem>
              <MenuItem value={coinOption[1].value}>Rice <img src={coinOption[1].img}/></MenuItem>
            </Select>
          </FormControl>
        </Box> */}
      </center>
      <center>
        {/* <Box sx={{ maxWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">COIN</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={coinState2}
              label="Coin"
              onChange={handleChange2}
            >
              <MenuItem value={coinOption[0].value}>Matic <img src={coinOption[0].img}/></MenuItem>
              <MenuItem value={coinOption[1].value}>Rice <img src={coinOption[1].img}/></MenuItem>
            </Select>
          </FormControl>
        </Box> */}
      </center>
      <form onSubmit={onSwap}>
        <input type="hidden" value={coinState1} disabled={coinState1===""}></input>
        <input type="hidden" value={coinState2} disabled={coinState1===""}></input>
        <input placeholder='amount token' type='number' step=".0001" onChange={handleChange3}></input><br/>

        <button>submit</button>
      </form>
      GetOdds
      <form onSubmit={onGetOdds}>
        <input type="hidden" value={coinState1} disabled={coinState1===""}></input>
        <input type="hidden" value={coinState2} disabled={coinState1===""}></input>
        {/* TODO: set value and render coin */}
        <input placeholder='amount token' type='number' step=".0001" ></input><br/>
        <button>submit</button>
      </form>
    </div>
  );
}
export default SwapPage;