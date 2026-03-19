import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginApi, logoutApi, signupApi } from "./authService";
import { AuthState, AuthUser } from "./authTypes";
import { getStoredUser } from "./getStoredUser";

const initialState: AuthState = {
  user: getStoredUser(),
  loading: false,
  error: null,
};

const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

const mapAuthError = (err: any): string => {
  const message = err?.message || "";

  if (
    err?.code === "auth/invalid-credential" ||
    err?.code === "auth/user-not-found" ||
    err?.code === "auth/wrong-password" ||
    message.includes("invalid-credential") ||
    message.includes("user-not-found") ||
    message.includes("wrong-password")
  ) {
    return "Invalid email or password";
  }

  if (
    err?.code === "auth/invalid-email" ||
    message.includes("invalid-email")
  ) {
    return "Invalid email format";
  }

  return "Something went wrong";
};

// LOGIN
export const loginUser = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, thunkAPI) => {
  try {
    return await loginApi(email, password);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(mapAuthError(err));
  }
});

// SIGNUP
export const signupUser = createAsyncThunk<
  AuthUser,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/signup", async ({ name, email, password }, thunkAPI) => {
  try {
    return await signupApi(name, email, password);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(mapAuthError(err));
  }
});

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
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: action.payload,
            expiresAt,
          })
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: action.payload,
            expiresAt,
          })
        );
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        localStorage.removeItem("auth");
      });
  },
});

export const { clearAuthError, setUser } = authSlice.actions;
export default authSlice.reducer;