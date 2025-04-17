// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("VotingAppModule", (m) => {

  const candidates = m.getParameter("candidates", ["Ahmed Mars","Wael Znagui","Oussema Joudi","Imen Belhaj"]);
  const VotingApp = m.contract("VotingApp", [candidates]);

  return { VotingApp };
});
