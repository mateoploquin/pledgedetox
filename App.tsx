// App.tsx
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useAppInit from "./src/hooks/useAppInit";
import { StripeProvider } from "@stripe/stripe-react-native";
import AppNavigator from "./src/navigation";
import { fetchPublishableKey } from "./src/services/stripe-api"; // Import the fetch function

SplashScreen.preventAutoHideAsync();

function AppContent({ initialRouteName, onLayoutRootView }) {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AppNavigator initialRouteName={initialRouteName} />
      </View>
    </SafeAreaProvider>
  );
}

export default function App() {
  const { isLoadingComplete, initialRouteName } = useAppInit();
  const [publishableKey, setPublishableKey] = useState<string>("");

  useEffect(() => {
    const loadPublishableKey = async () => {
      try {
        // Add a timeout to the Stripe API call
        const timeoutPromise = new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error('Stripe API timeout')), 3000)
        );
        
        // Race between the API call and the timeout
        const key = await Promise.race([
          fetchPublishableKey(),
          timeoutPromise
        ]);
        
        setPublishableKey(key);
      } catch (error) {
        console.warn("Failed to load publishable key:", error);
        // Continue without the key - we'll handle this in the payment flow
      }
    };

    loadPublishableKey();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    // Only wait for isLoadingComplete, not publishableKey
    if (isLoadingComplete) {
      await SplashScreen.hideAsync();
    }
  }, [isLoadingComplete]);

  // If we don't have a key yet, we still render the app
  // The Stripe functionality will be disabled until the key loads
  return (
    <NavigationContainer>
      <StripeProvider publishableKey={publishableKey || 'pk_placeholder'}>
        <AppContent
          initialRouteName={initialRouteName}
          onLayoutRootView={onLayoutRootView}
        />
      </StripeProvider>
    </NavigationContainer>
  );
}
