var Parent = artifacts.require('Parent')
var MyAdvancedToken = artifacts.require('MyAdvancedToken')
var TokenERC20Storage = artifacts.require("TokenERC20Storage");
var Erc20Library = artifacts.require("Erc20Library");

module.exports = function (deployer) {
  deployer.link(TokenERC20Storage, Erc20Library);
  deployer.deploy(Erc20Library);
  deployer.link(TokenERC20Storage, MyAdvancedToken);
  deployer.link(Erc20Library, MyAdvancedToken);
  deployer.deploy(MyAdvancedToken, TokenERC20Storage.address);
}
