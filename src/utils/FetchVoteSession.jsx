
import { ethers } from 'ethers'

import voteFactory from '../artifacts/contracts/vote/VoteFactory.sol/VoteFactory.json'

export default async function getSessionAddress(factoryAddress) {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.AlchemyProvider("maticmum")
        
        const contract = new ethers.Contract(factoryAddress, voteFactory.abi, provider)
        try {
       
          const data = await contract.getLatestSession()
          console.log(data)
          return data
        } catch (err){
            return err
        }
}
  }