/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: { // 👈 Додай або розшир цю секцію
        extend: {
            fontFamily: { // 👈 Додай це
                sans: ['Inter', 'sans-serif'],
                serif: ['DM Serif Display', 'serif'],
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
    ],
}