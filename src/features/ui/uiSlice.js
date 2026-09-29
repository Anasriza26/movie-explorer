import { createSlice } from '@reduxjs/toolkit';

// Optional chaining: matchMedia doesn't exist in Jest's jsdom.
const getSystemMode = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { mode: getSystemMode() }, // overridden by preloadedState if the user chose before
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { toggleMode } = uiSlice.actions;
export const selectMode = (state) => state.ui.mode;
export default uiSlice.reducer;
