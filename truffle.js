module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 4700000,
      gasPrice: 65000000000,
      from: '0x3282c4E35B10454b74179Dd6DB28b19211e7f8e7',
    },
    // rinkeby: {
    //     host: 'localhost',
    //     port: 8545,
    //     network_id: '4',
    //     from: '0xd03fc73d0b3b96f1e12b97c92dc0651c9ee1ccf8',
    //     gas: 4700000,
    // }
  }
}
