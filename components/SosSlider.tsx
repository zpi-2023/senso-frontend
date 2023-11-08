import { useState } from "react";
import {
  View,
  PanResponder,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { IconButton, type MD3Theme, Text, useTheme } from "react-native-paper";

import { colors } from "@/common/constants";
import { useI18n } from "@/common/i18n";

const sliderWidth = Dimensions.get("window").width - 100;
const circleRadius = 35;

const PowerOffSlider = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [slideAnim] = useState(new Animated.Value(0));
  const [calledForHelp, setCalledForHelp] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      if (
        gestureState.dx >= 0 &&
        gestureState.dx + circleRadius * 2 <= sliderWidth
      ) {
        Animated.event([null, { dx: slideAnim }], { useNativeDriver: false })(
          event,
          gestureState,
        );
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx + circleRadius * 2 >= sliderWidth) {
        setCalledForHelp(true);
        // TODO: call API to send SOS
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 10,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const slideLeft = slideAnim.interpolate({
    inputRange: [0, sliderWidth],
    outputRange: [0, sliderWidth],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <View style={styles.sliderBackground}>
        {calledForHelp ? (
          <View style={styles.sosContainer}>
            <Text variant="titleLarge" style={styles.sosText}>
              {t("sosSlider.slider")}
            </Text>
          </View>
        ) : (
          <Animated.View
            style={[
              styles.circle,
              {
                left: slideLeft,
              },
            ]}
            {...panResponder.panHandlers}
          >
            <IconButton icon="arrow-right" size={circleRadius} />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    sliderBackground: {
      width: sliderWidth,
      height: 70,
      backgroundColor: theme.colors.onBackground,
      borderRadius: circleRadius,
      overflow: "hidden",
    },
    circle: {
      position: "absolute",
      top: 0,
      width: circleRadius * 2,
      height: circleRadius * 2,
      backgroundColor: colors.error,
      borderRadius: circleRadius,
      justifyContent: "center",
      alignItems: "center",
    },
    sosContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    sosText: {
      color: "black",
    },
  });

export default PowerOffSlider;
