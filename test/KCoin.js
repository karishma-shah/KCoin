const KCoin = artifacts.require("./KCoin.sol");

contract("KCoin", function (accounts) {
  it("sets the total supply upon deployment", () => {
    return KCoin.deployed()
      .then((instance) => {
        tokenInstance = instance;
        return tokenInstance.totalSupply();
      })
      .then((totalSupply) => {
        assert.equal(
          totalSupply.toNumber(),
          1000000,
          "sets the total supply to 1,000,000"
        );
      });
  });
});
