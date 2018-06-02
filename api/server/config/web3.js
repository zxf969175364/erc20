const Web3 = require('web3');
const abiArray = require('./web3Abi');

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB_HOSTS || 'http://localhost:8545'));
// const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB_HOSTS || 'https://mainnet.infura.io/8zLFlnWSG9Fh4zPOClce'));
// localhost:8545
// The address of the contract which created MFIL
web3.getContract = function (contractAddress, fromAddress, abiArrayData) {
  const abi = abiArrayData && abiArrayData.length ? abiArrayData : abiArray;
  return new web3.eth.Contract(abi, contractAddress, {
    from: fromAddress,
    // gasPrice: '20000000000',
    // gas: 1000000,
  });
};

module.exports = web3;
