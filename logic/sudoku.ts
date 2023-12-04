// Cells to fill in the board
export const emptyCellCount = 30;

// Function to check if a value can be placed in a given cell
const isValid = (
  board: number[][],
  row: number,
  col: number,
  num: number,
): boolean => {
  // Check if the number is already in the same row or column
  for (let i = 0; i < 9; i++) {
    if (board[row]![i] === num || board[i]![col] === num) {
      return false;
    }
  }

  // Check if the number is already in the 3x3 subgrid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i]![j] === num) {
        return false;
      }
    }
  }

  return true;
};

// Function to solve the Sudoku puzzle using backtracking
const solveSudoku = (board: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row]![col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row]![col] = num;

            if (solveSudoku(board)) {
              return true;
            }

            board[row]![col] = 0;
          }
        }

        return false;
      }
    }
  }

  return true; // All cells filled
};

export const generateSolvedSudoku = (): number[][] => {
  const board: number[][] = [];

  // Initialize the board with empty places
  for (let i = 0; i < 9; i++) {
    board.push(Array<number>(9).fill(0));
  }

  // Solve the board
  solveSudoku(board);

  return board;
};

export const generateSudoku = (
  emptyCells: number,
  solvedBoard: number[][],
): [cellsToFill: { row: number; col: number }[], board: number[][]] => {
  const cellsToFill: { row: number; col: number }[] = [];
  // Randomly remove numbers to create the desired number of empty cells
  for (let i = 0; i < emptyCells; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (solvedBoard[row]![col] !== 0) {
      solvedBoard[row]![col] = 0;
      cellsToFill.push({ row, col });
    } else {
      // If the cell is already empty, try again
      i--;
    }
  }

  return [cellsToFill, solvedBoard];
};

export const checkBoard = (sudokuBoard: number[][]): boolean => {
  // Check if the board is valid
  for (let row = 0; row < 9; row++) {
    const rowSet = new Set<number>();
    for (let col = 0; col < 9; col++) {
      const digit = sudokuBoard[row]![col] as number;
      if (digit === 0 || rowSet.has(digit)) {
        return false;
      }
      rowSet.add(digit);
    }
  }

  // Check rows
  for (let row = 0; row < 9; row++) {
    const rowSet = new Set<number>();
    for (let col = 0; col < 9; col++) {
      const digit = sudokuBoard[row]![col] as number;
      if (digit === 0 || rowSet.has(digit)) {
        return false;
      }
      rowSet.add(digit);
    }
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const colSet = new Set<number>();
    for (let row = 0; row < 9; row++) {
      const digit = sudokuBoard[row]![col] as number;
      if (digit === 0 || colSet.has(digit)) {
        return false;
      }
      colSet.add(digit);
    }
  }

  // Check 3x3 grids
  for (let gridRow = 0; gridRow < 3; gridRow++) {
    for (let gridCol = 0; gridCol < 3; gridCol++) {
      const gridSet = new Set<number>();
      for (let row = gridRow * 3; row < gridRow * 3 + 3; row++) {
        for (let col = gridCol * 3; col < gridCol * 3 + 3; col++) {
          const digit = sudokuBoard[row]![col] as number;
          if (digit === 0 || gridSet.has(digit)) {
            return false;
          }
          gridSet.add(digit);
        }
      }
    }
  }

  return true;
};
