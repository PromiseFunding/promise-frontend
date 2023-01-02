import { Poppins } from '@next/font/google'
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const poppins = Poppins({
    weight: ['400', '500', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
})

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
    },
    typography: {
        fontFamily: poppins.style.fontFamily,
    },
});

export default theme;
