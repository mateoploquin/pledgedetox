import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  try {
    // Check if we already have permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If we don't have permission yet, ask for it
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If we still don't have permission, exit the function
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    // Get the device push token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push token:', token);

    // Configure notification channels for Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF3D00',
      });
    }

    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
  }
};

// Schedule daily evening notifications with days remaining
export const scheduleDailyEveningNotifications = async () => {
  try {
    // Cancel any existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Get challenge duration
    const durationStr = await AsyncStorage.getItem('challengeDuration');
    const duration = durationStr ? parseInt(durationStr, 10) : 14;

    // Encouraging messages
    const encouragingMessages = [
      "You're doing great! Keep going strong.",
      "Every day without those apps is a victory. You've got this!",
      "Your willpower is impressive. Keep up the good work!",
      "You're building healthier habits each day. Stay committed!",
      "Remember why you started this journey. You're making progress!",
      "The digital world can wait. Your real life is happening now.",
      "Stay focused on your goals. You're proving your strength!",
      "This challenge is making you stronger. Keep pushing forward!",
    ];

    // Schedule a notification for each day of the challenge
    for (let day = 1; day <= duration; day++) {
      // Calculate the date for this notification (today + day)
      const notificationDate = new Date();
      notificationDate.setDate(notificationDate.getDate() + day);
      notificationDate.setHours(18, 0, 0, 0); // 6 PM

      // Calculate days remaining
      const daysRemaining = duration - day;
      
      // Pick a random encouraging message
      const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
      
      // Create the notification content
      let title, body;
      
      if (daysRemaining > 0) {
        title = `Day ${day} of your Pledge challenge`;
        body = `${daysRemaining} days remaining. ${message}`;
      } else {
        title = "Challenge complete!";
        body = "Congratulations! You've successfully completed your Pledge challenge!";
      }

      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { day, daysRemaining },
        },
        trigger: {
          seconds: Math.floor((notificationDate.getTime() - Date.now()) / 1000),
          repeats: false,
        },
      });
    }

    console.log(`Scheduled ${duration} daily evening notifications`);
  } catch (error) {
    console.error('Error scheduling daily notifications:', error);
  }
};

// Schedule a special notification for when the timer finishes
export const scheduleCompletionNotification = async () => {
  try {
    // Get challenge duration
    const durationStr = await AsyncStorage.getItem('challengeDuration');
    const duration = durationStr ? parseInt(durationStr, 10) : 14;
    
    // Get challenge start date
    const startDateStr = await AsyncStorage.getItem('challengeStartDate');
    if (!startDateStr) {
      console.error('No challenge start date found');
      return;
    }
    
    // Calculate the exact end time of the challenge
    const startDate = new Date(startDateStr);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);
    
    // Schedule the completion notification for the exact moment the challenge ends
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎉 Challenge Successfully Completed! 🎉",
        body: "Congratulations! You've made it through your digital detox challenge. Your apps are now unblocked. How do you feel?",
        data: { type: 'challenge-completed' },
      },
      trigger: {
        seconds: Math.floor((endDate.getTime() - Date.now()) / 1000),
        repeats: false,
      },
    });
    
    console.log('Scheduled challenge completion notification for', endDate.toLocaleString());
  } catch (error) {
    console.error('Error scheduling completion notification:', error);
  }
};

// Initialize notifications
export const initializeNotifications = async () => {
  await registerForPushNotificationsAsync();
  await scheduleDailyEveningNotifications();
  await scheduleCompletionNotification();
};

// Cancel all notifications (e.g., when user surrenders)
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications canceled');
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};
