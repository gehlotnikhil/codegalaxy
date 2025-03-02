import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  RecaptchaVerifier,
  PhoneAuthProvider, 

  signInWithCredential,
} from "firebase/auth";

// Firebase Configuration (Replace with your actual Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyCJh40Y2lR4N1dxE2lPEw_HbA39V09l9gg",
    authDomain: "codegalaxyproject.firebaseapp.com",
    projectId: "codegalaxyproject",
    storageBucket: "codegalaxyproject.firebasestorage.app",
    messagingSenderId: "61985322403",
    appId: "1:61985322403:web:07655ce53fadb94d829616",
    measurementId: "G-YTX601QMEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Login
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("User Info:", result.user);
    return result.user;
  } catch (error) {
    console.error("Login Failed:", error);
    return null;
  }
};

// Google Logout
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Logout Failed:", error);
  }
};

// Setup Recaptcha for SMS MFA
export const setupRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
};

// Send OTP for MFA
export const sendOtp = async (phoneNumber: string, recaptchaVerifier: any) => {
  try {
    const provider = new PhoneAuthProvider(auth);
    const verificationId = await provider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);
    return verificationId;
  } catch (error) {
    console.error("OTP Sending Failed:", error);
    return null;
  }
};

// Verify OTP for MFA
export const verifyOtp = async (verificationId: string, otp: string) => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    await signInWithCredential(auth, credential);
    console.log("Phone Authentication Successful");
  } catch (error) {
    console.error("OTP Verification Failed:", error);
  }
};

export { auth };
