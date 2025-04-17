import {ethers} from 'ethers';
import { contractAddress, contractAbi } from "../constants/contract_data"; 

export const connectToMetamask = async() => {
  if (window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      console.log("heyyyyyyyyyyyyyyyy",signer);

      return {
        address,
        provider,
        signer,
        contract,
      };

    } catch (err) {
      console.error(err);
    }
  } else {
    console.error("Metamask is not detected in the browser")
  }
}

export const listenToAccountChanges = (handleAccountsChanged) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
  }

  return () => {
    if (window.ethereum){
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  };

};


