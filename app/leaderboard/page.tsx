"use client";

import { Leaderboard } from '@/app/components/leaderboard';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LeaderboardPage() {
    const router = useRouter();
    const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);
    const [countdown, setCountdown] = useState(5);
    const [isCountdownActive, setIsCountdownActive] = useState(true);
    const [scoreSaved, setScoreSaved] = useState(false);
    const [storedScore, setStoredScore] = useState<number>(0);
    const [username, setUsername] = useState<string>('anonymous');
  

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const score = localStorage.getItem('snakeGameScore');
          const user = localStorage.getItem('snakeUsername') || 'anonymous';
          if (score) {
            setStoredScore(parseInt(score, 10));
          }
          setUsername(user);
        }
      }, []);

    useEffect(() => {
        if (!isCountdownActive) return;

        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        inactivityTimeout.current = setTimeout(() => {
            if (!scoreSaved) {
                saveScore();
            }
            router.push('/');
        }, 5000);

        return () => {
            clearInterval(interval);
            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current);
            }
        };
    }, [router, isCountdownActive, scoreSaved]);

    const handleStartNewGame = () => {
        if (inactivityTimeout.current) {
            clearTimeout(inactivityTimeout.current);
        }
        saveScore();
        router.push('/');
    };

    const handleCancelCountdown = () => {
        if (inactivityTimeout.current) {
            clearTimeout(inactivityTimeout.current);
        }
        setIsCountdownActive(false);
    };

    const saveScore = async () => {
        if (storedScore && !scoreSaved) {
          await fetch('/api/leaderboard/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, score: storedScore })
          });
          setScoreSaved(true);
        }
      };

    return (
        <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold text-white mt-8 mb-4">Leaderboard</h1>
            <div className="flex w-full max-w-md space-x-4 mb-4">
                <button
                    onClick={handleCancelCountdown}
                    className="flex-1 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                    Cancel Countdown
                </button>
                <button
                    onClick={handleStartNewGame}
                    className="flex-1 px-6 py-2 bg-snake bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                    Start New Game ({countdown})
                </button>
            </div>
            <Leaderboard  score={storedScore} cancelCountdown={handleCancelCountdown} />
        </main>
    );
}