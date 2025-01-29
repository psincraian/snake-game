import { useState, useEffect, useCallback } from 'react'
import { LeaderboardItem } from '../api/leaderboard/top/route'

type LeaderboardType = 'daily' | 'monthly' | 'yearly'

export const Leaderboard = ({ score }: { score: number }) => {
  const [scores, setScores] = useState<LeaderboardItem[] >([])
  // In Leaderboard component
  const [username, setUsername] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('snakeUsername') || 'anonymous'
    }
    return 'anonymous'
  })
  const [activeTab, setActiveTab] = useState<LeaderboardType>('daily')
  const [saved, setSaved] = useState(false)
  
  const fetchScores = useCallback(async () => {
    const response = await fetch('/api/leaderboard/top?timeFrame=' + activeTab)
    const data = await response.json()
    setScores(data.data)
  }, [activeTab])
  
  // Update useEffect dependency array
  useEffect(() => {
    fetchScores()
  }, [saved, activeTab, fetchScores])

  const saveScore = async () => {
    if (!username.trim() || score === 0 || saved) return

    await fetch('/api/leaderboard/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim(), score })
    })

    setSaved(true)
    await fetchScores()
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value
    setUsername(newUsername)
    localStorage.setItem('snakeUsername', newUsername)
  }

  return (
    <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-white">Leaderboard</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => handleUsernameChange(e)}
          className="flex-1 p-2 rounded bg-gray-700 text-white"
        />
        <button
          onClick={saveScore}
          className="px-4 py-2 bg-snake bg-green-600 hover:bg-green-700 rounded text-white"
        >
          Save
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {(['daily', 'monthly', 'yearly'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded ${activeTab === tab ? 'bg-snake text-white' : 'bg-gray-700 text-gray-300'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {scores.map((entry: LeaderboardItem, i) => (
          <div key={i} className="flex justify-between items-center bg-gray-700 p-2 rounded">
            <span className="text-white">{entry.username}</span>
            <span className="text-snake font-bold">{entry.score}</span>
            <span className="text-gray-400 text-sm">
              {new Date(entry.datetime).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}