import { useEffect, useCallback, useRef, useState } from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };
type GameState = 'START' | 'PLAYING' | 'GAME_OVER';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

export const useGameLogic = () => {
    const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Position>({ x: 15, y: 15 });
    const [direction, setDirection] = useState<Direction>('RIGHT');
    const [gameState, setGameState] = useState<GameState>('START');
    const [score, setScore] = useState(0);
    const [speed, setSpeed] = useState(INITIAL_SPEED);
    const gameLoopRef = useRef<NodeJS.Timeout>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Memoize generateFood properly
    const generateFood = useCallback(() => ({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    }), []);

    // Memoize checkCollision with dependencies
    const checkCollision = useCallback((head: Position) => {
        return head.x < 0 || head.x >= GRID_SIZE ||
            head.y < 0 || head.y >= GRID_SIZE ||
            snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
    }, [snake]);

    // Memoize startGame function
    const startGame = useCallback(() => {
        setGameState('PLAYING');
    }, []);

    // Properly handle dependencies in updateGame
    const updateGame = useCallback(() => {
        if (gameState !== 'PLAYING') return;

        setSnake(prev => {
            const newSnake = [...prev];
            const head = { ...newSnake[0] };

            switch (direction) {
                case 'UP': head.y -= 1; break;
                case 'DOWN': head.y += 1; break;
                case 'LEFT': head.x -= 1; break;
                case 'RIGHT': head.x += 1; break;
            }

            if (checkCollision(head)) {
                setGameState('GAME_OVER');
                return prev;
            }

            newSnake.unshift(head);
            if (head.x === food.x && head.y === food.y) {
                setScore(s => {
                    const newScore = s + 1;
                    if (newScore % 5 === 0) setSpeed(sp => Math.max(50, sp - 20));
                    return newScore;
                });
                setFood(generateFood());
            } else {
                newSnake.pop();
            }
            return newSnake;
        });
    }, [direction, food.x, food.y, gameState, generateFood, checkCollision]);

    // Handle key press with proper dependencies
    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        const keyDirectionMap: { [key: string]: Direction } = {
            ArrowUp: 'UP',
            ArrowDown: 'DOWN',
            ArrowLeft: 'LEFT',
            ArrowRight: 'RIGHT'
        };

        const newDirection = keyDirectionMap[e.key];
        if (newDirection && direction !== oppositeDirection[newDirection]) {
            setDirection(newDirection);
        }
    }, [direction]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    // Fix the cleanup function syntax
    useEffect(() => {
        if (gameState === 'PLAYING') {
            gameLoopRef.current = setInterval(updateGame, speed);
        }
        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
        };
    }, [updateGame, gameState, speed]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cellSize = canvas.width / GRID_SIZE;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#4CAF50' : '#81C784';
            ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize - 1, cellSize - 1);
        });

        // Draw food
        ctx.fillStyle = '#FF5252';
        ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize - 1, cellSize - 1);
    }, [snake, food]);

    useEffect(() => { draw() }, [draw]);

    // Memoize resetGame function
    const resetGame = useCallback(() => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection('RIGHT');
        setScore(0);
        setSpeed(INITIAL_SPEED);
        setFood(generateFood());
        setGameState('START');
    }, [generateFood]);

    return {
        canvasRef,
        gameState,
        score,
        startGame,
        resetGame
    };
};

const oppositeDirection: { [key in Direction]: Direction } = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT'
};