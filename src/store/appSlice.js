import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const THEME_STORAGE_KEY = '@app_theme';

// Async thunks for loading/saving theme
export const loadTheme = createAsyncThunk(
  'app/loadTheme',
  async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      return storedTheme || 'light'; // Default to light if no theme is stored
    } catch (error) {
      return 'light'; // Default to light if error
    }
  }
);

export const saveTheme = createAsyncThunk(
  'app/saveTheme',
  async (_, { getState }) => {
    try {
      const { app: { theme } } = getState();
      const themeToSave = theme || 'light'; // Ensure we have a value
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeToSave);
      return themeToSave;
    } catch (error) {
      return null;
    }
  }
);

// Initial state
const initialState = {
  theme: 'light',
  isLoading: false,
  error: null,
};

// Create slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadTheme
      .addCase(loadTheme.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadTheme.fulfilled, (state, action) => {
        state.isLoading = false;
        state.theme = action.payload;
      })
      .addCase(loadTheme.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // saveTheme
      .addCase(saveTheme.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveTheme.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.theme = action.payload;
        }
      })
      .addCase(saveTheme.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { toggleTheme, setTheme, setLoading, setError } = appSlice.actions;
export default appSlice.reducer; 