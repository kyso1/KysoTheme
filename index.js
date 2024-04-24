/*
 * @name KysoThemev0.0.1
 * @author Kyso (agonised)
 * @description Kyso theme for League of Legends (Pengu Loader)
 * @link https://github.com/kyso1
*/

function addCss(filename) {
  const style = document.createElement('link')
  style.href = filename
  style.type = 'text/css'
  style.rel = 'stylesheet'
  document.body.append(style)
}
import "./main-theme/theme.css"

window.onload = () => {
  // External CDN for css hosting.
  addCss("https://rawcdn.githack.com/kyso1/KysoTheme/a82e777648b692d6e8dfd39eca2c69bd1e900a38/main-theme/theme.css");
  console.log("Theme loaded successfully! Enjoy ;)");

  // Loads the css from local filesystem
  
  //const cssPath = "./main-theme/theme.css";
  //addCss(theme);
}
