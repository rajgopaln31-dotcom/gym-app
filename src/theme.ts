import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: { fontFamily: 'var(--b)' },
  shape: { borderRadius: 6 },
  components: {
    MuiButtonBase: { defaultProps: { disableRipple: true } },
  },
});

export default theme;
