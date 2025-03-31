import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../../../theme/colors";
import MainButton from "../../../components/buttons/main-button";

const ChallengeOn: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleStartChallenge = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../../assets/images/onboarding/challenge-on.png")}
        style={styles.image}
      />

      <Text style={styles.title}>Challenge On!</Text>
      <Text style={styles.subtitle}>
        Your 30-day app blocker is now active. Take control of your time and break free from digital distractions!
      </Text>

      <View style={styles.buttonContainer}>
        <MainButton 
          text="Start My Challenge" 
          onPress={handleStartChallenge}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  image: {
    alignSelf: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    color: colors.white,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: "InstrumentSerif-Regular",
    textAlign: "center",
    color: colors.white,
    fontSize: 18,
    lineHeight: 26,
  },
  buttonContainer: {
    marginTop: 50,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: 200,
  }
});

export default ChallengeOn;
