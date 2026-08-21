
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-e9cc1.firebaseapp.com",
  projectId: "interviewiq-e9cc1",
  storageBucket: "interviewiq-e9cc1.firebasestorage.app",
  messagingSenderId: "833776666710",
  appId: "1:833776666710:web:880ee3f99f1df0ad3513f7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});

export { auth, provider };






// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
//   authDomain: "interviewiq-e9cc1.firebaseapp.com",
//   projectId: "interviewiq-e9cc1",
//   storageBucket: "interviewiq-e9cc1.firebasestorage.app",
//   messagingSenderId: "833776666710",
//   appId: "1:833776666710:web:880ee3f99f1df0ad3513f7"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

// export const provider = new GoogleAuthProvider();
// provider.setCustomParameters({
//   prompt: "select_account"
// });