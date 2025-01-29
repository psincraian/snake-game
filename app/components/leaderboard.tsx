import { useState, useEffect } from 'react'

type ScoreEntry = {
  username: string
  score: number
  timestamp: number
}

type LeaderboardType = 'daily' | 'monthly' | 'yearly' | 'allTime'

export const Leaderboard = ({ score }: { score: number }) => {
  const [scores, setScores] = useState<{ [key in LeaderboardType]: ScoreEntry[] }>({
    daily: [],
    monthly: [],
    yearly: [],
    allTime: []
  })
  // In Leaderboard component
  const [username, setUsername] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('snakeUsername') || 'anonymous'
    }
    return 'anonymous'
  })
  const [activeTab, setActiveTab] = useState<LeaderboardType>('allTime')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchScores()
  }, [])

  const fetchScores = async () => {
    const response = await fetch('/api/scores')
    const data = await response.json()
    setScores(data)
  }

  const saveScore = async () => {
    if (!username.trim() || score === 0 || saved) return

    await fetch('/api/scores', {
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
          className="px-4 py-2 bg-snake hover:bg-green-600 rounded text-white"
        >
          Save
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {(['daily', 'monthly', 'yearly', 'allTime'] as const).map((tab) => (
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
        {scores[activeTab].map((entry: ScoreEntry, i) => (
          <div key={i} className="flex justify-between items-center bg-gray-700 p-2 rounded">
            <span className="text-white">{entry.username}</span>
            <span className="text-snake font-bold">{entry.score}</span>
            <span className="text-gray-400 text-sm">
              {new Date(entry.timestamp).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}