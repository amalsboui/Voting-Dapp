import React , { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { AuthForm } from './components/AuthForm';
import { VotingPage } from './components/VotingPage';
import { CandidatesPage } from './components/CandidatesPage';
//import { candidatesList } from './constants/CandidatesList';
import { Res } from './components/LiveResults';
import { MetaMaskLogin } from './components/ConnectWallet';
import {ethers} from 'ethers';
import { contractAddress, contractAbi } from "./constants/contract_data"; 
import ProtectedRoute from './components/ProtectedRoute';
import { connectToMetamask, listenToAccountChanges } from './blockchain/web3Wallet';



function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
  });

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [candidates, setCandidates] = useState([]);
  const [winners, setWinners] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [remainingTime, setremainingTime] = useState('');
  const [votingStatus, setVotingStatus] = useState(true);
  const [CanVote, setCanVote] = useState(true); // Convert to seconds ONCE at the top level
  const [walletInfo, setWalletInfo] = useState(null);
  const [votingPeriodSet, setVotingPeriodSet] = useState(false);

  //set dates
  const staticStartTime = new Date("2025-06-03T15:48:00.654427Z"); // UTC time
  const staticEndTime = new Date("2025-06-03T15:50:08.915885Z"); // 1 week later
  
  
  const votingStart = Math.floor(staticStartTime.getTime() / 1000);
  const votingEnd = Math.floor(staticEndTime.getTime() / 1000);


  useEffect(() => {
    const initializeContractData = async () => {
      if (!walletInfo?.contract || !walletInfo?.address) return;

      try {
        const candidates = await walletInfo.contract.getAllVotes();
        const currentTime = Math.floor(Date.now() / 1000);
        const isVotingActive = currentTime >= votingStart && currentTime <= votingEnd;
        
        setVotingStatus(isVotingActive);

        const formattedCandidates = candidates.map((candidate, index) => ({
          id: index,
          name: candidate.name,
          imageCID: candidate.imageCID,
          votes: Number(ethers.toBigInt(candidate.voteCount))
        }));

        setCandidates(formattedCandidates);
      } catch (error) {
        console.error("Error initializing contract data:", error);
      }
    };

    if (walletInfo?.contract && walletInfo?.address) {
      initializeContractData();
    }
  }, [walletInfo, votingStart, votingEnd]);

  // Periodic updates
  useEffect(() => {
    if (!walletInfo?.contract || !walletInfo?.address) return;

    const updateData = async () => {
      try {
        const candidates = await walletInfo.contract.getAllVotes();
        const currentTime = Math.floor(Date.now() / 1000);
        const isVotingActive = currentTime >= votingStart && currentTime <= votingEnd;
        
        setVotingStatus(isVotingActive);
        setremainingTime(votingEnd - currentTime);

        const formattedCandidates = candidates.map((candidate, index) => ({
          id: index,
          name: candidate.name,
          imageCID: candidate.imageCID,
          votes: Number(ethers.toBigInt(candidate.voteCount))
        }));

        setCandidates(formattedCandidates);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    };

    // Initial update
    updateData();

    // Set up periodic updates
    const interval = setInterval(updateData, 10000);
    return () => clearInterval(interval);
  }, [walletInfo, votingStart, votingEnd]);

  useEffect(() => {
  const connect = async () => {
    const info = await connectToMetamask();
    setWalletInfo(info);
  };

  connect();

  const cleanup = listenToAccountChanges(() => {
    window.location.reload(); // or reconnect logic
  });

  return cleanup;
}, []);

  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token); // Save token
        setAuth({ isAuthenticated: true });
      } else {
        const error = await response.text();
        console.error('Login failed:', error);
      }
    } catch (err) {
      console.error('Error during login:', err);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          // TODO : badalaha b FormData.username kif tzidha fl form
          username: `User${Math.floor(Math.random() * 1000)}`
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token); // Save token
        setAuth({ isAuthenticated: true });
      } else {
        const error = await response.text();
        console.error('Registration failed:', error);
      }
    } catch (err) {
      console.error('Error during registration:', err);
    }
  };
    
    
const handleInputChange = (e) => {
setFormData({
  ...formData,
  [e.target.name]: e.target.value
});
};

const getCandidates = async(contractInstance) => {
  try {
    const candidatesList = await contractInstance.getAllVotes();
    const formattedCandidates = candidatesList.map((candidate, index) => {
      return {
        id: index,  // Use 0-based index for the frontend
        name: candidate.name,
        imageCID: candidate.imageCID,
        votes: Number(ethers.toBigInt(candidate.voteCount))
      }
    });
    setCandidates(formattedCandidates);
  } catch (error) {
    console.error("Error getting candidates:", error);
  }
};

