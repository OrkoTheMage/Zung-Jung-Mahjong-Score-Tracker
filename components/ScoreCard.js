import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PlayerRow from './PlayerRow';
import WinningHandForm from './WinningHandForm';

export default function ScoreCard() {
  // Wind symbols in order: East, South, West, North
  const winds = ['東', '南', '西', '北'];
  
  // Hand scoring values
  const handScores = {
    // Trivial Patterns
    'All Sequences': 5,
    'Concealed Hand': 5,
    'No Terminals': 5,
    
    // One-Suit Patterns
    'Mixed One-Suit': 40,
    'Pure One-Suit': 80,
    'Nine Gates': 480,
    
    // Honor Tiles
    'Value Honor': 10,
    'Small Three Dragons': 40,
    'Big Three Dragons': 130,
    'Small Three Winds': 30,
    'Big Three Winds': 120,
    'Small Four Winds': 320,
    'Big Four Winds': 400,
    'All Honors': 320,
    
    // Triplets and Kong
    'All Triplets': 30,
    'Two Concealed Triplets': 5,
    'Three Concealed Triplets': 30,
    'Four Concealed Triplets': 125,
    'One Kong': 5,
    'Two Kong': 20,
    'Three Kong': 120,
    'Four Kong': 480,
    
    // Identical Sets
    'Two Identical Sequences': 10,
    'Two Identical Sequences Twice': 60,
    'Three Identical Sequences': 120,
    'Four Identical Sequences': 480,
    
    // Similar Sets
    'Three Similar Sequences': 35,
    'Small Three Similar Triplets': 30,
    'Three Similar Triplets': 120,
    
    // Consecutive Sets
    'Nine-Tile Straight': 40,
    'Three Consecutive Triplets': 100,
    'Four Consecutive Triplets': 200,
    
    // Terminals
    'Mixed Lesser Terminals': 40,
    'Pure Lesser Terminals': 60,
    'Mixed Greater Terminals': 100,
    'Pure Greater Terminals': 400,
    
    // Irregular Patterns
    'Thirteen Terminals': 160,
    'Seven Pairs': 30,
    'Chicken Hand': 1
  };
  
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', scores: [], editing: false },
    { id: 2, name: 'Player 2', scores: [], editing: false },
    { id: 3, name: 'Player 3', scores: [], editing: false },
    { id: 4, name: 'Player 4', scores: [], editing: false },
  ]);
  
  const [rounds, setRounds] = useState([]);
  const [dealerIndex, setDealerIndex] = useState(null); // Track which player is the dealer
  const [prevalentWindIndex, setPrevalentWindIndex] = useState(0); // 0 = East, 1 = South, etc.
  
  const [isWinningHandFormVisible, setWinningHandFormVisible] = useState(false);
  const [selectedHand, setSelectedHand] = useState('');
  const [selectedBonuses, setSelectedBonuses] = useState([]);
  const [isSelfDraw, setIsSelfDraw] = useState(false);
  const [activePlayer, setActivePlayer] = useState('');
  const [winningPlayer, setWinningPlayer] = useState('');

  const bonuses = [
    'Final Draw',
    'Final Discard',
    'Win on Kong',
    'Robbing a Kong',
    'Blessing of Heaven',
    'Blessing of Earth',
  ];

  const toggleBonus = (bonus) => {
    setSelectedBonuses((prev) =>
      prev.includes(bonus) ? prev.filter((b) => b !== bonus) : [...prev, bonus]
    );
  };

  const handleWinningHandSubmit = () => {
    // Calculate the score for the winning hand
    const handValue = selectedHand ? (handScores[selectedHand] || 5) : 5; // Use defined hand value or default to 5
    const bonusValue = selectedBonuses.length * 5; // 5 points per bonus
    const totalHandValue = handValue + bonusValue;
    const totalScore = totalHandValue * 3; // Winner gets triple the hand value
    
    // Find the winning player's index
    const winnerIndex = players.findIndex(player => player.name === winningPlayer);
    
    if (winnerIndex !== -1) {
      // Check if the last round has any scores
      const lastRound = rounds[rounds.length - 1];
      const isLastRoundEmpty = lastRound && lastRound.scores.every(score => score === 0);
      
      let updatedRounds;
      
      if (isLastRoundEmpty) {
        // Use the last round if it's empty
        updatedRounds = [...rounds];
        
        // Determine scores for each player
        const scores = Array(players.length).fill(0);
        scores[winnerIndex] = totalScore;
        
        if (totalHandValue <= 25) {
          // Standard case: each losing player pays handValue
          players.forEach((player, index) => {
            if (index !== winnerIndex) {
              scores[index] = -totalHandValue;
            }
          });
        } else {
          // Special case: hand value > 25
          if (isSelfDraw) {
            // In case of self draw, all losing players pay 25 points
            players.forEach((player, index) => {
              if (index !== winnerIndex) {
                scores[index] = -25;
              }
            });
          } else {
            // Find the discarder's index
            const discarderIndex = players.findIndex(player => player.name === activePlayer);
            
            // Calculate what the discarder needs to pay
            // Total points minus what two players pay (25 each)
            const discarderPays = totalScore - (25 * 2);
            
            players.forEach((player, index) => {
              if (index !== winnerIndex) {
                if (index === discarderIndex) {
                  scores[index] = -discarderPays;
                } else {
                  scores[index] = -25;
                }
              }
            });
          }
        }
        
        // Update the round with calculated scores
        updatedRounds[updatedRounds.length - 1].scores = scores;
        setRounds(updatedRounds);
      } else {
        // Create a new round with the calculated scores
        const scores = Array(players.length).fill(0);
        scores[winnerIndex] = totalScore;
        
        if (totalHandValue <= 25) {
          // Standard case: each losing player pays handValue
          players.forEach((player, index) => {
            if (index !== winnerIndex) {
              scores[index] = -totalHandValue;
            }
          });
        } else {
          // Special case: hand value > 25
          if (isSelfDraw) {
            // In case of self draw, all losing players pay 25 points
            players.forEach((player, index) => {
              if (index !== winnerIndex) {
                scores[index] = -25;
              }
            });
          } else {
            // Find the discarder's index
            const discarderIndex = players.findIndex(player => player.name === activePlayer);
            
            // Calculate what the discarder needs to pay
            // Total points minus what two players pay (25 each)
            const discarderPays = totalScore - (25 * 2);
            
            players.forEach((player, index) => {
              if (index !== winnerIndex) {
                if (index === discarderIndex) {
                  scores[index] = -discarderPays;
                } else {
                  scores[index] = -25;
                }
              }
            });
          }
        }
        
        const newRound = { 
          id: rounds.length + 1, 
          scores: scores 
        };
        
        // Add the new round with scores
        setRounds([...rounds, newRound]);
      }
    }

    // Move the dealer index to the next player if the winning player is the dealer
    if (dealerIndex === winnerIndex) {
      setDealerIndex((prevDealerIndex) => (prevDealerIndex + 1) % players.length);
    }

    setWinningHandFormVisible(false); // Close the form after submission
  };

  const addRound = () => {
    // Remove the 4-round limit
    const newRound = { id: rounds.length + 1, scores: Array(players.length).fill(0) };
    setRounds([...rounds, newRound]);
  };

  const resetScoreCard = () => {
    // Reset all states to their initial values
    setPlayers(players.map(player => ({ ...player, scores: [], editing: false })));
    setRounds([{ id: 1, scores: Array(players.length).fill(0) }]); // Set rounds to a single initial round
    setDealerIndex(null);
    setPrevalentWindIndex(0);
    setWinningHandFormVisible(false);
    setSelectedHand('');
    setSelectedBonuses([]);
    setIsSelfDraw(false);
    setActivePlayer('');
    setWinningPlayer('');
  };

  const calculateTotals = () => {
    return players.map((player, playerIndex) => {
      return rounds.reduce((total, round) => total + (round.scores[playerIndex] || 0), 0);
    });
  };
  
  const updateScore = (roundIndex, playerIndex, score) => {
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex].scores[playerIndex] = parseInt(score) || 0;
    setRounds(updatedRounds);
  };
  
  const toggleEditing = (playerIndex) => {
    const updatedPlayers = [...players];
    updatedPlayers[playerIndex].editing = !updatedPlayers[playerIndex].editing;
    setPlayers(updatedPlayers);
  };
  
  const updatePlayerName = (playerIndex, name) => {
    const updatedPlayers = [...players];
    updatedPlayers[playerIndex].name = name;
    setPlayers(updatedPlayers);
  };

  const setDealer = (playerIndex) => {
    setDealerIndex(playerIndex);
  };
  
  // Calculate seat wind for a player based on dealer position
  const getPlayerSeatWind = (playerIndex) => {
    if (dealerIndex === null) return null;
    
    // Calculate wind position relative to dealer (who is always East)
    // (playerIndex - dealerIndex + 4) % 4 gives position relative to dealer in clockwise order
    const windPosition = (playerIndex - dealerIndex + 4) % 4;
    return {
      symbol: winds[windPosition],
      name: ['East', 'South', 'West', 'North'][windPosition],
      isPrevalentWind: windPosition === prevalentWindIndex
    };
  };
  
  // Get current prevalent wind
  const getPrevalentWind = () => {
    return {
      symbol: winds[prevalentWindIndex],
      name: ['East', 'South', 'West', 'North'][prevalentWindIndex]
    };
  };

  const moveWindsCounterClockwise = () => {
    setPrevalentWindIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % winds.length;

      // Update dealerIndex to reflect the new wind rotation
      setDealerIndex((prevDealerIndex) => (prevDealerIndex + 1) % players.length);

      return newIndex;
    });
  };

  useEffect(() => {
    if (rounds.length === 0) {
      // Start with a single round instead of 4 fixed rounds
      const initialRounds = [
        { id: 1, scores: Array(players.length).fill(0) }
      ];
      setRounds(initialRounds);
    }
  }, []);

  const totals = calculateTotals();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f0e6d2]/85 backdrop-blur-sm rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
      overflow-hidden border-4 border-[#d6c8a9] mx-auto relative
      bg-[url('/tile-texture.png')] bg-repeat min-h-[85vh] md:min-h-[80vh] flex flex-col"
      style={{
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.2)"
      }}
    >
      
      {/* Header row - significantly smaller */}
      <div className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] bg-[#9b221c]/90 border-b-2 border-[#8b7b59]">
        <div className="py-1 md:py-2 px-3 md:px-5 font-bold text-xs md:text-sm text-[#f0e6d2] uppercase tracking-wider flex items-center">
          Rounds
        </div>
        <div className="grid text-[#f0e6d2]" style={{ 
          gridTemplateColumns: `repeat(${rounds.length}, 1fr) 1.2fr`
        }}>
          {rounds.map((round, index) => (
            <div key={round.id} className="py-1 md:py-2 px-1 md:px-2 text-center text-xs"></div>
          ))}
          <div className="py-1 md:py-2 px-1 md:px-2 font-medium text-center relative">
            <span className="inline-block text-xs md:text-sm font-bold text-[#f0e6d2]">Total</span>
          </div>
        </div>
      </div>
      
      {/* Player rows section - more compact */}
      <div className="flex-grow flex flex-col">
        {players.map((player, playerIndex) => (
          <PlayerRow
            key={player.id}
            player={player}
            playerIndex={playerIndex}
            rounds={rounds}
            updateScore={updateScore}
            toggleEditing={toggleEditing}
            updatePlayerName={updatePlayerName}
            total={totals[playerIndex]}
            playerCount={players.length}
            isDealer={dealerIndex === playerIndex} // Only the dealer gets this prop
            setDealer={setDealer}
            seatWind={getPlayerSeatWind(playerIndex)}
            compact={true}
          />
        ))}
      </div>
      
      {/* Buttons section - Winning Hand, Add Round, and End Game */}
      <div className="flex flex-col items-center p-6 md:p-8 space-y-3">
        <motion.button
          onClick={() => setWinningHandFormVisible(true)}
          whileHover="hover"
          whileTap="tap"
          className="bg-[#9b221c] text-[#f0e6d2] font-bold py-3 px-6 md:py-4 md:px-8 rounded-xl
          border-2 border-[#d6c8a9] shadow-lg flex items-center justify-center gap-3
          hover:bg-[#8a1e19] transition-colors duration-200 fredericka-the-great-regular"
          style={{
            boxShadow: "0 4px 10px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)"
          }}
        >
          <span className="tracking-wide text-3xl md:text-xl">Winning Hand</span>
        </motion.button>
        
        <div className="flex space-x-3">
          {/* Add Round button */}
          <motion.button
            onClick={addRound}
            whileHover="hover"
            whileTap="tap"
            className="bg-[#9b221c] text-[#f0e6d2] font-bold py-2 px-5 md:py-3 md:px-6 rounded-xl
            border-2 border-[#d6c8a9] shadow-lg flex items-center justify-center gap-2
            hover:bg-[#8a1e19] transition-colors duration-200 text-sm fredericka-the-great-regular"
            style={{
              boxShadow: "0 4px 10px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)"
            }}
          >
            <span className="tracking-wide">Add Round</span>
          </motion.button>

          {/* End Game button */}
          <motion.button
            onClick={resetScoreCard}
            whileHover="hover"
            whileTap="tap"
            className="bg-[#9b221c] text-[#f0e6d2] font-bold py-2 px-5 md:py-3 md:px-6 rounded-xl
            border-2 border-[#d6c8a9] shadow-lg flex items-center justify-center gap-2
            hover:bg-[#8a1e19] transition-colors duration-200 text-sm fredericka-the-great-regular"
            style={{
              boxShadow: "0 4px 10px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)"
            }}
          >
            <span className="tracking-wide">End Game</span>
          </motion.button>
        </div>
      </div>

      {/* Winning Hand Form */}
      {isWinningHandFormVisible && (
        <WinningHandForm
          players={players}
          winningPlayer={winningPlayer}
          setWinningPlayer={setWinningPlayer}
          selectedHand={selectedHand}
          setSelectedHand={setSelectedHand}
          selectedBonuses={selectedBonuses}
          toggleBonus={toggleBonus}
          isSelfDraw={isSelfDraw}
          setIsSelfDraw={setIsSelfDraw}
          activePlayer={activePlayer}
          setActivePlayer={setActivePlayer}
          onClose={() => setWinningHandFormVisible(false)}
          onSubmit={handleWinningHandSubmit}
        />
      )}
    
    </motion.div>
  );
}
