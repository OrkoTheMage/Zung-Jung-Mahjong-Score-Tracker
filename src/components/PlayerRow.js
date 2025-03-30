import { motion } from 'framer-motion'
import ScoreInput from './ScoreInput'

export default function PlayerRow({ 
  player,
  playerIndex,
  rounds,
  updateScore,
  toggleEditing,
  updatePlayerName,
  total,
  playerCount,
  isDealer,
  setDealer,
  seatWind
}) {
  const renderWindIndicator = () => {
    if (!seatWind) {
      return (
        <button 
          onClick={() => setDealer(playerIndex)}
          className="mt-2 text-xs bg-[#9b221c]/90 text-[#f0e6d2] py-1 px-2 rounded 
            hover:bg-[#8a1e19] transition-colors duration-200 mx-auto block"
        >
          Set dealer
        </button>
      )
    }
    
    return (
      <div className="flex flex-col items-center mt-2">
        <div className={`
          ${isDealer ? 'bg-[#9b221c] ring-2 ring-yellow-400' : 'bg-[#59493f]'} 
          text-[#f0e6d2] px-2 py-1 rounded-md text-xs font-medium mb-1
        `}>
          {seatWind.name} Wind
        </div>
        <div className={`
          ${isDealer ? 'bg-[#9b221c] ring-2 ring-yellow-400' : 'bg-[#59493f]/80'} 
          w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold 
          text-[#f0e6d2] shadow-md relative
        `}>
          {seatWind.symbol}
          {isDealer && (
            <span className="absolute -top-1 -right-1 bg-[#f0e6d2] text-[#9b221c] 
              text-xs px-1 rounded-full border border-[#9b221c]">
              D
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: playerIndex * 0.1 }}
      className="grid grid-cols-[115px_1fr] md:grid-cols-[220px_1fr] border-b border-[#d6c8a9] hover:bg-[#e8decc]/80 transition-colors flex-grow"
      style={{ height: `${100 / playerCount}%` }}
    >
      <div className="py-4 md:py-6 px-4 md:px-8 flex flex-col justify-center border-r border-[#d6c8a9] text-[#59493f] font-medium relative">
        <div className="w-full flex items-center justify-center">
          {player.editing ? (
            <motion.input
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              type="text"
              value={player.name}
              onChange={(e) => updatePlayerName(playerIndex, e.target.value)}
              onBlur={() => toggleEditing(playerIndex)}
              className="bg-[#f0e6d2] text-[#59493f] px-3 md:px-4 py-2 md:py-3 rounded-lg w-full focus:outline-none 
              focus:ring-2 focus:ring-[#9b221c] border border-[#d6c8a9] text-sm md:text-base text-center"
              autoFocus
            />
          ) : (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => toggleEditing(playerIndex)} 
              className="cursor-pointer hover:text-[#9b221c] truncate transition-all duration-200 ease-in-out text-sm md:text-lg font-semibold text-center"
            >
              {player.name}
            </motion.div>
          )}
        </div>
        {renderWindIndicator()}
      </div>
      
      <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${rounds.length}, 1fr) 1.2fr` }}>
        {rounds.map((round, roundIndex) => (
          <ScoreInput 
            key={roundIndex}
            roundIndex={roundIndex}
            playerIndex={playerIndex}
            value={round.scores[playerIndex]}
            updateScore={updateScore}
          />
        ))}
        
        <motion.div 
          className="py-3 md:py-5 px-1 md:px-3 text-center flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="inline-block bg-[#1a6547] w-full
          text-[#f0e6d2] px-3 md:px-5 py-2 md:py-3 rounded-lg font-medium text-sm md:text-lg text-center overflow-hidden text-ellipsis">
            {total}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}