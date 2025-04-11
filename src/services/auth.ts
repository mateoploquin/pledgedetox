import {
  createUserWithEmailAndPassword,
  updateProfile,
  getIdToken,
} from "firebase/auth";
import axios from "axios";
import { auth } from "../firebaseConfig";

// Generate a random password for users
function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function signUp(email, displayName) {
  try {
    // Generate a random password that the user doesn't need to remember
    const password = generateRandomPassword();
    
    // Create user with email and the generated password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    
    // Update the user's display name
    await updateProfile(user, { displayName });

    await user.reload();
    const idToken = await getIdToken(user, true);

    await sendTokenToBackend(idToken);
  } catch (error) {
    console.error("Error during sign-up:", error);
    throw error;
  }
}

async function sendTokenToBackend(idToken) {
  try {
    await axios.post(
      "https://pledgecontainer--o7wsrym.lemonbay-3b8260a5.spaincentral.azurecontainerapps.io/auth/firebase/signup",
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
  } catch (error) {
    console.error("Error sending token to backend:", error);
    throw error;
  }
}
