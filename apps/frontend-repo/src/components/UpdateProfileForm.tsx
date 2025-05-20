"use client";

import { updateUserDetails } from "@/store/action";
import { useAppDispatch } from "@/store/hooks";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import { User } from "@repo/shared-types/types";
import { useEffect, useState } from "react";

interface UpdateProfileFormProps {
    user: User | null;
    loading: boolean;
    error: string | null; // For displaying update errors from Redux store
}

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
    user,
    loading,
    error,
}) => {
    const dispatch = useAppDispatch();

    const [displayName, setDisplayName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState<number | string>("");
    const [occupation, setOccupation] = useState("");

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "info" | "warning" | "error"
    >("info");

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "");
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setAge(user.age || "");
            setOccupation(user.occupation || "");
        }
    }, [user]);

    const handleUpdateDetails = async () => {
        if (!user) return;

        const dataToUpdate: Partial<Omit<User, "id" | "email">> = {};
        // Only include fields that have actually changed
        if (displayName !== (user.displayName || ""))
            dataToUpdate.displayName = displayName;
        if (firstName !== (user.firstName || ""))
            dataToUpdate.firstName = firstName;
        if (lastName !== (user.lastName || ""))
            dataToUpdate.lastName = lastName;

        const currentAge = user.age || ""; // Treat null/undefined from user.age as empty string for comparison
        const formAge = age === "" ? "" : Number(age); // Ensure age from form is number or empty string
        if (formAge !== currentAge) {
            dataToUpdate.age = age === "" ? null : Number(age);
        }

        if (occupation !== (user.occupation || ""))
            dataToUpdate.occupation = occupation;

        if (Object.keys(dataToUpdate).length === 0) {
            setSnackbarMessage("No changes to update.");
            setSnackbarSeverity("info");
            setSnackbarOpen(true);
            return;
        }

        try {
            await dispatch(updateUserDetails(dataToUpdate)).unwrap();
            setSnackbarMessage("Details updated successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (err) {
            // Redux store error prop will display specific error from thunk
            // Optionally, show a generic error toast here too
            setSnackbarMessage(
                "Failed to update details. See error below form."
            );
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            console.error("Update details failed:", err);
        }
    };

    const handleSnackbarClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Box component="form" noValidate autoComplete="off">
            {/* Display error from Redux store (e.g., validation errors from API) */}
            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    Error from server: {error}
                </Typography>
            )}
            <Grid container spacing={2}>
                <Grid>
                    <TextField
                        fullWidth
                        id="firstName"
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={loading}
                        margin="normal"
                    />
                </Grid>
                <Grid>
                    <TextField
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={loading}
                        margin="normal"
                    />
                </Grid>
                <Grid>
                    <TextField
                        fullWidth
                        id="displayName"
                        label="Display Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={loading}
                        margin="normal"
                    />
                </Grid>
                <Grid>
                    <TextField
                        fullWidth
                        id="age"
                        label="Age"
                        type="number"
                        value={age}
                        onChange={(e) =>
                            setAge(
                                e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                            )
                        }
                        disabled={loading}
                        margin="normal"
                    />
                </Grid>
                <Grid>
                    <TextField
                        fullWidth
                        id="occupation"
                        label="Occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        disabled={loading}
                        margin="normal"
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button
                    variant="contained"
                    onClick={handleUpdateDetails}
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        "Update My Details"
                    )}
                </Button>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UpdateProfileForm;
