import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@test-utils";
import { Rubyscore_Deposit } from "@contracts";
import { ContractTransactionResponse, parseUnits } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";

async function deployDepositContract() {
  const [deployer, admin, operator, user, user2] = await ethers.getSigners();

  const DepositInstance = await ethers.getContractFactory("Rubyscore_Deposit");
  const depositContract = await DepositInstance.deploy(admin.address, operator.address);

  return { depositContract, deployer, admin, operator, user, user2 };
}

describe("Method: removeFunds:", () => {
  describe("When one parameters is incorrect", () => {
    let admin: HardhatEthersSigner;
    let user: HardhatEthersSigner;
    let user2: HardhatEthersSigner;
    let depositContract: Rubyscore_Deposit;

    const amount = parseUnits("1", 18);

    before(async () => {
      const deployments = await loadFixture(deployDepositContract);
      depositContract = deployments.depositContract;
      admin = deployments.admin;
      user = deployments.user;
      user2 = deployments.user2;

      await depositContract.connect(user)["deposit()"]({ value: amount });
    });

    it("When not admin call removeFunds", async () => {
      await expect(depositContract.connect(user).removeFunds(user2, 111)).to.be.revertedWithCustomError(
        depositContract,
        "AccessControlUnauthorizedAccount",
      );
    });

    it("When insufficient funds", async () => {
      await expect(
        depositContract.connect(admin).removeFunds(user.address, amount + amount),
      ).to.be.revertedWith("INSUFFICIENT_BALANCE");
    });
  });

  describe("When all parameters correct", () => {
    let admin: HardhatEthersSigner;
    let user: HardhatEthersSigner;
    let user2: HardhatEthersSigner;
    let depositContract: Rubyscore_Deposit;
    let result: ContractTransactionResponse;
    let recipientBalanceBefore: bigint;

    const amount = parseUnits("1", 18);

    before(async () => {
      const deployments = await loadFixture(deployDepositContract);
      depositContract = deployments.depositContract;
      admin = deployments.admin;
      user = deployments.user;
      user2 = deployments.user2;

      await depositContract.connect(user)["deposit()"]({ value: amount });
      await depositContract.connect(admin).addFunds({ value: amount });

      recipientBalanceBefore = await ethers.provider.getBalance(user2.address);
    });

    it("should success", async () => {
      result = await depositContract.connect(admin).removeFunds(user2.address, amount + amount);
      await expect(result).to.be.not.reverted;
    });

    it("should contract balance equal to expected", async () => {
      const contractBalance = await ethers.provider.getBalance(depositContract.getAddress());

      expect(contractBalance).to.be.equal(0);
    });

    it("should recipient balance equal to expected", async () => {
      const recipientBalanceAfter = await ethers.provider.getBalance(user2.address);

      expect(recipientBalanceAfter).to.be.equal(recipientBalanceBefore + amount + amount);
    });
  });
});
