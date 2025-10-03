/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'emergency-pulse': 'emergencyPulse 1s ease-in-out infinite',
        'radar-sweep': 'radarSweep 3s linear infinite',
        'alert-flash': 'alertFlash 0.5s ease-in-out infinite alternate',
      },
      keyframes: {
        emergencyPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        alertFlash: {
          '0%': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
          '100%': { backgroundColor: 'rgba(239, 68, 68, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}