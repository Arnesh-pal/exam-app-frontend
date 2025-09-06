// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#673ab7', // A deep purple
        },
        secondary: {
            main: '#ffab40', // A vibrant orange for accents
        },
        background: {
            default: '#f4f4f9', // Light grey background
            paper: '#ffffff',   // White for cards and surfaces
        },
    },
    shape: {
        borderRadius: 12, // More rounded borders
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 600,
        },
    },
    // We can add default styles for specific components
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    // Add a subtle transition to all cards
                    transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                    '&:hover': {
                        transform: 'scale3d(1.02, 1.02, 1)', // Slightly enlarge on hover
                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)', // Deeper shadow on hover
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // More modern, less SHOUTY buttons
                    fontWeight: 600,
                },
            },
        },
    },
});

export default theme;