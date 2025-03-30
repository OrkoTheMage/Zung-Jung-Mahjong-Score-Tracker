import React, { useState } from 'react'
import { 
  bonuses,
  bonusValues,
  handCategories,
  handScores,
  splitHandName,
  getBaseHandName,
  getCategoryNumber,
  getSubCategoryNumber
} from '../../utils/formUtils'

export default function WinningHandForm({
  players,
  winningPlayer,
  setWinningPlayer,
  selectedHands,
  setSelectedHands,
  selectedBonuses,
  toggleBonus,
  activePlayer,
  setActivePlayer,
  onClose,
  onSubmit,
}) {
  // Toggle a hand selection with category restrictions
  const toggleHand = (hand) => {
    if (selectedHands.includes(hand)) {
      // If the hand is already selected, just remove it
      setSelectedHands(prev => prev.filter(h => h !== hand))
    } else {
      // Check if hand is "Chicken Hand"
      if (hand === 'Chicken Hand') {
        // If selecting Chicken Hand, clear all other selections
        setSelectedHands(['Chicken Hand'])
      } else if (selectedHands.includes('Chicken Hand')) {
        // If Chicken Hand is selected and trying to add another hand,
        // remove Chicken Hand and select the new one
        setSelectedHands([hand])
      } else {
        // Get the subcategory of the hand being selected (first two levels of numbering)
        const subCategory = getSubCategoryNumber(hand)
        
        if (subCategory) {
          // Remove any hands from the same subcategory
          const filteredHands = selectedHands.filter(h => {
            const currentSubCategory = getSubCategoryNumber(h)
            return currentSubCategory !== subCategory
          })
          
          // Add the new hand
          setSelectedHands([...filteredHands, hand])
        } else {
          // For hands without proper category numbering
          setSelectedHands(prev => [...prev, hand])
        }
      }
    }
  }

  // When winning player changes, reset activePlayer if it matches the winning player
  React.useEffect(() => {
    if (activePlayer === winningPlayer) {
      setActivePlayer('')
    }
  }, [winningPlayer, activePlayer, setActivePlayer])

  // Add error states for required fields
  const [errors, setErrors] = useState({
    winningPlayer: false,
    selectedHands: false,
    activePlayer: false
  })

  // Validate form before submission
  const handleSubmit = () => {
    const newErrors = {
      winningPlayer: !winningPlayer,
      selectedHands: selectedHands.length === 0,
      activePlayer: !activePlayer
    }
    
    setErrors(newErrors)
    
    // Only submit if there are no errors
    if (!newErrors.winningPlayer && !newErrors.selectedHands && !newErrors.activePlayer) {
      onSubmit(bonusValues)
    }
  }

  return (
    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-amber-100 p-6 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-[500px] max-h-[90vh] overflow-y-auto border-4 border-[#9b221c] 
        relative bg-[url('/tile-texture.png')] bg-repeat"
        style={{
          boxShadow: "inset 0 0 30px rgba(0,0,0,0.2)"
        }}
      >
        <h2 className="md:block hidden text-lg font-bold mb-2 text-black uppercase tracking-wider">Winning Hand</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1 text-black justify-between">
            <span>Winning Player</span>
            {errors.winningPlayer && <span className="text-red-500 text-xs ml-2">Required</span>}
          </label>
          <div className="relative">
            <select
              value={winningPlayer}
              onChange={(e) => {
                setWinningPlayer(e.target.value)
                setErrors({...errors, winningPlayer: false})
              }}
              className={`w-full border ${errors.winningPlayer ? 'border-red-500' : 'border-[#9b221c]'} rounded px-3 py-2 bg-black text-white`}
            >
              <option value="" disabled>Select a player</option>
              {players.map((player) => (
                <option key={player.id} value={player.name}>{player.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black justify-between">
            <span>Select Hands</span>
            {errors.selectedHands && <span className="text-red-500 text-xs ml-2 ">Required</span>}
          </label>
          <div className={`max-h-[300px] overflow-y-auto border ${errors.selectedHands ? 'border-red-500' : 'border-[#9b221c]'} rounded bg-black/10 p-3`}>
            {Object.entries(handCategories).map(([category, hands]) => (
              <div key={category} className="mb-2">
                <h3 className="font-semibold text-sm mb-1 text-black">{category}</h3>
                {hands.map((hand) => {
                  const { index, name } = splitHandName(hand)
                  return (
                    <div key={hand} className="flex items-center mb-1 text-black">
                      <input
                        type="checkbox"
                        id={`hand-${hand}`}
                        checked={selectedHands.includes(hand)}
                        onChange={() => {
                          toggleHand(hand)
                          setErrors({...errors, selectedHands: false})
                        }}
                        className="mr-2 accent-[#9b221c]"
                      />
                      <label htmlFor={`hand-${hand}`} className="text-sm text-black flex items-baseline">
                        {index && (
                          <span className="text-xs mr-2 ">({index})</span>
                        )}
                        <span>{name}</span>
                        <span className="ml-1.5">({handScores[getBaseHandName(hand)] || 0} pts)</span>
                      </label>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1 text-black">
            9.0 Bonuses
          </label>
          <div className="max-h-[200px] overflow-y-auto border border-[#9b221c] rounded bg-black/10 p-3">
            {bonuses.map((bonus) => (
              <div key={bonus} className="flex items-center mb-1 text-black">
                <input
                  type="checkbox"
                  id={`bonus-${bonus}`}
                  checked={selectedBonuses.includes(bonus)}
                  onChange={() => toggleBonus(bonus)}
                  className="mr-2 accent-[#9b221c]"
                />
                <label htmlFor={`bonus-${bonus}`} className="text-sm text-black flex items-baseline">
                  <span>{bonus}</span>
                  <span className="ml-1.5">({bonusValues[bonus]} pts)</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1 text-black justify-between">
            <span>Winning Tile From</span>
            {errors.activePlayer && <span className="text-red-500 text-xs ml-2 ">Required</span>}
          </label>
          <div className="relative">
            <select
              value={activePlayer}
              onChange={(e) => {
                setActivePlayer(e.target.value)
                setErrors({...errors, activePlayer: false})
              }}
              className={`w-full border ${errors.activePlayer ? 'border-red-500' : 'border-[#9b221c]'} rounded px-3 py-2 bg-black text-white`}
            >
              <option value="" disabled>Select a player</option>
              <option value="Self">Self Draw</option>
              {players
                .filter(player => player.name !== winningPlayer) // Filter out the winning player
                .map((player) => (
                  <option key={player.id} value={player.name}>{player.name}</option>
                ))
              }
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}