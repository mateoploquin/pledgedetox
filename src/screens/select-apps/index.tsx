import { useState, useEffect } from "react";
import { Button, NativeSyntheticEvent, Text, View, StyleSheet, TouchableOpacity, Alert, Linking } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import {
  DeviceActivitySelectionEvent,
  DeviceActivitySelectionView,
  setFamilyActivitySelectionId,
  requestAuthorization,
  getAuthorizationStatus,
  AuthorizationStatus,
  AuthorizationStatusType
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
    };
  }>;
};

const SelectAppsView = ({ navigation, route }: SelectAppsViewProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAppsCount, setSelectedAppsCount] = useState(0);
  const [authorizationStatus, setAuthorizationStatus] = useState<AuthorizationStatusType>(AuthorizationStatus.notDetermined);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const [deviceActivitySelection, setDeviceActivitySelection] = useState<
    DeviceActivitySelectionEvent | undefined
  >(route.params.deviceActivitySelection);

  useEffect(() => {
    // Check current authorization status when component mounts
    const currentStatus = getAuthorizationStatus();
    setAuthorizationStatus(currentStatus);
    
    // If not authorized, request authorization
    if (currentStatus !== AuthorizationStatus.approved) {
      requestScreenTimeAccess();
    }
  }, []);

  const requestScreenTimeAccess = async () => {
    if (isRequesting) return; // Prevent multiple rapid requests
    
    try {
      setIsRequesting(true);
      
      if (authorizationStatus === AuthorizationStatus.notDetermined) {
        // First-time request
        await requestAuthorization();
        const newStatus = getAuthorizationStatus();
        setAuthorizationStatus(newStatus);
        
        if (newStatus !== AuthorizationStatus.approved) {
          // If still not authorized after request
          showAuthorizationAlert();
        }
      } else if (authorizationStatus === AuthorizationStatus.denied) {
        // Previously denied, direct to settings
        showAuthorizationAlert();
      }
    } catch (error) {
      console.error("Error requesting Screen Time authorization:", error);
      Alert.alert(
        "Authorization Error",
        "There was an error requesting Screen Time access. Please try again."
      );
    } finally {
      setIsRequesting(false);
    }
  };

  const updateDeviceActivitySelection = (
    event: any
  ) => {
    const selectionEvent = event.nativeEvent as DeviceActivitySelectionEvent;
    setDeviceActivitySelection(selectionEvent);
    if (selectionEvent.familyActivitySelection) {
      // Set the selection ID with the opaque token provided by the system
      setFamilyActivitySelectionId({
        id: pledgeActivitySelectionId,
        familyActivitySelection: selectionEvent.familyActivitySelection,
      });
      
      // Save the entire selection event (which contains the opaque token)
      // We can't access the specific apps, but we can store the token for later use
      try {
        // Log the selection structure for debugging
        console.log("Selection structure in select-apps:", 
          JSON.stringify(selectionEvent).substring(0, 200) + "...");
          
        AsyncStorage.setItem(
          "pledgeSettings",
          JSON.stringify({
            selectionEvent: selectionEvent,
            paymentSetupComplete: true,
          })
        );
        
        // Count the number of selected apps by examining the structure
        // This is an approximation since we can't directly access the app list
        const selectionStr = JSON.stringify(selectionEvent);
        const appCount = (selectionStr.match(/"bundleIdentifier"/g) || []).length;
        setSelectedAppsCount(appCount);
      } catch (error) {
        console.error("Error saving selection:", error);
      }
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

  const handleDone = () => {
    setIsVisible(false);
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
        style={[
          styles.selectAppsButton,
          selectedAppsCount > 0 && styles.appsSelectedButton
        ]}
        onPress={() => {
          setIsVisible(true);
        }}
      >
        <Text style={[
          styles.selectAppsButtonText,
          selectedAppsCount > 0 && styles.appsSelectedButtonText
        ]}>
          {selectedAppsCount > 0 
            ? `${selectedAppsCount} Apps Selected` 
            : "Click to Select Apps..."}
        </Text>
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.selectionOverlay}>
          <View style={styles.selectionHeader}>
            <Text style={styles.selectionHeaderText}>Select Apps to Block</Text>
            <Button title="Done" color={colors.orange} onPress={handleDone} />
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
        <Text style={styles.continueButtonText}>
          {selectedAppsCount > 0 
            ? `Continue with ${selectedAppsCount} Apps` 
            : "Continue"}
        </Text>
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
    fontSize: 70,
    fontWeight: "900",
    color: colors.white,
    marginBottom: 5,
    letterSpacing: -5,
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
    color: colors.black,
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
  appsSelectedButton: {
    backgroundColor: colors.orange,
  },
  selectAppsButtonText: {
    color: colors.orange,
    fontSize: 16,
    fontWeight: '500',
  },
  appsSelectedButtonText: {
    color: colors.white,
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
});

export default SelectAppsView;
