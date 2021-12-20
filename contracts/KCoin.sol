// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract KCoin {
    string public name = "K-Coin";
    string public symbol = "KAR";
    string public standard = "K-Coin v1.0";
    uint256 public totalSupply;

    //map(key => value): who has each token
    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) {
        //msg.sender is the account that deployed the contract
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }
}
