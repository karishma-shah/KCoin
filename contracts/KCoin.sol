// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract KCoin {
    string public name = "K-Coin";
    string public symbol = "KAR";
    string public standard = "K-Coin v1.0";
    uint256 public totalSupply;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    //map(key => value): who has each token
    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) {
        //msg.sender is the account that deployed the contract
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    // Transfer

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}
