import React from "react";
import { StyleSheet, Text, PanResponder, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import colors from "../../theme/colors";
import { SCREEN_WIDTH } from "../../utils/constants/dimensions";
import { Feather } from "@expo/vector-icons";

type SplashSliderProps = {
  isPledged: boolean;
  setIsPledged: (isPledged: boolean) => void;
};

const SplashSlider: React.FC<SplashSliderProps> = ({
  isPledged,
  setIsPledged,
}) => {
  const sliderValue = useSharedValue(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      const position = Math.max(
        0,
        Math.min(gestureState.dx, SCREEN_WIDTH * 0.6)
      );
      sliderValue.value = withSpring(position);
    },
    onPanResponderRelease: (event, gestureState) => {
      if (gestureState.dx > SCREEN_WIDTH * 0.3) {
        sliderValue.value = withSpring(SCREEN_WIDTH * 0.65);
        setIsPledged(true);
      } else {
        sliderValue.value = withSpring(0);
        setIsPledged(false);
      }
    },
  });

  const animatedSliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sliderValue.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.sliderBackground}>
        <Text style={styles.text}>
          {isPledged ? "Let's Pledge" : "Slide to break free"}
        </Text>
        <Animated.View
          style={[styles.sliderButton, animatedSliderStyle]}
          {...panResponder.panHandlers}
        >
          <Feather name="arrow-right" size={20} color="#FF3D00" />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderBackground: {
    width: SCREEN_WIDTH * 0.8,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    padding: 5,
    position: "relative",
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    position: "absolute",
    width: "100%",
    zIndex: 0,
    color: colors.white,
  },
  sliderButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default SplashSlider;
