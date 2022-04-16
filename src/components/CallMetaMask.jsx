import React, { useEffect, useState } from 'react';

import checkMetaMask from '../utils/CheckMetaMask';

import '../assets/CallMetaMask.css';

const MetaMask = () => {
  let [status, setStatus] = useState(checkMetaMask())
  let [networkStatus, setNetworkStatus] = useState("Wrong Network")
  
  
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x13881",
          rpcUrls: ["https://rpc-mumbai.matic.today"],
          chainName: "Polygon Mumbai",
          nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
          },
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
        }]
      })
      setNetworkStatus(window.ethereum.networkVersion === '80001' ? "Maticmum" : "Wrong Network")
    }

    const interval = setInterval(() => {
      setStatus(checkMetaMask())
      if (checkMetaMask() === "Connected") {
        clearInterval(interval);
      }
    }, 5000);

    const interval2 = setInterval(() => {
      if (checkMetaMask() !== "Install MetaMask") {
        handleCheck()
        if (networkStatus === "Maticmum") {
          clearInterval(interval2);
        }
      }
    }, 3000);
  }, []);



	async function callMetaMask() {
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		// console.log("MetaMask account",accounts)
    return accounts
	}

  function handleSelect(status) {
    if (status === "Connect MetaMask") {
      callMetaMask().then(()=>{window.location.reload()})
    } else if (status === "Install MetaMask") {
      window.open(`https://metamask.io/`, `_blank`);
    }
  }

  function handleCheck2(){
    setNetworkStatus(window.ethereum.networkVersion === '80001' ? "Maticmum" : "Wrong Network")
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x13881",
          rpcUrls: ["https://rpc-mumbai.matic.today"],
          chainName: "Polygon Mumbai",
          nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
          },
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
        }]
      }).then(()=>{window.location.reload()})
    }

  }
  
  function handleCheck(){
    setNetworkStatus(window.ethereum.networkVersion === '80001' ? "Maticmum" : "Wrong Network")
  }

  return (
    <div className='metamask-top-right'> 
      {status !== "Install MetaMask" &&
      <button className={networkStatus === "Maticmum" ? "maticmum":"others"} onClick={handleCheck2} >
        {networkStatus === "Maticmum" ? "Polygon Mumbai" : "Connect Polygon Mumbai"}</button>}
      <button className={status === "Connected" ? "metamask-button-con":"metamask-button-dis"} 
        onClick={() => handleSelect(status)}>{status}</button>
    </div>
  );
}
export default MetaMask;