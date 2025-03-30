import Head from 'next/head'
import { useState } from 'react'
import ScoreCard from '../src/components/ScoreCard'

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false)

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
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/coffee.mp4" type="video/mp4" />
        {/* Add WebM format for better compatibility */}
        {/* <source src="/coffee.webm" type="video/webm" /> */}
        Your browser does not support the video tag.
      </video>
      
      <div className="flex items-center justify-center w-full min-h-screen absolute inset-0">
        {gameStarted ? (
          <ScoreCard />
        ) : (
          <div className="text-center bg-black bg-opacity-50 rounded-3xl p-8 shadow-3xl max-w-md mx-auto">
            <button
              onClick={() => setGameStarted(true)}
              className="bg-red-700 bg-opacity-80 text-white font-bold py-6 px-12 rounded-2xl text-6xl transition-transform duration-200 transform active:scale-95 active:translate-y-1 active:shadow-lg shiny-button"
              style={{ textShadow: '2px 2px 4px rgba(255, 255, 0, 0.8)' }}
            >
              中庸麻雀
            </button>
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

      {/* Links appear below the button when game is not started */}
      {!gameStarted && (
        <div className="absolute bottom-10 inset-x-0 bg-black pb-4 bg-opacity-40 text-center text-white z-10">
          <div className="mt-6 space-x-4 flex justify-center">
            <p>
              <a
                href="https://zj-mahjong.info/zj33_patterns_eng.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-sm hover:text-yellow-400"
              >
                <span className="block text-sm">Zung Jung</span>
                Mahjong Guide
              </a>
            </p>
            <p>
              <a
                href="https://buymeacoffee.com/aeryngrindk"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-sm hover:text-yellow-400"
              >
                <span className="block text-sm">Buy Me a</span>
                Cup of Coffee
              </a>
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Made with ❤️ by OrkoTheMage
          </p>
        </div>
      )}
    </div> //test
  )
}