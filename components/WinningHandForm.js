import React from 'react';

export default function WinningHandForm({
  players,
  winningPlayer,
  setWinningPlayer,
  selectedHand,
  setSelectedHand,
  selectedBonuses,
  toggleBonus,
  isSelfDraw,
  setIsSelfDraw,
  activePlayer,
  setActivePlayer,
  onClose,
  onSubmit,
}) {
  const bonuses = [
    'Final Draw',
    'Final Discard',
    'Win on Kong',
    'Robbing a Kong',
    'Blessing of Heaven',
    'Blessing of Earth',
  ];

  return (
    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-amber-100 p-6 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-96 border-4 border-[#9b221c] 
        relative bg-[url('/tile-texture.png')] bg-repeat"
        style={{
          boxShadow: "inset 0 0 30px rgba(0,0,0,0.2)"
        }}
      >
        <h2 className="text-lg font-bold mb-4 text-black uppercase tracking-wider">Winning Hand</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Winning Player</label>
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
          <label className="block text-sm font-medium mb-2 text-black">Select Hand</label>
          <select
            value={selectedHand}
            onChange={(e) => setSelectedHand(e.target.value)}
            className="w-full border border-[#9b221c] rounded px-3 py-2 bg-black text-white"
          >
            <option value="" disabled>Select a hand</option>
            <optgroup label="Trivial Patterns">
              <option value="All Sequences">All Sequences</option>
              <option value="Concealed Hand">Concealed Hand</option>
              <option value="No Terminals">No Terminals</option>
            </optgroup>
            <optgroup label="One-Suit Patterns">
              <option value="Mixed One-Suit">Mixed One-Suit</option>
              <option value="Pure One-Suit">Pure One-Suit</option>
              <option value="Nine Gates">Nine Gates</option>
            </optgroup>
            <optgroup label="Honor Tiles">
              <option value="Value Honor">Value Honor</option>
              <option value="Small Three Dragons">Small Three Dragons</option>
              <option value="Big Three Dragons">Big Three Dragons</option>
              <option value="Small Three Winds">Small Three Winds</option>
              <option value="Big Three Winds">Big Three Winds</option>
              <option value="Small Four Winds">Small Four Winds</option>
              <option value="Big Four Winds">Big Four Winds</option>
              <option value="All Honors">All Honors</option>
            </optgroup>
            <optgroup label="Triplets and Kong">
              <option value="All Triplets">All Triplets</option>
              <option value="Two Concealed Triplets">Two Concealed Triplets</option>
              <option value="Three Concealed Triplets">Three Concealed Triplets</option>
              <option value="Four Concealed Triplets">Four Concealed Triplets</option>
              <option value="One Kong">One Kong</option>
              <option value="Two Kong">Two Kong</option>
              <option value="Three Kong">Three Kong</option>
              <option value="Four Kong">Four Kong</option>
            </optgroup>
            <optgroup label="Identical Sets">
              <option value="Two Identical Sequences">Two Identical Sequences</option>
              <option value="Two Identical Sequences Twice">Two Identical Sequences Twice</option>
              <option value="Three Identical Sequences">Three Identical Sequences</option>
              <option value="Four Identical Sequences">Four Identical Sequences</option>
            </optgroup>
            <optgroup label="Similar Sets">
              <option value="Three Similar Sequences">Three Similar Sequences</option>
              <option value="Small Three Similar Triplets">Small Three Similar Triplets</option>
              <option value="Three Similar Triplets">Three Similar Triplets</option>
            </optgroup>
            <optgroup label="Consecutive Sets">
              <option value="Nine-Tile Straight">Nine-Tile Straight</option>
              <option value="Three Consecutive Triplets">Three Consecutive Triplets</option>
              <option value="Four Consecutive Triplets">Four Consecutive Triplets</option>
            </optgroup>
            <optgroup label="Terminals">
              <option value="Mixed Lesser Terminals">Mixed Lesser Terminals</option>
              <option value="Pure Lesser Terminals">Pure Lesser Terminals</option>
              <option value="Mixed Greater Terminals">Mixed Greater Terminals</option>
              <option value="Pure Greater Terminals">Pure Greater Terminals</option>
            </optgroup>
            <optgroup label="Iregular Patterns">
              <option value="Thirteen Terminals">Thirteen Terminals</option>
              <option value="Seven Pairs">Seven Pairs</option>
              <option value="Chicken Hand">Chicken Hand</option>
            </optgroup>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Bonuses</label>
          {bonuses.map((bonus) => (
            <div key={bonus} className="flex items-center mb-2 text-black">
              <input
                type="checkbox"
                id={bonus}
                checked={selectedBonuses.includes(bonus)}
                onChange={() => toggleBonus(bonus)}
                className="mr-2 accent-[#9b221c]"
              />
              <label htmlFor={bonus} className="text-sm text-black">{bonus}</label>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Winning Tile</label>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="self-draw"
              checked={isSelfDraw}
              onChange={(e) => setIsSelfDraw(e.target.checked)}
              className="mr-2 accent-[#9b221c]"
            />
            <label htmlFor="self-draw" className="text-sm text-black">Self Draw?</label>
          </div>
          <div>
            <select
              value={activePlayer}
              onChange={(e) => setActivePlayer(e.target.value)}
              className="w-full border border-[#9b221c] rounded px-3 py-2 bg-black text-white"
            >
              <option value="" disabled>Select a player</option>
              {players.map((player) => (
                <option key={player.id} value={player.name}>{player.name}</option>
              ))}
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
            onClick={onSubmit}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
