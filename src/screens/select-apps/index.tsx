import { useState } from "react";
import { Button, NativeSyntheticEvent, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import {
  DeviceActivitySelectionEvent,
  DeviceActivitySelectionView,
  setFamilyActivitySelectionId,
} from "react-native-device-activity";
import { pledgeActivitySelectionId } from "../home/home.constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../../theme/colors";
import { Ionicons, FontAwesome, Entypo, FontAwesome5 } from "@expo/vector-icons";

export type SelectAppsViewProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<{
    params: {
      deviceActivitySelection: DeviceActivitySelectionEvent | undefined;
      setDeviceActivitySelection: (
        event: NativeSyntheticEvent<DeviceActivitySelectionEvent>
      ) => void;
    };
  }>;
};

const SelectAppsView = ({ navigation, route }: SelectAppsViewProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const [deviceActivitySelection, setDeviceActivitySelection] = useState<
    DeviceActivitySelectionEvent | undefined
  >(route.params.deviceActivitySelection);

  const updateDeviceActivitySelection = (
    event: NativeSyntheticEvent<DeviceActivitySelectionEvent>
  ) => {
    setDeviceActivitySelection(event.nativeEvent);
    if (event.nativeEvent.familyActivitySelection) {
      route.params.setDeviceActivitySelection(event);
      setFamilyActivitySelectionId({
        id: pledgeActivitySelectionId,
        familyActivitySelection: event.nativeEvent.familyActivitySelection,
      });
    }
  };

  const handleContinue = async () => {
    if (deviceActivitySelection?.familyActivitySelection) {
      await AsyncStorage.setItem(
        "pledgeSettings",
        JSON.stringify({
          selectionEvent: deviceActivitySelection,
          paymentSetupComplete: true,
        })
      );
      const now = new Date();
      await AsyncStorage.setItem("challengeStartDate", now.toISOString());
      navigation.navigate("ChallengeOn");
    } else {
      alert("Please select at least one app to block");
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pledge</Text>
        <Text style={styles.subtitle}>Live more, scroll less.</Text>
      </View>

      <Text style={styles.instructionText}>
        Select the apps you want to block and include in the challenge
      </Text>

      <View style={styles.appIconsContainer}>
        <View style={styles.appIconRow}>
          <View style={styles.appIcon}><Ionicons name="logo-linkedin" size={28} color="white" /></View>
          <View style={styles.appIcon}><FontAwesome name="reddit" size={28} color="white" /></View>
          <View style={styles.appIcon}><Ionicons name="logo-facebook" size={28} color="white" /></View>
          <View style={styles.appIcon}><Ionicons name="logo-instagram" size={28} color="white" /></View>
        </View>
        <View style={styles.appIconRow}>
          <View style={styles.appIcon}><FontAwesome name="snapchat-ghost" size={28} color="white" /></View>
          <View style={styles.appIcon}><Entypo name="twitter" size={28} color="white" /></View>
          <View style={styles.appIcon}><Ionicons name="logo-youtube" size={28} color="white" /></View>
          <View style={styles.appIcon}><FontAwesome5 name="tiktok" size={28} color="white" /></View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.selectAppsButton}
        onPress={() => {
          setIsVisible(true);
        }}
      >
        <Text style={styles.selectAppsButtonText}>Click to Select Apps...</Text>
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.selectionOverlay}>
          <View style={styles.selectionHeader}>
            <Text style={styles.selectionHeaderText}>Select Apps to Block</Text>
            <Button title="Done" color={colors.orange} onPress={() => setIsVisible(false)} />
          </View>
          <DeviceActivitySelectionView
            familyActivitySelection={
              deviceActivitySelection?.familyActivitySelection
            }
            onSelectionChange={updateDeviceActivitySelection}
            style={styles.selectionView}
          />
        </View>
      )}

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGoBack}>
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.white,
    letterSpacing: 1,
  },
  instructionText: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 40,
  },
  appIconsContainer: {
    marginBottom: 40,
  },
  appIconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  selectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgb(240, 240, 245)',
    zIndex: 10,
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.darkGray2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  selectionHeaderText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  selectionView: {
    flex: 1,
  },
  selectAppsButton: {
    width: '90%',
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  selectAppsButtonText: {
    color: colors.orange,
    fontSize: 16,
    fontWeight: '500',
  },
  continueButton: {
    width: '90%',
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  continueButtonText: {
    color: colors.orange,
    fontSize: 16,
    fontWeight: '500',
  },
  goBackText: {
    color: colors.white,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default SelectAppsView;
