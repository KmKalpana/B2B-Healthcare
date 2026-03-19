import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, logoutApi, signupApi } from "./authService";

export type AuthUser = {
  email: string | null;
};

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"), // ✅ persisted
  loading: false,
  error: null,
};

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: any, thunkAPI) => {
    try {
      return await loginApi(email, password);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// SIGNUP
export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }: any, thunkAPI) => {
    try {
      return await signupApi(name, email, password);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await logoutApi();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        localStorage.setItem("user", JSON.stringify(action.payload)); // ✅
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        localStorage.setItem("user", JSON.stringify(action.payload)); // ✅
      })
      .addCase(signupUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("user"); // ✅
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;