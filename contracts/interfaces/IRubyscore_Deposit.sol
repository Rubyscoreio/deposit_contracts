// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.21;

/**
 * @title IRubyscore_Deposit
 * @dev IRubyscore_Deposit is an interface for IRubyscore_Deposit contract
 */
interface IRubyscore_Deposit {
    struct ClaimParams {
        address payable recipient;
        uint256 amount;
        uint256 userNonce;
    }

    /**
    * @notice Emitted when a user makes a deposit.
    * @param user - The user who made the deposit.
    * @param amount - Amount deposited.
    */
    event Deposit(address indexed user, uint256 indexed amount);

    /**
    * @notice Emitted when a user withdraws a deposit.
    * @param user - User where the deposit was withdrawn.
    * @param amount - Withdrawal amount.
    * @param tax - Withdrawal fee.
    */
    event Withdrawal(address indexed user, uint256 indexed amount, uint256 indexed tax);

    /**
    * @notice Emitted when a user comes for profit from the referral system.
    * @param recipient - The address that receives the profit for the referral system.
    * @param amount - The address that receives the profit for the referral system.
    */
    event Claimed(address indexed recipient, uint256 indexed amount);

    /**
     * @notice Get the user's nonce associated with their address.
     * @param userAddress - The address of the user.
     * @return The user's nonce.
     */
    function getUserNonce(address userAddress) external view returns (uint256);

    /**
    * @notice Returns the user's stored deposit.
    * @param userAddress - Address to get deposit amount.
    * @return User deposit amount.
    */
    function getUserDeposit(address userAddress) external view returns (uint256);

    /**
    * @notice Accepts the user's deposit and writes it to the user's account.
    * @dev The ETH sent must be greater than zero.
    */
    function deposit() external payable;

    /**
    * @notice Accepts the user's deposit and writes it to the user's account.
    * @param recipient - The address to which the deposit is to be credited.
    * @dev The ETH sent must be greater than zero.
    */
    function deposit(address recipient) external payable;

    /**
    * @notice Withdraws the deposit to the specified address, used exclusively by the operator.
    * @dev Can only be used by the operator role.
    * @param from - Address from which to withdraw deposit.
    * @param to - Address where to send the deposit.
    * @param amount - Withdrawal amount.
    * @param tax - Withdrawal fee.
    */
    function withdraw(address from, address payable to, uint256 amount, uint256 tax) external;

    /**
    * @notice Batch withdraws the deposits to the specified addresses, used exclusively by the operator.
    * @dev Can only be used by the operator role.
    * @param from - Addresses from which to withdraw deposit.
    * @param to - Addresses where to send the deposits.
    * @param amounts - Withdrawal amounts.
    * @param taxes - Withdrawal fees.
    */
    function withdrawBatch(address[] calldata from, address payable[] calldata to, uint256[] calldata amounts, uint256[] calldata taxes) external;

    /**
    * @notice Withdraws the profit generated for the referral system. Only works if the notice is correct and the operator's signature is valid.
    * @param claimParams - Object with information about the output profit.
    * @param operatorSignature - Signature message.
    */
    function claimProfit(ClaimParams memory claimParams, bytes calldata operatorSignature) external;

    /**
    * @notice Contributes free funds to the contract.
    * @dev Can only be used by the operator role.
    */
    function addFunds() external payable;

    /**
    * @notice Withdraws funds from the contract.
    * @dev Can only be used by the operator role.
    */
    function removeFunds(address payable to, uint256 amount) external;
}