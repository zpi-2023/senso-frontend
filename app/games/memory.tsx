import { Image } from "expo-image";
import { type FC, useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  type ImageSourcePropType,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Button, Text } from "react-native-paper";

import { actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";
import { toMinutesAndSeconds } from "@/common/time";
import { Header } from "@/components";

const images = [
  require("../../assets/images/memoCard01.jpg"),
  require("../../assets/images/memoCard02.jpg"),
  require("../../assets/images/memoCard03.jpg"),
  require("../../assets/images/memoCard04.jpg"),
  require("../../assets/images/memoCard05.jpg"),
  require("../../assets/images/memoCard06.jpg"),
  require("../../assets/images/memoCard07.jpg"),
  require("../../assets/images/memoCard08.jpg"),
  require("../../assets/images/memoCard09.jpg"),
  require("../../assets/images/memoCard10.jpg"),
  require("../../assets/images/memoCard11.jpg"),
  require("../../assets/images/memoCard12.jpg"),
];

const screenWidth = Dimensions.get("window").width;

interface ICard {
  id: number;
  image: ImageSourcePropType;
  flipped: boolean;
}

interface ICardProps {
  card: ICard;
  onPress: () => void;
}

const Card: FC<ICardProps> = ({ card, onPress }) => {
  const styles = useStyles();
  const { image, flipped } = card;
  return (
    <TouchableOpacity onPress={onPress}>
      {flipped ? (
        <Image source={image} style={styles.card} cachePolicy="memory-disk" />
      ) : (
        <View style={styles.card} />
      )}
    </TouchableOpacity>
  );
};

const Page = () => {
  const styles = useStyles();
  const { t } = useI18n();
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const secondsTimeout = useRef<NodeJS.Timeout | null>(null);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [firstCard, setFirstCard] = useState<ICard | null>(null);
  const [secondCard, setSecondCard] = useState<ICard | null>(null);
  const [cards, setCards] = useState<ICard[]>(
    images
      .concat(images)
      .map((image: ImageSourcePropType, index) => ({
        id: index,
        image,
        flipped: true,
      }))
      .sort(() => Math.random() - 0.5),
  );

  const handleFlipCard = (card: ICard) => {
    if (card.flipped) {
      return;
    }
    if (!firstCard) {
      setFirstCard(card);
      setCards((prevCards) =>
        prevCards.map((prevCard) =>
          prevCard.id === card.id ? { ...prevCard, flipped: true } : prevCard,
        ),
      );
    } else if (!secondCard) {
      setSecondCard(card);
      setCards((prevCards) =>
        prevCards.map((prevCard) =>
          prevCard.id === card.id ? { ...prevCard, flipped: true } : prevCard,
        ),
      );
      setMoves((prevMoves) => prevMoves + 1);

      if (firstCard.image !== card.image) {
        timeout.current = setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((prevCard) =>
              prevCard.id === firstCard.id || prevCard.id === card.id
                ? { ...prevCard, flipped: false }
                : prevCard,
            ),
          );
          setFirstCard(null);
          setSecondCard(null);
        }, 1000);
      } else {
        setMatchedPairs((prevMatchedPairs) => prevMatchedPairs + 1);
        setFirstCard(null);
        setSecondCard(null);
      }
    }
  };

  const handleFlipAllCards = ({ showImage }: { showImage: boolean }) => {
    setCards((prevCards) =>
      prevCards.map((prevCard) => ({ ...prevCard, flipped: showImage })),
    );
  };

  const shuffleCards = () => {
    setCards((prevCards) => prevCards.sort(() => Math.random() - 0.5));
  };

  const handleStartGame = () => {
    setGameStarted(true);
    handleFlipAllCards({ showImage: false });
  };

  const handleResetGame = useCallback(() => {
    setGameStarted(false);
    setMatchedPairs(0);
    setSeconds(0);
    setMoves(0);
    shuffleCards();
    handleFlipAllCards({ showImage: true });
  }, []);

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameStarted) {
      secondsTimeout.current = setTimeout(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
    return () => {
      if (secondsTimeout.current) {
        clearTimeout(secondsTimeout.current);
      }
    };
  }, [gameStarted, seconds]);

  useEffect(() => {
    if (matchedPairs === images.length) {
      setGameStarted(false);
      Alert.alert(
        t("memoryGame.alertTitle"),
        t("memoryGame.alertDescription", {
          moves,
          time: toMinutesAndSeconds(seconds),
        }),
        [
          {
            text: "Play again",
            onPress: () => handleResetGame(),
          },
        ],
      );
    }
  }, [matchedPairs, moves, handleResetGame, seconds, t]);

  return (
    <View style={styles.componentWrapper}>
      <Header left={actions.goBack} title={t("memoryGame.pageTitle")} />
      <View style={styles.optionsWrapper}>
        <Button
          mode="contained"
          onPress={handleStartGame}
          disabled={gameStarted}
        >
          {t("memoryGame.startButton")}
        </Button>
        <Button
          mode="contained"
          onPress={handleResetGame}
          disabled={!gameStarted}
        >
          {t("memoryGame.restartButton")}
        </Button>
      </View>
      <View style={styles.optionsWrapper}>
        <Text style={styles.statsLabel}>
          {t("memoryGame.movesCounter", {
            moves,
          })}
        </Text>
        <Text style={styles.statsLabel}>
          {t("memoryGame.timeCounter", {
            time: toMinutesAndSeconds(seconds),
          })}
        </Text>
      </View>
      <View style={styles.grid}>
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onPress={() => handleFlipCard(card)}
          />
        ))}
      </View>
    </View>
  );
};

const useStyles = sty.themedHook(({ colors }) => ({
  componentWrapper: {
    flex: 1,
    flexDirection: "column",
    gap: 16,
    marginVertical: 16,
  },
  optionsWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  card: {
    margin: 5,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: screenWidth / 4 - 10,
    aspectRatio: 1,
  },
  statsLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
}));

export default Page;
