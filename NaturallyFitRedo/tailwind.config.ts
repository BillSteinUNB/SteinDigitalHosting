import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // === COLORS (from design spec) ===
      colors: {
        // Primary
        black: "#000000",
        white: "#FFFFFF",
        red: {
          primary: "#D24028",
          hover: "#B53520",
        },
        // Secondary
        yellow: {
          highlight: "#FFFF42",
        },
        gray: {
          dark: "#1A1A1A",
          medium: "#333333",
          light: "#F5F5F5",
          border: "#E0E0E0",
        },
        // Functional
        success: "#28A745",
        warning: "#FFC107",
        error: "#DC3545",
        star: "#FFD700",
        "star-empty": "#D3D3D3",
      },
      
      // === TYPOGRAPHY ===
      fontFamily: {
        heading: ["var(--font-oswald)", "Impact", "sans-serif"],
        body: ["var(--font-open-sans)", "Helvetica Neue", "sans-serif"],
      },
      fontSize: {
        hero: ["48px", { lineHeight: "1.1" }],
        h1: ["36px", { lineHeight: "1.1" }],
        h2: ["28px", { lineHeight: "1.1" }],
        h3: ["22px", { lineHeight: "1.2" }],
        h4: ["18px", { lineHeight: "1.3" }],
        body: ["16px", { lineHeight: "1.5" }],
        small: ["14px", { lineHeight: "1.5" }],
        tiny: ["12px", { lineHeight: "1.5" }],
      },
      letterSpacing: {
        heading: "0.02em",
        button: "0.05em",
      },
      
      // === SPACING (8px base grid) ===
      spacing: {
        "4.5": "18px",
        "13": "52px",
        "15": "60px",
        "18": "72px",
        "22": "88px",
      },
      
      // === CONTAINER ===
      maxWidth: {
        container: "1280px",
      },
      
      // === Z-INDEX TOKENS ===
      zIndex: {
        dropdown: "100",
        sticky: "200",
        modal: "300",
        toast: "400",
      },
      
      // === TRANSITIONS ===
      transitionDuration: {
        DEFAULT: "200ms",
      },
      
      // === BOX SHADOW ===
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.1)",
        dropdown: "0 4px 20px rgba(0, 0, 0, 0.1)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.15)",
      },
      
      // === BORDER RADIUS ===
      borderRadius: {
        none: "0",
        sm: "4px",
        DEFAULT: "8px",
        full: "9999px",
      },
      
      // === KEYFRAMES & ANIMATIONS ===
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "slide-up": "slide-up 200ms ease-out",
        "slide-down": "slide-down 200ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
