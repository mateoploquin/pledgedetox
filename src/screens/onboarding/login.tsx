// File: src/screens/onboarding/login.tsx
import React, { useState } from "react";
import { Text, Image, TouchableOpacity, TextInput, View, Alert, StyleSheet } from "react-native";
import AppWrapper from "../../components/layout/app-wrapper";
import MainHeader from "../../components/headers/main-header";
import colors from "../../theme/colors";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import MainButton from "../../components/buttons/main-button";

interface LoginScreenProps {}

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to SelectApps screen with only serializable parameters
      navigation.navigate("SelectApps", {
        deviceActivitySelection: undefined,
      });
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Login failed", error.message || "An error occurred");
    }
  };

  return (
    <AppWrapper style={styles.wrapper}>
      <MainHeader />

      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Your Email"
            style={styles.input}
            placeholderTextColor={"#929292"}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Your Password"
            style={styles.input}
            placeholderTextColor={"#929292"}
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
            textContentType="password"
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <MainButton 
            text="Login" 
            onPress={handleLogin}
            style={styles.loginButton}
            textStyle={styles.loginButtonText}
          />
        </View>
      </View>

      <Image
        source={require("../../../assets/images/onboarding/Phone_withicons.png")}
        style={styles.bottomImage}
        resizeMode="contain"
      />
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 100,
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray3,
    marginHorizontal: 38,
    flexDirection: "row",
    alignItems: "center", 
    justifyContent: "space-between",
    marginTop: 20,
  },
  input: {
    marginVertical: 12,
    width: "100%",
    color: colors.white,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 60,
  },
  loginButton: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 25,
  },
  loginButtonText: {
    color: colors.black,
    fontWeight: "600",
  },
  bottomImage: {
    position: "absolute",
    alignSelf: "center",
    bottom: 0,
    width: '100%',
    height: 200,
  }
});

export default LoginScreen;