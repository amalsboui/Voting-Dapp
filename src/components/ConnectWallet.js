import React, { useState, useEffect } from "react";
import { connectToMetamask, listenToAccountChanges } from "../blockchain/web3Wallet";

export const MetaMaskLogin = (props) => {
  
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const handleConnect = async () => {
      try {
        const  { address, provider, signer, contract } = await connectToMetamask();
        console.log(address);
        console.log(signer);
        setAccount(address); //saving the connected wallet 
        setIsConnected(true);

        console.log("Connected wallet:", address);
        console.log("Contract instance:", contract);

      } catch (err) {
        alert("Failed to connect wallet");
      }
    };

    function handleAccountsChanged(accounts) {
      if (accounts.length > 0 && account !== accounts[0]) {
        setAccount(accounts[0]);
        console.log("hihi", account);
      } else {
        setIsConnected(false);
        setAccount(null);
      }
    }

    useEffect(() => {

      const cleanup = listenToAccountChanges(handleAccountsChanged);
    
      return () => {
        if (cleanup) cleanup(); 
      };
    }, []);

  
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
            <h1 className="text-2xl font-bold text-center mb-8"> Welcome to decentralize voting app </h1>

            <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center"
            onClick = {handleConnect}
            >
            Login Metamask
            </button>
        </div>
        </div>
        {/*TODO: if isConnected afficher you are connected (component okhor voting mathalan) to metamask + afficher addresse + thezou lel voting page  */}
        </div>
    )
}
