import { useState, useRef, useEffect } from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";
import { Text } from "react-native-paper";

import { useTheme } from "@/common/theme";

const screenWidth = Dimensions.get("window").width;

const LetterTile = (
  letter: string,
  letterIndex: number,
  correctWord: string,
  previousGuessIndex: number,
  bgColor: string,
) => (
  <View
    key={`${letter}-${letterIndex}-${previousGuessIndex}`}
    style={[
      styles.letterInput,
      {
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
      },
    ]}
  >
    <Text
      style={{
        fontSize: 32,
        color: "black",
        fontWeight: "bold",
      }}
    >
      {letter}
    </Text>
  </View>
);

const Page = () => {
  const correctWord = "REACT".split("");
  const theme = useTheme();
  const [currentGuess, setCurrentGuess] = useState<string[]>(
    new Array(5).fill(""),
  );
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const textInputRefs = useRef<TextInput[]>([]);

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

  const getLetterBackgroundColor = (letter: string, index: number) => {
    if (correctWord[index] === letter) {
      return "green";
    } else if (correctWord.includes(letter)) {
      return "yellow";
    }

    return theme.colors.background;
  };

  const clearInputs = () => {
    textInputRefs.current.forEach((input) => input.clear());
    textInputRefs.current[0]?.focus();
  };

  useEffect(() => {
    if (previousGuesses.length > 0) {
      clearInputs();
    }
  }, [previousGuesses]);

  useEffect(() => {
    textInputRefs.current[0]?.focus();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: "column",
        },
      ]}
    >
      {previousGuesses.map((guess, previousGuessIndex) => (
        <View
          key={`${guess}-${previousGuessIndex}`}
          style={{ flexDirection: "row" }}
        >
          {guess
            .split("")
            .map((letter, index) =>
              LetterTile(
                letter,
                index,
                correctWord.join(""),
                previousGuessIndex,
                getLetterBackgroundColor(letter, index),
              ),
            )}
        </View>
      ))}
      <View style={styles.container}>
        {currentGuess.map((letter, index) => (
          <TextInput
            key={index}
            style={styles.letterInput}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  letterInput: {
    width: screenWidth / 5 - 20,
    aspectRatio: 1,
    margin: 10,
    textAlign: "center",
    fontSize: 32,
    borderColor: "gray",
    borderWidth: 1,
  },
  correctPosition: {
    backgroundColor: "green",
  },
  wrongPosition: {
    backgroundColor: "yellow",
  },
  incorrect: {
    backgroundColor: "red",
  },
});

export default Page;
