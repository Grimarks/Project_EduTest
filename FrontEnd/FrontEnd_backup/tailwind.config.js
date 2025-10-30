/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    safelist: [
        "bg-destructive",
        "text-destructive-foreground",
        "hover:bg-destructive/90"
    ],
    // eslint-disable-next-line no-undef
    plugins: [require("tailwindcss-animate")],
};
