import {ethers} from 'ethers';
import { contractAddress, contractAbi } from "../constants/contract_data"; 

export const connectToMetamask = async() => {
  if (window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      // Create contract instance with signer
      const contract = new ethers.Contract(
        contractAddress, 
        contractAbi, 
        signer
      );

      // Verify contract is properly initialized
      const isContract = await provider.getCode(contractAddress);
      if (isContract === '0x') {
        throw new Error('Contract not deployed at this address');
      }

      return {
        address,
        provider,
        signer,
        contract,
      };

    } catch (err) {
      console.error("Error connecting to MetaMask:", err);
      throw err;
    }
  } else {
    throw new Error("Metamask is not detected in the browser");
  }
}

export const listenToAccountChanges = (handleAccountsChanged) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
  }

  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  };
};
