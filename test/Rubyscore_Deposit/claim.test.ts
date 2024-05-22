import { expect } from "chai";
import { ContractTransactionResponse, parseUnits } from "ethers";
import { ethers, getChainId } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { sign, Domain, ITypes, HardhatEthersSigner } from "@test-utils";
import { Rubyscore_Deposit } from "@contracts";
import { IRubyscore_Deposit } from "@contracts/Rubyscore_Deposit";
import ClaimParamsStruct = IRubyscore_Deposit.ClaimParamsStruct;

async function deployDepositContract() {
  const [deployer, admin, operator, user, user2] = await ethers.getSigners();

  const DepositInstance = await ethers.getContractFactory("Rubyscore_Deposit");
  const depositContract = await DepositInstance.deploy(admin.address, operator.address);

  const domain = {
    name: "Rubyscore_Deposit",
    version: "0.0.1",
    chainId: await getChainId(),
    verifyingContract: await depositContract.getAddress(),
  };

  const types = {
    ClaimParams: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "userNonce", type: "uint256" },
    ],
  };

  const claimParams = {
    recipient: user.address,
    amount: parseUnits("1", 5),
    userNonce: parseUnits("0", 0),
  };

  return { depositContract, domain, types, claimParams, deployer, operator, user, user2 };
}

describe("Method: claimProfit:", () => {
  describe("When one of parameters is incorrect", () => {
    let operator: HardhatEthersSigner;
    let user: HardhatEthersSigner;
    let user2: HardhatEthersSigner;
    let depositContract: Rubyscore_Deposit;
    let types: ITypes;
    let domain: Domain;
    let originalClaimParams: ClaimParamsStruct;

    const amount = parseUnits("1", 18);
    const tax = parseUnits("1", 16);

    before(async () => {
      const deployments = await loadFixture(deployDepositContract);
      depositContract = deployments.depositContract;
      operator = deployments.operator;
      user = deployments.user;
      user2 = deployments.user2;
      types = deployments.types;
      domain = deployments.domain;
      originalClaimParams = deployments.claimParams;

      await depositContract.connect(user)["deposit()"]({ value: amount });

      await depositContract.connect(operator).withdraw(user.address, user2.address, amount, tax);
    });

    it("When amount is zero", async () => {
      const claimParams = {
        recipient: originalClaimParams.recipient,
        amount: 0,
        userNonce: originalClaimParams.userNonce,
      };
      const operatorSignature = await sign(domain, types, claimParams, operator);

      await expect(
        depositContract.connect(operator).claimProfit(claimParams, operatorSignature),
      ).to.be.revertedWith("Zero amount to claim");
    });

    it("When user nonce not equal with signature", async () => {
      const claimParams = {
        recipient: originalClaimParams.recipient,
        amount: originalClaimParams.amount,
        userNonce: 9,
      };

      const operatorSignature = await sign(domain, types, claimParams, operator);

      await expect(
        depositContract.connect(operator).claimProfit(claimParams, operatorSignature),
      ).to.be.revertedWith("Nonce is invalid");
    });

    it("When signer is not equal operator", async () => {
      const operatorSignature = await sign(domain, types, originalClaimParams, user);

      await expect(
        depositContract.connect(operator).claimProfit(originalClaimParams, operatorSignature),
      ).to.be.revertedWithCustomError(depositContract, "AccessControlUnauthorizedAccount");
    });

    it("When signed message not equal claim params", async () => {
      const operatorSignature = await sign(domain, types, originalClaimParams, user);

      const claimParams = {
        recipient: originalClaimParams.recipient,
        amount: 985,
        userNonce: originalClaimParams.userNonce,
      };

      await expect(
        depositContract.connect(operator).claimProfit(claimParams, operatorSignature),
      ).to.be.revertedWithCustomError(depositContract, "AccessControlUnauthorizedAccount");
    });
  });

  describe("When all parameters correct", () => {
    let operator: HardhatEthersSigner;
    let user: HardhatEthersSigner;
    let user2: HardhatEthersSigner;
    let depositContract: Rubyscore_Deposit;
    let types: ITypes;
    let domain: Domain;
    let originalClaimParams: ClaimParamsStruct;
    let recipientBalanceBefore: bigint;
    let contractBalanceBefore: bigint;

    let result: ContractTransactionResponse;

    const amount = parseUnits("1", 18);
    const tax = parseUnits("1", 16);

    before(async () => {
      const deployments = await loadFixture(deployDepositContract);
      depositContract = deployments.depositContract;
      operator = deployments.operator;
      user = deployments.user;
      user2 = deployments.user2;
      types = deployments.types;
      domain = deployments.domain;
      originalClaimParams = deployments.claimParams;

      await depositContract.connect(user)["deposit()"]({ value: amount });
      await depositContract.connect(operator).withdraw(user.address, user2.address, amount, tax);

      recipientBalanceBefore = await ethers.provider.getBalance(originalClaimParams.recipient);
      contractBalanceBefore = await ethers.provider.getBalance(depositContract.getAddress());
    });

    it("should success", async () => {
      const operatorSignature = await sign(domain, types, originalClaimParams, operator);

      result = await depositContract.connect(user2).claimProfit(originalClaimParams, operatorSignature);
      await expect(result).to.be.not.reverted;
    });

    it("should decrease contract balance", async () => {
      const contractBalanceAfter = await ethers.provider.getBalance(depositContract.getAddress());

      expect(contractBalanceAfter).to.be.equal(
        contractBalanceBefore - (originalClaimParams.amount as bigint),
      );
    });

    it("should decrease contract balance", async () => {
      const recipientBalanceAfter = await ethers.provider.getBalance(originalClaimParams.recipient);

      expect(recipientBalanceAfter).to.be.equal(
        recipientBalanceBefore + (originalClaimParams.amount as bigint),
      );
    });

    it("should change nonce", async () => {
      const newNonce = await depositContract.getUserNonce(originalClaimParams.recipient);
      expect(newNonce).to.be.equal(1);
    });

    it("when revert for dabble use", async () => {
      const operatorSignature = await sign(domain, types, originalClaimParams, operator);

      await expect(
        depositContract.connect(user2).claimProfit(originalClaimParams, operatorSignature),
      ).to.be.revertedWith("Nonce is invalid");
    });

    it("Event Claim", async () => {
      await expect(result)
        .to.emit(depositContract, "Claimed")
        .withArgs(originalClaimParams.recipient, originalClaimParams.amount);
    });
  });
});
