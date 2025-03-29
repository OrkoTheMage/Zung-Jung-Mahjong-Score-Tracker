export default function ScoreInput({ roundIndex, playerIndex, value, updateScore }) {
  return (
    <div className="py-3 md:py-5 px-1 md:px-3 border-r border-[#d6c8a9] flex items-center">
      <input
        type="number"
        value={value}
        onChange={(e) => updateScore(roundIndex, playerIndex, e.target.value)}
        className="w-full text-center py-2 md:py-3 px-1 md:px-3 bg-[#f0e6d2] text-[#59493f] border 
        border-[#d6c8a9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b221c] 
        hover:border-[#9b221c] transition-all duration-200 text-sm md:text-lg"
      />
    </div>
  );
}
