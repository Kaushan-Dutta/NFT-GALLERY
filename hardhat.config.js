require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {

  solidity: "0.8.17",
  networks:{
   
    /* goerli:{
      url:'https://goerli.infura.io/v3/da968d1fe0d14b52851585d86f2f0cd8',
      accounts:[process.env.PRIVATE_KEY]
    }, */
     polygon:{
      url:'https://polygon-mumbai.g.alchemy.com/v2/t9j38RtTOEEXWT9SNB8M5KYOUIf_BzeP',
      accounts:[process.env.PRIVATE_KEY]
    

    } ,
    ganache:{
      url:'http://127.0.0.1:7545',
      accounts:[process.env.PRIVATE_KEY]
    }
  },
  paths:{
    artifacts:"./src/artifacts"
  }
};
