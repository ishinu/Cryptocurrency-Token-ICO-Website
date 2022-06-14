const EPICToken = artifacts.require("./EPICToken.sol");
const EPICTokenSale = artifacts.require("./EPICTokenSale.sol");

module.exports = function (deployer) {
  deployer.deploy(EPICToken,1000000).then(function(){
  var tokenPrice= 1000000000000000;
  return deployer.deploy(EPICTokenSale, EPICToken.address, tokenPrice);
  });
};
