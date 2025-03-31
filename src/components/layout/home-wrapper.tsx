import React from "react";
import { StyleSheet, SafeAreaView, View, ViewStyle } from "react-native";
import colors from "../../theme/colors";

interface HomeWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const HomeWrapper: React.FC<HomeWrapperProps> = ({ children, style }) => {
  return (
    <View style={styles.imageContainer}>
      <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
});

export default HomeWrapper;
