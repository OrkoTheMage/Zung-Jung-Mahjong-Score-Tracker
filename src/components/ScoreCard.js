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
    // Calculate the hand value from selected hands and bonuses
    const handValue = selectedHands.reduce((total, hand) => {
      const baseName = getBaseHandName(hand)
      return total + (handScores[baseName] || 5)
    }, 0)
    
    const bonusValue = selectedBonuses.reduce((total, bonus) => 
      total + (bonusValues[bonus] || 5), 0)
    
    const totalHandValue = handValue + bonusValue
    const isSelfDraw = activePlayer === "Self"
    
    // Find winning player
    const winningPlayerIndex = players.findIndex(player => player.name === winningPlayer)
    if (winningPlayerIndex === -1) return // Exit if no valid winning player
    
    // Define scoring constants
    const parScore = 25
    const scores = Array(players.length).fill(0)
    
    if (isSelfDraw) {
      // Self-draw: all non-winners pay evenly
      const pointsPerNonWinner = Math.ceil(totalHandValue * 3 / 3 )
      
      players.forEach((player, playerIdx) => {
        if (playerIdx !== winningPlayerIndex) {
          // Non-winners lose points
          scores[playerIdx] = -pointsPerNonWinner
        } else {
          // Winner gets all points
          scores[playerIdx] = pointsPerNonWinner * 3
        }
      })
    } else {
      // Regular win from discard
      const activePlayerIndex = players.findIndex(player => player.name === activePlayer)
      
      if (totalHandValue <= parScore) {
        // Standard scoring: everyone pays the same
        players.forEach((player, playerIdx) => {
          if (playerIdx !== winningPlayerIndex) {
            scores[playerIdx] = -totalHandValue
          } else {
            scores[playerIdx] = totalHandValue * 3
          }
        })
      } else {
        // Special case: above parScore
        // Non-active players pay parScore
        const nonActivePlayerPayment = parScore
        
        // Active player pays the remainder
        const activePlayerPayment = (totalHandValue * 3) - (nonActivePlayerPayment * 2)
        
        players.forEach((player, playerIdx) => {
          if (playerIdx === winningPlayerIndex) {
            scores[playerIdx] = totalHandValue * 3
          } else if (playerIdx === activePlayerIndex) {
            scores[playerIdx] = -activePlayerPayment
          } else {
            scores[playerIdx] = -nonActivePlayerPayment
          }
        })
      }
    }
    
    // Update rounds with calculated scores
    const lastRound = rounds[rounds.length - 1]
    const isLastRoundEmpty = lastRound && lastRound.scores.every(score => score === 0)
    
    if (isLastRoundEmpty) {
      // Use existing empty round
      const updatedRounds = [...rounds]
      updatedRounds[updatedRounds.length - 1].scores = scores
      setRounds(updatedRounds)
    } else {
      // Create a new round
      const newRound = { 
        id: rounds.length + 1, 
        scores: scores 
      }
      setRounds([...rounds, newRound])
    }
    
    // Move dealer to next player
    setDealerIndex((prevDealerIndex) => (prevDealerIndex + 1) % players.length)
    
    // Reset form state
    setSelectedHands([])
    setSelectedBonuses([])
    setActivePlayer('')
    setWinningPlayer('')
    setWinningHandFormVisible(false)
  }

  const addRound = () => {
    // Remove the 4-round limit
    const newRound = { id: rounds.length + 1, scores: Array(players.length).fill(0) }
    setRounds([...rounds, newRound])
    setDealerIndex((prevDealerIndex) => (prevDealerIndex + 1) % players.length)
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
    return players.map((player, playerIdx) => {
      return rounds.reduce((total, round) => total + (round.scores[playerIdx] || 0), 0)
    })
  }
  
  const updateScore = (roundIndex, playerIndex, score) => {
    const updatedRounds = [...rounds];
    const parsedScore = parseInt(score) || 0;

    // Update the current round's score
    updatedRounds[roundIndex].scores[playerIndex] = parsedScore;

    // Recalculate running totals for all subsequent rounds
    for (let i = roundIndex + 1; i < updatedRounds.length; i++) {
      updatedRounds[i].scores[playerIndex] =
        (updatedRounds[i - 1].scores[playerIndex] || 0) +
        (updatedRounds[i].scores[playerIndex] || 0);
    }

    setRounds(updatedRounds);
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
        {players.map((player, playerIdx) => (
          <PlayerRow
            key={player.id}
            player={player}
            playerIndex={playerIdx}
            rounds={rounds}
            updateScore={updateScore}
            toggleEditing={toggleEditing}
            updatePlayerName={updatePlayerName}
            total={totals[playerIdx]}
            playerCount={players.length}
            isDealer={dealerIndex === playerIdx} // Only the dealer gets this prop
            setDealer={setDealer}
            seatWind={getPlayerSeatWind(playerIdx)}
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
        
        {/* Buttons section - Exhaustive Draw and End Game */}
        <div className="flex space-x-3">
          {dealerIndex !== null && (
            <>
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
                <span className="tracking-wide">New Round</span>
              </motion.button>
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
            </>
          )}
        </div>
        
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
