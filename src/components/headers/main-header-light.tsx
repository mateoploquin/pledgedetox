import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SCREEN_WIDTH } from "../../utils/constants/dimensions";
import colors from "../../theme/colors";

const MainHeaderLight: React.FC = ({}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pledge</Text>
      <Text style={styles.subtitle}>Live more, scroll less.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    width: SCREEN_WIDTH,
    alignItems: "center",
    alignSelf: "center",
  },
  title: {
    fontSize: 40,
    letterSpacing: -4,
    fontWeight: "900",
    color: colors.white,
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "500",
    marginTop: 4,
    color: colors.white,
  },
});

export default MainHeaderLight;
