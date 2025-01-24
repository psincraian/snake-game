import { useState, useEffect } from 'react'

type ScoreEntry = { username: string; score: number; date: string }

export const Leaderboard = ({ score }: { score: number }) => {
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [username, setUsername] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('snakeScores')
    setScores(saved ? JSON.parse(saved) : [])
  }, [])

  const saveScore = () => {
    if (!username.trim() || score === 0) return

    const newEntry = {
      username: username.trim(),
      score,
      date: new Date().toISOString()
    }

    const updated = [...scores, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    localStorage.setItem('snakeScores', JSON.stringify(updated))
    setScores(updated)
    setUsername('')
  }

  return (
    <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
      
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700 text-white"
        />
        <button
          onClick={saveScore}
          className="px-4 py-2 bg-snake hover:bg-green-600 rounded text-white"
        >
          Save
        </button>
      </div>

      <div className="space-y-2">
        {scores.map((entry, i) => (
          <div key={i} className="flex justify-between items-center bg-gray-700 p-2 rounded">
            <span className="text-white">{entry.username}</span>
            <span className="text-snake font-bold">{entry.score}</span>
            <span className="text-gray-400 text-sm">
              {new Date(entry.date).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}