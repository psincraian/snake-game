'use client'

import { useGameLogic } from '@/app/components/game-board'
import { useCallback, useEffect } from 'react';
import { Controls } from './components/controls';
import { Leaderboard } from './components/leaderboard';

export default function Home() {
  const {
    canvasRef,
    gameState,
    score,
    startGame,
    resetGame,
    setDirection
  } = useGameLogic();

  const handleStart = useCallback(() => {
    if (gameState === 'GAME_OVER') {
      resetGame();
    }
    startGame();
  }, [resetGame, startGame, gameState]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleStart();
    }
  }, [handleStart]);
  

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.focus();
      canvasRef.current.addEventListener('keydown', (event) => handleKeyDown(event));
    }
  }, [canvasRef, gameState, handleKeyDown]);


  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-white mt-8 mb-4">Snake Game</h1>
      <div className="mt-4 text-xl font-bold text-white text-snake">
        Score: {score}
      </div>
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
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 space-y-4 rounded-lg overflow-y-auto">
            <h2 className="text-3xl font-bold text-red-500">Game Over!</h2>
            <p className="text-xl text-white">Final Score: {score}</p>

            <Leaderboard score={score} />

            <button
              onClick={handleStart}
              className="px-6 py-2 bg-snake hover:bg-green-600 text-white rounded-lg mt-4"
            >
              Play Again (Enter)
            </button>
          </div>
        )}
      </div>

      <Controls onDirectionChange={setDirection} />
    </main>
  )
}