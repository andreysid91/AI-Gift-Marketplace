module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F2937', // Dark gray for primary elements
        secondary: '#3B82F6', // Blue for accents
        accent: '#FBBF24', // Yellow for highlights
      },
      fontSize: {
        'xxl': '2rem', // Extra extra large font size
        'xl': '1.5rem', // Extra large font size
        'lg': '1.25rem', // Large font size
        'base': '1rem', // Base font size
      },
      spacing: {
        '72': '18rem', // Custom spacing
        '84': '21rem', // Custom spacing
        '96': '24rem', // Custom spacing
      },
      animation: {
        fade: 'fade 0.5s ease-in-out',
        bounce: 'bounce 1s infinite',
      },
      keyframes: {
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15%)' },
        },
      },
    },
  },
  plugins: [],
}