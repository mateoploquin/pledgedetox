import { useState, useEffect } from "react";
import { loadFonts } from "../utils/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAppInit() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState(null);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await loadFonts();

        // Check if the user has already set up a challenge
        const settings = await AsyncStorage.getItem("pledgeSettings");
        const challengeStartDate = await AsyncStorage.getItem("challengeStartDate");
        
        if (settings && challengeStartDate) {
          // User has already set up a challenge, go to Home
          setInitialRouteName("Home");
        } else {
          // User hasn't set up a challenge, start with Splash
          setInitialRouteName("Splash");
        }
      } catch (e) {
        console.error("Failed to initialize app:", e);
      } finally {
        setLoadingComplete(true);
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  return { isLoadingComplete, initialRouteName };
}
