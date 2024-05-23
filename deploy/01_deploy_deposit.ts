import { DeployFunction } from "hardhat-deploy/types";
import { typedDeployments } from "@utils";

const migrate: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy } = typedDeployments(deployments);
  const { deployer, admin, operator } = await getNamedAccounts();

  await deploy("Rubyscore_Deposit", {
    from: deployer,
    args: [admin, operator],
    log: true,
  });
  console.log("Ready \n");
};

migrate.tags = ["depos"];

export default migrate;
