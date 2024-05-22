// SPDX-License-Identifier: MIT

pragma solidity 0.8.21;

import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IRubyscore_Deposit} from "./interfaces/IRubyscore_Deposit.sol";

contract Rubyscore_Deposit is EIP712, AccessControl, ReentrancyGuard, IRubyscore_Deposit {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    string public constant NAME = "Rubyscore_Deposit";
    string public constant VERSION = "0.0.1";


    mapping(address => uint256) private depositStorage;
    mapping(address => uint256) private userNonce;

    function getUserNonce(address userAddress) external view returns (uint256) {
        return userNonce[userAddress];
    }

    function getUserDeposit(address userAddress) external view returns (uint256) {
        return depositStorage[userAddress];
    }

    constructor(address admin, address operator) EIP712(NAME, VERSION){
        require(admin != address(0), "Zero address check");
        require(operator != address(0), "Zero address check");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, operator);
    }

    function deposit() external payable {
        require(msg.value > 0, "Value should equal highest zero");
        uint256 amount = msg.value;
        uint256 currentDeposit = depositStorage[msg.sender];
        currentDeposit += amount;
        depositStorage[msg.sender] = currentDeposit;

        emit Deposit(msg.sender, amount);
    }

    function deposit(address recipient) external payable nonReentrant {
        require(msg.value > 0, "Value should equal highest zero");
        uint256 amount = msg.value;
        uint256 currentDeposit = depositStorage[recipient];
        currentDeposit += amount;
        depositStorage[recipient] = currentDeposit;

        emit Deposit(recipient, amount);
    }

    function withdraw(address from, address payable to, uint256 amount, uint256 tax) external onlyRole(OPERATOR_ROLE) {
        uint256 currentDeposit = depositStorage[from];
        require(currentDeposit >= amount, "Insufficient funds");
        uint256 finalAmount = amount - tax;
        (bool success,) = to.call{value: finalAmount}("");
        require(success, "Failed to send Ether");
        depositStorage[from] -= amount;

        emit Withdrawal(to, finalAmount, tax);
    }

    function withdrawBatch(address[] calldata from, address payable[] calldata to, uint256[] calldata amounts, uint256[] calldata taxes) external onlyRole(OPERATOR_ROLE) {
        for(uint256 i = 0; i < from.length; i++) {
            address sender = from[i];
            uint256 amount = amounts[i];
            uint256 tax = taxes[i];
            address payable recipient = to[i];

            require(depositStorage[sender] >= amount, "Insufficient funds");
            uint256 finalAmount = amount - tax;
            (bool success,) = recipient.call{value: finalAmount}("");
            require(success, "Failed to send Ether");
            depositStorage[sender] -= amount;

            emit Withdrawal(recipient, finalAmount, tax);
        }
    }

    function claimProfit(ClaimParams memory claimParams, bytes calldata operatorSignature) external nonReentrant {
        require(claimParams.amount > 0, "Zero amount to claim");
        require(claimParams.userNonce == userNonce[claimParams.recipient], "Nonce is invalid");

        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("ClaimParams(address recipient,uint256 amount,uint256 userNonce)"),
                    claimParams.recipient,
                    claimParams.amount,
                    claimParams.userNonce
                )
            )
        );
        _checkRole(OPERATOR_ROLE, ECDSA.recover(digest, operatorSignature));
        userNonce[claimParams.recipient] += 1;

        (bool success,) = payable(claimParams.recipient).call{value: claimParams.amount}("");
        require(success, "Failed to send Ether");

        emit Claimed(claimParams.recipient, claimParams.amount);
    }

    function addFunds() external payable onlyRole(DEFAULT_ADMIN_ROLE) {}

    function removeFunds(address payable to, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(address(this).balance >= amount, "INSUFFICIENT_BALANCE");
        to.call{value: amount}("");
    }

}