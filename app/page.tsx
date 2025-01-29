'use client'

import { useGameLogic } from '@/app/components/game-board'
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controls } from './components/controls';

export default function Home() {
  const {
    canvasRef,
    gameState,
    score,
    startGame,
    resetGame,
    setDirection
  } = useGameLogic();

  const router = useRouter();

  const handleStart = useCallback(() => {
    if (gameState === 'GAME_OVER') {
      resetGame();
    }
    startGame();
  }, [resetGame, startGame, gameState]);

  useEffect(() => {
    if (gameState === 'GAME_OVER') {
        localStorage.setItem('snakeGameScore', score.toString());
        router.push('/leaderboard');
    }
  }, [gameState, router]);

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
              className="px-6 py-2 bg-snake bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Start Game (Enter)
            </button>
          </div>
        )}
      </div>

      <Controls onDirectionChange={setDirection} />
    </main>
  )
}