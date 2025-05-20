"use client"; // Required for onClick handlers and hooks

import { fetchUserDetails, logoutUser } from "@/store/action";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { useRouter } from "next/navigation"; // Not used currently
import RefreshDetailsButton from "@/components/RefreshDetailsButton"; // Import new component
import UpdateProfileForm from "@/components/UpdateProfileForm"; // Import new component
import { useEffect } from "react";

import {
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    // Grid, // No longer directly used for form layout here
    Paper,
    Typography,
} from "@mui/material";

export default function Home() {
    const dispatch = useAppDispatch();
    // const router = useRouter(); // Not used currently
    const { user, isAuthenticated, loading, error } = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
        // Fetch user details on initial load if authenticated and details aren't already loaded
        // Or if user object is present but might be missing some fields we want to refresh
        if (isAuthenticated && !loading) {
            // Avoid fetching if already loading something else like login/register
            // Simple check: if user is present but maybe missing firstName (as a proxy for full details)
            // More robust checks might be needed depending on how full user object is determined
            if (!user?.firstName) {
                dispatch(fetchUserDetails());
            }
        }
    }, [dispatch, isAuthenticated, user, loading]); // Add loading to dependencies to avoid loop if fetch starts loading

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            // router.push('/login'); // Optional: redirect after logout
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    // Loading state for initial page access before user is determined by AuthGuard
    if (loading && !isAuthenticated) {
        // This state is mostly handled by AuthGuard now
        return (
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    mt: 8,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                }}
            >
                <CircularProgress />
            </Container>
        );
    }

    // If not authenticated and not loading, AuthGuard should have redirected.
    // This is a fallback or for scenarios where AuthGuard might not be used at this level.
    if (!isAuthenticated && !loading) {
        return (
            <Container
                component="main"
                maxWidth="xs"
                sx={{ mt: 8, textAlign: "center" }}
            >
                <Typography variant="h6">
                    Please log in to view this page.
                </Typography>
            </Container>
        );
    }

    // If user is authenticated but user object is somehow null (shouldn't happen if isAuthenticated is true)
    // or if still loading the very first set of user details for an authenticated user.
    if (!user || (loading && !user.firstName)) {
        // Added a check for user.firstName before showing full page
        return (
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    mt: 8,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                }}
            >
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading user data...</Typography>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome, {user?.email || "User"}!
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h5" component="h2" gutterBottom>
                    User Profile
                </Typography>

                {/* Pass relevant props to UpdateProfileForm */}
                <UpdateProfileForm
                    user={user}
                    loading={loading}
                    error={error}
                />

                <Box sx={{ mt: 2 }}>
                    {/* Pass relevant props to RefreshDetailsButton */}
                    <RefreshDetailsButton loading={loading} />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading && (
                        <CircularProgress size={24} sx={{ marginRight: 1 }} />
                    )}
                    Logout
                </Button>
            </Paper>
        </Container>
    );
}
