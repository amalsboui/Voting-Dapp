// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingApp is Ownable {


    event CandidateAdded(uint256 index);
    event VotingPeriodSet(uint256 start, uint256 end);
    event VotingPeriodUpdated(uint256 newStart, uint256 newEnd);
    event VotingStarted(uint256 startTime);
    event VotingEnded(uint256 endTime);

    //address  ownerofcontract ;//njmou baad naamloulou fonction yskr w y7el w9t l elections
    uint256 votingStart;
    uint256 votingEnd;
    bool votingTimesSet;

    struct Candidate {
        uint256 index;
        string name;
        uint voteCount;
        string imageCID;
    }

    Candidate[] candidates;//tkynha liste mtaa les condidats mt3na bech laabed tnjm tchoufhom
    mapping (address=>bool) voters;//hethom laabed li chyvotiw bch baad njmou naarfouh est ce que vota wale bch ynjm yvoti wale
   
    
    //bech nsaviw l adresse mtaa l owner

    //njmou ndeclariw modifiers eli tnjm t9oul sur chntstaamlouhom
    //fama des fonctions base chyaamlhom l owner khw kima mthln y7el w yskr l elections

    //nchoufou vota wale
    modifier hasNotVoted() {
        require(!voters[msg.sender]);
        _;
    }


    modifier onlyDuringVotingPeriod() {
        require(votingTimesSet, "Voting times not set");
        require(block.timestamp >= votingStart, "Voting not started yet");
        require(block.timestamp <= votingEnd, "Voting has ended");
        _;
    }

    constructor(string[] memory _candidateNames,string[] memory _imageCIDs) Ownable(msg.sender){
         // automatically set by Ownable
        //votingStart = block.timestamp; // Voting starts at contract deployment time
        //votingEnd = block.timestamp+(_durationInMinutes*1 minutes);

        // Add all candidates to the election
        for (uint256 i =0; i< _candidateNames.length; i++){
            candidates.push(Candidate({
                index: i+1,
                name: _candidateNames[i],
                voteCount: 0,
                imageCID: _imageCIDs[i]
            }));
        }
    }
    function setVotingPeriod(uint256 _startTime, uint256 _endTime) public onlyOwner {
        require(_startTime < _endTime, "End time must be after start time");
        require(block.timestamp < _startTime, "Start time must be in future");

        bool wasPreviouslySet = votingTimesSet;//bch naarf mbaad update wle awal mara
        bool wasActive = getVotingStatus();

        votingStart = _startTime;
        votingEnd = _endTime;
        votingTimesSet = true;
        
        if (wasPreviouslySet) {
            emit VotingPeriodUpdated(_startTime, _endTime);
        } else {
            emit VotingPeriodSet(_startTime, _endTime);
        }

        bool isNowActive = getVotingStatus();

        if (isNowActive && !wasActive) {
            emit VotingStarted(_startTime);
       }else if (!isNowActive && wasActive) {
            emit VotingEnded(_endTime);
        }
       
    }
    
    function addCandidate(string memory _name, string memory imageCID) public onlyOwner {
        require(bytes(_name).length > 0, "Empty name");
        require(!votingTimesSet || block.timestamp < votingStart, "Cannot add during voting");
        uint256 index = candidates.length+1;
        candidates.push(Candidate(index,_name, 0, imageCID));
        emit CandidateAdded(index);
    }

   

    function vote (uint256 _index) public hasNotVoted onlyDuringVotingPeriod{
            require(_index < candidates.length, "Invalid candidate index.");
            // Increment the vote count of the chosen candidate
            candidates[_index].voteCount++;
            // Mark the sender as having voted
            voters[msg.sender] = true;
        }
    
    // Function to retrieve all candidates and their vote counts
    function getAllVotes() public view returns(Candidate[] memory){
            return candidates;
        }

      // Function to check if voting is still open
    function getVotingStatus() public view returns(bool) {
        return votingTimesSet && block.timestamp >= votingStart && block.timestamp <= votingEnd;
    }
            // Function to get the remaining time until voting ends
    function getRemainingTime() public view returns (uint256){
            require(block.timestamp >= votingStart, "Voting has not started yet.");
            if (block.timestamp >= votingEnd) {
                return 0;
            }
            return votingEnd - block.timestamp;
        }
        //tnjm tzid extension taa vote wle tskaar lvote early ama manich mo9tan3a behom mastin

    function getWinners() public view returns (uint256[] memory) {
        require(block.timestamp > votingEnd, "Voting not ended yet");
        
        uint256 winningVoteCount = 0;
        uint256[] memory winners = new uint256[](candidates.length);
        uint256 winnerCount = 0;
        
        //find max votecount
        
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
            }
        }
        //aamlna two for loops bch nakhsrou a9al gas khatir read blech 
        //hne hatina winners fitableau
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount == winningVoteCount) {
                winners[winnerCount] = candidates[i].index;
                winnerCount++;
            }
        }
        
        // Resize array
        uint256[] memory finalWinners = new uint256[](winnerCount);

        for (uint256 i = 0; i < winnerCount; i++) {
            finalWinners[i] = winners[i];
        }
    
    return finalWinners;
}


}