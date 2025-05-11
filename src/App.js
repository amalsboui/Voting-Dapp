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

  //set dates
  const staticStartTime = new Date("2025-05-11T11:01:19.654427Z"); // UTC time
  const staticEndTime = new Date("2025-05-11T11:02:08.915885Z"); // 1 week later
  
  
  const votingStart = Math.floor(staticStartTime.getTime() / 1000);
  const votingEnd = Math.floor(staticEndTime.getTime() / 1000);


  useEffect(() => {
    const fetchData = async () => {
      if (walletInfo?.contract && walletInfo?.address) {
      await getCandidates(walletInfo.contract);
      await getRemainingTime(walletInfo.contract);
      await getCurrentStatus(walletInfo.contract);
      await getWinners(walletInfo.contract);
      await setVotingPeriod(walletInfo.contract, votingStart, votingEnd);
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
    const candidatesList = await contractInstance.getAllVotes();
    const formattedCandidates = candidatesList.map((candidate, index) => {
    const voteCount = Number(ethers.toBigInt(candidate.voteCount));

        return {
          id: index,
          name: candidate.name,
          imageCID: candidate.imageCID,
          voteCount: candidate.voteCount
        }
    });
    setCandidates(formattedCandidates);   
};

const getWinners = async(contractInstance) => {
  const winnerIndexes = await contractInstance.getWinners();
  const indexes = winnerIndexes.map(index => Number(ethers.toBigInt(index)));

  // 3. Récupération des objets candidats gagnants
  const formattedWinners = indexes
    .map(index => candidates.find(c => c.index === index))
    .filter(Boolean);
  
  setWinners(formattedWinners);   
};

async function setVotingPeriod(contractInstance,votingStart, votingEnd) {
  //y3adi lel contrat lwa9t likhtarneh
  const tx = await contractInstance.setVotingPeriod(votingStart,votingEnd );
  await tx.wait();
  

}

async function getRemainingTime(contractInstance) {
  const time = await contractInstance.getRemainingTime();
  setremainingTime(parseInt(time, 16));
}

const handleVote = async(contractInstance,candidateId) => {
      const tx = await contractInstance.vote(candidateId);//yasmine remember bch thothoulna lvariable
      await tx.wait();
      console.log("transaction successful");
      canVote(); //to add the address of the user who voted in the voters table
      
  };

async function canVote(contractInstance, userAddress) {
  
  const voteStatus = await contractInstance.voters(userAddress);
  setCanVote(voteStatus);

}

async function getCurrentStatus(contractInstance) {
  const status = await contractInstance.getVotingStatus();
  console.log(status);
  setVotingStatus(status);
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
                                            
        <Route path="/res" element={<Res
                                            candidates={candidates}
                                            votingStart={votingStart}
                                            votingEnd={votingEnd}
                                            votingStatus={votingStatus}
                                            winners={winners}//zid thabat khatrou tableau 
                                            
                                                    />} />


        <Route path="/logmeta" element={<MetaMaskLogin connectWallet = {connectToMetamask}   />} />

      </Routes>

    </Router>
  );
}

export default App;


