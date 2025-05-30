import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import colors from "../../theme/colors";
import MainHeaderLight from "../../components/headers/main-header-light";
import AppWrapper from "../../components/layout/app-wrapper";
import { SCREEN_HEIGHT } from "../../utils/constants/dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ReactNativeDeviceActivity from "react-native-device-activity";

interface ChallengeCompletedProps {
  navigation: any;
  route: {
    params?: {
      result?: string;
    }
  };
}

const ChallengeCompleted: React.FC<ChallengeCompletedProps> = ({
  navigation,
  route,
}) => {
  const result = route.params?.result || "success";

  const handleRestart = async () => {
    // Ensure all monitoring is stopped
    ReactNativeDeviceActivity.stopMonitoring();
    ReactNativeDeviceActivity.resetBlocks();

    await AsyncStorage.removeItem('pledgeSettings');
    await AsyncStorage.removeItem('challengeStartDate');
    
    navigation.navigate("Splash");
  };

  useEffect(() => {
    if (result === "success") {
      ReactNativeDeviceActivity.stopMonitoring();
      ReactNativeDeviceActivity.resetBlocks();
    }
  }, [result]);

  return (
    <AppWrapper style={styles.wrapper}>
      <MainHeaderLight />

      <Text style={styles.headerText}>
        Challenge outcome
      </Text>

      <View style={styles.contentContainer}>
        <Image
          source={require("../../../assets/Splashwhite.png")}
          style={styles.resultImage}
          resizeMode="contain"
        />

        <Text style={styles.resultText}>
          {result === "success" ? (
            "Congratulations!\nYou Are a Certified Pledger!"
          ) : (
            <Text>
              You Gave It a Good Try!{"\n"}
              <Text style={styles.subText}>
                Sometimes change is hard, but every effort counts.
              </Text>
            </Text>
          )}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => handleRestart()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            New Challenge
          </Text>
        </Pressable>
      </View>
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.black
  },
  headerText: {
    fontFamily: "InstrumentSerif-Regular",
    color: colors.white,
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  resultImage: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  resultText: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.white,
    textAlign: "center",
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.white,
    textAlign: "center",
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: 200,
  },
  buttonText: {
    color: colors.orange,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ChallengeCompleted;
