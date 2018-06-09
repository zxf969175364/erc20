const Transaction = require('ethereumjs-tx');
const keythereum = require('keythereum');
const math = require('mathjs');
const ApiError = require('../../errors').ApiError;
const utils = require('../../utils/util');
const encrypt = require('../../utils/encrypt');
const web3 = require('../../config/web3');
const coins = require('../../config/coin.meta');

async function sendSign(coin, ctx, methodName, methodParams) {
  const body = ctx.request.body;
  const contract = web3.getContract(coin.option.contractAddress, body.fromAddress);
  const ethjsTxParams = {};
  const gas = 300000;
  const gasPrice = 3000000000;
  const privateKey = new Buffer(ctx.user.privateKey, 'hex');
  const nonce = await web3.eth.getTransactionCount(body.fromAddress);
  ethjsTxParams.from = encrypt.add0x(body.fromAddress);
  ethjsTxParams.to = encrypt.add0x(coin.option.contractAddress);
  ethjsTxParams.gasLimit = encrypt.add0x(gas);
  ethjsTxParams.gasPrice = encrypt.add0x(gasPrice);
  ethjsTxParams.nonce = nonce ? encrypt.add0x((nonce).toString(16)) : encrypt.add0x((0).toString(16));
  ethjsTxParams.value = encrypt.add0x(0);
  ethjsTxParams.data = contract.methods[methodName].apply(this, methodParams).encodeABI();
  // 保持networkid 一致
  ethjsTxParams.chainId = process.env.ETH_CHAINID || 10;

  const tx = new Transaction(ethjsTxParams);
  tx.sign(privateKey);

  const serializedTx = tx.serialize();

  const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
  return result;
}

exports.getGethPrivateKey = async function(ctx) {
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

exports.getEncryptString = async function(ctx) {
  try {
    const pwk = await encrypt.deriveKeyFromPasswordAndSalt(ctx.request.body.password, ctx.request.body.salt);
    const privateKey = encrypt.encryptString(ctx.request.body.privateKey, pwk);
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
    let counts = await contract.methods.getBalance(ctx.query.fromAddress).call();
    counts = utils.fromWei(counts, coin.decimals);
    ctx.body = {
      counts
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.getTokenERC20 = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const contract = web3.getContract(coin.option.contractAddress, ctx.query.fromAddress);
    const result = await contract.methods.getTokenERC20(web3.utils.fromAscii(ctx.query.key)).call();
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.registerTokenERC20 = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const result = await sendSign(coin, ctx, 'registerTokenERC20', [web3.utils.fromAscii(ctx.request.body.key), ctx.request.body.contractAddress]);
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.mintToken = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const result = await sendSign(coin, ctx, 'mintToken', [ctx.request.body.toAddress, utils.toWei(ctx.request.body.value, coin.decimals).toString()]);
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.setFrozenAccount = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const result = await sendSign(coin, ctx, 'setFrozenAccount', [ctx.request.body.toAddress, ctx.request.body.isFrozen]);
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.getFrozenAccount = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const contract = web3.getContract(coin.option.contractAddress, ctx.query.fromAddress);
    const result = await contract.methods.getFrozenAccount(ctx.query.fromAddress).call();
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
    const result = await sendSign(coin, ctx, 'burnFrom', [ctx.request.body.toAddress, utils.toWei(ctx.request.body.value, coin.decimals).toString()]);
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
    const result = await sendSign(coin, ctx, 'burn', [utils.toWei(ctx.request.body.value, coin.decimals).toString()]);
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.transfer = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const result = await sendSign(coin, ctx, 'transfer', [ctx.request.body.toAddress, utils.toWei(ctx.request.body.value, coin.decimals).toString()]);
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.updateOwnerAddress = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const result = await sendSign(coin, ctx, 'updateOwnerAddress', [ctx.request.body.newOwnerAddress]);
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.getOwnerAddress = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const contract = web3.getContract(coin.option.contractAddress, ctx.query.fromAddress);
    const result = await contract.methods.getOwnerAddress().call();
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.setAllowance = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const result = await sendSign(coin, ctx, 'setAllowance', [ctx.request.body.parentAddress, ctx.request.body.address, utils.toWei(ctx.request.body.value, coin.decimals).toString()]);
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.getAllowance = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const contract = web3.getContract(coin.option.contractAddress, ctx.query.fromAddress);
    let counts = await contract.methods.getAllowance(ctx.query.parentAddress, ctx.query.address).call();
    counts = utils.fromWei(counts, coin.decimals);
    ctx.body = {
      counts
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.setFee = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const result = await sendSign(coin, ctx, 'setFee', [utils.toWei(ctx.request.body.value, coin.decimals).toString()]);
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.getFee = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const contract = web3.getContract(coin.option.contractAddress, ctx.query.fromAddress);
    let counts = await contract.methods.getFee().call();
    counts = utils.fromWei(counts, coin.decimals);
    ctx.body = {
      counts
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.setFeeAccount = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const result = await sendSign(coin, ctx, 'setFeeAccount', [ctx.request.body.feeAccount]);
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.getFeeAccount = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const contract = web3.getContract(coin.option.contractAddress, ctx.query.fromAddress);
    const result = await contract.methods.getFeeAccount().call();
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.setMaxTransferNum = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const result = await sendSign(coin, ctx, 'setMaxTransferNum', [utils.toWei(ctx.request.body.value, coin.decimals).toString()]);
    ctx.body = {
      result
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};

exports.getMaxTransferNum = async function(ctx) {
  try {
    const coin = coins[ctx.query.coinName.toUpperCase()];
    const contract = web3.getContract(coin.option.contractAddress, ctx.query.fromAddress);
    let counts = await contract.methods.getMaxTransferNum().call();
    counts = utils.fromWei(counts, coin.decimals);
    ctx.body = {
      counts
    };
  } catch (err) {
    throw new ApiError(ctx, 500, err.message);
  }
};
