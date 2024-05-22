import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Rubyscore_Deposit } from "@contracts";
import { ContractTransactionResponse, parseUnits } from "ethers";
import { HardhatEthersSigner } from "@test-utils";

async function deployDepositContract() {
  const [deployer, admin, operator, user, user2] = await ethers.getSigners();

  const DepositInstance = await ethers.getContractFactory("Rubyscore_Deposit");
  const depositContract = await DepositInstance.deploy(admin.address, operator.address);

  return { depositContract, deployer, admin, operator, user, user2 };
}

describe("Method: withdraw:", () => {
  describe("When one parameters is incorrect", () => {
    let operator: HardhatEthersSigner;
    let user: HardhatEthersSigner;
    let user2: HardhatEthersSigner;
    let depositContract: Rubyscore_Deposit;

    const amount = parseUnits("1", 18);
    const tax = parseUnits("1", 16);

    before(async () => {
      const deployments = await loadFixture(deployDepositContract);
      depositContract = deployments.depositContract;
      operator = deployments.operator;
      user = deployments.user;
      user2 = deployments.user2;

      await depositContract.connect(user)["deposit()"]({ value: amount });
    });

    it("When not operator call withdraw", async () => {
      await expect(
        depositContract.connect(user).withdraw(user.address, user2.address, amount, tax),
      ).to.be.revertedWithCustomError(depositContract, "AccessControlUnauthorizedAccount");
    });

    it("When insufficient funds", async () => {
      await expect(
        depositContract.connect(operator).withdraw(user.address, user2.address, amount + tax, tax),
      ).to.be.revertedWith("Insufficient funds");
    });
  });

  describe("When all parameters correct", () => {
    let depositContract: Rubyscore_Deposit;
    let operator: HardhatEthersSigner;
    let user: HardhatEthersSigner;
    let user2: HardhatEthersSigner;
    let recipientBalanceBefore: bigint;
    let result: ContractTransactionResponse;

    const amount = parseUnits("1", 18);
    const tax = parseUnits("1", 16);

    before(async () => {
      const deployments = await loadFixture(deployDepositContract);
      depositContract = deployments.depositContract;
      operator = deployments.operator;
      user = deployments.user;
      user2 = deployments.user2;
      recipientBalanceBefore = await ethers.provider.getBalance(user2.address);

      await depositContract.connect(user)["deposit()"]({ value: amount });
    });

    it("should success", async () => {
      result = await depositContract.connect(operator).withdraw(user.address, user2.address, amount, tax);
      await expect(result).to.be.not.reverted;
    });

    it("should decrease user deposit", async () => {
      const userDeposit = await depositContract.getUserDeposit(user);
      expect(userDeposit).to.be.equal(0);
    });

    it("should contract balance equal to expected", async () => {
      const contractBalance = await ethers.provider.getBalance(depositContract.getAddress());

      expect(contractBalance).to.be.equal(tax);
    });

    it("should recipient balance equal to expected", async () => {
      const recipientBalanceAfter = await ethers.provider.getBalance(user2.address);

      expect(recipientBalanceAfter).to.be.equal(recipientBalanceBefore + amount - tax);
    });

    it("Event Withdrawal", async () => {
      await expect(result)
        .to.emit(depositContract, "Withdrawal")
        .withArgs(user2.address, amount - tax, tax);
    });
  });
});
