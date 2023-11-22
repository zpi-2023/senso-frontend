import { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text } from "react-native-paper";

import { actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";
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
  const correctWord = "REACT".split("");
  const styles = useStyles();
  const { t } = useI18n();
  const textInputRefs = useRef<TextInput[]>([]);
  const lastGuessRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>(
    new Array(5).fill(""),
  );

  const handleTextChange = (text: string, index: number) => {
    const newGuess = [...currentGuess];
    newGuess[index] = text.toUpperCase();
    setCurrentGuess(newGuess);
    if (newGuess.every((letter) => letter !== "")) {
      setPreviousGuesses([...previousGuesses, newGuess.join("")]);
      setCurrentGuess(new Array(5).fill(""));
    } else {
      textInputRefs.current[index + 1]?.focus();
    }
  };

  const clearInputs = () => {
    textInputRefs.current.forEach((input) => input.clear());
    textInputRefs.current[0]?.focus();
  };

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
    textInputRefs.current[0]?.focus();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Header left={actions.goBack} title={t("wordle.pageTitle")} />
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
}));

export default Page;
