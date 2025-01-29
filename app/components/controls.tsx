import { Direction } from "./game-board";
import { useCallback, useRef, useState } from "react";

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void;
}

export function Controls({ onDirectionChange }: ControlsProps) {
  const [activeDirection, setActiveDirection] = useState<Direction | null>(null);
  const controlRef = useRef<HTMLDivElement>(null);

  const handleTouchMove = useCallback((e: TouchEvent | React.TouchEvent) => {
    if (!controlRef.current) return;

    const touch = 'touches' in e ? e.touches[0] : e;
    const rect = controlRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate angle from center to touch point
    const angle = Math.atan2(
      touch.clientY - centerY,
      touch.clientX - centerX
    ) * 180 / Math.PI;

    // Convert angle to direction
    let newDirection: Direction;
    if (angle >= -45 && angle < 45) newDirection = 'RIGHT';
    else if (angle >= 45 && angle < 135) newDirection = 'DOWN';
    else if (angle >= -135 && angle < -45) newDirection = 'UP';
    else newDirection = 'LEFT';

    if (newDirection !== activeDirection) {
      setActiveDirection(newDirection);
      onDirectionChange(newDirection);
    }
  }, [activeDirection, onDirectionChange]);

  const handleSingleTouch = useCallback((e: TouchEvent | React.TouchEvent) => {
    if (!controlRef.current) return;

    const touch = 'touches' in e ? e.touches[0] : e;
    const rect = controlRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate angle from center to touch point
    const angle = Math.atan2(
      touch.clientY - centerY,
      touch.clientX - centerX
    ) * 180 / Math.PI;

    // Convert angle to direction
    let newDirection: Direction;
    if (angle >= -45 && angle < 45) newDirection = 'RIGHT';
    else if (angle >= 45 && angle < 135) newDirection = 'DOWN';
    else if (angle >= -135 && angle < -45) newDirection = 'UP';
    else newDirection = 'LEFT';

    setActiveDirection(newDirection);
    onDirectionChange(newDirection);
  }, [onDirectionChange]);

  const handleTouchEnd = useCallback(() => {
    setActiveDirection(null);
  }, []);

  return (
    <div
      ref={controlRef}
      className="lg:hidden relative w-48 h-48 mx-auto mt-8"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleSingleTouch}
    >
      <div className="absolute inset-0 rounded-full bg-gray-800/50 border-2 border-snake/30">
        {/* Up */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center
          ${activeDirection === 'UP' ? 'text-snake' : 'text-white/70'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
        {/* Left */}
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center
          ${activeDirection === 'LEFT' ? 'text-snake' : 'text-white/70'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        {/* Right */}
        <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center
          ${activeDirection === 'RIGHT' ? 'text-snake' : 'text-white/70'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        {/* Down */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center
          ${activeDirection === 'DOWN' ? 'text-snake' : 'text-white/70'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {/* Center indicator */}
        <div className="absolute inset-1/4 rounded-full bg-snake/20 border border-snake/30" />
      </div>
    </div>
  );
}