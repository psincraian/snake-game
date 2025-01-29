import { Direction } from "./game-board";

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void;
}

export function Controls({ onDirectionChange }: ControlsProps) {
  return (
    <div className="lg:hidden grid grid-cols-2 gap-2 w-full max-w-[320px] mx-auto mt-4 px-2">
      <button 
        className="aspect-square bg-snake/20 rounded-lg active:bg-snake/40 transition-colors"
        onClick={() => onDirectionChange('UP')}
        aria-label="Up"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <button 
        className="aspect-square bg-snake/20 rounded-lg active:bg-snake/40 transition-colors"
        onClick={() => onDirectionChange('LEFT')}
        aria-label="Left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        className="aspect-square bg-snake/20 rounded-lg active:bg-snake/40 transition-colors"
        onClick={() => onDirectionChange('DOWN')}
        aria-label="Down"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <button 
        className="aspect-square bg-snake/20 rounded-lg active:bg-snake/40 transition-colors"
        onClick={() => onDirectionChange('RIGHT')}
        aria-label="Right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}