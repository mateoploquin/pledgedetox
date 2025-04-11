import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signUp } from "../../services/auth";
import MainHeader from "../../components/headers/main-header";
import AppWrapper from "../../components/layout/app-wrapper";
import colors from "../../theme/colors";
import MainButton from "../../components/buttons/main-button";

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Invalid Name", "Please enter your name");
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, name);
      setIsLoading(false);
      // Navigate to SelectDuration screen instead of SelectApps
      navigation.navigate("SelectDuration");
    } catch (error) {
      setIsLoading(false);
      console.error("Sign-up Error:", error);
      Alert.alert("Registration failed", error.message || "An error occurred");
    }
  };

  return (
    <AppWrapper>
      <MainHeader />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>Enter your details to continue</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Your Name"
            style={styles.input}
            placeholderTextColor={"#929292"}
            value={name}
            autoCapitalize="words"
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Your Email"
            style={styles.input}
            placeholderTextColor={"#929292"}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            onChangeText={setEmail}
            onSubmitEditing={handleSignUp}
          />
        </View>

        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.white} />
          ) : (
            <MainButton 
              text="Continue" 
              onPress={handleSignUp}
              style={styles.continueButton}
              textStyle={styles.continueButtonText}
            />
          )}
        </View>
      </View>
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 80,
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
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray3,
    marginHorizontal: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    zIndex: 2,
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
    minHeight: 50,
    justifyContent: 'center',
    zIndex: 2,
  },
  continueButton: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 25,
  },
  continueButtonText: {
    color: colors.black,
    fontWeight: "600",
  },
});

export default RegisterScreen;
