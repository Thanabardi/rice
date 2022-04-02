import React, { createContext, useState  } from 'react'

export const AddressContext = createContext()



export const AddressContextProvider = ({children}) => {
    const Mumbai = {
        nftAddress:"0xF70e6A73f93d81e5b14f201dc86f9BaD862B998F",
        exchangeAddress: "0x86D446233e1F79bD40Ad92f4272Ec8796CA61e66",
        factoryAddress: "0x388dED90116770E6795447239E0Dd95209506D81",


        moneyballAddress: "0xb4367e58B304b19CDeBB16b6469569f1D05e7180",
        poolFactoryAddress: "0xBD6a738dff5653FC95F12b5156770a0595558194",
        swapAddress: "0x17C3E53c894e30c952bbbC250A794d07357B6ABE",
        stakeAddress: '0x45aC01Aca8f487Db4173E65b9F7ac3d7002E5844',

        tokenAddress: '0x87C2EBffe6C50eE034b4D05D2d3c2EC7b325e346',
        wMaticAddress: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
        linkAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
    }
    const Ropsten = {

    }

const [network,setNetwork] = useState(Mumbai)
  return (
      <AddressContext.Provider value={{network}}>
        {children}
    </AddressContext.Provider>
  )
}

export default AddressContextProvider