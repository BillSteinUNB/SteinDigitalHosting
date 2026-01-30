/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Championship Gold
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E5C76B',
          dark: '#B8960C',
          muted: '#A89050',
        },
        // Foundation - Velvet Black
        black: {
          pure: '#000000',
          rich: '#0A0A0A',
          elevated: '#141414',
          soft: '#1A1A1A',
          border: '#2A2A2A',
        },
        // Light Surfaces
        white: {
          pure: '#FFFFFF',
          warm: '#FAFAF8',
        },
        gray: {
          light: '#F5F5F3',
          mid: '#E5E5E3',
        },
        // Text
        text: {
          white: '#FFFFFF',
          gray: '#A0A0A0',
          dark: '#1A1A1A',
          muted: '#666666',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      fontSize: {
        hero: 'clamp(3rem, 8vw, 6rem)',
        display: 'clamp(2rem, 5vw, 3.5rem)',
        h1: 'clamp(1.75rem, 4vw, 2.5rem)',
        h2: 'clamp(1.5rem, 3vw, 2rem)',
        h3: '1.25rem',
      },
      letterSpacing: {
        ultra: '0.15em',
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'golden-reveal': 'goldenReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        goldenReveal: {
          '0%': { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
          '100%': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
        },
      },
      transitionTimingFunction: {
        elegant: 'cubic-bezier(0.4, 0, 0.2, 1)',
        reveal: 'cubic-bezier(0.16, 1, 0.3, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 25%, #D4AF37 50%, #B8960C 75%, #D4AF37 100%)',
        'gradient-gold-shimmer': 'linear-gradient(110deg, transparent 20%, rgba(212, 175, 55, 0.1) 50%, transparent 80%)',
      },
    },
  },
  plugins: [],
};
