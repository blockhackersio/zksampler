/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{ts,tsx}",
    "./ui/**/*.{ts,tsx}",
    "./public/**/*.html",
  ],
  darkMode: "class",
  plugins: [require("flowbite/plugin")],
  theme: {},
};
