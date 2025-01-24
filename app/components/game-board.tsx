import { useState, useCallback, useEffect, useRef } from 'react'

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Position = { x: number; y: number }
type GameState = 'START' | 'PLAYING' | 'GAME_OVER'

const GRID_SIZE = 20
const INITIAL_SPEED = 150

export const useGameLogic = () => {
    const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
    const [food, setFood] = useState<Position>({ x: 15, y: 15 })
    const [direction, setDirection] = useState<Direction>('RIGHT')
    const [gameState, setGameState] = useState<GameState>('START')
    const [score, setScore] = useState(0)
    const [speed, setSpeed] = useState(INITIAL_SPEED)
    const gameLoop = useRef<NodeJS.Timeout>()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const touchStart = useRef<{ x: number; y: number } | null>(null)

    const generateFood = useCallback(() => ({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    }), [])

    const checkCollision = useCallback((head: Position) => {
        return head.x < 0 || head.x >= GRID_SIZE ||
            head.y < 0 || head.y >= GRID_SIZE ||
            snake.some((seg, i) => i > 0 && seg.x === head.x && seg.y === head.y)
    }, [snake])

    const startGame = () => setGameState('PLAYING');
    const resetGame = useCallback(() => {
        setSnake([{ x: 10, y: 10 }])
        setDirection('RIGHT')
        setScore(0)
        setSpeed(INITIAL_SPEED)
        setFood(generateFood())
        setGameState('START')
    }, [])

    const updateGame = useCallback(() => {
        if (gameState !== 'PLAYING') return

        setSnake(prev => {
            const newSnake = [...prev]
            const head = { ...newSnake[0] }

            switch (direction) {
                case 'UP': head.y--; break
                case 'DOWN': head.y++; break
                case 'LEFT': head.x--; break
                case 'RIGHT': head.x++; break
            }

            if (checkCollision(head)) {
                setGameState('GAME_OVER')
                return prev
            }

            newSnake.unshift(head)
            if (head.x === food.x && head.y === food.y) {
                setScore(s => {
                    const newScore = s + 1
                    if (newScore % 5 === 0) setSpeed(sp => Math.max(50, sp - 20))
                    return newScore
                })
                setFood(generateFood())
            } else {
                newSnake.pop()
            }
            return newSnake
        })
    }, [direction, food.x, food.y, gameState, checkCollision, generateFood])

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        // Existing direction handling
        const directions: Record<string, Direction> = {
            ArrowUp: 'UP',
            ArrowDown: 'DOWN',
            ArrowLeft: 'LEFT',
            ArrowRight: 'RIGHT'
        };

        if (directions[e.key]) {
            const newDir = directions[e.key];
            if (newDir && direction !== oppositeDirection[newDir]) {
                setDirection(newDir);
            }
        }
        // Add Enter key handling
        else if (e.key === 'Enter') {
            if (gameState === 'START') {
                startGame();
            } else if (gameState === 'GAME_OVER') {
                resetGame();
                startGame();
            }
        }
    }, [direction, gameState, startGame, resetGame]);

    const handleTouch = useCallback((e: TouchEvent) => {
        e.preventDefault()
        if (!touchStart.current) return

        const touch = e.touches[0]
        const deltaX = touch.clientX - touchStart.current.x
        const deltaY = touch.clientY - touchStart.current.y
        const absX = Math.abs(deltaX)
        const absY = Math.abs(deltaY)

        if (Math.max(absX, absY) < 10) return // Dead zone

        let newDir: Direction | null = null
        if (absX > absY) {
            newDir = deltaX > 0 ? 'RIGHT' : 'LEFT'
        } else {
            newDir = deltaY > 0 ? 'DOWN' : 'UP'
        }

        if (newDir && direction !== oppositeDirection[newDir]) {
            setDirection(newDir)
        }
        touchStart.current = null
    }, [direction])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)
        document.addEventListener('touchstart', (e) => {
            touchStart.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            }
        })
        document.addEventListener('touchmove', handleTouch, { passive: false })

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
            document.removeEventListener('touchstart', () => touchStart.current = null)
            document.removeEventListener('touchmove', handleTouch)
        }
    }, [handleKeyPress, handleTouch])

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx) return

        const draw = () => {
            const cellSize = ctx.canvas.width / GRID_SIZE
            ctx.fillStyle = '#1a1a1a'
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

            // Draw snake
            snake.forEach((seg, i) => {
                ctx.fillStyle = i === 0 ? '#4CAF50' : '#81C784'
                ctx.fillRect(seg.x * cellSize, seg.y * cellSize, cellSize - 1, cellSize - 1)
            })

            // Draw food
            ctx.fillStyle = '#FF5252'
            ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize - 1, cellSize - 1)
        }

        draw()
    }, [snake, food])

    useEffect(() => {
        if (gameState === 'PLAYING') {
            gameLoop.current = setInterval(updateGame, speed)
        }
        return () => { gameLoop.current && clearInterval(gameLoop.current) }
    }, [gameState, speed, updateGame])

    return {
        canvasRef,
        gameState,
        score,
        startGame: () => setGameState('PLAYING'),
        resetGame: () => {
            setSnake([{ x: 10, y: 10 }])
            setDirection('RIGHT')
            setScore(0)
            setSpeed(INITIAL_SPEED)
            setFood(generateFood())
            setGameState('START')
        }
    }
}

const oppositeDirection: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT'
}