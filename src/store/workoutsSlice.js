import { createSlice } from '@reduxjs/toolkit';
import { workoutsData } from '../data/workoutsData';

const initialState = {
  workouts: workoutsData,
  selectedWorkout: null,
  loading: false,
  error: null,
};

export const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    selectWorkout: (state, action) => {
      state.selectedWorkout = action.payload;
    },
    clearSelectedWorkout: (state) => {
      state.selectedWorkout = null;
    },
  },
});

export const { selectWorkout, clearSelectedWorkout } = workoutsSlice.actions;

export default workoutsSlice.reducer; 