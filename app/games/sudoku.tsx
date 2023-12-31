import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, TextInput, View } from "react-native"; // eslint-disable-line senso-import-sources
import { Text, Button } from "react-native-paper";

import { actions } from "@/common/actions";
import { useMutation } from "@/common/api";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { calculateScore } from "@/common/score";
import { sty } from "@/common/styles";
import { toMinutesAndSeconds } from "@/common/time";
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
  const [gameStarted, setGameStarted] = useState(true);
  const [solvedBoard] = useState<number[][]>(() => generateSolvedSudoku());
  const [[cellsToFill, board], setBoard] = useState<
    [cellsToFill: { row: number; col: number }[], board: number[][]]
  >(() => generateSudoku(emptyCellCount, solvedBoard));
  const postNewScore = useMutation("post", "/api/v1/games/{gameName}/score");

  // Function to handle digit input
  const handleDigitInput = (row: number, col: number, value: number) => {
    setBoard((prevBoard) => {
      const [prevCellsToFill, prevSudokuBoard] = prevBoard;
      const newBoard = [...prevSudokuBoard];
      newBoard[row]![col] = value < 1 || value > 9 ? 0 : value;
      return [prevCellsToFill, newBoard];
    });
  };

  const showResult = () => {
    const result = checkBoard(board);
    setChecks((prevChecks) => prevChecks + 1);
    if (result) {
      setGameStarted(false);
      void postNewScore({
        params: {
          path: {
            gameName: "sudoku",
          },
        },
        body: {
          score: calculateScore(checks, seconds),
        },
      });
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
          {t("games.sudoku.timer", { time: toMinutesAndSeconds(seconds) })}
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
      <View style={styles.sudokuWrapper}>
        {board.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{ ...styles.boardRow, ...calculateBorder(rowIndex, 0) }}
          >
            {row.map((digit, colIndex) => (
              <View
                key={colIndex}
                style={{
                  ...styles.boardCell,
                  ...calculateBorder(rowIndex, colIndex),
                }}
              >
                {cellsToFill.some(
                  (cell) => cell.row === rowIndex && cell.col === colIndex,
                ) ? (
                  <TextInput
                    style={styles.digitInput}
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
    fontSize: 30,
    color: "black",
  },
  statsText: {
    fontSize: 18,
  },
  sudokuWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  boardRow: {
    flexDirection: "row",
    borderColor: colors.tertiary,
  },
  boardCell: {
    width: screen.width / 9,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.tertiary,
  },
  statsLabel: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
  },
}));

export default SudokuGame;
