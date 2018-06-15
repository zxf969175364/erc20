pragma solidity ^0.4.17;

import "./TokenERC20Storage.sol";

library Erc20Library {

  function getBalance(address _storageContract, address _address) public view returns(uint256) {
    return TokenERC20Storage(_storageContract).getBalance(_address);
  }

  function _transfer(address _storageContract, address _from, address _to, uint256 _value) private {
    TokenERC20Storage data = TokenERC20Storage(_storageContract);
    require(_value <= data.getMaxTransferNum());
    require(_to != 0x0);
    require(data.getBalance(_from) >= _value);
    require(data.getBalance(_to) + _value > data.getBalance(_to));
    require(!data.getFrozenAccount(_from));
    require(!data.getFrozenAccount(_to));

    uint taxedValue = _value - data.getFee();
    data.setBalance(_from, (data.getBalance(_from) - _value));
    data.setBalance(_to, (data.getBalance(_to) + taxedValue));
    data.setBalance(
    data.getFeeAccount(),
    data.getBalance(data.getFeeAccount()) + data.getFee());

    data.emitTransfer(msg.sender, _to, taxedValue);
    data.emitTransfer(msg.sender,
      data.getFeeAccount(),
      data.getFee()
    );
  }

  function transferFrom(address _storageContract, address _from, address _to, uint256 _value) public {
    TokenERC20Storage data = TokenERC20Storage(_storageContract);
    require(_value <= data.getAllowance(_from, msg.sender));
    data.setAllowance(_from, msg.sender, (data.getAllowance(_from, msg.sender) - _value));
    _transfer(_storageContract, _from, _to, _value);
  }

  function transfer(address _storageContract, address _to, uint256 _value) public {
    _transfer(_storageContract, msg.sender, _to, _value);
  }

  function mintToken(address _storageContract, address _to, uint256 _value) public {
    TokenERC20Storage(_storageContract).setBalance(_to, (TokenERC20Storage(_storageContract).getBalance(_to) + _value));
  }

  function setFrozenAccount(address _storageContract, address _to, bool freeze) public {
    TokenERC20Storage(_storageContract).setFrozenAccount(_to, freeze);
  }

  function getFrozenAccount(address _storageContract, address _to) public view returns (bool) {
    return TokenERC20Storage(_storageContract).getFrozenAccount(_to);
  }

  function burnFrom(address _storageContract, address _from, uint256 _value) public {
    address burnAddress;
    TokenERC20Storage data = TokenERC20Storage(_storageContract);
    require(_from != 0x0);
    require(data.getBalance(_from) >= _value);
    data.setBalance(_from, (data.getBalance(_from) - _value));
    data.emitTransfer(_from, burnAddress, _value);
  }

  function setAllowance(address _storageContract, address _parentAddress, address _address, uint256 _value) public {
    TokenERC20Storage(_storageContract).setAllowance(_parentAddress, _address, _value);
  }

  function getAllowance(address _storageContract, address _parentAddress, address _address) public view returns (uint256) {
    return TokenERC20Storage(_storageContract).getAllowance(_parentAddress, _address);
  }

  function setFee(address _storageContract, uint256 newFee) public {
    TokenERC20Storage(_storageContract).setFee(newFee);
  }

  function getFee(address _storageContract) public view returns (uint256) {
    return TokenERC20Storage(_storageContract).getFee();
  }

  function setFeeAccount(address _storageContract, address newFeeAccount) public {
    TokenERC20Storage(_storageContract).setFeeAccount(newFeeAccount);
  }

  function getFeeAccount(address _storageContract) public view returns (address) {
    return TokenERC20Storage(_storageContract).getFeeAccount();
  }

  function setFeeAccount(address _storageContract) public view returns (address) {
    return TokenERC20Storage(_storageContract).getFeeAccount();
  }

  function getMaxTransferNum(address _storageContract) public view returns (uint256) {
    return TokenERC20Storage(_storageContract).getMaxTransferNum();
  }

  function setMaxTransferNum(address _storageContract, uint256 newMaxTransferNum) public {
    TokenERC20Storage(_storageContract).setMaxTransferNum(newMaxTransferNum);
  }

}
