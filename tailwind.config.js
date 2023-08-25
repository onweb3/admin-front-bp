/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                textColor: "#495057",
                grayColor: "#878a99",
                primaryColor: "#002366",
                secondaryColor: "#ff0000",
                tableBorderColor: "#e9ebec",
            },
            boxShadow: {
                sm: "0 1px 2px rgb(56 65 74 / 15%)",
            },
        },
    },
    plugins: [],
};
