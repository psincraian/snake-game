"use client";

import { Leaderboard } from '@/app/components/leaderboard';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LeaderboardPage() {
    const router = useRouter();
    const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);
    const [countdown, setCountdown] = useState(5);
    const [isCountdownActive, setIsCountdownActive] = useState(true);

    useEffect(() => {
        if (!isCountdownActive) return;

        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        inactivityTimeout.current = setTimeout(() => {
            router.push('/');
        }, 5000);

        return () => {
            clearInterval(interval);
            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current);
            }
        };
    }, [router, isCountdownActive]);

    const handleStartNewGame = () => {
        if (inactivityTimeout.current) {
            clearTimeout(inactivityTimeout.current);
        }
        router.push('/');
    };

    const handleCancelCountdown = () => {
        if (inactivityTimeout.current) {
            clearTimeout(inactivityTimeout.current);
        }
        setIsCountdownActive(false);
    };

    return (
        <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold text-white mt-8 mb-4">Leaderboard</h1>
            <div className="flex w-full max-w-md space-x-4 mb-4">
                <button
                    onClick={handleCancelCountdown}
                    className="flex-1 px-6 py-2 border-red-700 border-2 hover:bg-red-700 text-white rounded-lg"
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
            <Leaderboard score={0} cancelCountdown={handleCancelCountdown} />
        </main>
    );
}