import React , { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { AuthForm } from './components/AuthForm';
import { VotingPage } from './components/VotingPage';
import { CandidatesPage } from './components/CandidatesPage';
import { candidatesList } from './constants/CandidatesList';
import { Res } from './components/LiveResults';
import { MetaMaskLogin } from './components/ConnectWallet';
import {ethers} from 'ethers';
import { contractAddress, contractAbi } from "./constants/contract_data"; 





function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
  });

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [candidates, setCandidates] = useState(candidatesList);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect( () => {
    getCandidates();
    getRemainingTime();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return() => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    setAuth({
      isAuthenticated: true,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // TODO: Implement actual registration
    setAuth({
      isAuthenticated: true,
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const getCandidates = async(candidateId) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    const candidatesList = await contractInstance.getAllVotes();
    const formattedCandidates = candidatesList.map((candidate, index) => {
        return {
          id: index,
          name: candidate.name,
          voteCount: candidate.voteCount.toNumber()
        }
    });
    setCandidates(formattedCandidates);
    
    
};

const handleVote = async(candidateId) => {
      console.log(candidateId);

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

      const tx = await contractInstance.vote(candidateId);//yasmine remember bch thothoulna lvariable
      await tx.wait();
      console.log("transaction successful");
      
  };

  const connectToMetamask = () => {

  };


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
    
        <Route path="/login" element={<AuthForm 
                                       type="login"
                                       auth={auth}
                                       formData={formData}
                                       setAuth={setAuth}
                                       handleInputChange={handleInputChange}
                                       handleSubmit={handleLogin}/>} />

        <Route path="/register" element={<AuthForm 
                                          type="register"
                                          auth={auth}
                                          formData={formData}
                                          setAuth={setAuth}
                                          handleInputChange={handleInputChange}
                                          handleSubmit={handleRegister}/>} />

        <Route path="/vote" element={<VotingPage
                                      candidates={candidates}
                                      selectedCandidate={selectedCandidate}
                                      hasVoted={hasVoted}
                                      setSelectedCandidate={setSelectedCandidate}
                                      handleVote={handleVote}
                                      setAuth={setAuth}
                                     />} />

        <Route path="/Candidates" element={<CandidatesPage
                                            candidates={candidates} />} />

        <Route path="/res" element={<Res
                                            candidates={candidates}
                                            selectedCandidate={selectedCandidate}
                                            hasVoted={hasVoted}
                                            setSelectedCandidate={setSelectedCandidate}
                                            handleVote={handleVote}
                                            setAuth={setAuth}
                                                    />} />

        <Route path="/logmeta" element={<MetaMaskLogin connectWallet = {connectToMetamask}   />} />

      </Routes>

    </Router>
  );
}

export default App;

