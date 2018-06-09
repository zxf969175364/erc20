pragma solidity ^0.4.17;

//定义的ABI接口
interface tokenRecipient { function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) external; }

//ERC20 标准的TOKEN
contract TokenERC20Storage {
    // Public variables of the token
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    // 18 decimals is the strongly suggested default, avoid changing it
    uint256 public totalSupply;
    uint256 public fee;
    address public feeAccount;
    uint256 public maxTransferNum;

    // This creates an array with all balances
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;
    mapping (address => bool) public frozenAccount;

    //事件 用于触发外部通知
    //事件是使用EVM日志内置功能的方便工具，在DAPP的接口中，它可以反过来调用Javascript的监听事件的回调。
    // This generates a public event on the blockchain that will notify clients
    event Transfer(address indexed from, address indexed to, uint256 value);

    // This notifies clients about the amount burnt
    event Burn(address indexed from, uint256 value);
    event FrozenFunds(address target, bool frozen);

    /**
     * Constrctor function
     * 构造函数
     * Initializes contract with initial supply tokens to the creator of the contract
     */
    constructor() public {
        //**代表幂次方
        totalSupply = 1000000000 * 10 ** uint256(decimals);  // Update total supply with the decimal amount
        balanceOf[msg.sender] = totalSupply;                // Give the creator all initial tokens
        name = "zxf";                                   // Set the name for display purposes
        symbol = "zxf";                               // Set the symbol for display purposes
        feeAccount = msg.sender;
    }

    /**
     * Set allowance for other address
     * 设置限额
     * Allows `_spender` to spend no more than `_value` tokens in your behalf
     *
     * @param _spender The address authorized to spend
     * @param _value the max amount they can spend
     */
    function approve(address _spender, uint256 _value) public
        returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }

    /**
     * Set allowance for other address and notify
     *
     * Allows `_spender` to spend no more than `_value` tokens in your behalf, and then ping the contract about it
     *
     * @param _spender The address authorized to spend
     * @param _value the max amount they can spend
     * @param _extraData some extra information to send to the approved contract
     */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData)
        public
        returns (bool success) {
        tokenRecipient spender = tokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, this, _extraData);
            return true;
        }
    }

    /**
     * Destroy tokens
     *
     * Remove `_value` tokens from the system irreversibly
     *
     * @param _value the amount of money to burn
     */
    function burn(uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);   // Check if the sender has enough
        balanceOf[msg.sender] -= _value;            // Subtract from the sender
        totalSupply -= _value;                      // Updates totalSupply
        emit Burn(msg.sender, _value); //调用事件通知
        return true;
    }

    /**
     * Destroy tokens from other account
     *
     * Remove `_value` tokens from the system irreversibly on behalf of `_from`.
     *
     * @param _from the address of the sender
     * @param _value the amount of money to burn
     */
    function burnFrom(address _from, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value);                // Check if the targeted balance is enough
        require(_value <= allowance[_from][msg.sender]);    // Check allowance
        balanceOf[_from] -= _value;                         // Subtract from the targeted balance
        allowance[_from][msg.sender] -= _value;             // Subtract from the sender's allowance
        totalSupply -= _value;                              // Update totalSupply
        emit Burn(_from, _value);
        return true;
    }

    function setFee(uint256 newFee) public {
        fee = newFee;
    }

    function getFee() public view returns (uint256) {
        return fee;
    }

    function setFeeAccount(address newFeeAccount) public {
        feeAccount = newFeeAccount;
    }

    function getFeeAccount() public view returns (address) {
        return feeAccount;
    }

    // pure
    function getBalance(address _address) public view returns(uint256) {
      return balanceOf[_address];
    }

    function setBalance(address _address, uint256 _balance) public {
      balanceOf[_address] = _balance;
    }

    function setFrozenAccount(address _address, bool freeze) public {
      frozenAccount[_address] = freeze;
      emit FrozenFunds(_address, freeze);
    }

    function getFrozenAccount(address _address) public view returns(bool) {
      return frozenAccount[_address];
    }

    function setTotalSupply(uint256 newTotalSupply) public {
        totalSupply = newTotalSupply;
    }

    function emitTransfer(address _from, address _to, uint256 _value) public {
        emit Transfer(_from, _to, _value);
    }

    function getAllowance(address _parentAddress, address _address) public view returns(uint256) {
        return allowance[_parentAddress][_address];
    }

    function setAllowance(address _parentAddress, address _address, uint256 _value) public {
        allowance[_parentAddress][_address] = _value;
    }

    function getMaxTransferNum() public view returns(uint256) {
        return maxTransferNum;
    }

    function setMaxTransferNum(uint256 newMaxTransferNum) public {
        maxTransferNum = newMaxTransferNum;
    }
}
