import React, { useState } from 'react';
import { Vote, Users, CheckCircle2, ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VotingPage = ({
  candidates,
  selectedCandidate,
  hasVoted,
  setSelectedCandidate,
  handleVote,
  setAuth,
  votingStart,
  votingEnd,
  votingStatus
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isVoting, setIsVoting] = useState(false);
  
  const getCurrentTime = () => Math.floor(Date.now() / 1000);
  const currentTime = getCurrentTime();
  const hasVotingStarted = currentTime >= votingStart;
  const isVotingEnded = currentTime > votingEnd;

  const handleVoteClick = async () => {
    try {
      setError('');
      setIsVoting(true);
      await handleVote(selectedCandidate);
    } catch (err) {
      setError(err.message || 'An error occurred while processing your vote');
    } finally {
      setIsVoting(false);
    }
  };

  // Show different states based on voting period
  if (!hasVotingStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/Candidates")}
              className="flex items-center text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Candidates
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
            <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Voting Has Not Started Yet</h2>
            <p className="text-gray-600">Please check back when the voting period begins.</p>
            <p className="text-sm text-gray-500 mt-4">
              Voting starts: {new Date(votingStart * 1000).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isVotingEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/Candidates")}
              className="flex items-center text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Candidates
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
            <AlertCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Voting Has Ended</h2>
            <p className="text-gray-600 mb-6">The voting period is now closed.</p>
            <button
              onClick={() => navigate("/results")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
            >
              View Results
            </button>
          </div>
        </div>
      </div>
    );
  }
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/Candidates")}
            className="flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Candidates
          </button>
          <div className="flex items-center">
            <Vote className="w-8 h-8 text-indigo-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Cast Your Vote</h1>
          </div>
          <div className="w-24"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-1 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">Select Your Candidate</h2>
            </div>

            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCandidate === candidate.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-200'
                  } ${hasVoted ? 'cursor-not-allowed' : ''}`}
                  onClick={() => !hasVoted && setSelectedCandidate(candidate.id)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/${candidate.imageCID}`}
                      alt={candidate.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">{candidate.name}</h3>
                        {selectedCandidate === candidate.id && (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                      <p className="text-gray-600 mt-2">{candidate.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleVoteClick}
              disabled={hasVoted || selectedCandidate === null || isVoting}
              className={`mt-6 w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                hasVoted || selectedCandidate === null || isVoting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isVoting ? 'Processing...' : hasVoted ? 'Vote Recorded' : 'Submit Vote'}
            </button>

            {!hasVoted && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Voting ends: {new Date(votingEnd * 1000).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};