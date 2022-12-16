/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                'purple-header': '#2D41A6',
                'background-header': '#f0f2f6',
                'black-header': '#141414',
              },
        },
    },
    plugins: [],
}
