import { Direction } from "./game-board";

type ControlsProps = {
  onDirectionChange: (dir: Direction) => void;
};

export const Controls = ({ onDirectionChange }: ControlsProps) => {
  return (
    <div className="mobile-controls">
      <button onClick={() => onDirectionChange('UP')}>↑</button>
      <button onClick={() => onDirectionChange('LEFT')}>←</button>
      <button onClick={() => onDirectionChange('DOWN')}>↓</button>
      <button onClick={() => onDirectionChange('RIGHT')}>→</button>
    </div>
  );
};