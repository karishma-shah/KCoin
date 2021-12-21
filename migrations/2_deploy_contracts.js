const KCoin = artifacts.require("./KCoin.sol");
const KCoinSale = artifacts.require("./KCoinSale.sol");

module.exports = function (deployer) {
  deployer.deploy(KCoin, 1000000).then(() => {
    //Token price is 0.001 Ether
    const tokenPrice = 1000000000000000;
    return deployer.deploy(KCoinSale, KCoin.address, tokenPrice);
  });
};
