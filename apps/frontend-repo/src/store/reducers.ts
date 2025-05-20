import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@repo/shared-types/types";
import { fetchUserDetails, loginUser, logoutUser, registerUser, updateUserDetails } from "./action";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            if (action.payload) {
                state.isAuthenticated = true;
            }
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        setAuthLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setAuthError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
        })
              .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload || 'Login failed';
      })
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload || 'Register failed';
      })
      // Logout user
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
      })
      // Fetch User Details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        state.error = null;
      })
      .addCase(fetchUserDetails.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch details';
      })
      // Update User Details
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        state.error = null;
      })
      .addCase(updateUserDetails.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update details';
      });
    }
})

export const { setUser, clearUser, setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;