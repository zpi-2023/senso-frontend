import { useState } from "react";
import { View, PanResponder, Animated, Dimensions } from "react-native";
import { Text } from "react-native-paper";

import { useMutation, useQueryInvalidation } from "@/common/api";
import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";
import { Icon } from "@/components";

const sliderWidth = Dimensions.get("window").width - 100;
const circleRadius = 35;

export const SosSlider = () => {
  const { t } = useI18n();
  const styles = useStyles();
  const [slideAnim] = useState(new Animated.Value(0));
  const [calledForHelp, setCalledForHelp] = useState(false);

  const sendSos = useMutation("post", "/api/v1/alerts/sos");
  const invalidateAlerts = useQueryInvalidation("/api/v1/alerts");

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
        void sendSos({}).then(invalidateAlerts);
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
    <View style={sty.center}>
      <View style={styles.sliderBackground}>
        {calledForHelp ? (
          <View style={sty.center}>
            <Text variant="titleLarge" style={styles.sosText}>
              {t("alerts.sosSlider.slider")}
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
            <Icon icon="arrow-right" size={circleRadius} />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const useStyles = sty.themedHook(({ colors }) => ({
  sliderBackground: {
    width: sliderWidth,
    height: 70,
    backgroundColor: colors.onBackground,
    borderRadius: circleRadius,
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    top: 0,
    width: circleRadius * 2,
    height: circleRadius * 2,
    backgroundColor: colors.alert,
    borderRadius: circleRadius,
    justifyContent: "center",
    alignItems: "center",
  },
  sosText: {
    color: "black",
  },
}));
