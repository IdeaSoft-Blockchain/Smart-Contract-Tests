var NSCDistributionContract = artifacts.require("./NSCDistributionContract.sol");

module.exports = function(deployer) {
  deployer.deploy(NSCDistributionContract);
};
