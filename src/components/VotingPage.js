import React from 'react';
import { Vote, Users, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export const VotingPage = ({
  candidates,
  selectedCandidate,
  hasVoted,
  setSelectedCandidate,
  handleVote,
  setAuth
}) => {

  const navigate = useNavigate();
    
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
                  }`}
                  onClick={() => !hasVoted && setSelectedCandidate(candidate.id)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={candidate.image}
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
              onClick={() => handleVote(selectedCandidate)}
              disabled={hasVoted || selectedCandidate === null}
              className={`mt-6 w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                hasVoted || selectedCandidate === null
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {hasVoted ? 'Vote Recorded' : 'Submit Vote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};