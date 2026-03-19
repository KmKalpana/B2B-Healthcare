import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAnalyticsData } from "./analyticsService";
import { AnalyticsData } from "./analyticsTypes";

interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null; // ✅ added for rejected state
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null, // ✅ initialized
};

export const fetchAnalytics = createAsyncThunk<AnalyticsData, void>(
  "analytics/fetch",
  async () => {
    return await getAnalyticsData();
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load analytics";
      });
  },
});

export default analyticsSlice.reducer;
