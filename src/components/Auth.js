// auth.js
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./Firebase";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Giriş uğurlu:", user);
  } catch (error) {
    console.error("Giriş xətası:", error.message);
  }
};
