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
  const staticStartTime = new Date("2025-06-02T21:49:00.654427Z"); // UTC time
  const staticEndTime = new Date("2025-06-02T21:50:08.915885Z"); // 1 week later
  
  
  const votingStart = Math.floor(staticStartTime.getTime() / 1000);
  const votingEnd = Math.floor(staticEndTime.getTime() / 1000);


  useEffect(() => {
    const fetchData = async () => {
      if (walletInfo?.contract && walletInfo?.address) {
        try {
          // First check if voting period is already set
          const status = await walletInfo.contract.getVotingStatus();
          if (!status && !votingPeriodSet) {
            await setVotingPeriod(walletInfo.contract, votingStart, votingEnd);
            setVotingPeriodSet(true);
          }
          
          await getCandidates(walletInfo.contract);
          await getRemainingTime(walletInfo.contract);
          await getCurrentStatus(walletInfo.contract);
          await getWinners(walletInfo.contract);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    
    fetchData();
  }, [walletInfo]);

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
        id: index, // Frontend ID (0-based)
        index: Number(candidate.index), // Contract ID (1-based)
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
  if (!walletInfo?.contract) return;
  
  try {
    // Find the candidate with the frontend ID
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) {
      console.error("Candidate not found");
      return;
    }
    
    // Use the contract's index (1-based) for voting
    const tx = await walletInfo.contract.vote(candidate.index - 1);
    await tx.wait();
    console.log("Vote transaction successful");
    setHasVoted(true);
    
    // Refresh the candidates list
    await getCandidates(walletInfo.contract);
  } catch (error) {
    console.error("Error voting:", error);
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

        <Route path="/Candidates" element={
          // <ProtectedRoute>
            <CandidatesPage
              candidates={candidates} />
         //</ProtectedRoute>
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


        <Route path="/logmeta" element={<MetaMaskLogin connectWallet = {connectToMetamask}   />} />

      </Routes>

    </Router>
  );
}

export default App;


