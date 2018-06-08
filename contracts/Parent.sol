pragma solidity ^0.4.17;
import "./Owned.sol";

contract Parent is owned {
  uint count = 0;
  event OrganisationCreated(address organisation, uint now);
  event OrganisationUpgraded(address organisation, uint now);

  mapping(bytes32 => address) public organisations;

  function registerTokenERC20(bytes32 key_, address _address) onlyOwner public {
    organisations[key_] = _address;
    count += 1;
    emit OrganisationCreated(_address, count);
  }

  function getTokenERC20(bytes32 key_) public constant returns (address) {
    return organisations[key_];
  }

}
