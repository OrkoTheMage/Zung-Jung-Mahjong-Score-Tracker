import React from 'react';

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
  // Bonus types with their specific point values
  const bonuses = [
    'Final Draw',
    'Final Discard',
    'Win on Kong',
    'Robbing a Kong',
    'Blessing of Heaven',
    'Blessing of Earth',
  ];
  
  // Specific point values for each bonus type
  const bonusValues = {
    'Final Draw': 10,
    'Final Discard': 10,
    'Win on Kong': 10,
    'Robbing a Kong': 10,
    'Blessing of Heaven': 155,
    'Blessing of Earth': 155,
  };

  // Hand categories and their hand types
  const handCategories = {
    '1.0 Trivial Patterns': ['Chicken Hand', '1.1 All Sequences', '1.2 Concealed Hand', '1.3 No Terminals',],
    '2.0 One-Suit Patterns': ['2.1.1 Mixed One-Suit', '2.1.2 Pure One-Suit', '2.2 Nine Gates'],
    '3.0 Honor Tiles': [
      '3.1 Value Honor', '3.2.1 Small Three Dragons', '3.2.2 Big Three Dragons',
      '3.3.1 Small Three Winds', '3.3.2 Big Three Winds', '3.3.3 Small Four Winds',
      '3.3.4. Big Four Winds', '3.4 All Honors'
    ],
    '4.0 Triplets and Kong': [
      '4.1 All Triplets', '4.2.1 Two Concealed Triplets', '4.2.2 Three Concealed Triplets',
      '4.2.3 Four Concealed Triplets', '4.3.1 One Kong', '4.3.2 Two Kong', '4.3.3 Three Kong', '4.3.4 Four Kong'
    ],
    '5.0 Identical Sets': [
      '5.1.1 Two Identical Sequences', '5.1.2 Two Identical Sequences Twice',
      '5.1.3 Three Identical Sequences', '5.1.4 Four Identical Sequences'
    ],
    '6.0 Similar Sets': [
      '6.1 Three Similar Sequences', '6.2.1 Small Three Similar Triplets',
      '6.2.2 Three Similar Triplets'
    ],
    '7.0 Consecutive Sets': [
      '7.1 Nine-Tile Straight', '7.2.1 Three Consecutive Triplets',
      '7.2.2 Four Consecutive Triplets'
    ],
    '8.0 Terminals': [
      '8.1.1 Mixed Lesser Terminals', '8.1.2 Pure Lesser Terminals',
      '8.1.3 Mixed Greater Terminals', '8.1.4 Pure Greater Terminals'
    ],
    '10.0 Irregular Patterns': [
      '10.1 Thirteen Terminals', '10.2 Seven Pairs'
    ]
  };

  // Hand scoring values for display in the UI
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

  // Helper function to separate index and hand name
  const splitHandName = (hand) => {
    const match = hand.match(/^(\d+\.\d+(?:\.\d+)?(?:\/\d+)?)\s+(.*)/);
    return match ? { index: match[1], name: match[2] } : { index: '', name: hand };
  };

  // Helper function to extract base hand name without numbering (keep for score lookup)
  const getBaseHandName = (hand) => {
    const match = hand.match(/\d+\.\d+\s+(.*)/);
    return match ? match[1] : hand;
  };

  // Helper function to get the main category number (first digit)
  const getCategoryNumber = (hand) => {
    const match = hand.match(/^(\d+)\./);
    return match ? match[1] : null;
  };

  // Helper function to get the first two levels of the category (e.g., "2.1" from "2.1.1")
  const getSubCategoryNumber = (hand) => {
    // Match patterns like "2.1" from "2.1.1" or "2.1.2"
    const match = hand.match(/^(\d+\.\d+)/);
    return match ? match[1] : null;
  };

  // Toggle a hand selection with category restrictions
  const toggleHand = (hand) => {
    if (selectedHands.includes(hand)) {
      // If the hand is already selected, just remove it
      setSelectedHands(prev => prev.filter(h => h !== hand));
    } else {
      // Check if hand is "Chicken Hand"
      if (hand === 'Chicken Hand') {
        // If selecting Chicken Hand, clear all other selections
        setSelectedHands(['Chicken Hand']);
      } else if (selectedHands.includes('Chicken Hand')) {
        // If Chicken Hand is selected and trying to add another hand,
        // remove Chicken Hand and select the new one
        setSelectedHands([hand]);
      } else {
        // Get the subcategory of the hand being selected (first two levels of numbering)
        const subCategory = getSubCategoryNumber(hand);
        
        if (subCategory) {
          // Remove any hands from the same subcategory
          const filteredHands = selectedHands.filter(h => {
            const currentSubCategory = getSubCategoryNumber(h);
            return currentSubCategory !== subCategory;
          });
          
          // Add the new hand
          setSelectedHands([...filteredHands, hand]);
        } else {
          // For hands without proper category numbering
          setSelectedHands(prev => [...prev, hand]);
        }
      }
    }
  };

  // When winning player changes, reset activePlayer if it matches the winning player
  React.useEffect(() => {
    if (activePlayer === winningPlayer) {
      setActivePlayer('');
    }
  }, [winningPlayer, activePlayer, setActivePlayer]);

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
          <label className="block text-sm font-medium mb-1 text-black">Winning Player</label>
          <select
            value={winningPlayer}
            onChange={(e) => setWinningPlayer(e.target.value)}
            className="w-full border border-[#9b221c] rounded px-3 py-2 bg-black text-white"
          >
            <option value="" disabled>Select a player</option>
            {players.map((player) => (
              <option key={player.id} value={player.name}>{player.name}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">Select Hands</label>
          <div className="max-h-[300px] overflow-y-auto border border-[#9b221c] rounded bg-black/10 p-3">
            {Object.entries(handCategories).map(([category, hands]) => (
              <div key={category} className="mb-2">
                <h3 className="font-semibold text-sm mb-1 text-black">{category}</h3>
                {hands.map((hand) => {
                  const { index, name } = splitHandName(hand);
                  return (
                    <div key={hand} className="flex items-center mb-1 text-black">
                      <input
                        type="checkbox"
                        id={`hand-${hand}`}
                        checked={selectedHands.includes(hand)}
                        onChange={() => toggleHand(hand)}
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
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1 text-black">9.0 Bonuses</label>
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
          <label className="block text-sm font-medium mb-1 text-black">Winning Tile From</label>
          <div>
            <select
              value={activePlayer}
              onChange={(e) => setActivePlayer(e.target.value)}
              className="w-full border border-[#9b221c] rounded px-3 py-2 bg-black text-white"
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
            onClick={() => onSubmit(bonusValues)}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
