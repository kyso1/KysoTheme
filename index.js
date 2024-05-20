/*
 * @name Clean Theme v1.0
 * @author Kyso
 * @description Kyso Clean theme for League of Legends (Pengu Loader)
 * @link https://github.com/kyso1/KysoTheme
*/

import "./main-theme/theme.css"
function addCss(filename) {
  const style = document.createElement('link')
  style.href = filename
  style.type = 'text/css'
  style.rel = 'stylesheet'
  document.body.append(style)
}
export async function init(context) {
  context.rcp.postInit('rcp-fe-lol-navigation', async (api) => {
      window.__RCP_NAV_API = api
      
      const originalCreate = api._apiHome.navigationManager.createSubNavigationFromJSON
      api._apiHome.navigationManager.createSubNavigationFromJSON = async function (e, t, n) {
          console.log('Home button created sucessfully!')
          console.dir(n)

          n.push({
              id: 'home-button',
              displayName: 'home',
              isPlugin: false,
              enabled: true,
              visibile: true,
              priority: 1,
              url: 'about:blank',
          })

          return originalCreate.apply(this, [e, t, n])
      }
  })
}
window.onload = () => {
  console.log("Theme loaded successfully! Enjoy ;)");
  // Loads the css from local filesystem
  const cssPath = "./main-theme/tema.css";
  _apiHome.appDomNode.textContent = "Home";
  addCss(theme);
}

