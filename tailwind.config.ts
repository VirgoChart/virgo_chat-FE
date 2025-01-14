import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: "#B4916C",
        900: "#B4916C",
        800: "#D9A767",
        700: "#DBBCB4",
        600: "#A35427",
        400: "#FF9B1E",
        350: "#FAB55A",
        300: "#FFC961",
        200: "#F3C796",
        100: "#EFEBE8",
      },
      dark: {
        DEFAULT: "#242424",
        900: "#242424",
        800: "#222222",
        700: "#383838",
        600: "#444444",
        500: "#626262",
        450: "#808080",
        400: "#939CAB",
        300: "#B9B9B9",
        200: "#D3CDC7",
        150: "#00000080",
        100: "#ccc",
      },
      white: {
        DEFAULT: "#FFFFFF",
        900: "#F5F5F5",
        800: "#F9F9F9",
        700: "#D9D9D9",
        600: "#f2f2f2",
        500: "#E7E7E7",
        400: "#E8E7E7",
        300: "#F5F5F5",
        200: "#EBEBEB",
      },
      yellow: {
        DEFAULT: "#F9A825",
        900: "#F5CF05",
        800: "#FDE047",
        700: "#FACC15",
        600: "#EAB308",
        500: "#CA8A04",
        400: "#A16207",
        300: "#854D0E",
        200: "#713F12",
        100: "#5F370E",
      },
      red: {
        DEFAULT: "#FC2B2B",
        900: "#FC2B2B",
        800: "#E01020",
        700: "#CF5763",
        600: "#DC2626",
        500: "#EB5757",
        400: "#F87171",
        300: "#FA6338",
        200: "#FCA5A5",
        100: "#FECACA",
      },
      blue: {
        DEFAULT: "#0089ED",
        900: "#1E3A8A",
        800: "#0089ED",
        700: "#1D4ED8",
        600: "#2563EB",
        500: "#33496C",
        400: "#3B82F6",
        300: "#60A5FA",
        200: "#93C5FD",
        100: "#BFDBFE",
      },
      gray: {
        DEFAULT: "#939CAB",
        900: "#111827",
        800: "#1F2937",
        700: "#374151",
        600: "#4B5563",
        500: "#6B7280",
        400: "#9CA3AF",
        300: "#D1D5DB",
        200: "#E5E7EB",
        100: "#F3F4F6",
      },
      green: {
        DEFAULT: "#15803D",
        900: "#14532D",
        800: "#166534",
        700: "#15803D",
        600: "#22C55E",
        500: "#4ADE80",
        400: "#86EFAC",
        300: "#BBF7D0",
        200: "#D1FAE5",
        100: "#DCFCE7",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      fill: {
        hover: {
          blue: "#4299e1",
          red: "#f56565",
        },
      },
      keyframes: {
        fadeInDown: {
          "0%": {
            top: "50%",
            opacity: "0",
          },
          "100%": {
            top: "100%",
            opacity: "1",
          },
        },
        fadeInUp: {
          "0%": {
            bottom: "50%",
            opacity: "0",
          },
          "100%": {
            bottom: "100%",
            opacity: "1",
          },
        },
        changeColor: {
          "0%": {
            backgroundSize: "0 100%",
            backgroundColor: "#B9B9B9",
          },
          "100%": {
            backgroundSize: "100% 100%",
            backgroundColor: "#B4916C",
          },
        },
      },
    },
  },
  variants: {
    fill: ["hover"],
  },
  plugins: [],
};

export default config;
