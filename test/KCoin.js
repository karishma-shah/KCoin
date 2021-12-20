const KCoin = artifacts.require("./KCoin.sol");

contract("KCoin", function (accounts) {
  var tokenInstance;

  it("initializes the contract with the correct values", () => {
    return KCoin.deployed()
      .then((instance) => {
        tokenInstance = instance;
        return tokenInstance.name();
      })
      .then((name) => {
        assert.equal(name, "K-Coin", "has the correct name");
        return tokenInstance.symbol();
      })
      .then((symbol) => {
        assert.equal(symbol, "KAR", "has the correct symbol");
        return tokenInstance.standard();
      })
      .then((standard) => {
        assert.equal(standard, "K-Coin v1.0", "has the correct standard");
      });
  });

  it("allocates the initial supply upon deployment", () => {
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
        return tokenInstance.balanceOf(accounts[0]);
      })
      .then((adminBalance) => {
        assert.equal(
          adminBalance.toNumber(),
          1000000,
          "it allocates the intial supply to the admin account"
        );
      });
  });
});
