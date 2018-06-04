pragma solidity ^0.4.23;
//管理员
contract Owned {
    address public owner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) onlyOwner public
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
