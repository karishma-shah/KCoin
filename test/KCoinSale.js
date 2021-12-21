var KCoin = artifacts.require("./KCoin.sol");
var KCoinSale = artifacts.require("./KCoinSale.sol");

contract("KCoinSale", (accounts) => {
  var tokenInstance;
  var tokenSaleInstance;
  var admin = accounts[0];
  var buyer = accounts[1];
  var tokenPrice = 1000000000000000; //in wei
  var tokensAvaliable = 750000;
  var numberOfTokens;

  it("initializes the contract with the correct values", () => {
    return KCoinSale.deployed()
      .then((instance) => {
        tokenSaleInstance = instance;
        return tokenSaleInstance.address;
      })
      .then((address) => {
        assert.notEqual(address, 0x0, "has contract address");
        return tokenSaleInstance.tokenContract();
      })
      .then((address) => {
        assert.notEqual(address, 0x0, "has token contract address");
        return tokenSaleInstance.tokenPrice();
      })
      .then((price) => {
        assert.equal(price, tokenPrice, "token price is correct");
      });
  });

  it("facilitates token buying", () => {
    return KCoin.deployed()
      .then((instance) => {
        // Grab token instance first
        tokenInstance = instance;
        return KCoinSale.deployed();
      })
      .then((instance) => {
        // Then grab token sale intance
        tokenSaleInstance = instance;
        // Provision 75% of all tokens to the token sale
        return tokenInstance.transfer(
          tokenSaleInstance.address,
          tokensAvaliable,
          { from: admin }
        );
      })
      .then((receipt) => {
        numberOfTokens = 10;
        return tokenSaleInstance.buyTokens(numberOfTokens, {
          from: buyer,
          value: numberOfTokens * tokenPrice, //in wei
        });
      })
      .then((receipt) => {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "Sell",
          'should be the "Sell" event'
        );
        assert.equal(
          receipt.logs[0].args._buyer,
          buyer,
          "logs the account that purchased the tokens"
        );
        assert.equal(
          receipt.logs[0].args._amount,
          numberOfTokens,
          "logs the number of tokens purchased"
        );
        return tokenSaleInstance.tokensSold();
      })
      .then((amount) => {
        assert.equal(
          amount.toNumber(),
          numberOfTokens,
          "increments number of tokens sold"
        );
        return tokenInstance.balanceOf(buyer);
      })
      .then((balance) => {
        assert.equal(balance.toNumber(), numberOfTokens);
        return tokenInstance.balanceOf(tokenSaleInstance.address);
      })
      .then((balance) => {
        assert.equal(balance.toNumber(), tokensAvaliable - numberOfTokens);
        //Try to buy tokens different from the Ether value
        return tokenSaleInstance
          .buyTokens(numberOfTokens, {
            from: buyer,
            value: 1, //in wei
          })
          .then(assert.fail)
          .catch((error) => {
            assert(
              error.message.indexOf("revert") >= 0,
              "msg.value must equal number of tokens in wei"
            );
            return tokenSaleInstance.buyTokens(800000, {
              from: buyer,
              value: numberOfTokens * tokenPrice, //in wei
            });
          })
          .then(assert.fail)
          .catch((error) => {
            assert(
              error.message.indexOf("revert") >= 0,
              "cannot purchase more tokens than available"
            );
          });
      });
  });

  it("ends token sale", function () {
    return KCoin.deployed()
      .then(function (instance) {
        // Grab token instance first
        tokenInstance = instance;
        return KCoinSale.deployed();
      })
      .then(function (instance) {
        // Then grab token sale instance
        tokenSaleInstance = instance;
        // Try to end sale from account other than the admin
        return tokenSaleInstance.endSale({ from: buyer });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf("revert" >= 0, "must be admin to end sale")
        );
        // End sale as admin
        return tokenSaleInstance.endSale({ from: admin });
      })
      .then(function (receipt) {
        return tokenInstance.balanceOf(admin);
      })
      .then(function (balance) {
        assert.equal(
          balance.toNumber(),
          999990,
          "returns all unsold KCoins to admin"
        );
        // Check that the contract has no balance
        balance = web3.eth.getBalance(tokenSaleInstance.address).then((balance) => {
          assert.equal(balance, 0);
        });
      });
  });
});
