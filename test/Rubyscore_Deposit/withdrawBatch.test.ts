import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Rubyscore_Deposit } from "@contracts";
import { ContractTransactionResponse, parseUnits } from "ethers";
import { HardhatEthersSigner } from "@test-utils";

async function deployDepositContract() {
  const [deployer, admin, operator, user, user2, user3, user4] = await ethers.getSigners();

  const DepositInstance = await ethers.getContractFactory("Rubyscore_Deposit");
  const depositContract = await DepositInstance.deploy(admin.address, operator.address);

  return { depositContract, deployer, admin, operator, user, user2, user3, user4 };
}

describe("Method: withdrawBatch:", () => {
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
      await depositContract.connect(user2)["deposit()"]({ value: amount });
    });

    it("When not operator call withdraw", async () => {
      await expect(
        depositContract.connect(user).withdrawBatch([user.address], [user2.address], [amount], [tax]),
      ).to.be.revertedWithCustomError(depositContract, "AccessControlUnauthorizedAccount");
    });

    it("When insufficient funds", async () => {
      await expect(
        depositContract
          .connect(operator)
          .withdrawBatch([user.address], [user2.address], [amount + tax], [tax]),
      ).to.be.revertedWith("Insufficient funds");
    });
  });

  describe("When all parameters correct", () => {
    let depositContract: Rubyscore_Deposit;
    let operator: HardhatEthersSigner;
    let user: HardhatEthersSigner;
    let user2: HardhatEthersSigner;
    let user3: HardhatEthersSigner;
    let user4: HardhatEthersSigner;
    let recipient1BalanceBefore: bigint;
    let recipient2BalanceBefore: bigint;
    let result: ContractTransactionResponse;

    const amount = parseUnits("1", 18);
    const tax = parseUnits("1", 16);

    before(async () => {
      const deployments = await loadFixture(deployDepositContract);
      depositContract = deployments.depositContract;
      operator = deployments.operator;
      user = deployments.user;
      user2 = deployments.user2;
      user3 = deployments.user3;
      user4 = deployments.user4;
      recipient1BalanceBefore = await ethers.provider.getBalance(user3.address);
      recipient2BalanceBefore = await ethers.provider.getBalance(user4.address);

      await depositContract.connect(user)["deposit()"]({ value: amount });
      await depositContract.connect(user2)["deposit()"]({ value: amount });
    });

    it("should success", async () => {
      result = await depositContract
        .connect(operator)
        .withdrawBatch(
          [user.address, user2.address],
          [user3.address, user4.address],
          [amount, amount],
          [tax, tax],
        );
      await expect(result).to.be.not.reverted;
    });

    it("should decrease users deposit", async () => {
      const user1Deposit = await depositContract.getUserDeposit(user);
      const user2Deposit = await depositContract.getUserDeposit(user2);
      expect(user1Deposit).to.be.equal(0);
      expect(user2Deposit).to.be.equal(0);
    });

    it("should contract balance equal to expected", async () => {
      const contractBalance = await ethers.provider.getBalance(depositContract.getAddress());

      expect(contractBalance).to.be.equal(tax + tax);
    });

    it("should recipient balance equal to expected", async () => {
      const recipient1BalanceAfter = await ethers.provider.getBalance(user3.address);
      const recipient2BalanceAfter = await ethers.provider.getBalance(user4.address);

      expect(recipient1BalanceAfter).to.be.equal(recipient1BalanceBefore + amount - tax);
      expect(recipient2BalanceAfter).to.be.equal(recipient2BalanceBefore + amount - tax);
    });
  });
});
