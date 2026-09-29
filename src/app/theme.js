import { createTheme } from '@mui/material/styles';

/** MUI theme (used by Dialog, Menu, Slider). Tailwind handles the rest of the UI. */
export const buildTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#f5b301', contrastText: '#0c0e13' },
      ...(mode === 'dark' && { background: { default: '#0c0e13', paper: '#141721' } }),
    },
    shape: { borderRadius: 12 },
    typography: { fontFamily: '"DM Sans", system-ui, sans-serif' },
  });
