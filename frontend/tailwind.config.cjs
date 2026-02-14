/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'serif']
            },
            colors: {
                bg: '#fff6f4', // light coral background
                card: '#ffffff',
                foreground: '#1a1a1a',
                muted: '#6b7280',
                border: '#ffd6d2',
                accent: '#ff5e5b', // coral red accent
                coral: {
                  50: '#fff5f4',
                  100: '#ffddd9',
                  200: '#ffc4be',
                  300: '#ffa399',
                  400: '#ff7a6e',
                  500: '#ff5e5b',
                  600: '#ed3d3a',
                  700: '#c72d2a',
                  800: '#a52826',
                  900: '#882926'
                },
                success: '#22c55e',
                destructive: '#ef4444'
            },
            backgroundImage: {
                'primary-gradient': 'linear-gradient(135deg, #ff5e5b 0%, #ffb199 100%)',
                'accent-gradient': 'linear-gradient(135deg, #ff5e5b 0%, #ffb199 100%)'
            }
        }
    },
    plugins: []
};