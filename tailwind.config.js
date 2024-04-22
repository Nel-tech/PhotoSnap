/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/Components/Nav.jsx",
    "./src/Pages/Home/home.jsx",
  ],
  theme: {
    extend: {
      maxWidth: {
        containerWidth: "1250px",
        primarytextWidth: "25rem",
        secondarytextWidth: "30rem",
        backgroundStorytext: "20rem",
      },
      lineHeigth: {
        Primaryline: "40px",
      },

      width: {
        logoWidth: "15rem",
        heroWidth: "45rem",
        HeroimgWidth: "66rem",
        StoriesImage2: "61rem",
        storiesImages:"26.33rem",
      },
      height: {
        heroHeight: "103.2vh",
        HeroimgHeight: "100vh",
      },
      colors: {
        primary: "rgb(151, 151, 151)",
        TextColor: "#d87d4a",
      },
      margin: {
        leftSide: "9rem",
      },
    },
  },
  plugins: [],
};
