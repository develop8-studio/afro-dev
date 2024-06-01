import { auth } from "./firebaseConfig";
import { useState } from "react";
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const SignUp = async (e) => {
    e.preventDefault();
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
    } catch (error) {
        console.error("Error signing up: ", error);
    }
};

const GoogleSignUp = async () => {
    try {
        await signInWithPopup(auth, provider);
        router.push("/dashboard");
    } catch (error) {
        console.error("Error signing up with Google: ", error);
    }
};