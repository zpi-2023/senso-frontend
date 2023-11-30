import { useState } from "react";
import { Alert, Dimensions, TextInput, View } from "react-native"; // eslint-disable-line senso-import-sources
import { Button, Text } from "react-native-paper";

const screen = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

const calculateBorder = (rowIndex: number, colIndex: number) => {
  let borderStyle = {};

  if (rowIndex >= 0 && rowIndex <= 7) {
    borderStyle = { ...borderStyle, borderBottomWidth: 1 };
  }

  if (rowIndex === 2 || rowIndex === 5) {
    borderStyle = { ...borderStyle, borderBottomWidth: 2 };
  }

  if (colIndex >= 0 && colIndex <= 7) {
    borderStyle = { ...borderStyle, borderRightWidth: 1 };
  }

  if (colIndex === 2 || colIndex === 5) {
    borderStyle = { ...borderStyle, borderRightWidth: 3 };
  }

  return borderStyle;
};

const SudokuGame = () => {
  const [board, setBoard] = useState<number[][]>([]);

  const generateBoard = () => {
    // Logic to generate a new Sudoku board
    // ...
    // Set the generated board to the states
    const newBoard = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [4, 5, 6, 7, 8, 9, 1, 2, 3],
      [7, 8, 0, 1, 2, 3, 4, 5, 0],
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [4, 5, 6, 7, 8, 9, 1, 2, 3],
      [7, 8, 9, 1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [4, 5, 6, 7, 8, 9, 0, 2, 3],
      [7, 8, 9, 1, 2, 3, 4, 5, 6],
    ];

    setBoard(newBoard);
  };

  // Function to handle digit input
  const handleDigitInput = (row: number, col: number, value: number) => {
    if (value < 1 || value > 9) {
      return;
    }

    setBoard(
      board.map((rowArray, rowIndex) =>
        rowIndex === row
          ? rowArray.map((digit, colIndex) =>
              colIndex === col ? value : digit,
            )
          : rowArray,
      ),
    );
  };

  const checkBoard = () => {
    // Check if the board is valid
    for (let row = 0; row < 9; row++) {
      const rowSet = new Set<number>();
      for (let col = 0; col < 9; col++) {
        const digit = board[row]![col] as number;
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
        const digit = board[row]![col] as number;
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
        const digit = board[row]![col] as number;
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
            const digit = board[row]![col] as number;
            if (digit === 0 || gridSet.has(digit)) {
              return false;
            }
            gridSet.add(digit);
          }
        }
      }
    }
  };

  const showResult = () => {
    const result = checkBoard();
    Alert.alert(result ? "You solved it!" : "Continue trying!", "", [
      {
        text: "OK",
        onPress: () => {},
      },
    ]);
  };

  return (
    <View>
      <Button onPress={generateBoard}>New Game</Button>
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
                {digit !== 0 ? (
                  <Text>{digit}</Text>
                ) : (
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
