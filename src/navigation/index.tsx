import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home";
import SplashScreen from "../screens/onboarding";
import LoginScreen from "../screens/onboarding/login";
import ChallengeOn from "../screens/onboarding/setup/challenge-on";
import ChallengeCompleted from "../screens/challenge-completed";
import SelectAppsView from "../screens/select-apps";

const Stack = createStackNavigator();

const hideHeaderOptions = { headerShown: false };
const hideHeaderNoGesture = { headerShown: false, gestureEnabled: false };
const hideHeaderNoAnimation = { headerShown: false, animationEnabled: false };
const modalOptions = {
  presentation: "modal" as const,
  headerShown: false,
  cardOverlayEnabled: true,
  cardShadowEnabled: true,
  gestureEnabled: true,
  gestureResponseDistance: 400,
  gestureDirection: "vertical" as const,
};

const AppNavigator = ({ initialRouteName }) => {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={hideHeaderOptions}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={hideHeaderNoAnimation}
      />
      <Stack.Screen
        name="SelectApps"
        component={SelectAppsView}
        options={modalOptions}
      />
      <Stack.Screen
        name="ChallengeOn"
        component={ChallengeOn}
        options={hideHeaderNoAnimation}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={hideHeaderNoGesture}
      />
      <Stack.Screen
        name="ChallengeCompleted"
        component={ChallengeCompleted}
        options={hideHeaderOptions}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
