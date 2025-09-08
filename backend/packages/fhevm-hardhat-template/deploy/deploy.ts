import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedConfidentialSalary = await deploy("ConfidentialSalary", {
    from: deployer,
    log: true,
  });

  console.log(`ConfidentialSalary contract: `, deployedConfidentialSalary.address);
};
export default func;
func.id = "deploy_confidentialSalary"; // id required to prevent reexecution
func.tags = ["ConfidentialSalary"];
