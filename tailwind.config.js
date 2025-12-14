/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                astro: {
                    950: '#050505',
                    900: '#0a0a0a',
                    800: '#121212',
                    700: '#1e1e1e',
                    600: '#2a2a2a',
                    500: '#3d3d3d',
                    accent: '#6366f1',
                    gold: '#FFD700',
                    'gold-dim': '#B8860B',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                'slide-up': 'slideUp 0.3s ease-out forwards',
                'slide-down': 'slideDown 0.3s ease-out forwards',
                'pulse-gold': 'pulseGold 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    from: { opacity: '0', transform: 'translateY(-20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                pulseGold: {
                    '0%, 100%': { boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)' },
                    '50%': { boxShadow: '0 0 25px rgba(255, 215, 0, 0.4)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
