import { FC, useEffect, useState, Fragment } from "react";
import * as ReactNativeDeviceActivity from "react-native-device-activity";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import colors from "../../theme/colors";
import SurrenderModal from "../../components/modals/surrender-modal";
import HomeHeader from "../../components/headers/home-header";
import HomeWrapper from "../../components/layout/home-wrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PledgeSettings } from "../../types";
import { Controller } from "./home.controller";
import { CHALLENGE_DURATION } from "./home.constants";
import { Interfaces } from "./home.interfaces";

const HomeScreen: FC<Interfaces.HomeScreenProps> = (props) => {
  const { navigation } = props;
  const [isModalVisible, setModalVisible] = useState(false);
  const { startMonitoring, stopMonitoring, shieldConfiguration, block } =
    Controller.useHandleMonitoring();
  const { onSurrender } = Controller.useHandleChangeEvents(setModalVisible);

  const [settings, setSettings] = useState<PledgeSettings | undefined>(
    undefined
  );
  const [challengeStartDate, setChallengeStartDate] = useState<Date | null>(
    null
  );
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const countdownTimes = [
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Minutes" },
    { value: countdown.seconds, label: "Seconds" },
  ];

  useEffect(() => {
    let listener: (() => void) | undefined;
    AsyncStorage.getItem("pledgeSettings").then((s) => {
      if (s) {
        const settings = JSON.parse(s);
        if (!settings.paymentSetupComplete) {
          navigation.replace("Instructions");
          return;
        }
        setSettings(settings);
        shieldConfiguration();

        listener = ReactNativeDeviceActivity.onDeviceActivityMonitorEvent(
          (event) => {
            console.log("got event");
          }
        ).remove;
      }
    });

    return () => {
      listener?.();
    };
  }, []);

  useEffect(() => {
    const loadChallengeStartDate = async () => {
      try {
        const startDateStr = await AsyncStorage.getItem("challengeStartDate");
        if (startDateStr) {
          const startDate = new Date(startDateStr);
          setChallengeStartDate(startDate);
        }
      } catch (error) {
        console.error("Error loading challenge start date:", error);
      }
    };

    loadChallengeStartDate();
  }, []);

  useEffect(() => {
    if (!challengeStartDate) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(challengeStartDate);
      endDate.setDate(endDate.getDate() + CHALLENGE_DURATION);

      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        stopMonitoring();

        AsyncStorage.removeItem("pledgeSettings");
        AsyncStorage.removeItem("challengeStartDate");

        navigation.navigate("ChallengeCompleted", { result: "success" });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [challengeStartDate]);

  if (!settings) {
    return null;
  }

  const toggleModal = () => setModalVisible((prev) => !prev);

  return (
    <HomeWrapper>
      <HomeHeader />
      <View style={styles.contentContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.countdownContainer}>
            {countdownTimes.map((item, index) => (
              <Fragment key={item.label}>
                {index > 0 && <Text style={styles.colonText}>:</Text>}
                <View style={styles.timeItemContainer}>
                  <Text style={styles.time}>{item.value}</Text>
                  <Text style={styles.timeText}>{item.label}</Text>
                </View>
              </Fragment>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={toggleModal} style={styles.surrenderButton}>
        <Text style={styles.surrenderText}>I surrender</Text>
      </TouchableOpacity>

      <SurrenderModal
        isVisible={isModalVisible}
        onClose={toggleModal}
        onSurrender={onSurrender}
      />
    </HomeWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '90%',
    borderRadius: 25,
    overflow: "hidden",
    padding: 15,
  },
  countdownContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 20,
  },
  timeItemContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  colonText: {
    fontSize: 36,
    color: colors.white,
    marginBottom: 10,
  },
  time: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.white,
  },
  timeText: {
    fontSize: 10,
    color: colors.white,
    textTransform: "uppercase",
    textAlign: "center",
  },
  surrenderButton: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignSelf: "center",
    position: "absolute",
    bottom: 40,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: 200,
  },
  surrenderText: {
    color: colors.primaryOrange,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default HomeScreen;
