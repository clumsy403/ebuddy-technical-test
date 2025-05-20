import { signInWithEmail, signOutUser, signUpWithEmail } from "@/firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { User as FirebaseUser } from 'firebase/auth';
import apiClient from '../utils/apiClient'; // Import the API client

import { db } from "@/firebase";
import { API_ENDPOINTS, USER_COLLECTION } from "@repo/shared-types/constants";
import { User } from "@repo/shared-types/types";
import { collection, doc, setDoc } from "firebase/firestore";
import { clearUser, setAuthError, setAuthLoading, setUser } from "./reducers"; // Import from reducers
// Utility function to map Firebase user to our User profile
export const mapFirebaseUserToProfile = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
});

// Async thunk for user login
export const loginUser = createAsyncThunk<
    User,
    {email: string, password: string},
    {rejectValue: string}
>(
    "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const firebaseUser = await signInWithEmail(email, password);
      return mapFirebaseUserToProfile(firebaseUser);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to login');
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk<
    User,
    { 
        email: string; 
        password: string; 
        firstName?: string; 
        lastName?: string; 
        age?: number; 
        occupation?: string; 
    },
    {rejectValue: string}
>(
    'auth/registerUser',
    async({email, password, firstName, lastName, age, occupation}, {rejectWithValue}) => {
        try {
            const firebaseUser = await signUpWithEmail(email, password);
            // Initial profile from Firebase Auth
            let userProfile = mapFirebaseUserToProfile(firebaseUser);

            // Data to save in Firestore, including new fields
            const firestoreData: Partial<User> = {
                id: userProfile.id,
                email: userProfile.email,
                displayName: userProfile.displayName || `${firstName} ${lastName}` || "", // Use names for displayName if not set by Firebase
                firstName: firstName || "",
            lastName: lastName || "",
            age: age || null, // Store as null if undefined
            occupation: occupation || "",
        };

        const userDocRef = doc(collection(db, USER_COLLECTION), firebaseUser.uid);
        await setDoc(userDocRef, firestoreData, { merge: true }); // Use merge: true to be safe if doc exists

        // Update userProfile to include new fields for the return value / Redux state
        userProfile = { ...userProfile, ...firestoreData };

        return userProfile;
    } catch (error) {
        // Check if error is a Firebase AuthError and has a code property
        if (error instanceof Error && 'code' in error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                        return rejectWithValue('This email address is already in use.');
                    case 'auth/invalid-email':
                        return rejectWithValue('The email address is not valid.');
                    case 'auth/operation-not-allowed':
                        return rejectWithValue('Email/password accounts are not enabled.');
                    case 'auth/weak-password':
                        return rejectWithValue('The password is too weak.');
                    default:
                        return rejectWithValue(error.message || 'Failed to register');
                }
            }
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to register');
        }
    }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk<
    void, // Returns void on success
    void, // No arguments needed
    { rejectValue: string }
>(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            await signOutUser();

        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to logout');
        }
    }
);

// Async thunk for fetching user details
export const fetchUserDetails = createAsyncThunk<
    User, 
    void, 
    { rejectValue: string; state: { auth: { user: User | null } } }
>(
    "auth/fetchUserDetails",
    async (_, { rejectWithValue, getState }) => {
        const state = getState();
      
        if (!state.auth.user?.id) {
            return rejectWithValue("User not authenticated to fetch details.");
        }
        try {
            const userData = await apiClient<User>(API_ENDPOINTS.FETCH_USER);
            return userData;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user details');
        }
    }
);

// Async thunk for updating user details
export const updateUserDetails = createAsyncThunk<
    User, 
    Partial<Omit<User, 'id' | 'email'>>, 
    { rejectValue: string; state: { auth: { user: User | null } } }
>(
    "auth/updateUserDetails",
    async (userDataToUpdate, { rejectWithValue, getState }) => {
        const state = getState();
         if (!state.auth.user?.id) {
            return rejectWithValue("User not authenticated to update details.");
        }
        try {
            const updatedUser = await apiClient<User>(API_ENDPOINTS.UPDATE_USER, {
                method: 'PUT',
                body: userDataToUpdate,
            });
            return updatedUser;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to update user details');
        }
    }
);

export { clearUser, setAuthError, setAuthLoading, setUser };
