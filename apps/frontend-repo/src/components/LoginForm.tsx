"use client";

import { loginUser, registerUser } from "@/store/action";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { User } from "@repo/shared-types/types";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";

interface LoginFormProps {
    onAuthSuccess?: (user: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState<number | string>("");
    const [occupation, setOccupation] = useState("");
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { loading, error: authError } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let action;
        if (isLoginMode) {
            action = dispatch(loginUser({ email, password }));
        } else {
            action = dispatch(
                registerUser({
                    email,
                    password,
                    firstName,
                    lastName,
                    age: age ? parseInt(String(age), 10) : undefined, // Parse age to number
                    occupation,
                })
            );
        }

        try {
            const resultAction = await action;
            if (
                loginUser.fulfilled.match(resultAction) ||
                registerUser.fulfilled.match(resultAction)
            ) {
                const user = resultAction.payload;
                console.log(
                    isLoginMode ? "Login successful:" : "Sign up successful:",
                    user
                );
                if (onAuthSuccess && user) {
                    onAuthSuccess(user);
                }
            } else {
                console.error(
                    isLoginMode ? "Login failed:" : "Sign up failed:",
                    resultAction.payload
                );
            }
        } catch (err) {
            console.error("Form submission error:", err);
        }
    };

    const toggleFormMode = () => {
        setIsLoginMode(!isLoginMode);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper
                elevation={3}
                sx={{
                    marginTop: 8,
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    {isLoginMode ? "Sign In" : "Sign Up"}
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ mt: 1, width: "100%" }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete={
                            isLoginMode ? "current-password" : "new-password"
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    {!isLoginMode && (
                        <>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="firstName"
                                label="First Name"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={loading}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="lastName"
                                label="Last Name"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={loading}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="age"
                                label="Age"
                                type="number"
                                id="age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                disabled={loading}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="occupation"
                                label="Occupation"
                                id="occupation"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                                disabled={loading}
                            />
                        </>
                    )}
                    {authError && (
                        <Typography
                            color="error"
                            variant="body2"
                            sx={{ mt: 1 }}
                        >
                            {authError}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading
                            ? "Loading..."
                            : isLoginMode
                              ? "Sign In"
                              : "Sign Up"}
                    </Button>

                    <Button
                        onClick={toggleFormMode}
                        disabled={loading}
                        size="small"
                        fullWidth
                    >
                        {isLoginMode
                            ? "Don't have an account? Sign Up"
                            : "Already have an account? Sign In"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginForm;
