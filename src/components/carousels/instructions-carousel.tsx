import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import { CarouselItem } from "../../types";
import colors from "../../theme/colors";

const items: CarouselItem[] = [
  {
    image: require("../../../assets/images/onboarding/instructions/instruction-1.png"),
    title: "Set Your Limit",
    subtitle:
      "Choose how many hours you want to spend on social media and selected apps each day.",
  },
  {
    image: require("../../../assets/images/onboarding/instructions/instruction-2.png"),
    title: "Make a Pledge",
    subtitle:
      "Turn intention into action! Pledge €10–€100 and stay committed—financial incentives make you 3x more likely to reach your goal! ",
  },
  {
    image: require("../../../assets/images/onboarding/instructions/instruction-3.png"),
    title: "We Keep You Accountable",
    subtitle:
      "Track your social media screen time daily and monthly to stay on target.",
  },
  {
    image: require("../../../assets/images/onboarding/instructions/instruction-4.png"),
    title: "Stay Strong",
    subtitle:
      "If you meet your screen time goal, you win. But if you forfeit your challenge, we’ll donate your Pledge to a charity.",
  },
];

const InstructionCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image source={items[currentIndex].image} style={styles.image} />
        <Text style={styles.title}>{items[currentIndex].title}</Text>
        <Text style={styles.subtitle}>{items[currentIndex].subtitle}</Text>
      </Animated.View>

      <View style={styles.dotContainer}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.onboardingBackgroundLight,
    marginTop: 100,
  },
  image: {
    width: 243,
    height: 276,
    resizeMode: "contain",
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: colors.black,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "InstrumentSerif-Regular",
    textAlign: "center",
    color: colors.gray,
    paddingHorizontal: 20,
  },
  dotContainer: {
    position: "absolute",
    bottom: 120,
    flexDirection: "row",
    marginTop: 20,
    alignSelf: "center",
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 7,
    backgroundColor: colors.black,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.orange,
  },
});

export default InstructionCarousel;
