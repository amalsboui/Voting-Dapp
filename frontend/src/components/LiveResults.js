import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, Trophy } from 'lucide-react';

export const Res = ({
    candidates,
    votingStart,
    votingEnd,
    votingStatus,
    winners,
}) => {
  const [remainingTime, setRemainingTime] = useState(votingStart - Date.now() / 1000);

  useEffect(() => {
    if (votingStatus && Date.now() / 1000 < votingEnd) {
      const interval = setInterval(() => {
        const currentTime = Date.now() / 1000;
        const timeLeft = votingEnd - currentTime;

        if (timeLeft <= 0) {
          clearInterval(interval);
          setRemainingTime(0);
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);

      return () => clearInterval(interval);
    }

    return () => {};
  }, [votingEnd, votingStatus]);

  const getCurrentTime = () => {
    return Date.now() / 1000;
  };
      
  const currentTime = getCurrentTime();
  const hasVotingStarted = currentTime >= votingStart;
  const isVotingActive = currentTime >= votingStart && currentTime <= votingEnd;

  const getTotalVotes = () => {
    return candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
  };

  const formatTime = (seconds) => {
    if (!seconds) return "00:00:00";
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${hours}:${mins}:${secs}`;
  };

  if (!hasVotingStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <BarChart3 className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Voting Has Not Started Yet</h2>
              <p className="text-lg text-indigo-600 font-semibold mt-4">
                Starts in {formatTime(votingStart - currentTime)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isVotingActive) {
    const winner = candidates.length === 1 ? candidates[0] : winners;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-center mb-6">
                <Trophy className="w-10 h-10 text-indigo-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-800">Final Results</h2>
              </div>
              
              <div className="mb-6 p-6 bg-indigo-50 rounded-xl border border-indigo-200">
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">Winners</h3>
                <p className="text-lg text-indigo-700">
                  {Array.isArray(winner) ? winner.map(w => w.name).join(', ') : winner.name}
                </p>
              </div>

              <div className="space-y-6">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="bg-indigo-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-medium text-gray-800">{candidate.name}</span>
                      <span className="text-indigo-600 font-semibold">
                        {candidate.votes} votes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Live Results</h2>
              </div>
              <div className="flex items-center bg-indigo-50 px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-indigo-600 mr-2" />
                <span className="text-indigo-600 font-medium">{formatTime(remainingTime)} left</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {candidates.map((candidate) => (    
                <div key={candidate.id} className="bg-indigo-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-medium text-gray-800">{candidate.name}</span>
                    <span className="text-indigo-600 font-semibold">
                      {getTotalVotes() > 0
                        ? Math.round((candidate.votes / getTotalVotes()) * 100)
                        : 0}%
                    </span>
                  </div>

                  <div className="w-full bg-indigo-100 rounded-full h-3">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                      style={{
                        width: `${
                          getTotalVotes() > 0
                            ? (candidate.votes / getTotalVotes()) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 text-sm text-indigo-600">
                    {candidate.votes} votes
                  </div>
                </div>
              ))}

              <div className="mt-6 pt-6 border-t border-indigo-100">
                <div className="flex justify-between items-center">
                  <span className="text-indigo-700 font-medium">Total Votes</span>
                  <span className="text-2xl font-bold text-indigo-600">{getTotalVotes()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}