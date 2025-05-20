import { AuthError, createUserWithEmailAndPassword, onAuthStateChanged as firebaseOnAuthStateChanged, getAuth, signInWithEmailAndPassword, signOut, User, } from "firebase/auth";
import { app } from "./index";

export const auth = getAuth(app);

export const signUpWithEmail = async(email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        const authError = error as AuthError;
        console.error("Error signing up with email", authError);
        throw authError;
    }
}

export const signInWithEmail = async(email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        const authError = error as AuthError;
        console.error("Error signing in with email", authError);
        throw authError;
    }
}

export const signOutUser = async() => {
    try {
        await signOut(auth);
    } catch (error) {
        const authError = error as AuthError;
        console.error("Error signing out", authError);
        throw authError;
    }
}

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
    return firebaseOnAuthStateChanged(auth, callback);
}

export { auth as firebaseAuth };
