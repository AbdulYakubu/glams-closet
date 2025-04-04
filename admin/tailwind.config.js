

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        primary: "#c1e8ef36",
        secondary: "#43c2d1",
        tertiary: "#272626",
        deep:"#072A6C",
        gray: {
          10: "#EEEEEE",
          20: "#A2A2A2",
          30: "#787B7B",
          50: "#585858",
          90: "#141414",
        },
      },
    },
    screens: {
      xs: "400px",
      "3xl": "1680px",
      "4xl": "2200px",
    },
    backgroundImage: {
      hero: "url(/src/assets/assets/bg.png)",
      banner: "url(/src/assets/assets/banner.png)",
    }
  },
  plugins: [],
} 