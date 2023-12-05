import { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput, // eslint-disable-line senso-import-sources
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Text } from "react-native-paper";

import { randomWord } from "@/assets/words";
import { actions } from "@/common/actions";
import { useMutation } from "@/common/api";
import { useI18n } from "@/common/i18n";
import { calculateScore } from "@/common/score";
import { sty } from "@/common/styles";
import { toMinutesAndSeconds } from "@/common/time";
import { Header } from "@/components";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const LetterTile = (
  letter: string,
  letterIndex: number,
  correctWord: string,
  previousGuessIndex: number,
  styles: ReturnType<typeof useStyles>,
) => {
  const inWord = correctWord.includes(letter);
  const inPostion = correctWord[letterIndex] === letter;

  return (
    <View
      key={`${letter}-${letterIndex}-${previousGuessIndex}`}
      style={[
        styles.letterTile,
        ...(inWord && inPostion ? [styles.correctPosition] : []),
        ...(inWord && !inPostion ? [styles.wrongPosition] : []),
        ...(!inWord ? [styles.incorrect] : []),
      ]}
    >
      <Text style={styles.letter}>{letter}</Text>
    </View>
  );
};

const Page = () => {
  const { t, language } = useI18n();
  const [correctWord, setCorrectWord] = useState<string[]>(
    randomWord(language).toUpperCase().split(""),
  );
  const styles = useStyles();
  const postNewScore = useMutation("post", "/api/v1/games/{gameName}/score");

  const textInputRefs = useRef<TextInput[]>([]);
  const lastGuessRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [seconds, setSeconds] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(true);
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>(
    new Array(5).fill(""),
  );

  const handleResetGame = () => {
    setCorrectWord(randomWord(language).toUpperCase().split(""));
    setGameStarted(true);
    setSeconds(0);
    setPreviousGuesses([]);
    setCurrentGuess(new Array(5).fill(""));
    clearInputs();
    textInputRefs.current[0]?.focus();
  };

  const handleTextChange = (text: string, index: number) => {
    const newGuess = [...currentGuess];
    newGuess[index] = text.toUpperCase();
    setCurrentGuess(newGuess);
    if (newGuess.every((letter) => letter !== "")) {
      setPreviousGuesses([...previousGuesses, newGuess.join("")]);
      setCurrentGuess(new Array(5).fill(""));

      if (newGuess.join("") === correctWord.join("")) {
        setGameStarted(false);
        void postNewScore({
          params: {
            path: {
              gameName: "wordle",
            },
          },
          body: {
            score: calculateScore(previousGuesses.length, seconds),
          },
        });
        Alert.alert(
          t("games.wordle.alertTitle"),
          t("games.wordle.alertDescription", {
            count: previousGuesses.length,
            time: toMinutesAndSeconds(seconds),
          }),
          [
            {
              text: t("games.wordle.alertButton"),
              onPress: () => handleResetGame(),
            },
          ],
        );
      }
    } else {
      textInputRefs.current[index + 1]?.focus();
    }
  };

  const clearInputs = () => {
    textInputRefs.current.forEach((input) => input.clear());
    textInputRefs.current[0]?.focus();
  };

  useEffect(() => {
    textInputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (previousGuesses.length > 0) {
      clearInputs();
    }

    lastGuessRef.current?.measure((x, y, width, height, pageX, pageY) => {
      scrollViewRef.current?.scrollTo({
        y: pageY,
        animated: true,
      });
    });
  }, [previousGuesses]);

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [gameStarted]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Header left={actions.goBack} title={t("games.wordle.pageTitle")} />
        <View style={styles.optionsWrapper}>
          <Text style={styles.statsLabel}>
            {t("games.wordle.timer", { time: seconds })}
          </Text>
          <Text style={styles.statsLabel}>
            {t("games.wordle.guesses", {
              guesses: previousGuesses.length,
            })}
          </Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContainer}
          style={styles.scrollView}
        >
          {previousGuesses.map((guess, previousGuessIndex) => (
            <View key={`${guess}-${previousGuessIndex}`} style={styles.row}>
              {guess
                .split("")
                .map((letter, index) =>
                  LetterTile(
                    letter,
                    index,
                    correctWord.join(""),
                    previousGuessIndex,
                    styles,
                  ),
                )}
            </View>
          ))}
          <View ref={lastGuessRef} />
        </ScrollView>
        <View style={styles.row}>
          {currentGuess.map((letter, index) => (
            <TextInput
              key={index}
              style={styles.letterTile}
              maxLength={1}
              onKeyPress={({ nativeEvent }) => {
                if (
                  nativeEvent.key === "Backspace" &&
                  letter === "" &&
                  index > 0
                ) {
                  setCurrentGuess((currentGuess) => {
                    const newGuess = [...currentGuess];
                    newGuess[index - 1] = "";
                    return newGuess;
                  });
                  textInputRefs.current[index - 1]?.clear();
                  textInputRefs.current[index - 1]?.focus();
                }
              }}
              onChangeText={(text) => handleTextChange(text, index)}
              ref={(elem) => (textInputRefs.current[index] = elem as TextInput)}
            />
          ))}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const useStyles = sty.themedHook(({ colors }) => ({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: screenHeight / 2,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  scrollView: {
    height: screenHeight / 2 - (screenWidth / 5 - 40),
  },
  letterTile: {
    width: screenWidth / 5 - 20,
    aspectRatio: 1,
    margin: 10,
    textAlign: "center",
    fontSize: 32,
    borderColor: colors.primary,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    fontWeight: "bold",
    color: colors.text,
  },
  letter: {
    fontSize: 32,
    color: colors.text,
    fontWeight: "bold",
  },
  correctPosition: {
    backgroundColor: "#73dc73",
  },
  wrongPosition: {
    backgroundColor: "#edd36a",
  },
  incorrect: {
    backgroundColor: colors.surfaceDisabled,
  },
  row: {
    flexDirection: "row",
  },
  statsLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  optionsWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 16,
  },
}));

export default Page;
