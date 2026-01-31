import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material You Inspired Theme (Derived from Daisy Warmth)
        primary: {
          DEFAULT: "#825500", // Darker Gold/Yellow
          container: "#FFDDAE", // Light Peach/Yellow
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#6B5D4D",
          container: "#F5F0E8", // Light Cream
          foreground: "#FFFFFF",
        },
        surface: {
          DEFAULT: "#FFFEF9", // Warm White
          variant: "#F0EAE2", // Soft Beige
          container: "#F5F0E8", // Card Background
        },
        outline: "#857360",
        background: {
          DEFAULT: "#E6DCCA", // Sand color
          white: "#FFFEF9",
          light: "#F0EAE2",
        },
        foreground: {
          DEFAULT: "#3D3225",
          muted: "#857360",
          secondary: "#6B5D4D",
          title: "#3D3225", // Dark brown for contrast on sand background
        },

        // Legacy support (mapping to new system where possible)
        accent: {
          yellow: "#E8B931",
          green: "#7A9B5C",
          white: "#FFFFFF",
        },
        state: {
          success: "#7A9B5C",
          pending: "#E8B931",
          error: "#BA1A1A",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.75rem", // Material You standard
        "4xl": "2.5rem",
        "pill": "9999px",
      },
      boxShadow: {
        "elevation-1": "0 1px 2px 0 rgba(0,0,0,0.05)",
        "elevation-2": "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        "elevation-3": "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
