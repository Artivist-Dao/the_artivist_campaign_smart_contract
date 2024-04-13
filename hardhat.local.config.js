require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
    }
  },
  paths: {
    artifacts: './artifacts',
  },
  mocha: {
    reporter: 'mochawesome'
  }
};