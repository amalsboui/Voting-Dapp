import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, Trophy } from 'lucide-react';

export const Res = ({
    candidates ,
    votingStart,
    votingEnd,
    votingStatus,
    winners,
}) => {

  const [remainingTime, setRemainingTime] = useState(votingStart - Date.now() / 1000);//bch mano93odch kolmara n3ayat lel contract bch nchouf remainingtime

  useEffect(() => {
    if (votingStatus && Date.now() / 1000 < votingEnd) {
      const interval = setInterval(() => {
        const currentTime = Date.now() / 1000;
        const timeLeft = votingEnd - currentTime;

        if (timeLeft <= 0) {
          clearInterval(interval); // Stop the interval once time is up
          setRemainingTime(0); // Ensure it doesn't show negative time
        } else {
          setRemainingTime(timeLeft); // Update remaining time
        }
      }, 1000);

      return () => clearInterval(interval);
    }

    return () => {}; // Cleanup function if voting is not active
  }, [votingEnd, votingStatus]);

  const getCurrentTime = () => {
        return Date.now() / 1000; // Unix timestamp in seconds
      };
      
  const currentTime = getCurrentTime();
  const hasVotingStarted = currentTime >= votingStart;
  const isVotingActive = currentTime >= votingStart && currentTime <= votingEnd;

  const getTotalVotes = () => {
    // Sum the votes for each candidate, ensuring that undefined votes are treated as 0
    return candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
};


  const formatTime = (seconds) => {
    if (!seconds) return "00:00:00";
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${hours}:${mins}:${secs}`;
  };

  /*yelzmna 7al mtaa baad 5 ayam results page maash feha resultat wtwali tetla3 hedhi
  if (candidates.length === 0) {//ma3anach vote
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center py-8">
        <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">No candidates available for voting</p>
      </div>
    );
  }
*/
  if (!hasVotingStarted) {//voting mezel
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center py-8">
        <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Voting has not started yet</p>
        <p className="text-sm text-gray-400 mt-2">
          Starts in {formatTime(votingStart - currentTime)}
        </p>
      </div>
    );
  }

   if (!isVotingActive) {//voting wfe
    const winner = candidates.length === 1 ? candidates[0] : winners;
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <Trophy className="w-6 h-6 text-amber-500 mr-2" />
          <h2 className="text-xl font-semibold">Final Results</h2>
        </div>
        
        <div className="mb-4 p-3 bg-amber-50 rounded-lg">
          <p className="font-medium text-amber-800">
            Winners: {Array.isArray(winner) ? winner.map(w => w.name).join(', ') : winner.name}
          </p>
        </div>
      </div>
    );
  }
  return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
                <BarChart3 className="w-6 h-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold">
                    Live Results
                </h2>
                
            </div>
            
            <div className="space-y-4">
                    <div className="flex items-center text-amber-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{formatTime(remainingTime)} left</span>
                    </div>
                    {candidates.map((candidate) => (    
                    <div key={candidate.id} className="space-y-2">
                    
                        <div className="flex justify-between">
                            <span className="text-gray-700">{candidate.name}</span>
                            <span className="text-indigo-600 font-semibold">
                            {getTotalVotes() > 0
                                ? Math.round((candidate.votes / getTotalVotes()) * 100)
                                : 0}%
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                            className="bg-indigo-600 h-2.5 rounded-full transition-all"
                            style={{
                                width: `${
                                getTotalVotes() > 0
                                    ? (candidate.votes / getTotalVotes()) * 100
                                    : 0
                                }%`,
                            }}
                            >
                            </div>
                        </div>
                    </div>
                    ))}

                    <div className="mt-4 pt-4 border-t">
                        <p className="text-gray-600">
                        Total Votes: <span className="font-semibold">{getTotalVotes()}</span>
                        </p>
                    </div>
            </div>

        </div>
  )
}