pragma solidity^0.5.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.3.0/contracts/token/ERC20/ERC20.sol";

contract Adoption {

    address[16] private adopters;

    uint256[16] private prices;

    address payable owner;

    address token_address = 0x20f25fD3cD08Fd98539579f567636fade7a7bcc2;

    constructor() public {
        owner = msg.sender;
        for (uint i = 0; i < 16; i++) {
            adopters[i] = msg.sender;
            prices[i] = i * 2 * 1000000000000000000;
        }
    }

    function adopt(uint petId) public payable returns (uint) {
        ERC20 DogCoin = ERC20(token_address);
        require(petId >= 0 && petId <= 15, "array out of bounds");
        require(DogCoin.balanceOf(msg.sender) >= prices[petId], "msg.value not equal to price");

        DogCoin.transferFrom(adopters[petId], msg.sender, prices[petId]);

        adopters[petId] = msg.sender;

        return petId;
    }

    function buyDogToken() public payable {
      ERC20 DogCoin = ERC20(token_address);
      //0.1 ether for 10 dog tokens

      require(msg.value >= 0.1 ether);

      owner.transfer(msg.value);

      DogCoin.transferFrom(msg.sender, owner, 100000000000000000000);
    }

    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }

    function getPrices() public view returns (uint256[16] memory) {
        return prices;
    }

    function whoIsContractOwner() public view returns (address) {
        return owner;
    }

    function() external payable {}

}
