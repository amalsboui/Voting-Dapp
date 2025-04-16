// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";


contract VotingApp is Ownable {


    event CandidateAdded(uint256 id);
    event CandidateRemoved(uint256 id);
    event VotingPeriodSet(uint256 start, uint256 end);
    event VotingPeriodUpdated(uint256 newStart, uint256 newEnd);
    event VotingStarted(uint256 startTime);
    event VotingEnded(uint256 endTime);

    //address  ownerofcontract ;//njmou baad naamloulou fonction yskr w y7el w9t l elections
    uint256 votingStart;
    uint256 votingEnd;
    bool votingTimesSet;

    struct Candidate {
        uint256 id;
        string name;
        uint voteCount;
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

    constructor(string[] memory _candidateNames) Ownable(msg.sender){
         // automatically set by Ownable
        //votingStart = block.timestamp; // Voting starts at contract deployment time
        //votingEnd = block.timestamp+(_durationInMinutes*1 minutes);

        // Add all candidates to the election
        for (uint256 i =0;i< _candidateNames.length; i++){
            candidates.push(Candidate({
                id: i+1,
                name: _candidateNames[i],
                voteCount: 0
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
    
    function addCandidate(string memory _name) public onlyOwner {
        require(bytes(_name).length > 0, "Empty name");
        require(!votingTimesSet || block.timestamp < votingStart, "Cannot add during voting");
        uint256 id = candidates.length+1;
        candidates.push(Candidate(id, _name, 0));
        emit CandidateAdded(id);
    }

    function findIndex(uint256 _idCandidate) private view returns (uint256 _candidateIndex){
        for (uint256 i = 0; i < candidates.length; i++) {
                if (candidates[i].id == _idCandidate) {
                    return i;
                }
            }
    }
    function removeCandidate(uint256 _id) public onlyOwner {
        require(block.timestamp < votingStart, "Cannot remove during voting");
        // find index of candidate to be removed by name
        uint256 _candidateIndex = findIndex(_id);

        //swapi lekhr wlcandidat heki wbaad remove( lel asaf lordre bch ytbadal ama we have to bch mankhsrouch barcha agz wanyway lordre mayhmch barcha flcas mteena)
        if (_candidateIndex != candidates.length - 1) {
            candidates[_candidateIndex] = candidates[candidates.length - 1];
        }
        candidates.pop();
        
        emit CandidateRemoved(_id);
    }

    function vote (uint256 _id) public hasNotVoted onlyDuringVotingPeriod{

            require(_id > 0, "Candidate id must be greater than 0");//njmou ndeclariw modifiers eli tnjm w9oul lel chez fcnam l owner khw m8khsroucheh y7el w yskr l elections
            // find index of candidate to vote for by id
            uint256 _candidateIndex = findIndex(_id);
            // Increment the vote count of the chosen candidate
            candidates[_candidateIndex].voteCount++;
            // Mark the sender as having voted
            voters[msg.sender] = true;

        }
    
    // Function to retrieve all candidates and their vote counts
    function getAllVotes() public view returns(Candidate[] memory){
            return candidates;
        }

      // Function to check if voting is still open
    function getVotingStatus() public view returns(bool){
            return block.timestamp >= votingStart && block.timestamp <= votingEnd;

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
                winners[winnerCount] = candidates[i].id;
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
