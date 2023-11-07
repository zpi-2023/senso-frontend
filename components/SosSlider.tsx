import React, { useState } from "react";
import {
  View,
  PanResponder,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { IconButton } from "react-native-paper";

const sliderWidth = Dimensions.get("window").width - 100;
const circleRadius = 35;

const PowerOffSlider = () => {
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
            <Animated.Text style={styles.sosText}>SOS</Animated.Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderBackground: {
    width: sliderWidth,
    height: 70,
    backgroundColor: "lightgray",
    borderRadius: circleRadius,
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    top: 0,
    width: circleRadius * 2,
    height: circleRadius * 2,
    backgroundColor: "#dc1616",
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
    fontSize: 20, // Style as needed
  },
});

export default PowerOffSlider;
