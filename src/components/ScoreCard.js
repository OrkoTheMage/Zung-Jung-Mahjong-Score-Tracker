import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PlayerRow from './PlayerRow'
import WinningHandForm from './WinningHandForm'
import { winds, handScores, bonuses, getBaseHandName } from '../../utils/scoreUtils'

export default function ScoreCard() {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', scores: [], editing: false },
    { id: 2, name: 'Player 2', scores: [], editing: false },
    { id: 3, name: 'Player 3', scores: [], editing: false },
    { id: 4, name: 'Player 4', scores: [], editing: false },
  ])
  
  const [rounds, setRounds] = useState([])
  const [dealerIndex, setDealerIndex] = useState(null) // Track which player is the dealer
  
  const [isWinningHandFormVisible, setWinningHandFormVisible] = useState(false)
  const [selectedHands, setSelectedHands] = useState([])
  const [selectedBonuses, setSelectedBonuses] = useState([])
  const [activePlayer, setActivePlayer] = useState('')
  const [winningPlayer, setWinningPlayer] = useState('')

  const toggleBonus = (bonus) => {
    setSelectedBonuses((prev) =>
      prev.includes(bonus) ? prev.filter((b) => b !== bonus) : [...prev, bonus]
    )
  }

  const handleWinningHandSubmit = (bonusValues) => {
    // Calculate the score for the winning hand - sum up values for all selected hands
    const handValue = selectedHands.reduce((total, hand) => {
      const baseName = getBaseHandName(hand)
      return total + (handScores[baseName] || 5)
    }, 0)
    
    // Calculate bonus value based on the specific values for each selected bonus
    const bonusValue = selectedBonuses.reduce((total, bonus) => total + (bonusValues[bonus] || 5), 0)
    
    const totalHandValue = handValue + bonusValue
    const isSelfDraw = activePlayer === "Self" // Determine if it's a self draw
    
    // Find the winning player's index
    const winnerIndex = players.findIndex(player => player.name === winningPlayer)
    
    if (winnerIndex !== -1) {
      // Check if the last round has any scores
      const lastRound = rounds[rounds.length - 1]
      const isLastRoundEmpty = lastRound && lastRound.scores.every(score => score === 0)
      
      let updatedRounds
      
      if (isLastRoundEmpty) {
        // Use the last round if it's empty
        updatedRounds = [...rounds]
        
        // Determine scores for each player
        const scores = Array(players.length).fill(0)
        
        if (isSelfDraw) {
          // Self draw: each losing player loses totalHandValue/3 points evenly
          const pointsPerPlayer = Math.ceil(totalHandValue / 3)
          
          // Winner gets the total points from all losers
          const totalWinPoints = pointsPerPlayer * 3
          scores[winnerIndex] = totalWinPoints
          
          // Each losing player pays evenly
          players.forEach((player, index) => {
            if (index !== winnerIndex) {
              scores[index] = -pointsPerPlayer
            }
          })
        } else if (totalHandValue <= 25) {
          // Standard case: each losing player pays handValue
          const totalWinPoints = totalHandValue * 3 // Winner gets triple the hand value
          scores[winnerIndex] = totalWinPoints
          
          players.forEach((player, index) => {
            if (index !== winnerIndex) {
              scores[index] = -totalHandValue
            }
          })
        } else {
          // Special case: hand value > 25
          // Find the discarder's index
          const discarderIndex = players.findIndex(player => player.name === activePlayer)
          
          // Calculate what the discarder needs to pay
          // Total points minus what two players pay (25 each)
          const discarderPays = totalHandValue * 3 - (25 * 2)
          
          // Winner gets the total points
          scores[winnerIndex] = totalHandValue * 3
          
          players.forEach((player, index) => {
            if (index !== winnerIndex) {
              if (index === discarderIndex) {
                scores[index] = -discarderPays
              } else {
                scores[index] = -25
              }
            }
          })
        }
        
        // Update the round with calculated scores
        updatedRounds[updatedRounds.length - 1].scores = scores
        setRounds(updatedRounds)
      } else {
        // Create a new round with the calculated scores
        const scores = Array(players.length).fill(0)
        
        if (isSelfDraw) {
          // Self draw: each losing player loses totalHandValue/3 points evenly
          const pointsPerPlayer = Math.ceil(totalHandValue / 3)
          
          // Winner gets the total points from all losers
          const totalWinPoints = pointsPerPlayer * 3
          scores[winnerIndex] = totalWinPoints
          
          // Each losing player pays evenly
          players.forEach((player, index) => {
            if (index !== winnerIndex) {
              scores[index] = -pointsPerPlayer
            }
          })
        } else if (totalHandValue <= 25) {
          // Standard case: each losing player pays handValue
          const totalWinPoints = totalHandValue * 3 // Winner gets triple the hand value
          scores[winnerIndex] = totalWinPoints
          
          players.forEach((player, index) => {
            if (index !== winnerIndex) {
              scores[index] = -totalHandValue
            }
          })
        } else {
          // Special case: hand value > 25
          // Find the discarder's index
          const discarderIndex = players.findIndex(player => player.name === activePlayer)
          
          // Calculate what the discarder needs to pay
          // Total points minus what two players pay (25 each)
          const discarderPays = totalHandValue * 3 - (25 * 2)
          
          // Winner gets the total points
          scores[winnerIndex] = totalHandValue * 3
          
          players.forEach((player, index) => {
            if (index !== winnerIndex) {
              if (index === discarderIndex) {
                scores[index] = -discarderPays
              } else {
                scores[index] = -25
              }
            }
          })
        }
        
        const newRound = { 
          id: rounds.length + 1, 
          scores: scores 
        }
        
        // Add the new round with scores
        setRounds([...rounds, newRound])
      }
    }

    // Always move the dealer index to the next player after each winning hand
    // This ensures winds rotate properly regardless of who wins
    setDealerIndex((prevDealerIndex) => (prevDealerIndex + 1) % players.length)

    // Reset form selections
    setSelectedHands([])
    setSelectedBonuses([])
    setActivePlayer('')
    setWinningPlayer('')
    setWinningHandFormVisible(false) // Close the form after submission
  }

  const addRound = () => {
    // Remove the 4-round limit
    const newRound = { id: rounds.length + 1, scores: Array(players.length).fill(0) }
    setRounds([...rounds, newRound])
  }

  const resetScoreCard = () => {
    // Reset all states to their initial values
    setPlayers(players.map(player => ({ ...player, scores: [], editing: false })))
    setRounds([{ id: 1, scores: Array(players.length).fill(0) }]) // Set rounds to a single initial round
    setDealerIndex(null)
    setWinningHandFormVisible(false)
    setSelectedHands([])
    setSelectedBonuses([])
    setActivePlayer('')
    setWinningPlayer('')
  }

  const calculateTotals = () => {
    return players.map((player, playerIndex) => {
      return rounds.reduce((total, round) => total + (round.scores[playerIndex] || 0), 0)
    })
  }
  
  const updateScore = (roundIndex, playerIndex, score) => {
    const updatedRounds = [...rounds]
    updatedRounds[roundIndex].scores[playerIndex] = parseInt(score) || 0
    setRounds(updatedRounds)
  }
  
  const toggleEditing = (playerIndex) => {
    const updatedPlayers = [...players]
    updatedPlayers[playerIndex].editing = !updatedPlayers[playerIndex].editing
    setPlayers(updatedPlayers)
  }
  
  const updatePlayerName = (playerIndex, name) => {
    const updatedPlayers = [...players]
    updatedPlayers[playerIndex].name = name
    setPlayers(updatedPlayers)
  }

  const setDealer = (playerIndex) => {
    setDealerIndex(playerIndex)
  }
  
  // Calculate seat wind for a player based on dealer position
  const getPlayerSeatWind = (playerIndex) => {
    if (dealerIndex === null) return null
    
    // Calculate wind position relative to dealer (who is always East)
    // (playerIndex - dealerIndex + 4) % 4 gives position relative to dealer in clockwise order
    const windPosition = (playerIndex - dealerIndex + 4) % 4
    return {
      symbol: winds[windPosition],
      name: ['East', 'South', 'West', 'North'][windPosition],
    }
  }

  useEffect(() => {
    if (rounds.length === 0) {
      // Start with a single round instead of 4 fixed rounds
      const initialRounds = [
        { id: 1, scores: Array(players.length).fill(0) }
      ]
      setRounds(initialRounds)
    }
  }, [])

  const totals = calculateTotals()

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
      
      {/* Buttons section - Winning Hand and End Game */}
      <div className="flex flex-col items-center p-6 md:p-8 space-y-3">
        <motion.button
          onClick={() => dealerIndex !== null && setWinningHandFormVisible(true)}
          whileHover={dealerIndex !== null ? "hover" : ""}
          whileTap={dealerIndex !== null ? "tap" : ""}
          className={`${dealerIndex !== null ? 'bg-[#9b221c] hover:bg-[#8a1e19]' : 'bg-[#9b221c]/50 cursor-not-allowed'} text-[#f0e6d2] font-bold py-3 px-6 md:py-4 md:px-8 rounded-xl
          border-2 border-[#d6c8a9] shadow-lg flex items-center justify-center gap-3
          transition-colors duration-200 fredericka-the-great-regular`}
          style={{
            boxShadow: "0 4px 10px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)"
          }}
          disabled={dealerIndex === null}
        >
          <span className="tracking-wide text-3xl md:text-xl">
            {dealerIndex !== null ? "Winning Hand" : "Select Dealer First"}
          </span>
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

      {/* Winning Hand Form */}
      {isWinningHandFormVisible && (
        <WinningHandForm
          players={players}
          winningPlayer={winningPlayer}
          setWinningPlayer={setWinningPlayer}
          selectedHands={selectedHands}
          setSelectedHands={setSelectedHands}
          selectedBonuses={selectedBonuses}
          toggleBonus={toggleBonus}
          activePlayer={activePlayer}
          setActivePlayer={setActivePlayer}
          onClose={() => setWinningHandFormVisible(false)}
          onSubmit={handleWinningHandSubmit}
        />
      )}
    
    </motion.div>
  )
}
