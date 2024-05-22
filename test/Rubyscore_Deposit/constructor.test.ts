import { expect } from "chai";
import { ethers } from "hardhat";
import { Rubyscore_Deposit, Rubyscore_Deposit__factory } from "@contracts";
import { HardhatEthersSigner, ZERO_ADDRESS } from "@test-utils";

describe("Method: constructor", () => {
  let deployer: HardhatEthersSigner, admin: HardhatEthersSigner, operator: HardhatEthersSigner;
  let DepositInstance: Rubyscore_Deposit__factory;
  let depositContract: Rubyscore_Deposit;

  before(async () => {
    [deployer, admin, operator] = await ethers.getSigners();
    DepositInstance = await ethers.getContractFactory("Rubyscore_Deposit");
  });

  describe("When one of parameters is incorrect", () => {
    it("When admin is zero address", async () => {
      await expect(DepositInstance.deploy(ZERO_ADDRESS, operator.address)).to.be.revertedWith(
        "Zero address check",
      );
    });

    it("When operator is zero address", async () => {
      await expect(DepositInstance.connect(deployer).deploy(admin.address, ZERO_ADDRESS)).to.be.revertedWith(
        "Zero address check",
      );
    });

    describe("When all parameters correct", () => {
      before(async () => {
        depositContract = await DepositInstance.connect(deployer).deploy(admin.address, operator.address);
      });

      it("should admin have DEFAULT_ADMIN_ROLE", async () => {
        const DEFAULT_ADMIN_ROLE = await depositContract.DEFAULT_ADMIN_ROLE();
        expect(await depositContract.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
      });

      it("should operator have OPERATOR_ROLE", async () => {
        const OPERATOR_ROLE = await depositContract.OPERATOR_ROLE();
        expect(await depositContract.hasRole(OPERATOR_ROLE, operator.address)).to.be.true;
      });
    });
  });
});
