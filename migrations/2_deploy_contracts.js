const KCoin = artifacts.require("./KCoin.sol");

module.exports = function (deployer) {
  deployer.deploy(KCoin, 1000000);
};
