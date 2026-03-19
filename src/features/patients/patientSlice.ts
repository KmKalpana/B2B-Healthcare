import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { patientService } from './patientService';
import type { Patient } from './patientTypes';

export const fetchPatients = createAsyncThunk(
  'patients/fetch',
  async () => {
    const patients = await patientService.getPatients();
    return patients;
  }
);

export const addPatient = createAsyncThunk(
  'patients/add',
  async (patient: Omit<Patient, 'id' | 'createdAt'>) => {
    return await patientService.addPatient(patient);
  }
);

export const updatePatient = createAsyncThunk(
  'patients/update',
  async ({ id, updates }: { id: string; updates: Partial<Patient> }) => {
    await patientService.updatePatient(id, updates);
    return { id, updates };
  }
);

export const deletePatient = createAsyncThunk(
  'patients/delete',
  async (id: string) => {
    await patientService.deletePatient(id);
    return id;
  }
);

const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    list: [] as Patient[],
    loading: false,
    view: 'grid' as 'grid' | 'list',
    isFetched: false,
  },
  reducers: {
    toggleView: (state) => {
      state.view = state.view === 'grid' ? 'list' : 'grid';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.isFetched = true;
      })
      .addCase(fetchPatients.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const index = state.list.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload.updates };
        }
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p.id !== action.payload);
      });
  }
});

export const { toggleView } = patientSlice.actions;
export default patientSlice.reducer;
