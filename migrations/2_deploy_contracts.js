var TokenERC20Storage = artifacts.require('TokenERC20Storage');

module.exports = function (deployer) {
  deployer.deploy(TokenERC20Storage);
}
