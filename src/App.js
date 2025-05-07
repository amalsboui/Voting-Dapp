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
const [votingPeriod, setVotingPeriod] = useState({
  start: Math.floor(staticStartTime.getTime() / 1000), // in seconds
  end: Math.floor(staticEndTime.getTime() / 1000),    // in seconds
  startReadable: staticStartTime.toISOString(),       // for display
  endReadable: staticEndTime.toISOString()           // for display
});






  //set dates
  const staticStartTime = new Date("2025-05-07T10:34:18.654427Z"); // UTC time
  const staticEndTime = new Date("2025-05-07T10:34:58.915885Z"); // 1 week later
  
  
const votingStart = Math.floor(staticStartTime.getTime() / 1000);
const votingEnd = Math.floor(staticEndTime.getTime() / 1000);

  

  useEffect(() => {
    const fetchData = async () => {
      await getCandidates();
      await getRemainingTime();
      await getCurrentStatus();
      await getWinners();
      await setVotingPeriod(votingStart, votingEnd);
    };
    
    fetchData();
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

const getCandidates = async(candidateId) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    const candidatesList = await contractInstance.getAllVotes();
    const formattedCandidates = candidatesList.map((candidate, index) => {
    const voteCount = Number(ethers.toBigInt(candidate.voteCount));

        return {
          id: index,
          name: candidate.name,
          imageCID: candidate.imageCID,
          voteCount
        }
    });
    setCandidates(formattedCandidates);   
};

const getWinners = async() => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
  const winnerIndexes = await contractInstance.getWinners();
  const indexes = winnerIndexes.map(index => Number(ethers.toBigInt(index)));

  // 3. Récupération des objets candidats gagnants
  const formattedWinners = indexes
    .map(index => candidates.find(c => c.index === index))
    .filter(Boolean);
  
  setWinners(formattedWinners);   
};

async function setVotingPeriod(votingStart, votingEnd) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract (contractAddress, contractAbi, signer);

  //y3adi lel contrat lwa9t likhtarneh
  const tx = await contractInstance.setVotingPeriod(votingStart,votingEnd );
  await tx.wait();
  

}

async function getRemainingTime() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract (contractAddress, contractAbi, signer);
  const time = await contractInstance.getRemainingTime();
  setremainingTime(parseInt(time, 16));
}

const handleVote = async(candidateId) => {
      console.log(candidateId);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

      const tx = await contractInstance.vote(candidateId);//yasmine remember bch thothoulna lvariable
      await tx.wait();
      console.log("transaction successful");
      canVote(); //to add the address of the user who voted in the voters table
      
  };

async function canVote() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract (
    contractAddress, contractAbi, signer
  );
  const voteStatus = await contractInstance.voters(await signer.getAddress());
  setCanVote(voteStatus);

}

async function getCurrentStatus() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract (contractAddress, contractAbi, signer);
  const status = await contractInstance.getVotingStatus();
  console.log(status);
  setVotingStatus(status);
}

  const connectToMetamask = () => {

  };
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

        <Route path="/vote" element={<ProtectedRoute><VotingPage
                                      candidates={candidates}
                                      selectedCandidate={selectedCandidate}
                                      hasVoted={hasVoted}
                                      setSelectedCandidate={setSelectedCandidate}
                                      handleVote={handleVote}
                                      setAuth={setAuth}
                                     /></ProtectedRoute>} />

        <Route path="/Candidates" element={
          // <ProtectedRoute>
            <CandidatesPage
              candidates={candidates} />
         //</ProtectedRoute>
         } />
                                            
        <Route path="/res" element={<Res
                                            candidates={candidates}
                                            votingStart={votingStart}
                                            votingStatus={votingStatus}
                                            remainingTime={remainingTime}
                                            winners={winners}//zid thabat khatrou tableau 
                                            
                                                    />} />


        <Route path="/logmeta" element={<MetaMaskLogin connectWallet = {connectToMetamask}   />} />

      </Routes>

    </Router>
  );
}

export default App;


