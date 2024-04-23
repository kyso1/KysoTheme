function addCss(filename) {
  const style = document.createElement('link')
  style.href = filename
  style.type = 'text/css'
  style.rel = 'stylesheet'
  document.body.append(style)
}

window.onload = () => {
  // External CDN for css hosting.
  
  addCss("https://rawcdn.githack.com/kyso1/KysoTheme/main/main-theme/theme.css");
  console.log("Theme loaded successfully! Enjoy ;)");
}