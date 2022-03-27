export default function checkMetaMask() {
  // console.log("check MetaMask",window.ethereum)
  if (typeof window.ethereum !== 'undefined') {
    if (window.ethereum.selectedAddress === null) {
      return "Connect MetaMask"
    } else {
      return "Connected"
    }
  } else {
    return "Install MetaMask"
  }
}