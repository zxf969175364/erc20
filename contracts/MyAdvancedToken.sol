pragma solidity ^0.4.17;
import "./Erc20Library.sol";
import "./Owned.sol";

contract MyAdvancedToken is owned
{
  using Erc20Library for address;
  address public eternalStorage;

  constructor(address _eternalStorage) public {
    eternalStorage = _eternalStorage;
  }

  function getBalance(address _address) public view returns (uint256)
  {
    return eternalStorage.getBalance(_address);
  }

  function transferFrom(address _from, address _to, uint256 _value) public {
    eternalStorage.transferFrom(_from, _to, _value);
  }

  function transfer(address _to, uint256 _value) public {
    eternalStorage.transfer(_to, _value);
  }

  function mintToken(address _to, uint256 _value) onlyOwner public {
    eternalStorage.mintToken(_to, _value);
  }

  function setFrozenAccount(address _to, bool freeze) onlyOwner public {
    eternalStorage.setFrozenAccount(_to, freeze);
  }

  function getFrozenAccount(address _to) public view returns (bool) {
    return eternalStorage.getFrozenAccount(_to);
  }

  function burn(uint256 _value) public {
    eternalStorage.burnFrom(msg.sender, _value);
  }

  function burnFrom(address _from, uint256 _value) onlyOwner public {
    eternalStorage.burnFrom(_from, _value);
  }

  function setAllowance(address _parentAddress, address _address, uint256 _value) public {
    eternalStorage.setAllowance(_parentAddress, _address, _value);
  }

  function getAllowance(address _parentAddress, address _address) public view returns (uint256) {
    return eternalStorage.getAllowance(_parentAddress, _address);
  }

  function setFee(uint256 newFee) onlyOwner public {
    eternalStorage.setFee(newFee);
  }

  function getFee() public view returns (uint256) {
    return eternalStorage.getFee();
  }

  function setFeeAccount(address newFeeAccount) onlyOwner public {
    eternalStorage.setFeeAccount(newFeeAccount);
  }

  function getFeeAccount() public view returns (address) {
    return eternalStorage.getFeeAccount();
  }

  function updateOwnerAddress(address newOwnerAddress) public {
    transferOwnership(newOwnerAddress);
  }

  function getOwnerAddress() public view returns (address) {
    return owner;
  }

  function getMaxTransferNum() public view returns (uint256) {
    return eternalStorage.getMaxTransferNum();
  }

  function setMaxTransferNum(uint256 newMaxTransferNum) onlyOwner public {
    eternalStorage.setMaxTransferNum(newMaxTransferNum);
  }
}
