require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
const { WALLET_PRIVATE_KEY,ALCHEMY } = process.env;

module.exports = {
  defaultNetwork: "mumbai",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    mumbai: {
      url: `${ALCHEMY}`,
      accounts: [`0x${WALLET_PRIVATE_KEY}`]
    }
  },
  solidity: "0.8.1",
};
