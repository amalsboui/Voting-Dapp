import React from 'react';
import { Vote, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CandidatesPage = ({ candidates }) => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <Vote className="w-8 h-8 text-indigo-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Meet the Candidates</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={`https://gateway.pinata.cloud/ipfs/${candidate.imageCID}`}
                alt={candidate.name}
                className="w-full h-48 object-contain"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{candidate.name}</h3>
                <p className="text-gray-600 mb-4">{candidate.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Current Votes: {candidate.votes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/vote")}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
          >
            Proceed to Vote
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};