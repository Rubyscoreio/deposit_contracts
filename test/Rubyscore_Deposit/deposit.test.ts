import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Rubyscore_Deposit } from "@contracts";
import { ContractTransactionResponse } from "ethers";
import { HardhatEthersSigner } from "@test-utils";

async function deployDepositContract() {
  const [deployer, admin, operator, user, user2] = await ethers.getSigners();

  const DepositInstance = await ethers.getContractFactory("Rubyscore_Deposit");
  const depositContract = await DepositInstance.deploy(admin.address, operator.address);

  return { depositContract, deployer, admin, operator, user, user2 };
}

describe("Method: deposit", () => {
  describe("When send zero amount", () => {
    it("should receive error", async () => {
      const { depositContract, user } = await loadFixture(deployDepositContract);

      await expect(depositContract.connect(user)["deposit()"]()).to.be.revertedWith(
        "Value should equal highest zero",
      );
    });
  });

  describe("When all parameters correct", () => {
    let user: HardhatEthersSigner;
    let depositContract: Rubyscore_Deposit;
    const amount = 99999999999999;

    let result: ContractTransactionResponse;

    before(async () => {
      const deployments = await loadFixture(deployDepositContract);
      depositContract = deployments.depositContract;
      user = deployments.user;
    });

    it("should success", async () => {
      result = await depositContract.connect(user)["deposit()"]({ value: amount });
      await expect(result).to.be.not.reverted;
    });

    it("should increment user deposit", async () => {
      const userDeposit = await depositContract.getUserDeposit(user);
      expect(userDeposit).to.be.equal(amount);
    });

    it("should change contract balance", async () => {
      const contractBalance = await ethers.provider.getBalance(depositContract.getAddress());

      expect(contractBalance).to.be.equal(amount);
    });

    it("Event Deposit", async () => {
      await expect(result).to.emit(depositContract, "Deposit").withArgs(user.address, amount);
    });
  });
});

describe("Method: deposit with other recipient", () => {
  describe("When send zero amount", () => {
    it("Should receive error", async () => {
      const { depositContract, user } = await loadFixture(deployDepositContract);

      await expect(depositContract.connect(user)["deposit()"]()).to.be.revertedWith(
        "Value should equal highest zero",
      );
    });
  });

  describe("When all parameters correct", () => {
    let user: HardhatEthersSigner;
    let user2: HardhatEthersSigner;
    let depositContract: Rubyscore_Deposit;
    const amount = 99999999999999;

    let result: ContractTransactionResponse;

    before(async () => {
      const deployments = await loadFixture(deployDepositContract);
      depositContract = deployments.depositContract;
      user = deployments.user;
      user2 = deployments.user2;
    });

    it("should success", async () => {
      result = await depositContract.connect(user)["deposit(address)"](user2.address, { value: amount });
      await expect(result).to.be.not.reverted;
    });

    it("should increment user deposit", async () => {
      const userDeposit = await depositContract.getUserDeposit(user2);
      expect(userDeposit).to.be.equal(amount);
    });

    it("should change contract balance", async () => {
      const contractBalance = await ethers.provider.getBalance(depositContract.getAddress());

      expect(contractBalance).to.be.equal(amount);
    });

    it("Event Deposit", async () => {
      await expect(result).to.emit(depositContract, "Deposit").withArgs(user2.address, amount);
    });
  });
});
