'use client'

import { useGameLogic } from '@/app/components/game-board'
import { Leaderboard } from '@/app/components/leaderboard'
import { useEffect } from 'react';

export default function Home() {
  const {
    canvasRef,
    gameState,
    score,
    startGame,
    resetGame
  } = useGameLogic();

    // Auto-focus container for keyboard events
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  }, [canvasRef, gameState]);

  const handleStart = () => {
    if (gameState === 'GAME_OVER') {
      resetGame();
    }
    startGame();
  };

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-white mt-8 mb-4">Snake Game</h1>
      
      <div className="relative w-full max-w-lg">
      <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full aspect-square bg-gray-800 rounded-lg shadow-xl"
          tabIndex={0} // Make canvas focusable
        />

        {gameState === 'START' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <button
              onClick={handleStart}
              className="px-8 py-3 text-xl bg-snake hover:bg-green-600 text-white rounded-lg shadow-lg"
            >
              Start Game (Enter)
            </button>
          </div>
        )}

        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 space-y-4 rounded-lg">
            {/* ... existing game over content ... */}
            <button
              onClick={handleStart}
              className="px-6 py-2 bg-snake hover:bg-green-600 text-white rounded-lg"
            >
              Play Again (Enter)
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-xl font-bold text-snake">
        Score: {score}
      </div>

      <footer className="mt-8 text-gray-400">
        <a
          href="https://github.com/yourusername/snake-game"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          View Source Code ↗
        </a>
      </footer>
    </main>
  )
}