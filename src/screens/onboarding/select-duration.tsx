import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppWrapper from "../../components/layout/app-wrapper";
import MainHeader from "../../components/headers/main-header";
import colors from "../../theme/colors";
import MainButton from "../../components/buttons/main-button";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SelectDurationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const handleContinue = async () => {
    if (selectedDuration) {
      // Save the selected duration to AsyncStorage
      await AsyncStorage.setItem("challengeDuration", selectedDuration.toString());
      
      // Navigate to the app selection screen
      navigation.navigate("SelectApps", {
        deviceActivitySelection: undefined,
      });
    }
  };

  return (
    <AppWrapper>
      <MainHeader />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Choose Challenge Duration</Text>
        <Text style={styles.subtitle}>How long do you want to stay committed?</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedDuration === 14 && styles.selectedCard,
            ]}
            onPress={() => setSelectedDuration(14)}
          >
            <Text style={styles.optionTitle}>14 Days</Text>
            <Text style={styles.optionDescription}>
              A 2-week challenge to reduce your social media usage
            </Text>
            {selectedDuration === 14 && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedDuration === 28 && styles.selectedCard,
            ]}
            onPress={() => setSelectedDuration(28)}
          >
            <Text style={styles.optionTitle}>28 Days</Text>
            <Text style={styles.optionDescription}>
              A 4-week challenge for a more significant digital detox
            </Text>
            {selectedDuration === 28 && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <MainButton
            text="Continue"
            onPress={handleContinue}
            style={styles.continueButton}
            textStyle={styles.continueButtonText}
            disabled={!selectedDuration}
          />
        </View>
      </View>
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.lightGray,
    textAlign: "center",
    marginBottom: 40,
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 40,
  },
  optionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: colors.orange,
    backgroundColor: "rgba(255, 165, 0, 0.1)",
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.lightGray,
  },
  checkmark: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.orange,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: colors.white,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  continueButton: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 25,
    opacity: 1,
  },
  continueButtonText: {
    color: colors.black,
    fontWeight: "600",
  },
});

export default SelectDurationScreen;
