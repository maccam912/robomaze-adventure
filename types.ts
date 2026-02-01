
export interface Cell {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
}

export type Point = { x: number; y: number };

export interface GameState {
  level: number;
  gridSize: number;
  isTracing: boolean;
  currentPath: Point[];
  robotPos: Point;
  isMoving: boolean;
  companionMessage: string;
}
