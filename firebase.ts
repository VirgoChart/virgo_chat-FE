import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6vhwcdi2-hoFqq96kqmjS3sgMVgEvuHE",
  authDomain: "otp-verify-88566.firebaseapp.com",
  projectId: "otp-verify-88566",
  storageBucket: "otp-verify-88566.firebasestorage.app",
  messagingSenderId: "877002133219",
  appId: "1:877002133219:web:49506fec334982683e7fd6",
  measurementId: "G-ZKWSGKCTRB",
};

// Initialize Firebase only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics on the client side only
if (typeof window !== "undefined") {
  getAnalytics(app);
}

const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth, sendSignInLinkToEmail };
