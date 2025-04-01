import * as ReactNativeDeviceActivity from "react-native-device-activity";
import {
  pledgeActivitySelectionId,
  eventNameTick,
  initialMinutes,
  postponeMinutes,
  eventNameFinish,
  monitoringEventName,
  pledgeShieldId,
  POSTPONE_MINUTES,
} from "./home.constants";
import { Interfaces } from "./home.interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { SetStateAction, useCallback } from "react";
import { Dispatch } from "react";
import { SelectionInfo } from '../../types';
import { DeviceActivityEvent, UIBlurEffectStyle } from 'react-native-device-activity';

export namespace Controller {
  export const useHandleMonitoring = () => {
    const startMonitoring = async () => {
      try {
        // Get the saved selection data
        const pledgeSettings = await AsyncStorage.getItem("pledgeSettings");
        if (!pledgeSettings) {
          console.error("No app selection found");
          return;
        }
        
        const parsedSettings = JSON.parse(pledgeSettings);
        const selectionEvent = parsedSettings.selectionEvent;
        
        if (!selectionEvent?.familyActivitySelection) {
          console.error("No valid selection found");
          return;
        }
        
        // Configure the shield appearance
        shieldConfiguration();
        
        // Set the activity selection ID with the opaque token
        await ReactNativeDeviceActivity.setFamilyActivitySelectionId({
          id: pledgeActivitySelectionId,
          familyActivitySelection: selectionEvent.familyActivitySelection,
        });
        
        // Block the selected apps immediately
        ReactNativeDeviceActivity.blockSelection({ 
          activitySelectionId: pledgeActivitySelectionId
        });
        
        // Save the challenge start date if not already set
        const now = new Date();
        await AsyncStorage.setItem("challengeStartDate", now.toISOString());
        
        console.log("Apps blocked for 30 days challenge");
        
        // For debugging purposes, log the selection event structure
        console.log("Selection event structure:", JSON.stringify(selectionEvent).substring(0, 200) + "...");
      } catch (error) {
        console.error("Error starting app blocking:", error);
      }
    };

    const stopMonitoring = async () => {
      try {
        // Reset all blocks
        ReactNativeDeviceActivity.resetBlocks();
        
        // Clear the challenge start date
        await AsyncStorage.removeItem("challengeStartDate");
        
        console.log("App blocking stopped");
      } catch (error) {
        console.error("Error stopping app blocking:", error);
      }
    };

    const block = async () => {
      try {
        const pledgeSettings = await AsyncStorage.getItem("pledgeSettings");
        if (!pledgeSettings) return;
        
        const parsedSettings = JSON.parse(pledgeSettings);
        const selectionEvent = parsedSettings.selectionEvent;
        
        if (!selectionEvent?.familyActivitySelection) return;
        
        // Set the activity selection ID first
        await ReactNativeDeviceActivity.setFamilyActivitySelectionId({
          id: pledgeActivitySelectionId,
          familyActivitySelection: selectionEvent.familyActivitySelection,
        });
        
        // Then block the selected apps
        ReactNativeDeviceActivity.blockSelection({ 
          activitySelectionId: pledgeActivitySelectionId
        });
      } catch (error) {
        console.error("Error blocking apps:", error);
      }
    };

    const shieldConfiguration = () => {
      const primaryColor = { red: 1, green: 0, blue: 0 };
      const secondaryColor = { red: 1, green: 1, blue: 1 };
      const accentColor = { red: 0.2, green: 0.2, blue: 0.8 };

      ReactNativeDeviceActivity.updateShieldWithId(
        {
          title: "App blocked by Pledge",
          backgroundBlurStyle: UIBlurEffectStyle.systemMaterialDark,
          titleColor: primaryColor,
          subtitle: "Enough scrolling for today...",
          subtitleColor: secondaryColor,
          primaryButtonBackgroundColor: accentColor,
          primaryButtonLabelColor: secondaryColor,
          secondaryButtonLabelColor: secondaryColor,
        },
        {
          primary: {
            behavior: "close",
            type: "dismiss",
          },
        },
        pledgeShieldId
      );
    };

    const parseMinutes = (total: number): Interfaces.Timer => {
      const hours = Math.floor(total / 60);
      const minutes = total % 60;
      const remainingMinutes = Math.max(0, total);

      return { hours, minutes, remainingMinutes };
    };

    return {
      startMonitoring,
      stopMonitoring,
      shieldConfiguration,
      parseMinutes,
      block
      //   handlePaymentSuccess,
      //   toggleChallengeCompleted,
    };
  };

  export const useHandleChangeEvents = (
    setModalVisible: Dispatch<SetStateAction<boolean>>
  ) => {
    const { stopMonitoring, parseMinutes } = useHandleMonitoring();
    const navigation = useNavigation<any>();
    const onSurrender = () => {
      console.log('123123')
      stopMonitoring();
      setModalVisible(false);
      AsyncStorage.removeItem("pledgeSettings");
      AsyncStorage.removeItem("challengeStartDate");
      navigation.navigate("ChallengeCompleted", { result: "failure" });
    };

    const refreshEvents = useCallback(
      async (setTotalTime: Dispatch<SetStateAction<Interfaces.Timer>>) => {
        const events = ReactNativeDeviceActivity.getEvents();
        console.log(JSON.stringify(events, null, 2))
        let totalMinutes = 0;

        for (let i = 0; i < events.length; i++) {
          const event = events[i];
          if (event.callbackName !== "eventDidReachThreshold") {
            continue;
          } else if (event.eventName.includes(eventNameTick)) {
            totalMinutes++;
          }
        }

        setTotalTime(parseMinutes(totalMinutes));
      },
      []
    );

    return { onSurrender, refreshEvents };
  };
}
