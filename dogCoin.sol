pragma solidity ^0.5.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.3.0/contracts/token/ERC20/ERC20.sol";

contract DogCoin is ERC20 {

    string public constant name = "DogERC20";
    string public constant symbol = "DOG COIN";
    uint8 public constant decimals = 18;  


    event Transfer(address indexed from, address indexed to, uint tokens);


    mapping(address => uint256) balances;

    
    uint256 totalCoins;


   constructor(uint256 total) public {  
	    totalCoins = total;
	    balances[msg.sender] = totalCoins;
    }  

    function getTokenCount() public view returns (uint256) {
	    return totalCoins;
    }
    
    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint numTokens) public returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender] - numTokens;
        balances[receiver] = balances[receiver] + numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }


    function transferFrom(address owner, address buyer, uint numTokens) public returns (bool) {
        require(numTokens <= balances[buyer]);    
    
        balances[owner] = balances[owner] + numTokens;
        balances[buyer] = balances[buyer] - numTokens;
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
}
