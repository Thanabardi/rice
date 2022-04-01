import React, { createContext, useState  } from 'react'

export const AddressContext = createContext()



export const AddressContextProvider = ({children}) => {
    const Mumbai = {
        nftAddress:"0xF70e6A73f93d81e5b14f201dc86f9BaD862B998F",
        exchangeAddress: "0x86D446233e1F79bD40Ad92f4272Ec8796CA61e66",
        factoryAddress: "0x388dED90116770E6795447239E0Dd95209506D81",
     
        poolFactoryAddress: '0x4D03044Ee7f8f228a7A9D1C6f33d361C08CfBD61',
        swapAddress: "0xb6b4fD2703e9e878b530aC8906a74f892De46aC6",
        stakeAddress: '0x3Cb07efDBAfbc1BEb470d7B761eac8BacF428CF8',

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