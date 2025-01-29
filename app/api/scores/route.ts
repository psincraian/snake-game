import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function GET() {
  const allTimeScores = await kv.zrange('scores:all', 0, 100, { rev: true })
  const dailyScores = await kv.zrange(`scores:day:${getDateKey()}`, 0, 100, { rev: true })
  const monthlyScores = await kv.zrange(`scores:month:${getMonthKey()}`, 0, 100, { rev: true })
  const yearlyScores = await kv.zrange(`scores:year:${new Date().getFullYear()}`, 0, 100, { rev: true })

  return NextResponse.json({
    allTime: allTimeScores,
    daily: dailyScores,
    monthly: monthlyScores,
    yearly: yearlyScores
  })
}

export async function POST(request: Request) {
  const { username, score } = await request.json()
  const timestamp = Date.now()
  const entry = JSON.stringify({ username, score, timestamp })

  // Add to all time leaderboard
  await kv.zadd('scores:all', { score, member: entry })
  
  // Add to daily leaderboard
  await kv.zadd(`scores:day:${getDateKey()}`, { score, member: entry })
  
  // Add to monthly leaderboard
  await kv.zadd(`scores:month:${getMonthKey()}`, { score, member: entry })
  
  // Add to yearly leaderboard
  await kv.zadd(`scores:year:${new Date().getFullYear()}`, { score, member: entry })

  return NextResponse.json({ success: true })
}

function getDateKey(): string {
  const date = new Date()
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

function getMonthKey(): string {
  const date = new Date()
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
}