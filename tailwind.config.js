/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#CCD7E4",
        secondary: "#333333",
        textPrimary: "#272727",
        iconPrimary: "#1479FF",
        borderPrimary: "#888888",
        boxPrimary: "rgba(112, 112, 112, 0.1)",
        BtnText: "#FFFFFF",
        BtnBg: "#143664",
        background: "#F5F5F5",
      },
      width: {
        "43rem": "43rem",
        "28rem": "28rem",
        "32%": "32%",
        "48%": "48%",
        "14.5rem": "14.5rem",
      },
      height: {
        "calc-height": "calc(100svh - 35svh)",
        "calc-height-two": "calc(100svh - 16svh)",
        "calc-chat": "calc(100vh - 52vh)",
      },
      border: {
        "1px": "1px",
      },
      boxShadow: {
        "2xl": "0 0px 4px 4px rgba(200, 200, 200, 0.1)",
        "right-bottom":
          "6px 0px 10px rgba(200, 200, 200, 0.1), 0px 6px 10px rgba(200, 200, 200, 0.1)",
      },
      screens: {
        xs: [{ min: "0px", max: "767px" }],
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        scrollmedia: [{ min: "768px", max: "1440px" }],
        "2xl": "1536px",
        "3xl": "1700px",
        "4xl": "2100px",
      },
    },
  },
  plugins: [],
};
