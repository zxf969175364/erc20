var MyAdvancedToken = artifacts.require('MyAdvancedToken')


module.exports = function (deployer) {
  deployer.deploy(MyAdvancedToken, 6666666666, 'bixin', "BXT")
}
