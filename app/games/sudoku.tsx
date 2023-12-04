import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, TextInput, View } from "react-native"; // eslint-disable-line senso-import-sources
import { Text, Button } from "react-native-paper";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";
import { Header } from "@/components";
import {
  checkBoard,
  emptyCellCount,
  generateSolvedSudoku,
  generateSudoku,
} from "@/logic/sudoku";

const screen = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
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
      borderRightWidth: colIndex === 2 || colIndex === 5 ? 3 : 1,
    };
  }

  return borderStyle;
};

const SudokuGame = () => {
  const { t } = useI18n();
  const styles = useStyles();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [checks, setChecks] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [solvedBoard] = useState<number[][]>(() => generateSolvedSudoku());
  const [[cellsToFill, board], setBoard] = useState<
    [cellsToFill: { row: number; col: number }[], board: number[][]]
  >(() => generateSudoku(emptyCellCount, solvedBoard));

  // Function to handle digit input
  const handleDigitInput = (row: number, col: number, value: number) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard[1]];
      newBoard[row]![col] = value < 1 || value > 9 ? 0 : value;
      return [prevBoard[0], newBoard];
    });
  };

  const showResult = () => {
    const result = checkBoard(board);
    setChecks((prevChecks) => prevChecks + 1);
    if (result) {
      setGameStarted(false);
    }
    Alert.alert(
      result
        ? t("games.sudoku.alertTitlePositive")
        : t("games.sudoku.alertTitleNegative"),
      result ? t("games.sudoku.alertDescription", { time: seconds }) : "",
      [
        {
          text: result
            ? t("games.sudoku.backToMenu")
            : t("games.sudoku.continue"),
          onPress: () => (result ? router.replace(AppRoutes.Dashboard) : null),
        },
      ],
    );
  };

  useEffect(() => {
    setGameStarted(true);
  }, []);

  useEffect(() => {
    if (gameStarted) {
      timer.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [gameStarted]);

  return (
    <View style={styles.gameWrapper}>
      <Header title={t("games.sudoku.pageTitle")} left={actions.goBack} />
      <View style={styles.statsLabel}>
        <Text style={styles.statsText}>
          {t("games.sudoku.timer", { time: seconds })}
        </Text>
        <Text style={styles.statsText}>
          {t("games.sudoku.checkCounter", { checks })}
        </Text>
        <Button
          onPress={showResult}
          disabled={board.some((row) => row.some((digit) => digit === 0))}
        >
          {t("games.sudoku.check")}
        </Button>
      </View>
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
                    style={[styles.digitInput, styles.digit]}
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
                  <Text style={styles.digit}>{digit}</Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const useStyles = sty.themedHook(({ colors }) => ({
  gameWrapper: {
    flex: 1,
    gap: 10,
  },
  digit: {
    fontSize: 30,
    color: colors.text,
  },
  digitInput: {
    width: screen.width / 9 - 9,
    aspectRatio: 1,
    textAlign: "center",
    backgroundColor: "lightgray",
    borderRadius: 4,
  },
  statsText: {
    fontSize: 18,
  },
  statsLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
}));

export default SudokuGame;
