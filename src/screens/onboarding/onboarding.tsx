import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../utils/constants/dimensions";
import SplashSlider from "../../components/sliders/splash-slider";
import colors from "../../theme/colors";
import { useNavigation, NavigationProp } from "@react-navigation/native";

const Onboarding: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [isPledged, setIsPledged] = useState(false);

  // Navigate to register when slider is completed
  useEffect(() => {
    if (isPledged) {
      const timer = setTimeout(() => {
        navigation.navigate("Register");
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isPledged, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Pledge</Text>
        <Text style={styles.subtitle}>Live more, scroll less.</Text>
      </View>

      <View style={styles.sliderContainer}>
        <SplashSlider isPledged={isPledged} setIsPledged={setIsPledged} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.appBackground,
  },
  contentContainer: {
    alignItems: "center",
    position: "absolute",
    top: SCREEN_HEIGHT * 0.4,
    zIndex: 10,
  },
  title: {
    fontSize: 100,
    fontWeight: "900",
    color: colors.white,
    marginBottom: 5,
    letterSpacing: -8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.white,
    letterSpacing: 2,
  },
  sliderContainer: {
    position: "absolute",
    bottom: 100,
    zIndex: 10,
  },
});

export default Onboarding;
