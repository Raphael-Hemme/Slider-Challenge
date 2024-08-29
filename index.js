const bgColorLight = "hsl(0, 0%, 96%)";
const textColorLight = "hsl(0, 0%, 20%)";
const accentColorLight = "hsl(281, 78%, 30%)";

const bgColorDark = "hsl(0, 0%, 10%)";
const textColorDark = "hsl(0, 0%, 80%)";
const accentColorDark = "hsl(281, 78%, 70%)";

const root = document.documentElement;
let isDarkMode = false;

const toggleLightDarkMode = () => {
  console.log("currVal", isDarkMode);

  // Change the values of the CSS variables
  root.style.setProperty("--bg-color", isDarkMode ? bgColorLight : bgColorDark);
  root.style.setProperty(
    "--text-color",
    isDarkMode ? textColorLight : textColorDark
  );
  root.style.setProperty(
    "--accent-color",
    isDarkMode ? accentColorLight : accentColorDark
  );

  isDarkMode = !isDarkMode;
};
