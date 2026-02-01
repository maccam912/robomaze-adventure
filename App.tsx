
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bot, Trophy, RefreshCw, Sparkles, Wand2 } from 'lucide-react';
import { generateMaze } from './utils/mazeGenerator';
import { Cell, Point } from './types';
import Robot from './components/Robot';

const INITIAL_GRID_SIZE = 8;
const MAX_GRID_SIZE = 12;

const START_MESSAGES = [
  "Bleep Bloop! Let's solve this!",
  "Ready for a new puzzle?",
  "Let's find the flag together!",
  "New maze, same cool robot!",
  "I'm ready when you are!"
];

const WIN_MESSAGES = [
  "Bleep! We did it!",
  "You're a maze master!",
  "High five! That was fun!",
  "Amazing! Let's do another!",
  "Success! I love this game!"
];

const TIP_MESSAGES = [
  "Robots love the color blue! 🤖",
  "Try to look ahead for the exit!",
  "You can always trace backward too!",
  "Chip says: You're doing great!",
  "Bleep! Mazes are logic puzzles."
];

const App: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [level, setLevel] = useState(1);
  const [robotPos, setRobotPos] = useState<Point>({ x: 0, y: 0 });
  const [currentPath, setCurrentPath] = useState<Point[]>([{ x: 0, y: 0 }]);
  const [isTracing, setIsTracing] = useState(false);
  const [companionMsg, setCompanionMsg] = useState("Bleep Bloop! Let's play!");
  const [hasWon, setHasWon] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const initLevel = useCallback((lvl: number) => {
    // Generate maze algorithmically - instant
    const size = Math.min(INITIAL_GRID_SIZE + Math.floor((lvl - 1) / 2), MAX_GRID_SIZE);
    const newMaze = generateMaze(size, size);
    
    setGrid(newMaze);
    setRobotPos({ x: 0, y: 0 });
    setCurrentPath([{ x: 0, y: 0 }]);
    setHasWon(false);
    
    // Pick a random local message
    const randomMsg = START_MESSAGES[Math.floor(Math.random() * START_MESSAGES.length)];
    setCompanionMsg(randomMsg);
  }, []);

  useEffect(() => {
    initLevel(level);
  }, [level, initLevel]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (hasWon) return;
    setIsTracing(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isTracing || !containerRef.current || hasWon) return;

    const rect = containerRef.current.getBoundingClientRect();
    const cellSize = rect.width / grid.length;
    
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    if (x < 0 || y < 0 || x >= grid.length || y >= grid.length) return;

    const lastPoint = currentPath[currentPath.length - 1];
    
    if (x !== lastPoint.x || y !== lastPoint.y) {
      const dx = x - lastPoint.x;
      const dy = y - lastPoint.y;
      
      if (Math.abs(dx) + Math.abs(dy) === 1) {
        const currentCell = grid[lastPoint.y][lastPoint.x];
        let canMove = false;
        
        if (dx === 1 && !currentCell.walls.right) canMove = true;
        if (dx === -1 && !currentCell.walls.left) canMove = true;
        if (dy === 1 && !currentCell.walls.bottom) canMove = true;
        if (dy === -1 && !currentCell.walls.top) canMove = true;

        if (canMove) {
          if (currentPath.length > 1 && currentPath[currentPath.length - 2].x === x && currentPath[currentPath.length - 2].y === y) {
            const newPath = [...currentPath];
            newPath.pop();
            setCurrentPath(newPath);
            setRobotPos({ x, y });
          } else {
            const alreadyInPath = currentPath.some(p => p.x === x && p.y === y);
            if (!alreadyInPath) {
              const newPath = [...currentPath, { x, y }];
              setCurrentPath(newPath);
              setRobotPos({ x, y });
              
              if (x === grid.length - 1 && y === grid.length - 1) {
                handleWin();
              }
            }
          }
        }
      }
    }
  };

  const handlePointerUp = () => {
    setIsTracing(false);
  };

  const handleWin = () => {
    setHasWon(true);
    setIsTracing(false);
    const randomMsg = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
    setCompanionMsg(randomMsg);
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
  };

  const getTip = () => {
    const randomTip = TIP_MESSAGES[Math.floor(Math.random() * TIP_MESSAGES.length)];
    setCompanionMsg(randomTip);
  };

  if (grid.length === 0) return null;

  const cellSize = 100 / grid.length;

  return (
    <div className="flex flex-col h-screen max-h-screen bg-sky-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white px-4 py-3 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Bot className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-blue-900 tracking-tight">RoboMaze</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase font-bold text-blue-400">Level</span>
            <span className="text-xl font-black text-blue-600 leading-none">{level}</span>
          </div>
          <button 
            onClick={() => initLevel(level)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 active:rotate-180 duration-500"
            title="Reset Level"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      {/* Companion Area */}
      <div className="px-4 py-3 flex items-start gap-3 bg-blue-100/50 border-b border-blue-100 shrink-0">
        <div className="bg-white p-2 rounded-xl shadow-sm border border-blue-200">
          <Sparkles className="text-yellow-500" size={20} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-800 italic">
            "{companionMsg}"
          </p>
        </div>
        <button 
          onClick={getTip}
          className="bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm border border-blue-100 active:scale-95 transition-transform"
        >
          Chip's Tip
        </button>
      </div>

      {/* Game Board */}
      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <div 
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative aspect-square w-full max-w-[min(90vw,600px)] bg-white rounded-2xl shadow-xl border-8 border-white overflow-hidden touch-none select-none"
        >
          {/* Maze Grid */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Draw Visited Path */}
            <polyline
              points={currentPath.map(p => `${p.x * cellSize + cellSize/2},${p.y * cellSize + cellSize/2}`).join(' ')}
              fill="none"
              stroke="#93C5FD"
              strokeWidth={cellSize * 0.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-50"
            />
            
            {/* Goal Marker */}
            <rect 
              x={(grid.length - 1) * cellSize + 5} 
              y={(grid.length - 1) * cellSize + 5} 
              width={cellSize - 10} 
              height={cellSize - 10} 
              rx={cellSize * 0.15}
              fill="#FDE68A"
              className="animate-pulse"
            />
            <text 
              x={(grid.length - 1) * cellSize + cellSize/2} 
              y={(grid.length - 1) * cellSize + cellSize/2 + 2} 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontSize={cellSize * 0.5}
            >
              🏁
            </text>

            {/* Grid Lines/Walls */}
            {grid.map((row, y) => row.map((cell, x) => (
              <g key={`${x}-${y}`}>
                {cell.walls.top && <line x1={x * cellSize} y1={y * cellSize} x2={(x + 1) * cellSize} y2={y * cellSize} stroke="#1E3A8A" strokeWidth="1" strokeLinecap="round" />}
                {cell.walls.right && <line x1={(x + 1) * cellSize} y1={y * cellSize} x2={(x + 1) * cellSize} y2={(y + 1) * cellSize} stroke="#1E3A8A" strokeWidth="1" strokeLinecap="round" />}
                {cell.walls.bottom && <line x1={x * cellSize} y1={(y + 1) * cellSize} x2={(x + 1) * cellSize} y2={(y + 1) * cellSize} stroke="#1E3A8A" strokeWidth="1" strokeLinecap="round" />}
                {cell.walls.left && <line x1={x * cellSize} y1={y * cellSize} x2={x * cellSize} y2={(y + 1) * cellSize} stroke="#1E3A8A" strokeWidth="1" strokeLinecap="round" />}
              </g>
            )))}

            {/* Robot Positioning */}
            <foreignObject 
              x={robotPos.x * cellSize} 
              y={robotPos.y * cellSize} 
              width={cellSize} 
              height={cellSize}
              style={{ transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              <div className="w-full h-full flex items-center justify-center p-1">
                <Robot size="100%" />
              </div>
            </foreignObject>
          </svg>

          {/* Winning Overlay */}
          {hasWon && (
            <div className="absolute inset-0 bg-blue-600/90 flex flex-col items-center justify-center text-white p-6 animate-in fade-in zoom-in duration-300">
              <div className="bg-yellow-400 p-4 rounded-full mb-4 animate-bounce">
                <Trophy size={48} className="text-blue-900" />
              </div>
              <h2 className="text-3xl font-black mb-2">Maze Solved!</h2>
              <p className="text-center text-blue-100 mb-6 font-medium">Great job! Chip reached the goal.</p>
              <button 
                onClick={nextLevel}
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-xl shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
              >
                Next Level <Wand2 size={24} />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Instructions */}
      <footer className="p-6 bg-white shrink-0 text-center">
        {!hasWon && (
          <div className="flex flex-col items-center gap-1">
            <p className="text-blue-900 font-bold text-lg">Trace the path!</p>
            <p className="text-gray-500 text-sm">Use your finger to guide Chip to the flag</p>
          </div>
        )}
        {hasWon && <div className="h-[28px]" />}
      </footer>
    </div>
  );
};

export default App;
