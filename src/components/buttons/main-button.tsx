import React from "react";
import { View, Text, StyleSheet, Pressable, ViewStyle, TextStyle } from "react-native";
import colors from "../../theme/colors";

interface MainButtonProps {
  onPress: () => void;
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const MainButton: React.FC<MainButtonProps> = ({
  onPress,
  text,
  style,
  textStyle,
  disabled = false,
}) => {
  return (
    <View style={[{ alignSelf: "center" }]}>
      <Pressable
        onPress={!disabled ? onPress : undefined}
        style={[
          styles.container,
          style,
          disabled && { backgroundColor: colors.orange, opacity: 0.6 },
        ]}
      >
        <Text style={[styles.text, textStyle, disabled && { opacity: 0.6 }]}>{text}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.orange,
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default MainButton;
