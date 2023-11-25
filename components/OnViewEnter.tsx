import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { InView } from "react-native-intersection-observer";

type OnViewEnterProps = {
  handler: () => void;
  disabled?: boolean;
};

export const OnViewEnter = ({
  handler,
  disabled = false,
}: OnViewEnterProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const prevCondition = useRef(false);

  useEffect(() => {
    const condition = isVisible && !disabled;
    if (!prevCondition.current && condition) {
      handler();
    }
    prevCondition.current = condition;
  }, [isVisible, disabled, handler]);

  return (
    <InView onChange={setIsVisible}>
      <View style={{ width: 1, height: 1 }} />
    </InView>
  );
};
