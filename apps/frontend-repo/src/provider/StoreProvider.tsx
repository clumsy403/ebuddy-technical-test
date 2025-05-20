"use client";

import React, { useEffect, useRef } from "react"; // Added useEffect
import { Provider } from "react-redux";

import { setUser } from "@/store/reducers";
import { AppStore, makeStore } from "../store/store";

// Import your onAuthStateChanged function from your auth service
// Example: import { onAuthStateChanged } from '../apis/authService';
// OR from your firebase auth file:
import { auth } from "@/firebase/auth";
import { mapFirebaseUserToProfile } from "@/store/action";
import {
    onAuthStateChanged as firebaseOnAuthStateChanged,
    User as FirebaseUser,
} from "firebase/auth";

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const storeRef = useRef<AppStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = makeStore();
    }
    useEffect(() => {
        const unsubscribe = firebaseOnAuthStateChanged(
            auth,
            (firebaseUser: FirebaseUser | null) => {
                if (firebaseUser && storeRef.current) {
                    storeRef.current.dispatch(
                        setUser(mapFirebaseUserToProfile(firebaseUser))
                    );
                } else if (storeRef.current) {
                    storeRef.current.dispatch(setUser(null));
                }
            }
        );

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    return <Provider store={storeRef.current}>{children}</Provider>;
}