const getWinners = async(contractInstance) => {
  try {
    const winnerIndexes = await contractInstance.getWinners();
    const indexes = winnerIndexes.map(index => Number(ethers.toBigInt(index)));
    const formattedWinners = indexes
      .map(index => candidates.find(c => c.index === index))
      .filter(Boolean);
    setWinners(formattedWinners);
  } catch (error) {
    console.error("Error getting winners:", error);
  }
};

async function setVotingPeriod(contractInstance, votingStart, votingEnd) {
  try {
    const tx = await contractInstance.setVotingPeriod(votingStart, votingEnd);
    await tx.wait();
    console.log("Voting period set successfully");
  } catch (error) {
    console.error("Error setting voting period:", error);
  }
}

async function getRemainingTime(contractInstance) {
  try {
    const time = await contractInstance.getRemainingTime();
    setremainingTime(parseInt(time, 16));
  } catch (error) {
    console.error("Error getting remaining time:", error);
  }
}

const handleVote = async (candidateId) => {
  if (!walletInfo?.contract || !walletInfo?.address) {
    console.error("Wallet or contract not initialized");
    return;
  }
  
  try {
    // First set the voting period
    try {
      const tx = await walletInfo.contract.setVotingPeriod(votingStart, votingEnd);
      await tx.wait();
    } catch (error) {
      if (!error.message?.includes("Start time must be in future")) {
        console.error("Error setting voting period:", error);
        return;
      }
    }

    // Now proceed with vote
    const tx = await walletInfo.contract.vote(candidateId);
    await tx.wait();
    setHasVoted(true);
    
    // Refresh the candidates list
    const updatedCandidates = await walletInfo.contract.getAllVotes();
    const formattedCandidates = updatedCandidates.map((candidate, index) => ({
      id: index,
      name: candidate.name,
      imageCID: candidate.imageCID,
      votes: Number(ethers.toBigInt(candidate.voteCount))
    }));
    setCandidates(formattedCandidates);
    
  } catch (error) {
    console.error("Error voting:", error);
    if (error.message?.includes("execution reverted")) {
      if (error.message.toLowerCase().includes("voting period")) {
        console.error("Error: Voting period has not started or has ended");
      } else if (error.message.toLowerCase().includes("already voted")) {
        console.error("Error: You have already voted");
        setHasVoted(true);
      } else {
        console.error("Error: Transaction failed");
      }
    }
  }
};

async function canVote(contractInstance, userAddress) {
  try {
    const voteStatus = await contractInstance.voters(userAddress);
    setCanVote(voteStatus);
  } catch (error) {
    console.error("Error checking vote status:", error);
  }
}

async function getCurrentStatus(contractInstance) {
  try {
    const status = await contractInstance.getVotingStatus();
    setVotingStatus(status);
  } catch (error) {
    console.error("Error getting voting status:", error);
  }
}

  // Function to delete the token from localStorage
  const handleLogout = () => {
  localStorage.removeItem('access_token');
  // msh secure barsha tw nbadlouha bhal ekhr
  setAuth({ isAuthenticated: false });
  };


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
    
        <Route path="/login" element={
          <AuthForm 
            type="login"
            auth={auth}
            formData={formData}
            setAuth={setAuth}
            handleInputChange={handleInputChange}
            handleSubmit={handleLogin}
          />
        } />

        <Route path="/register" element={
          <AuthForm 
            type="register"
            auth={auth}
            formData={formData}
            setAuth={setAuth}
            handleInputChange={handleInputChange}
            handleSubmit={handleRegister}
          />
        } />

        <Route path="/vote" element={
          <VotingPage
            candidates={candidates}
            selectedCandidate={selectedCandidate}
            hasVoted={hasVoted}
            setSelectedCandidate={setSelectedCandidate}
            handleVote={handleVote}
            setAuth={setAuth}
            votingStart={votingStart}
            votingEnd={votingEnd}
            votingStatus={votingStatus}
          />
        } />

        <Route path="/Candidates" element={
          <CandidatesPage 
            candidates={candidates}
          />
        } />
                                            
        <Route path="/results" element={
          <Res
            candidates={candidates}
            votingStart={votingStart}
            votingEnd={votingEnd}
            votingStatus={votingStatus}
            winners={winners}
          />
        } />

        <Route path="/logmeta" element={
          <MetaMaskLogin 
            connectWallet={connectToMetamask}
          />
        } />
      </Routes>
    </Router>
  );
}

export default App;


