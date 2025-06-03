const { ethers } = require("hardhat");
const { contractAddress } = require("../src/constants/contract_data");

async function main() {
  // Get signer (assumes first account from your private key in hardhat config)
  const [deployer] = await ethers.getSigners();
  console.log("Adding candidates with account:", deployer.address);

  // Get contract instance
  const VotingContract = await ethers.getContractAt("VotingApp", contractAddress);

  // List of candidates to add
  const candidates = [
    {
      name: "Yasmine Elhakem",
      imageCID: "bafkreicgfntndac76lt5lb25kh644gbul6cvrolo2ga6mooje42gsevbze"
    },
    {
      name: "Eya Hammar",
      imageCID: "bafkreideqwq6qzukrug4wnkhquljv7ocyxlbnj2f4jmkixqaslh2etmdpu"
    },
    {
      name: "Imen Belhaj",
      imageCID: "bafkreibfq6ogw3cslnsbrp5ejf7kt52p6wribmzxqmtkjnhzhv7jjymjca"
    }
  ];

  // Add each candidate
  for (const candidate of candidates) {
    try {
      console.log(`\nAdding candidate ${candidate.name}...`);
      const tx = await VotingContract.addCandidate(candidate.name, candidate.imageCID);
      console.log("Transaction sent, hash:", tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log(`✅ Candidate ${candidate.name} added successfully!`);
      console.log("Block number:", receipt.blockNumber);
      console.log("Gas used:", receipt.gasUsed.toString());
      console.log("--------------------");
    } catch (error) {
      console.error(`❌ Failed to add candidate ${candidate.name}:`, error);
      if (error.reason) {
        console.error("Reason:", error.reason);
      }
      // Exit on first error to prevent continuing with other candidates
      process.exit(1);
    }
  }

  console.log("\n✅ All candidates added successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error in script execution:", error);
    process.exit(1);
  }); 