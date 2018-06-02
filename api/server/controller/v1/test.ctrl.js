const Transaction = require('ethereumjs-tx');
const keythereum = require('keythereum');
const math = require('mathjs');
const ApiError = require('../../errors').ApiError;
const utils = require('../../utils/util');
const encrypt = require('../../utils/encrypt');
const web3 = require('../../config/web3');
const coins = require('../../config/coin.meta');

exports.getPrivateKey = async function(ctx) {
  try {
    const buf = await keythereum.recover('123', {
      "address": "d03fc73d0b3b96f1e12b97c92dc0651c9ee1ccf8",
      "crypto": {
          "cipher": "aes-128-ctr",
          "ciphertext": "7ec9c257ed4927e27ed5027e6a1b947a3473f92756f76358076e3589861c6635",
          "cipherparams": {
              "iv": "20315f2282cd3fc7cd6cfc311a054a83"
          },
          "kdf": "scrypt",
          "kdfparams": {
              "dklen": 32,
              "n": 262144,
              "p": 1,
              "r": 8,
              "salt": "82613eacf5a48c4efc9f19d166a38f3e09ac4429ddaba9a20866111b4f89bd05"
          },
          "mac": "aa078f9ee25e4b06504aeb109b165e9e933016bdbd0f9bc502168ab7df2b1fce"
      },
      "id": "857f7c8f-8abf-45c8-92e6-87b61380ce84",
      "version": 3
    });
    const privateKey = buf.toString('hex');
    ctx.body = {
      privateKey,
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.getBalance = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const contract = web3.getContract(coin.option.contractAddress, ctx.query.fromAddress);
    let counts = await contract.methods.balanceOf(ctx.query.fromAddress).call();
    counts = utils.fromWei(counts, coin.decimals);
    ctx.body = {
      counts
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.mintToken = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const body = ctx.request.body;
    const contract = web3.getContract(coin.option.contractAddress, body.fromAddress);
    const ethjsTxParams = {};
    const gas = 300000;
    const gasPrice = 3000000000;
    const privateKey = new Buffer('949984efb71b88487074303688c50be7df1ba39dfed5c8fe57b0b3ea8a206f5b', 'hex');
    const nonce = await web3.eth.getTransactionCount(body.fromAddress);
    ethjsTxParams.from = encrypt.add0x(body.fromAddress);
    ethjsTxParams.to = encrypt.add0x(coin.option.contractAddress);
    ethjsTxParams.gasLimit = encrypt.add0x(gas);
    ethjsTxParams.gasPrice = encrypt.add0x(gasPrice);
    ethjsTxParams.nonce = nonce ? encrypt.add0x((nonce).toString(16)) : encrypt.add0x((0).toString(16));
    ethjsTxParams.value = encrypt.add0x(0);
    ethjsTxParams.data = contract.methods.mintToken(body.toAddress, utils.toWei(body.value, coin.decimals).toString()).encodeABI();
    // 保持networkid 一致
    ethjsTxParams.chainId = process.env.ETH_CHAINID || 10;

    const tx = new Transaction(ethjsTxParams);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.freezeAccount = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const body = ctx.request.body;
    const contract = web3.getContract(coin.option.contractAddress, body.fromAddress);
    const ethjsTxParams = {};
    const gas = 300000;
    const gasPrice = 3000000000;
    const privateKey = new Buffer('949984efb71b88487074303688c50be7df1ba39dfed5c8fe57b0b3ea8a206f5b', 'hex');
    const nonce = await web3.eth.getTransactionCount(body.fromAddress);
    ethjsTxParams.from = encrypt.add0x(body.fromAddress);
    ethjsTxParams.to = encrypt.add0x(coin.option.contractAddress);
    ethjsTxParams.gasLimit = encrypt.add0x(gas);
    ethjsTxParams.gasPrice = encrypt.add0x(gasPrice);
    ethjsTxParams.nonce = nonce ? encrypt.add0x((nonce).toString(16)) : encrypt.add0x((0).toString(16));
    ethjsTxParams.value = encrypt.add0x(0);
    ethjsTxParams.data = contract.methods.freezeAccount(body.toAddress, body.isFreeze).encodeABI();
    // 保持networkid 一致
    ethjsTxParams.chainId = process.env.ETH_CHAINID || 10;

    const tx = new Transaction(ethjsTxParams);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.setPrices = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const body = ctx.request.body;
    const contract = web3.getContract(coin.option.contractAddress, body.fromAddress);
    const ethjsTxParams = {};
    const gas = 300000;
    const gasPrice = 3000000000;
    const privateKey = new Buffer('949984efb71b88487074303688c50be7df1ba39dfed5c8fe57b0b3ea8a206f5b', 'hex');
    const nonce = await web3.eth.getTransactionCount(body.fromAddress);
    ethjsTxParams.from = encrypt.add0x(body.fromAddress);
    ethjsTxParams.to = encrypt.add0x(coin.option.contractAddress);
    ethjsTxParams.gasLimit = encrypt.add0x(gas);
    ethjsTxParams.gasPrice = encrypt.add0x(gasPrice);
    ethjsTxParams.nonce = nonce ? encrypt.add0x((nonce).toString(16)) : encrypt.add0x((0).toString(16));
    ethjsTxParams.value = encrypt.add0x(0);
    ethjsTxParams.data = contract.methods.setPrices(utils.toWei(body.newSellPrice, coin.decimals).toString(),utils.toWei(body.newBuyPrice, coin.decimals).toString()).encodeABI();
    // 保持networkid 一致
    ethjsTxParams.chainId = process.env.ETH_CHAINID || 10;

    const tx = new Transaction(ethjsTxParams);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.burnFrom = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const body = ctx.request.body;
    const contract = web3.getContract(coin.option.contractAddress, body.fromAddress);
    const ethjsTxParams = {};
    const gas = 300000;
    const gasPrice = 3000000000;
    const privateKey = new Buffer('949984efb71b88487074303688c50be7df1ba39dfed5c8fe57b0b3ea8a206f5b', 'hex');
    const nonce = await web3.eth.getTransactionCount(body.fromAddress);
    ethjsTxParams.from = encrypt.add0x(body.fromAddress);
    ethjsTxParams.to = encrypt.add0x(coin.option.contractAddress);
    ethjsTxParams.gasLimit = encrypt.add0x(gas);
    ethjsTxParams.gasPrice = encrypt.add0x(gasPrice);
    ethjsTxParams.nonce = nonce ? encrypt.add0x((nonce).toString(16)) : encrypt.add0x((0).toString(16));
    ethjsTxParams.value = encrypt.add0x(0);
    ethjsTxParams.data = contract.methods.burnFrom(body.fromAddress, utils.toWei(body.value, coin.decimals).toString()).encodeABI();
    // 保持networkid 一致
    ethjsTxParams.chainId = process.env.ETH_CHAINID || 10;

    const tx = new Transaction(ethjsTxParams);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.burn = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const body = ctx.request.body;
    const contract = web3.getContract(coin.option.contractAddress, body.fromAddress);
    const ethjsTxParams = {};
    const gas = 300000;
    const gasPrice = 3000000000;
    const privateKey = new Buffer('949984efb71b88487074303688c50be7df1ba39dfed5c8fe57b0b3ea8a206f5b', 'hex');
    const nonce = await web3.eth.getTransactionCount(body.fromAddress);
    ethjsTxParams.from = encrypt.add0x(body.fromAddress);
    ethjsTxParams.to = encrypt.add0x(coin.option.contractAddress);
    ethjsTxParams.gasLimit = encrypt.add0x(gas);
    ethjsTxParams.gasPrice = encrypt.add0x(gasPrice);
    ethjsTxParams.nonce = nonce ? encrypt.add0x((nonce).toString(16)) : encrypt.add0x((0).toString(16));
    ethjsTxParams.value = encrypt.add0x(0);
    ethjsTxParams.data = contract.methods.burn(utils.toWei(body.value, coin.decimals).toString()).encodeABI();
    // 保持networkid 一致
    ethjsTxParams.chainId = process.env.ETH_CHAINID || 10;

    const tx = new Transaction(ethjsTxParams);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.approve = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const body = ctx.request.body;
    const contract = web3.getContract(coin.option.contractAddress, body.fromAddress);
    const ethjsTxParams = {};
    const gas = 300000;
    const gasPrice = 3000000000;
    const privateKey = new Buffer('949984efb71b88487074303688c50be7df1ba39dfed5c8fe57b0b3ea8a206f5b', 'hex');
    const nonce = await web3.eth.getTransactionCount(body.fromAddress);
    ethjsTxParams.from = encrypt.add0x(body.fromAddress);
    ethjsTxParams.to = encrypt.add0x(coin.option.contractAddress);
    ethjsTxParams.gasLimit = encrypt.add0x(gas);
    ethjsTxParams.gasPrice = encrypt.add0x(gasPrice);
    ethjsTxParams.nonce = nonce ? encrypt.add0x((nonce).toString(16)) : encrypt.add0x((0).toString(16));
    ethjsTxParams.value = encrypt.add0x(0);
    ethjsTxParams.data = contract.methods.approve(body.fromAddress, utils.toWei(body.value, coin.decimals).toString()).encodeABI();
    // 保持networkid 一致
    ethjsTxParams.chainId = process.env.ETH_CHAINID || 10;

    const tx = new Transaction(ethjsTxParams);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.transferFrom = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const body = ctx.request.body;
    const contract = web3.getContract(coin.option.contractAddress, body.fromAddress);
    const ethjsTxParams = {};
    const gas = 300000;
    const gasPrice = 3000000000;
    const privateKey = new Buffer('949984efb71b88487074303688c50be7df1ba39dfed5c8fe57b0b3ea8a206f5b', 'hex');
    const nonce = await web3.eth.getTransactionCount(body.fromAddress);
    ethjsTxParams.from = encrypt.add0x(body.fromAddress);
    ethjsTxParams.to = encrypt.add0x(coin.option.contractAddress);
    ethjsTxParams.gasLimit = encrypt.add0x(gas);
    ethjsTxParams.gasPrice = encrypt.add0x(gasPrice);
    ethjsTxParams.nonce = nonce ? encrypt.add0x((nonce).toString(16)) : encrypt.add0x((0).toString(16));
    ethjsTxParams.value = encrypt.add0x(0);
    ethjsTxParams.data = contract.methods.transfer(body.toAddress, utils.toWei(body.value, coin.decimals).toString()).encodeABI();
    // 保持networkid 一致
    ethjsTxParams.chainId = process.env.ETH_CHAINID || 10;

    const tx = new Transaction(ethjsTxParams);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};
