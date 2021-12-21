// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./KCoin.sol";

contract KCoinSale {
    address admin;
    KCoin public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(KCoin _tokenContract, uint256 _tokenPrice) {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    //multiply
    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    //payable to allow user to send Ether via transaction with this function
    function buyTokens(uint256 _numberOfTokens) public payable {
        // Require that tokens are bought for correct amount
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        // Require that the contract has enough tokens
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        // Require that a transfer is successful
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    //Ending Token KCoinSale
    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));

        // Transfer the balance to the admin
        payable(admin).transfer(address(this).balance);
    }
}
