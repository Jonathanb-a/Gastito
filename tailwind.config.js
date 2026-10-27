/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: token("background"),
        surface: { DEFAULT: token("surface"), muted: token("surface-muted") },
        border: token("border"),
        outline: token("outline"),
        foreground: token("foreground"),
        muted: token("muted"),
        primary: { DEFAULT: token("primary"), foreground: token("primary-foreground") },
        success: token("success"),
        warning: token("warning"),
        danger: token("danger"),
        info: token("info"),
      },
      fontSize: {
        caption: ["12px", { lineHeight: "16px" }],
        footnote: ["13px", { lineHeight: "18px" }],
        body: ["16px", { lineHeight: "24px" }],
        subtitle: ["18px", { lineHeight: "26px", fontWeight: "600" }],
        title: ["22px", { lineHeight: "28px", fontWeight: "700" }],
        headline: ["28px", { lineHeight: "34px", fontWeight: "700" }],
        display: ["40px", { lineHeight: "44px", fontWeight: "800" }],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
    },
  },
  plugins: [],
};
