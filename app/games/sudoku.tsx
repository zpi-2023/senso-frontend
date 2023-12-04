import { useState } from "react";
import { Alert, Dimensions, TextInput, View } from "react-native"; // eslint-disable-line senso-import-sources
import { Button, Text } from "react-native-paper";

const screen = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

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

const generateSolvedSudoku = (): number[][] => {
  const board: number[][] = [];

  // Initialize the board with empty places
  for (let i = 0; i < 9; i++) {
    board.push(Array<number>(9).fill(0));
  }

  // Solve the board
  solveSudoku(board);

  return board;
};

const generateSudoku = (
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

const calculateBorder = (rowIndex: number, colIndex: number) => {
  let borderStyle = {};

  if (rowIndex >= 0 && rowIndex <= 7) {
    borderStyle = {
      ...borderStyle,
      borderBottomWidth: rowIndex === 2 || rowIndex === 5 ? 2 : 1,
    };
  }

  if (colIndex >= 0 && colIndex <= 7) {
    borderStyle = {
      ...borderStyle,
      borderRightWidth: colIndex === 2 || colIndex === 5 ? 2 : 1,
    };
  }

  return borderStyle;
};

const checkBoard = (sudokuBoard: number[][]): boolean => {
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

const emptyCellCount = 3;

const SudokuGame = () => {
  const [solvedBoard] = useState<number[][]>(() => generateSolvedSudoku());
  const [[cellsToFill, board], setBoard] = useState<
    [cellsToFill: { row: number; col: number }[], board: number[][]]
  >(() => generateSudoku(emptyCellCount, solvedBoard));

  // Function to handle digit input
  const handleDigitInput = (row: number, col: number, value: number) => {
    if (value < 1 || value > 9) {
      return;
    }

    setBoard((prevBoard) => {
      const newBoard = [...prevBoard[1]];
      newBoard[row]![col] = value;
      return [prevBoard[0], newBoard];
    });
  };

  const showResult = () => {
    const result = checkBoard(board);
    Alert.alert(result ? "You solved it!" : "Continue trying!", "", [
      {
        text: "OK",
        onPress: () => {},
      },
    ]);
  };

  return (
    <View>
      <Button onPress={showResult}>Check</Button>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {board.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{
              flexDirection: "row",
              borderColor: "black",
              ...calculateBorder(rowIndex, 0),
            }}
          >
            {row.map((digit, colIndex) => (
              <View
                key={colIndex}
                style={{
                  width: screen.width / 9,
                  aspectRatio: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  ...calculateBorder(rowIndex, colIndex),
                }}
              >
                {cellsToFill.some(
                  (cell) => cell.row === rowIndex && cell.col === colIndex,
                ) ? (
                  <TextInput
                    style={{
                      width: screen.width / 9 - 9,
                      aspectRatio: 1,
                      textAlign: "center",
                      backgroundColor: "lightgray",
                      borderRadius: 4,
                    }}
                    keyboardType="numeric"
                    value={
                      digit === 0 ? "" : board[rowIndex]![colIndex]?.toString()
                    }
                    onChangeText={(value) =>
                      handleDigitInput(
                        rowIndex,
                        colIndex,
                        parseInt(value, 10) || 0,
                      )
                    }
                  />
                ) : (
                  <Text>{digit}</Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default SudokuGame;
