"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAppSelector } from "../store/hooks";

const LoadingScreen: React.FC = () => (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
        }}
    >
        Loading...
    </div>
);

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading && !isAuthenticated && pathname !== "/login") {
            return;
        }

        if (isAuthenticated && pathname === "/login") {
            router.push("/");
            return;
        }

        if (!isAuthenticated && pathname !== "/login") {
            router.push("/login");
            return;
        }
    }, [isAuthenticated, loading, router, pathname]);

    if (loading && !isAuthenticated && pathname !== "/login") {
        return <LoadingScreen />;
    }

    if (isAuthenticated && pathname === "/login") {
        return <LoadingScreen />;
    }

    if (!isAuthenticated && pathname !== "/login") {
        return <LoadingScreen />;
    }

    return <>{children}</>;
};

export default AuthGuard;
