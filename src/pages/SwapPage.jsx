import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'
import WMATIC from '../artifacts/contracts/WMatic.sol/WMATIC.json'
import Swap from '../artifacts/contracts/Swap.sol/Swap.json'
import matic from '../assets/images/matic.png';
import rice from '../assets/images/rice.jpg';
import '../assets/SwapPage.css';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
  function add(x, y) {
    var c = 0, r = [];
    var x = x.split('').map(Number);
    var y = y.split('').map(Number);
    while(x.length || y.length) {
            var s = (x.pop() || 0) + (y.pop() || 0) + c;
            r.unshift(s < 10 ? s : s - 10); 
            c = s < 10 ? 0 : 1;
    }
    if(c) r.unshift(c);
    return r.join('');
  }

  function h2d(s) {
  var dec = '0';
  s.split('').forEach(function(chr) {
      var n = parseInt(chr, 16);
      for(var t = 8; t; t >>= 1) {
          dec = add(dec, dec);
          if(n & t) dec = add(dec, '1');
      }
  });
  return dec;
  }

  async function  onGetOdds(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
      console.log({ provider })
      const contract = new ethers.Contract(swapAddress, Swap.abi, provider)
          try {
            const data = await contract.getTokenOdds(coinState1, coinState2,  amountState*100000 + "0000000000000",)
            setHex(data._hex);
            const hexToDec = h2d(data._hex);
            if (data._hex==="0x00"){
              document.getElementById("Alert").innerHTML = "Error Insufficient Amount"
            }
            else {
              document.getElementById("Alert").innerHTML = ""
            }
            setCalculateState(hexToDec/Math.pow(10, 18));
            console.log('Total: ', data)
          } catch (err) {
            console.log("Error: ", err)
          }
    }  
  }

  function isSufficient(){
    // const ele = document.getElementById("value").value
    console.log("insuffiecient ", amountHex)
    if (amountHex==='0x00'){
      document.getElementById("Summit").disabled = true;
    } else {
      document.getElementById("Summit").disabled = false;
    }
  }

  const [coinState1, setState1] = useState('0');
  const [coinState2, setState2] = useState('0');
  const [amountState, setAmountState] = useState('0');
  const [amountHex, setHex] = useState('0');
  const [amountCalculation, setCalculateState] = useState('0');

  const handleChange1 = (event) => {
    setState1(event.target.value);
    console.log(event.target.value)
  };

  const handleChange2 = (event) => {
    setState2(event.target.value);
    console.log(event.target.value)
  };

  const handleChange3 = (event) => {
    setAmountState(event.target.value);
    console.log(event.target.value);
    onGetOdds();
  }

  return (
    <div className='swap'>
      Swap
        <div style={{ margin_top: '5%'}}>
          <form onSubmit={onSwap}> 
              <input className='swapInput' type="hidden" value={coinState1} disabled={coinState1===""}></input>
              <input className='swapInput' type="hidden" value={coinState2} disabled={coinState1===""}></input>
              <div className='input-item'>
                <input id='value' className='swapInput' placeholder='amount token' type='number' step=".0001" onInput={handleChange3}></input>
                <div className='swapInner'>
                    <div className='swapSelect'>
                      <div className='swapInterface'>
                        <Box sx={{ width:"125px" }}>
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
                                  <MenuItem value={coinOption[0].value}>Matic <img className="imageChange" src={coinOption[0].img}/></MenuItem>
                                  <MenuItem value={coinOption[1].value}>Rice <img className="imageChange" src={coinOption[1].img}/></MenuItem>
                              </Select>
                          </FormControl>
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
              <br/>
              <div className='input-item'>
            <input className='swapInput' value={amountCalculation} placeholder='amount token' type='number' step=".0001" disabled></input><br/>
            <div className='swapInner'>
            <div className='swapSelect'>
              <div className='swapInterface'>
                <Box sx={{ width:"125px" }}>
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
                          <MenuItem value={coinOption[0].value}>Matic <img className='imageChange' src={coinOption[0].img}/></MenuItem>
                          <MenuItem value={coinOption[1].value}>Rice <img className='imageChange' src={coinOption[1].img}/></MenuItem>
                      </Select>
                  </FormControl>
                </Box>
              </div>
            </div>
            </div>
            </div>
              <button id="Summit" className='swapSummit' disabled={amountHex==="0x00"?true :false}>Enter amount</button>
          </form>
          <p className='Alert' id="Alert"></p>
        </div>
      </div>
  );
}
export default SwapPage;