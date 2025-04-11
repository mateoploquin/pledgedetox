import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../../../theme/colors";
import MainButton from "../../../components/buttons/main-button";
import { Controller } from "../../../screens/home/home.controller";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainHeader from "../../../components/headers/main-header";
import { initializeNotifications } from "../../../services/notification.service";

const ChallengeOn = () => {
  const navigation = useNavigation<any>();
  const { block, shieldConfiguration } = Controller.useHandleMonitoring();

  const handleStartChallenge = async () => {
    try {
      // Configure the shield that will appear when apps are blocked
      shieldConfiguration();
      
      // Get the selected challenge duration
      const durationStr = await AsyncStorage.getItem("challengeDuration");
      const duration = durationStr ? parseInt(durationStr, 10) : 14; // Default to 14 if not set
      console.log("Starting challenge with duration:", duration, "days");
      
      // Save the challenge start date
      const now = new Date();
      await AsyncStorage.setItem("challengeStartDate", now.toISOString());
      
      // Initialize notifications
      try {
        await initializeNotifications();
        console.log("Notifications initialized successfully");
      } catch (notificationError) {
        console.error("Error initializing notifications:", notificationError);
        // Continue with the challenge even if notifications fail
      }
      
      // Trigger the app blocking directly
      await block();
      
      console.log("App blocking activated from Challenge On screen");
      
      // Navigate to the Home screen
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error starting app blocking:", error);
      // Still navigate to Home even if there's an error
      navigation.navigate("Home");
    }
  };

  return (
    <View style={styles.container}>
      <MainHeader />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.spacer} />
        
        <Text style={styles.title}>Challenge On!</Text>
        
        <Text style={styles.description}>
          When you click "Start My Challenge", the apps you've selected will be blocked for 14 or 28 days.
          {"\n\n"}
          This is your chance to become the person you've always wanted to be. It won't be easy—but it will be worth it.
          {"\n\n"}
          Be open with your support group—they're here to guide you through.
          {"\n\n"}
          You've got this.
        </Text>
        
        <View style={styles.spacer} />
        
        <View style={styles.bottomContainer}>
          <MainButton 
            text="Start My Challenge" 
            onPress={handleStartChallenge}
            style={styles.button}
            textStyle={styles.buttonText}
          />
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.goBackButton}
          >
            <Text style={styles.goBackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  spacer: {
    flex: 1,
  },
  title: {
    fontSize: 46,
    fontWeight: "700",
    textAlign: "center",
    color: colors.white,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: colors.white,
    marginBottom: 20,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 60,
  },
  button: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 25,
  },
  buttonText: {
    color: colors.appBackground,
  },
  goBackButton: {
    marginTop: 15,
    paddingVertical: 10,
  },
  goBackText: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  }
});

export default ChallengeOn;
