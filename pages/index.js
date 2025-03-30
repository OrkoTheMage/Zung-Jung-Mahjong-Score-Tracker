import Head from 'next/head'
import { useState } from 'react'
import ScoreCard from '../src/components/ScoreCard'
import { handCategories, handScores, getBaseHandName, splitHandName } from '../utils/formUtils'

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false)
  const [showHandGuide, setShowHandGuide] = useState(false)
  const [currentCategory, setCurrentCategory] = useState(0)
  
  // Hand descriptions for the guide
  const handDescriptions = {
    // Trivial Patterns
    'Chicken Hand': 'A basic winning hand that doesn\'t qualify for any other scoring pattern.',
    'All Sequences': 'The hand contains 4 sequences (chows); no triplets/kong.',
    'Concealed Hand': 'The hand is completely concealed, with no tiles called from other players.',
    'No Terminals': 'The hand contains no terminal tiles (1s or 9s) or honor tiles.',
    
    // One-Suit Patterns
    'Mixed One-Suit': 'The hand contains tiles of one suit plus honor tiles.',
    'Pure One-Suit': 'The hand contains tiles of only one suit, no honors.',
    'Nine Gates': 'A specific pattern with tiles 1-1-1-2-3-4-5-6-7-8-9-9-9 of the same suit plus any tile of that suit.',
    
    // Honor Tiles
    'Value Honor': 'The hand includes a triplet of dragons or seat/round winds.',
    'Small Three Dragons': 'The hand contains two dragon triplets and a pair of the third dragon.',
    'Big Three Dragons': 'The hand contains three triplets of dragons.',
    'Small Three Winds': 'The hand contains two wind triplets and a pair of a third wind.',
    'Big Three Winds': 'The hand contains three triplets of winds.',
    'Small Four Winds': 'The hand contains three wind triplets and a pair of the fourth wind.',
    'Big Four Winds': 'The hand contains four wind triplets.',
    'All Honors': 'The hand consists entirely of honor tiles (winds and dragons).',
    
    // Triplets and Kong
    'All Triplets': 'The hand consists of four triplets/kongs and a pair.',
    'Two Concealed Triplets': 'The hand contains two concealed triplets/kongs.',
    'Three Concealed Triplets': 'The hand contains three concealed triplets/kongs.',
    'Four Concealed Triplets': 'The hand contains four concealed triplets/kongs.',
    'One Kong': 'The hand contains one kong (declared or concealed).',
    'Two Kong': 'The hand contains two kongs (declared or concealed).',
    'Three Kong': 'The hand contains three kongs (declared or concealed).',
    'Four Kong': 'The hand contains four kongs (declared or concealed).',
    
    // Identical Sets
    'Two Identical Sequences': 'The hand contains two identical sequences in the same suit.',
    'Two Identical Sequences Twice': 'The hand contains two different pairs of identical sequences.',
    'Three Identical Sequences': 'The hand contains three identical sequences in the same suit.',
    'Four Identical Sequences': 'The hand contains four identical sequences in the same suit.',
    
    // Similar Sets
    'Three Similar Sequences': 'The hand contains three sequences with the same numerical values but in different suits.',
    'Small Three Similar Triplets': 'The hand contains three triplets with the same numerical values in two suits.',
    'Three Similar Triplets': 'The hand contains three triplets with the same numerical values in three suits.',
    
    // Consecutive Sets
    'Nine-Tile Straight': 'The hand contains a sequence of tiles from 1 through 9 in the same suit.',
    'Three Consecutive Triplets': 'The hand contains three triplets of consecutive numbers in the same suit.',
    'Four Consecutive Triplets': 'The hand contains four triplets of consecutive numbers in the same suit.',
    
    // Terminals
    'Mixed Lesser Terminals': 'The hand includes terminal or honor tiles in all sets, but not exclusively.',
    'Pure Lesser Terminals': 'The hand includes terminal tiles in all sets (no honors), but not exclusively.',
    'Mixed Greater Terminals': 'Every set in the hand is comprised entirely of terminal or honor tiles.',
    'Pure Greater Terminals': 'Every set in the hand is comprised entirely of terminal tiles (no honors).',
    
    // Irregular Patterns
    'Thirteen Terminals': 'The hand consists of 1 and 9 of each suit, all honors, and one duplicate.',
    'Seven Pairs': 'The hand consists of seven distinct pairs.'
  };

  // Convert handCategories object to array for easier pagination with descriptions
  const categoryList = Object.keys(handCategories).map(category => ({
    title: category,
    hands: handCategories[category].map(hand => {
      const { index, name } = splitHandName(hand);
      const baseName = getBaseHandName(hand);
      const score = handScores[baseName] || handScores[name] || 0;
      const description = handDescriptions[baseName] || handDescriptions[name] || '';
      
      return {
        fullName: hand,
        displayName: name || hand,
        score: score,
        description: description
      };
    })
  }));
  
  const nextCategory = () => {
    setCurrentCategory((prev) => (prev + 1) % categoryList.length);
  };
  
  const prevCategory = () => {
    setCurrentCategory((prev) => (prev - 1 + categoryList.length) % categoryList.length);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <Head>
        <title>Zung Jung Score-Tracker</title>
        <meta name="description" content="Mahjong application" />
        {/* Enhanced favicon support */}
        <link rel="icon" href="/favicon.ico?v=1" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico?v=1" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <meta name="theme-color" content="#FF0000" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      
      {/* Background video with Safari compatibility */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-[100dvh] object-cover z-0"
      >
        <source src="/coffee.mp4" type="video/mp4" />
        {/* Add WebM format for better compatibility */}
        {/* <source src="/coffee.webm" type="video/webm" /> */}
        Your browser does not support the video tag.
      </video>
      
      <div className="flex items-center justify-center w-full absolute inset-0">
        {gameStarted ? (
          <>
            <ScoreCard />
            <button
              onClick={() => setShowHandGuide(true)}
              className="absolute top-0 md:top-12 right-auto left-1/2 -translate-x-1/2 bg-[#9b221c] hover:bg-[#8a1e19] text-[#f0e6d2] font-bold py-2 px-3 md:py-4 md:px-8 rounded-xl
          border-2 border-[#d6c8a9] shadow-lg flex items-center justify-center gap-3
          transition-colors duration-200 fredericka-the-great-regular" 
              style={{
                boxShadow: "0 4px 10px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)"
              }}>
              Hand Guide
            </button>
            {showHandGuide && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="bg-amber-100 p-6 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-[500px] max-h-[90vh] overflow-y-auto border-4 border-[#9b221c] 
                  relative bg-[url('/tile-texture.png')] bg-repeat"
                  style={{
                    boxShadow: "inset 0 0 30px rgba(0,0,0,0.2)"
                  }}
                >
                  <button
                    onClick={() => setShowHandGuide(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                  >
                    ✖
                  </button>
                  
                  <div className="text-2xl font-bold mb-4 text-center text-[#9b221c]">
                    {categoryList[currentCategory].title}
                  </div>
                  
                  <ul className="list-none space-y-4 my-6">
                    {categoryList[currentCategory].hands.map((hand, index) => (
                      <li key={index} className="border-b border-amber-200 pb-3">
                        <div className="flex justify-between">
                          <div className="font-bold text-lg">{hand.displayName}</div>
                          <div className="font-bold text-[#9b221c]">{hand.score} pts</div>
                        </div>
                        {hand.description && (
                          <div className="text-gray-800 mt-1 text-sm">{hand.description}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex justify-between mt-6">
                    <button 
                      onClick={prevCategory}
                      className="bg-[#9b221c] text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
                    >
                      ← Previous
                    </button>
                    
                    <div className="flex space-x-1 items-center">
                      <span className="text-sm text-gray-700">
                        {currentCategory + 1} / {categoryList.length}
                      </span>
                    </div>
                    
                    <button 
                      onClick={nextCategory}
                      className="bg-[#9b221c] text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col justify-between h-[100dvh] w-full">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center backdrop-blur-sm rounded-3xl p-4 md:p-8 shadow-3xl max-w-md mx-auto bg-black/60 my-4">
                <button
                  onClick={() => setGameStarted(true)}
                  className="bg-red-700 bg-opacity-80 text-white font-bold py-4 md:py-6 px-8 md:px-12 rounded-2xl text-5xl md:text-7xl transition-transform duration-200 transform hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-lg shiny-button"
                  style={{ textShadow: '2px 2px 4px rgba(255, 255, 0, 0.8)' }}
                >
                  中庸麻雀
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-t from-black to-black/0 py-3 md:py-6 text-center text-white z-10">
              <div className="container mx-auto max-w-3xl px-2 md:px-4">
                <div className="flex justify-center items-center space-x-4 md:space-x-10">
                  <a
                    href="https://zj-mahjong.info/zj33_patterns_eng.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-xs md:text-sm text-gray-300 group-hover:text-yellow-400">Zung Jung</span>
                    <span className="text-sm md:text-base font-medium underline decoration-dotted underline-offset-2 group-hover:text-yellow-400 group-hover:decoration-yellow-400">
                      Mahjong Guide
                    </span>
                  </a>
                  <a
                    href="https://buymeacoffee.com/aeryngrindk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-xs md:text-sm text-gray-300 group-hover:text-yellow-400">Buy Me a</span>
                    <span className="text-sm md:text-base font-medium underline decoration-dotted underline-offset-2 group-hover:text-yellow-400 group-hover:decoration-yellow-400">
                      Cup of Coffee
                    </span>
                  </a>
                </div>
                <p className="text-xs text-gray-400 mt-2 md:mt-5 font-light">
                  Made with ❤️ by OrkoTheMage
                </p>
                <div className="mt-1 md:mt-2 text-xs md:text-sm text-gray-400 font-light">
                  Trans Pride! 
                  <svg className="inline-block w-4 md:w-5 h-2 md:h-3 align-text-bottom ml-1 md:ml-2 mb-0.5" viewBox="0 0 800 480">
                    <rect fill="#5BCEFA" width="800" height="480" />
                    <rect fill="#F5A9B8" width="800" height="288" y="96" />
                    <rect fill="#FFFFFF" width="800" height="96" y="192" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shiny {
          0% {
            background-position: -200%;
          }
          100% {
            background-position: 200%;
          }
        }

        .shiny-button {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.2) 25%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0.2) 75%
          );
          background-size: 200%;
          animation: shiny 2s infinite;
        }
      `}</style>
    </div>
  )
}