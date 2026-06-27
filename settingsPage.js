/**
 * KysoTheme – Página de Configurações
 * Injeta uma aba "KysoTheme" nas configurações nativas do cliente LoL.
 */

import "./utilsCss/ThemeSettings.css";
import * as assetReplacers from "./assetReplacers.js";

// ─────────────────────────────────────────────
//  i18n – Internacionalização
// ─────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    bgSection: "Background",
    bgPreset: "Preset",
    bgPresetNone: "no preset",
    bgUrl: "Image / GIF / Video URL",
    bgUrlPlaceholder: "//plugins/KysoTheme/assets/Main/file.webm",
    bgUrlHint:
      "Use //plugins/KysoTheme/assets/<file> for local files. Videos cannot be base64.",
    bgUpload: "Or upload a local file",
    bgChoose: "Choose file",
    bgOpenFolder: "Open assets folder",
    bgType: "Media type",
    bgTypeAuto: "Auto-detect",
    bgTypeImage: "Image (jpg, png, webp…)",
    bgTypeGif: "Animated GIF",
    bgTypeVideo: "Video (mp4, webm…)",
    bgApply: "Apply background",
    bgRemove: "Remove background",
    assetsSection: "Player Assets",
    bannerLabel: "Banner",
    crestLabel: "Crest",
    crestRankLabel: "Rank crest (game default)",
    crestChangeAll: "Change all ranked queues",
    crestLP: "Tooltip LP override",
    hoverBackdropLabel: "Hovercard backdrop",
    hoverBackdropHint: "Self-only splash behind your regalia hover card. Cropped to 2.934:1.",
    hoverBackdropCropButton: "Crop backdrop",
    hoverBackdropCropTitle: "Crop hovercard backdrop (2.93:1)",
    hoverBackdropCropHint: "Drag the frame to choose the visible area.",
    crestRankOff: "Off (real rank / image)",
    crestDivisionLabel: "Division",
    crestRankHint: "(overrides the crest, emblem and rank text to the selected tier's default)",
    profileIconLabel: "Profile Icon",
    loadingBgLabel: "Loading Background",
    loadingIconLabel: "Loading Icon",
    sourceLocal: "Local",
    sourceWeb: "Web",
    selectPlaceholder: "Choose...",
    noLocalAssets: "No local assets in manifest",
    addImage: "Add image",
    resetToDefault: "Reset to default",
    webUrlPlaceholder: "https://example.com/image.png",
    applyAsset: "Apply",
    bgApplied: "Background applied!",
    bgRemoved: "Background removed.",
    visSection: "Visibility",
    hideRP: "Hide RP (store currency)",
    showHover: "Always show hover elements",
    showHoverHint: "(missions, chat, profile, status…)",
    alwaysShowChat: "Always show chat",
    alwaysShowInvite: "Always show invite panel",
    alwaysShowNotifications: "Always show notifications button",
    alwaysShowXpRing: "Always show XP ring",
    alwaysShowStatus: "Always show status / availability",
    alwaysShowSocialActions: "Always show social action buttons",
    alwaysShowVersion: "Always show patch version",
    activityTabsAlwaysVisible: "Always show activity center tabs",
    // v3.2 Bucket A
    alwaysShowXpRadial: "Always show XP radial",
    alwaysShowRuneRec: "Always show rune recommender",
    alwaysShowDeepLinks: "Always show deep-links promo",
    showLootBackdrop: "Show loot backdrop",
    showIncidentTicker: "Show service-incident ticker",
    showRestrictionWarning: "Show profile restriction warning",
    showLoadingSpinner: "Show loading-screen spinner",
    showLobbyOverlay: "Show lobby header overlay",
    showNavDividers: "Show navbar item dividers",
    showActivityDivider: "Show activity-center divider",
    // v3.2 Bucket C
    killClientBlur: "Disable client blur",
    storeHueOverlay: "Store accent tint",
    readyCheckAnim: "Ready-check animations",
    viewportGlow: "Viewport accent glow",
    // v3.2 Bucket B
    screenBgSection: "Screen backgrounds",
    collectionsBgEnabled: "Collections background",
    champSelectBgEnabled: "Champ-select background",
    runesBgEnabled: "Runes background",
    modeSwitcherBgEnabled: "Mode-switcher background",
    collectionsBgLabel: "Collections background",
    champSelectBgLabel: "Champ-select background",
    runesBgLabel: "Runes background",
    modeSwitcherBgLabel: "Mode-switcher background",
    enableInUiEditor: "Enable in UI Editor",
    // v3.2 search
    searchPlaceholder: "Search options…",
    searchNoResults: "No results",
    moreVisSection: "More visibility",
    effectsSection: "Visual effects",
    uiEditorSection: "UI Editor",
    hoverGroupTitle: "Hover elements",
    hideTFT: "Hide TFT (hover mode)",
    hideSocialOnly: "Hide social panel only (hover)",
    hideSocialPanel: "Hide social + right nav (hover)",
    enableHideNavbarBtn: "Show sliding-door hide-navbar button",
    enableHideNavbarBtnHint:
      "(adds a vertical tab on the left edge to hide the top navbar)",
    enableHideSocialBtn: "Show sliding-door hide-social button",
    enableHideSocialBtnHint:
      "(adds a vertical tab on the right edge to slide the social panel out)",
    showBlueEssence: "Always show Blue Essence when navbar is hidden",
    colorSection: "Color Theme",
    colorAccent: "Accent color",
    colorAutoLabel: "Auto from background",
    colorAutoHint: "(samples dominant color from background image)",
    colorPresets: "Presets",
    colorApply: "Apply",
    colorReset: "Reset to white",
    colorApplied: "Color applied!",
    colorResetDone: "Color reset to white.",
    fontSection: "Font",
    fontFamily: "Font name",
    fontFamilyPlaceholder: "e.g. Orbitron or Mulish",
    fontUrl: "Import URL (Google Fonts, etc.)",
    fontUrlPlaceholder:
      "https://fonts.googleapis.com/css2?family=Orbitron&display=swap",
    fontUrlHint: "Leave blank to use a system-installed font.",
    fontUpload: "Or upload a local font file",
    fontChoose: "Choose font",
    fontApply: "Apply font",
    fontRemove: "Remove font",
    fontApplied: "Font applied!",
    fontRemoved: "Font removed.",
    iconSection: "Profile Icon",
    iconUrl: "Icon URL (remote image)",
    iconUrlPlaceholder: "https://example.com/icon.jpg",
    iconUpload: "Or upload a local icon",
    iconChoose: "Choose icon",
    iconHint: "Applies the icon on the profile page, sidebar and via CSS.",
    iconApply: "Apply icon",
    iconRemove: "Remove icon",
    iconAllPlayers: "Apply to all players",
    iconAllPlayersHint:
      "(social panel, chat & hover cards — off = only my icon)",
    iconApplied: "Icon applied!",
    iconRemoved: "Icon removed.",
    cropButton: "Crop icon",
    cropTitle: "Crop icon (1:1)",
    cropHint:
      "Drag the box to choose the visible area. LoL icons are always square.",
    cropApply: "Apply crop",
    cropCancel: "Cancel",
    bannerCropButton: "Crop banner",
    bannerCropTitle: "Crop banner (4:1)",
    bannerCropHint:
      "Drag the box to choose the visible area. LoL banners use a 4:1 ratio (1920 × 480).",
    noFile: "No file selected",
    rgbSection: "RGB Effects",
    rgbMode: "Animation mode",
    rgbModeNone: "Off",
    rgbModeRainbow: "Rainbow",
    rgbModeBlink: "Blink",
    rgbModePulse: "Pulse",
    rgbSpeed: "Speed",
    filterEffects: "Visual Effects",
    filterBlur: "Blur",
    filterBrightness: "Brightness",
    filterSaturate: "Saturation",
    filterContrast: "Contrast",
    filterReset: "Reset effects",
    saveAll: "Save all settings",
    saveAllDone: "Settings saved!",
    interfaceSection: "Interface",
    iconSyncNavbar: "Profile icon in top bar",
    iconSwapMastery: "Swap mastery icon with profile icon",
    lolColorScheme: "League color scheme",
    bannerHidden: "Hide profile banner",
    profileBgTransparent: "Transparent profile background",
    gearAlwaysVisible: "Always show settings button (profile page)",
    lorAlwaysVisible: "Always show LoR button",
    playVanilla: "Vanilla play button",
    playBgOpacity: "Play button opacity",
    playBgBlur: "Play button blur",
    socialBlur: "Social panel blur",
    welcomeTitle: "Welcome to Kyso UI Editor",
    welcomeSubtitle: "Quick setup — change anything later in Settings",
    welcomePlay: "Play button",
    welcomeThemed: "Themed",
    welcomeBanner: "Profile banner",
    welcomeButtons: "Settings + LoR buttons",
    welcomeAlways: "Always",
    welcomeHover: "On hover",
    welcomeProfileBg: "Profile background",
    welcomeKeep: "Keep",
    welcomeTransparent: "Transparent",
    welcomeOn: "On",
    welcomeOff: "Off",
    welcomeApply: "Apply",
    welcomeSkip: "Skip",
  },
  pt: {
    bgSection: "Background",
    bgPreset: "Preset",
    bgPresetNone: "sem preset",
    bgUrl: "URL da imagem / GIF / vídeo",
    bgUrlPlaceholder: "//plugins/KysoTheme/assets/Main/arquivo.webm",
    bgUrlHint:
      "Use //plugins/KysoTheme/assets/<arquivo> para arquivos locais. Vídeos não podem virar base64.",
    bgUpload: "Ou faça upload de um arquivo local",
    bgChoose: "Escolher arquivo",
    bgOpenFolder: "Abrir pasta assets",
    bgType: "Tipo de mídia",
    bgTypeAuto: "Detecção automática",
    bgTypeImage: "Imagem (jpg, png, webp…)",
    bgTypeGif: "GIF animado",
    bgTypeVideo: "Vídeo (mp4, webm…)",
    bgApply: "Aplicar background",
    bgRemove: "Remover background",
    assetsSection: "Assets do Jogador",
    bannerLabel: "Banner",
    crestLabel: "Brasão",
    crestRankLabel: "Brasão por elo (padrão do jogo)",
    crestChangeAll: "Mudar todas as filas ranqueadas",
    crestLP: "Sobrescrever LP do tooltip",
    hoverBackdropLabel: "Fundo do hovercard",
    hoverBackdropHint: "Splash atrás do seu hover card de regalia (só você). Cortado em 2.934:1.",
    hoverBackdropCropButton: "Cortar fundo",
    hoverBackdropCropTitle: "Cortar fundo do hovercard (2.93:1)",
    hoverBackdropCropHint: "Arraste o quadro para escolher a área visível.",
    crestRankOff: "Desligado (rank real / imagem)",
    crestDivisionLabel: "Divisão",
    crestRankHint: "(troca brasão, emblema e texto do rank pela arte padrão do elo)",
    profileIconLabel: "Ícone de Perfil",
    loadingBgLabel: "Fundo da Tela de Loading",
    loadingIconLabel: "Ícone da Tela de Loading",
    sourceLocal: "Local",
    sourceWeb: "Web",
    selectPlaceholder: "Escolher...",
    noLocalAssets: "Nenhum asset local no manifest",
    addImage: "Adicionar imagem",
    resetToDefault: "Restaurar padrão",
    webUrlPlaceholder: "https://exemplo.com/imagem.png",
    applyAsset: "Aplicar",
    bgApplied: "Background aplicado!",
    bgRemoved: "Background removido.",
    visSection: "Visibilidade",
    hideRP: "Ocultar RP (moeda da loja)",
    showHover: "Exibir elementos hover sempre visíveis",
    showHoverHint: "(missions, chat, perfil, status…)",
    alwaysShowChat: "Sempre mostrar o chat",
    alwaysShowInvite: "Sempre mostrar painel de convite",
    alwaysShowNotifications: "Sempre mostrar botão de notificações",
    alwaysShowXpRing: "Sempre mostrar anel de XP",
    alwaysShowStatus: "Sempre mostrar status / disponibilidade",
    alwaysShowSocialActions: "Sempre mostrar botões de ação social",
    alwaysShowVersion: "Sempre mostrar versão do patch",
    activityTabsAlwaysVisible: "Sempre mostrar abas da central de atividades",
    // v3.2 Bucket A
    alwaysShowXpRadial: "Sempre mostrar radial de XP",
    alwaysShowRuneRec: "Sempre mostrar recomendador de runas",
    alwaysShowDeepLinks: "Sempre mostrar promo de deep-links",
    showLootBackdrop: "Mostrar fundo do saque",
    showIncidentTicker: "Mostrar aviso de incidente do serviço",
    showRestrictionWarning: "Mostrar aviso de restrição no perfil",
    showLoadingSpinner: "Mostrar spinner da tela de loading",
    showLobbyOverlay: "Mostrar overlay do cabeçalho da lobby",
    showNavDividers: "Mostrar divisórias da navbar",
    showActivityDivider: "Mostrar divisória do activity-center",
    // v3.2 Bucket C
    killClientBlur: "Desativar blur do cliente",
    storeHueOverlay: "Tom de destaque na loja",
    readyCheckAnim: "Animações do ready-check",
    viewportGlow: "Brilho de destaque do viewport",
    // v3.2 Bucket B
    screenBgSection: "Fundos de tela",
    collectionsBgEnabled: "Fundo de Coleções",
    champSelectBgEnabled: "Fundo de Seleção de campeão",
    runesBgEnabled: "Fundo de Runas",
    modeSwitcherBgEnabled: "Fundo do seletor de modo",
    collectionsBgLabel: "Fundo de Coleções",
    champSelectBgLabel: "Fundo de Seleção de campeão",
    runesBgLabel: "Fundo de Runas",
    modeSwitcherBgLabel: "Fundo do seletor de modo",
    enableInUiEditor: "Ative no UI Editor",
    // v3.2 search
    searchPlaceholder: "Pesquisar opções…",
    searchNoResults: "Nenhum resultado",
    moreVisSection: "Mais visibilidade",
    effectsSection: "Efeitos visuais",
    uiEditorSection: "UI Editor",
    hoverGroupTitle: "Elementos hover",
    hideTFT: "Ocultar TFT (modo hover)",
    hideSocialOnly: "Ocultar somente painel social (hover)",
    hideSocialPanel: "Ocultar painel social + nav direita (hover)",
    enableHideNavbarBtn: "Exibir botão lateral p/ ocultar navbar",
    enableHideNavbarBtnHint:
      "(adiciona uma aba vertical na borda esquerda p/ esconder a barra de navegação superior)",
    enableHideSocialBtn: "Exibir botão lateral p/ ocultar painel social",
    enableHideSocialBtnHint:
      "(adiciona uma aba vertical na borda direita p/ deslizar o painel social pra fora)",
    showBlueEssence: "Sempre mostrar Essência Azul quando a navbar está oculta",
    colorSection: "Tema de Cores",
    colorAccent: "Cor de destaque",
    colorAutoLabel: "Automático pelo background",
    colorAutoHint: "(extrai a cor dominante do background)",
    colorPresets: "Presets",
    colorApply: "Aplicar",
    colorReset: "Resetar para branco",
    colorApplied: "Cor aplicada!",
    colorResetDone: "Cor resetada para branco.",
    fontSection: "Fonte",
    fontFamily: "Nome da fonte",
    fontFamilyPlaceholder: "Ex: Orbitron ou Mulish",
    fontUrl: "URL de importação (Google Fonts, etc.)",
    fontUrlPlaceholder:
      "https://fonts.googleapis.com/css2?family=Orbitron&display=swap",
    fontUrlHint: "Deixe em branco para usar uma fonte já instalada no sistema.",
    fontUpload: "Ou faça upload de um arquivo de fonte local",
    fontChoose: "Escolher fonte",
    fontApply: "Aplicar fonte",
    fontRemove: "Remover fonte",
    fontApplied: "Fonte aplicada!",
    fontRemoved: "Fonte removida.",
    iconSection: "Ícone de Perfil",
    iconUrl: "URL do ícone (imagem remota)",
    iconUrlPlaceholder: "https://exemplo.com/icone.jpg",
    iconUpload: "Ou faça upload de um ícone local",
    iconChoose: "Escolher ícone",
    iconHint: "Aplica o ícone na página de perfil, na barra lateral e via CSS.",
    iconApply: "Aplicar ícone",
    iconRemove: "Remover ícone",
    iconAllPlayers: "Aplicar para todos os jogadores",
    iconAllPlayersHint:
      "(painel social, chat e hover cards — desligado = só o meu ícone)",
    iconApplied: "Ícone aplicado!",
    iconRemoved: "Ícone removido.",
    cropButton: "Cortar ícone",
    cropTitle: "Cortar ícone (1:1)",
    cropHint:
      "Arraste a caixa para escolher a área visível. Ícones do LoL são sempre quadrados.",
    cropApply: "Aplicar corte",
    cropCancel: "Cancelar",
    bannerCropButton: "Cortar banner",
    bannerCropTitle: "Cortar banner (4:1)",
    bannerCropHint:
      "Arraste a caixa para escolher a área visível. Banners do LoL usam proporção 4:1 (1920 × 480).",
    noFile: "Nenhum arquivo selecionado",
    rgbSection: "Efeitos RGB",
    rgbMode: "Modo de animação",
    rgbModeNone: "Desligado",
    rgbModeRainbow: "Arco-íris",
    rgbModeBlink: "Piscar",
    rgbModePulse: "Pulsar",
    rgbSpeed: "Velocidade",
    filterEffects: "Efeitos Visuais",
    filterBlur: "Desfoque",
    filterBrightness: "Brilho",
    filterSaturate: "Saturação",
    filterContrast: "Contraste",
    filterReset: "Resetar efeitos",
    saveAll: "Salvar todas as configurações",
    saveAllDone: "Configurações salvas!",
    interfaceSection: "Interface",
    iconSyncNavbar: "Ícone de perfil na barra superior",
    iconSwapMastery: "Trocar ícone de maestria pelo ícone de perfil",
    lolColorScheme: "Esquema de cores do League",
    bannerHidden: "Ocultar banner do perfil",
    profileBgTransparent: "Fundo do perfil transparente",
    gearAlwaysVisible: "Sempre mostrar botão de config. (página de perfil)",
    lorAlwaysVisible: "Sempre mostrar botão LoR",
    playVanilla: "Botão jogar original",
    playBgOpacity: "Opacidade do botão jogar",
    playBgBlur: "Desfoque do botão jogar",
    socialBlur: "Desfoque do painel social",
    welcomeTitle: "Bem-vindo ao Kyso UI Editor",
    welcomeSubtitle: "Config. rápida — altere depois nas Configurações",
    welcomePlay: "Botão jogar",
    welcomeThemed: "Tema",
    welcomeBanner: "Banner do perfil",
    welcomeButtons: "Botões config. + LoR",
    welcomeAlways: "Sempre",
    welcomeHover: "Ao passar o mouse",
    welcomeProfileBg: "Fundo do perfil",
    welcomeKeep: "Manter",
    welcomeTransparent: "Transparente",
    welcomeOn: "Ligado",
    welcomeOff: "Desligado",
    welcomeApply: "Aplicar",
    welcomeSkip: "Pular",
  },
  es: {
    bgSection: "Fondo",
    bgPreset: "Preset",
    bgPresetNone: "sin preset",
    bgUrl: "URL de imagen / GIF / vídeo",
    bgUrlPlaceholder: "//plugins/KysoTheme/assets/Main/archivo.webm",
    bgUrlHint:
      "Usa //plugins/KysoTheme/assets/<archivo> para locales. Los vídeos no admiten base64.",
    bgUpload: "O sube un archivo local",
    bgChoose: "Elegir archivo",
    bgOpenFolder: "Abrir carpeta assets",
    bgType: "Tipo de medio",
    bgTypeAuto: "Detección automática",
    bgTypeImage: "Imagen (jpg, png, webp…)",
    bgTypeGif: "GIF animado",
    bgTypeVideo: "Vídeo (mp4, webm…)",
    bgApply: "Aplicar fondo",
    bgRemove: "Quitar fondo",
    assetsSection: "Recursos del Jugador",
    bannerLabel: "Banner",
    crestLabel: "Escudo",
    profileIconLabel: "Icono de Perfil",
    loadingBgLabel: "Fondo de Carga",
    loadingIconLabel: "Icono de Carga",
    sourceLocal: "Local",
    sourceWeb: "Web",
    selectPlaceholder: "Elegir...",
    noLocalAssets: "Sin recursos locales en el manifest",
    addImage: "Añadir imagen",
    resetToDefault: "Restablecer",
    webUrlPlaceholder: "https://ejemplo.com/imagen.png",
    applyAsset: "Aplicar",
    bgApplied: "¡Fondo aplicado!",
    bgRemoved: "Fondo eliminado.",
    visSection: "Visibilidad",
    hideRP: "Ocultar RP (moneda de tienda)",
    showHover: "Mostrar siempre elementos de hover",
    showHoverHint: "(misiones, chat, perfil, estado…)",
    hideTFT: "Ocultar TFT (modo hover)",
    hideSocialOnly: "Ocultar solo panel social (hover)",
    hideSocialPanel: "Ocultar panel social + nav derecha (hover)",
    enableHideNavbarBtn: "Mostrar botón lateral p/ ocultar navbar",
    enableHideNavbarBtnHint:
      "(añade una pestaña vertical en el borde izquierdo p/ ocultar la barra superior)",
    enableHideSocialBtn: "Mostrar botón lateral p/ ocultar panel social",
    enableHideSocialBtnHint:
      "(añade una pestaña vertical en el borde derecho p/ deslizar el panel social fuera)",
    showBlueEssence:
      "Mostrar siempre Esencia Azul cuando el navbar está oculto",
    colorSection: "Tema de Color",
    colorAccent: "Color de acento",
    colorAutoLabel: "Automático desde el fondo",
    colorAutoHint: "(extrae el color dominante del fondo)",
    colorPresets: "Presets",
    colorApply: "Aplicar",
    colorReset: "Restablecer a blanco",
    colorApplied: "¡Color aplicado!",
    colorResetDone: "Color restablecido a blanco.",
    fontSection: "Fuente",
    fontFamily: "Nombre de fuente",
    fontFamilyPlaceholder: "Ej: Orbitron o Mulish",
    fontUrl: "URL de importación (Google Fonts, etc.)",
    fontUrlPlaceholder:
      "https://fonts.googleapis.com/css2?family=Orbitron&display=swap",
    fontUrlHint: "Dejar en blanco para usar una fuente del sistema.",
    fontUpload: "O sube un archivo de fuente local",
    fontChoose: "Elegir fuente",
    fontApply: "Aplicar fuente",
    fontRemove: "Quitar fuente",
    fontApplied: "¡Fuente aplicada!",
    fontRemoved: "Fuente eliminada.",
    iconSection: "Icono de perfil",
    iconUrl: "URL del icono (imagen remota)",
    iconUrlPlaceholder: "https://ejemplo.com/icono.jpg",
    iconUpload: "O sube un icono local",
    iconChoose: "Elegir icono",
    iconHint: "Aplica el icono en el perfil, barra lateral y CSS.",
    iconApply: "Aplicar icono",
    iconRemove: "Quitar icono",
    iconAllPlayers: "Aplicar a todos los jugadores",
    iconAllPlayersHint:
      "(panel social, chat y tarjetas — apagado = solo mi ícono)",
    iconApplied: "¡Icono aplicado!",
    iconRemoved: "Icono eliminado.",
    cropButton: "Recortar icono",
    cropTitle: "Recortar icono (1:1)",
    cropHint:
      "Arrastra el cuadro para elegir el área visible. Los iconos de LoL son siempre cuadrados.",
    cropApply: "Aplicar recorte",
    cropCancel: "Cancelar",
    bannerCropButton: "Recortar banner",
    bannerCropTitle: "Recortar banner (4:1)",
    bannerCropHint:
      "Arrastra el cuadro para elegir el área visible. Los banners de LoL usan proporción 4:1 (1920 × 480).",
    noFile: "Ningún archivo seleccionado",
    rgbSection: "Efectos RGB",
    rgbMode: "Modo de animación",
    rgbModeNone: "Apagado",
    rgbModeRainbow: "Arcoíris",
    rgbModeBlink: "Parpadeo",
    rgbModePulse: "Pulso",
    rgbSpeed: "Velocidad",
    filterEffects: "Efectos Visuales",
    filterBlur: "Desenfoque",
    filterBrightness: "Brillo",
    filterSaturate: "Saturación",
    filterContrast: "Contraste",
    filterReset: "Restablecer efectos",
    saveAll: "Guardar configuración",
    saveAllDone: "¡Configuración guardada!",
    interfaceSection: "Interfaz",
    iconSyncNavbar: "Icono de perfil en barra superior",
    iconSwapMastery: "Cambiar icono de maestría por el de perfil",
    lolColorScheme: "Esquema de colores de League",
    bannerHidden: "Ocultar banner de perfil",
    profileBgTransparent: "Fondo de perfil transparente",
    gearAlwaysVisible: "Mostrar siempre botón de ajustes",
    lorAlwaysVisible: "Mostrar siempre botón LoR",
    playVanilla: "Botón jugar original",
    playBgOpacity: "Opacidad del botón jugar",
    playBgBlur: "Desenfoque del botón jugar",
    socialBlur: "Desenfoque del panel social",
    welcomeTitle: "Bienvenido a Kyso UI Editor",
    welcomeSubtitle: "Configuración rápida — cambia luego en Ajustes",
    welcomePlay: "Botón jugar",
    welcomeThemed: "Con tema",
    welcomeBanner: "Banner de perfil",
    welcomeButtons: "Botones ajustes + LoR",
    welcomeAlways: "Siempre",
    welcomeHover: "Al pasar el ratón",
    welcomeProfileBg: "Fondo de perfil",
    welcomeKeep: "Mantener",
    welcomeTransparent: "Transparente",
    welcomeOn: "Activado",
    welcomeOff: "Desactivado",
    welcomeApply: "Aplicar",
    welcomeSkip: "Omitir",
  },
  de: {
    bgSection: "Hintergrund",
    bgPreset: "Voreinstellung",
    bgPresetNone: "keine Voreinstellung",
    bgUrl: "Bild / GIF / Video-URL",
    bgUrlPlaceholder: "//plugins/KysoTheme/assets/Main/datei.webm",
    bgUrlHint:
      "Nutze //plugins/KysoTheme/assets/<datei> für lokale Dateien. Videos akzeptieren kein base64.",
    bgUpload: "Oder lokale Datei hochladen",
    bgChoose: "Datei wählen",
    bgOpenFolder: "Assets-Ordner öffnen",
    bgType: "Medientyp",
    bgTypeAuto: "Automatisch erkennen",
    bgTypeImage: "Bild (jpg, png, webp…)",
    bgTypeGif: "Animiertes GIF",
    bgTypeVideo: "Video (mp4, webm…)",
    bgApply: "Hintergrund anwenden",
    bgRemove: "Hintergrund entfernen",
    assetsSection: "Spieler-Assets",
    bannerLabel: "Banner",
    crestLabel: "Wappen",
    profileIconLabel: "Profilsymbol",
    loadingBgLabel: "Ladebildschirm-Hintergrund",
    loadingIconLabel: "Ladebildschirm-Symbol",
    sourceLocal: "Lokal",
    sourceWeb: "Web",
    selectPlaceholder: "Auswählen...",
    noLocalAssets: "Keine lokalen Assets im Manifest",
    addImage: "Bild hinzufügen",
    resetToDefault: "Auf Standard zurücksetzen",
    webUrlPlaceholder: "https://beispiel.de/bild.png",
    applyAsset: "Anwenden",
    bgApplied: "Hintergrund angewendet!",
    bgRemoved: "Hintergrund entfernt.",
    visSection: "Sichtbarkeit",
    hideRP: "RP ausblenden (Shopwährung)",
    showHover: "Hover-Elemente immer anzeigen",
    showHoverHint: "(Missionen, Chat, Profil, Status…)",
    hideTFT: "TFT ausblenden (Hover-Modus)",
    hideSocialOnly: "Nur Sozialbereich ausblenden (Hover)",
    hideSocialPanel: "Sozialbereich + rechte Navigation ausblenden (Hover)",
    enableHideNavbarBtn: "Schiebe-Taste zum Ausblenden der Navigation anzeigen",
    enableHideNavbarBtnHint:
      "(fügt einen vertikalen Tab am linken Rand hinzu, um die obere Navigationsleiste auszublenden)",
    enableHideSocialBtn:
      "Schiebe-Taste zum Ausblenden des Social-Panels anzeigen",
    enableHideSocialBtnHint:
      "(fügt einen vertikalen Tab am rechten Rand hinzu, um das Social-Panel herauszuschieben)",
    showBlueEssence:
      "Blaue Essenz beim Ausblenden der Navigationsleiste immer anzeigen",
    colorSection: "Farbthema",
    colorAccent: "Akzentfarbe",
    colorAutoLabel: "Automatisch aus Hintergrund",
    colorAutoHint: "(extrahiert die Hauptfarbe aus dem Hintergrund)",
    colorPresets: "Voreinstellungen",
    colorApply: "Anwenden",
    colorReset: "Auf Weiß zurücksetzen",
    colorApplied: "Farbe angewendet!",
    colorResetDone: "Farbe auf Weiß zurückgesetzt.",
    fontSection: "Schriftart",
    fontFamily: "Schriftartname",
    fontFamilyPlaceholder: "z.B. Orbitron oder Mulish",
    fontUrl: "Import-URL (Google Fonts usw.)",
    fontUrlPlaceholder:
      "https://fonts.googleapis.com/css2?family=Orbitron&display=swap",
    fontUrlHint: "Leer lassen für eine installierte Systemschriftart.",
    fontUpload: "Oder lokale Schriftartdatei hochladen",
    fontChoose: "Schriftart wählen",
    fontApply: "Schriftart anwenden",
    fontRemove: "Schriftart entfernen",
    fontApplied: "Schriftart angewendet!",
    fontRemoved: "Schriftart entfernt.",
    iconSection: "Profilsymbol",
    iconUrl: "Symbol-URL (Remote-Bild)",
    iconUrlPlaceholder: "https://beispiel.com/symbol.jpg",
    iconUpload: "Oder lokales Symbol hochladen",
    iconChoose: "Symbol wählen",
    iconHint: "Wendet das Symbol auf Profilseite, Seitenleiste und CSS an.",
    iconApply: "Symbol anwenden",
    iconRemove: "Symbol entfernen",
    iconAllPlayers: "Auf alle Spieler anwenden",
    iconAllPlayersHint:
      "(Social-Panel, Chat & Karten — aus = nur eigenes Symbol)",
    iconApplied: "Symbol angewendet!",
    iconRemoved: "Symbol entfernt.",
    cropButton: "Symbol zuschneiden",
    cropTitle: "Symbol zuschneiden (1:1)",
    cropHint:
      "Ziehe das Feld, um den sichtbaren Bereich zu wählen. LoL-Symbole sind immer quadratisch.",
    cropApply: "Zuschnitt anwenden",
    cropCancel: "Abbrechen",
    bannerCropButton: "Banner zuschneiden",
    bannerCropTitle: "Banner zuschneiden (4:1)",
    bannerCropHint:
      "Ziehe das Feld für den sichtbaren Bereich. LoL-Banner verwenden 4:1 (1920 × 480).",
    noFile: "Keine Datei ausgewählt",
    rgbSection: "RGB-Effekte",
    rgbMode: "Animationsmodus",
    rgbModeNone: "Aus",
    rgbModeRainbow: "Regenbogen",
    rgbModeBlink: "Blinken",
    rgbModePulse: "Puls",
    rgbSpeed: "Geschwindigkeit",
    filterEffects: "Visuelle Effekte",
    filterBlur: "Unschärfe",
    filterBrightness: "Helligkeit",
    filterSaturate: "Sättigung",
    filterContrast: "Kontrast",
    filterReset: "Effekte zurücksetzen",
    saveAll: "Alle Einstellungen speichern",
    saveAllDone: "Einstellungen gespeichert!",
    interfaceSection: "Oberfläche",
    iconSyncNavbar: "Profilsymbol in oberer Leiste",
    iconSwapMastery: "Meisterschaftssymbol durch Profilsymbol ersetzen",
    lolColorScheme: "League-Farbschema",
    bannerHidden: "Profilbanner ausblenden",
    profileBgTransparent: "Profilhintergrund transparent",
    gearAlwaysVisible: "Einstellungsknopf immer zeigen",
    lorAlwaysVisible: "LoR-Knopf immer zeigen",
    playVanilla: "Originaler Spielen-Knopf",
    playBgOpacity: "Spielen-Knopf Deckkraft",
    playBgBlur: "Spielen-Knopf Unschärfe",
    socialBlur: "Soziales Panel Unschärfe",
    welcomeTitle: "Willkommen bei Kyso UI Editor",
    welcomeSubtitle: "Schnelleinrichtung — später in Einstellungen änderbar",
    welcomePlay: "Spielen-Knopf",
    welcomeThemed: "Mit Thema",
    welcomeBanner: "Profilbanner",
    welcomeButtons: "Knöpfe + LoR",
    welcomeAlways: "Immer",
    welcomeHover: "Bei Mauszeiger",
    welcomeProfileBg: "Profilhintergrund",
    welcomeKeep: "Behalten",
    welcomeTransparent: "Transparent",
    welcomeOn: "An",
    welcomeOff: "Aus",
    welcomeApply: "Anwenden",
    welcomeSkip: "Überspringen",
  },
  ja: {
    bgSection: "背景",
    bgPreset: "プリセット",
    bgPresetNone: "プリセットなし",
    bgUrl: "画像 / GIF / 動画 の URL",
    bgUrlPlaceholder: "//plugins/KysoTheme/assets/Main/file.webm",
    bgUrlHint:
      "ローカルファイルは //plugins/KysoTheme/assets/<ファイル> を使用。動画はbase64不可。",
    bgUpload: "またはローカルファイルをアップロード",
    bgChoose: "ファイルを選択",
    bgOpenFolder: "assetsフォルダを開く",
    bgType: "メディアタイプ",
    bgTypeAuto: "自動検出",
    bgTypeImage: "画像 (jpg, png, webp…)",
    bgTypeGif: "アニメーション GIF",
    bgTypeVideo: "動画 (mp4, webm…)",
    bgApply: "背景を適用",
    bgRemove: "背景を削除",
    assetsSection: "プレイヤーアセット",
    bannerLabel: "バナー",
    crestLabel: "クレスト",
    profileIconLabel: "プロフィールアイコン",
    loadingBgLabel: "ロード画面の背景",
    loadingIconLabel: "ロード画面のアイコン",
    sourceLocal: "ローカル",
    sourceWeb: "Web",
    selectPlaceholder: "選択...",
    noLocalAssets: "マニフェストにローカルアセットがありません",
    addImage: "画像を追加",
    resetToDefault: "デフォルトに戻す",
    webUrlPlaceholder: "https://example.com/image.png",
    applyAsset: "適用",
    bgApplied: "背景を適用しました！",
    bgRemoved: "背景を削除しました。",
    visSection: "表示設定",
    hideRP: "RP を非表示",
    showHover: "ホバー要素を常に表示",
    showHoverHint: "(ミッション・チャット・プロフィール…)",
    hideTFT: "TFT を非表示",
    hideSocialOnly: "ソーシャルパネルのみ非表示 (ホバー)",
    hideSocialPanel: "ソーシャルパネル + 右ナビを非表示 (ホバー)",
    enableHideNavbarBtn: "ナビバー非表示用スライドボタンを表示",
    enableHideNavbarBtnHint:
      "(左端に垂直タブを追加して上部ナビゲーションバーを隠す)",
    enableHideSocialBtn: "ソーシャル非表示用スライドボタンを表示",
    enableHideSocialBtnHint:
      "(右端に垂直タブを追加してソーシャルパネルをスライドアウトする)",
    showBlueEssence: "ナビバー非表示中もブルーエッセンスを常に表示",
    colorSection: "カラーテーマ",
    colorAccent: "アクセントカラー",
    colorAutoLabel: "背景から自動取得",
    colorAutoHint: "(背景画像から主要色を抽出)",
    colorPresets: "プリセット",
    colorApply: "適用",
    colorReset: "白にリセット",
    colorApplied: "カラーを適用しました！",
    colorResetDone: "カラーを白にリセットしました。",
    fontSection: "フォント",
    fontFamily: "フォント名",
    fontFamilyPlaceholder: "例: Orbitron または Mulish",
    fontUrl: "インポート URL (Google Fonts など)",
    fontUrlPlaceholder:
      "https://fonts.googleapis.com/css2?family=Orbitron&display=swap",
    fontUrlHint: "システムフォントを使う場合は空白のまま。",
    fontUpload: "またはローカルフォントをアップロード",
    fontChoose: "フォントを選択",
    fontApply: "フォントを適用",
    fontRemove: "フォントを削除",
    fontApplied: "フォントを適用しました！",
    fontRemoved: "フォントを削除しました。",
    iconSection: "プロフィールアイコン",
    iconUrl: "アイコン URL (リモート画像)",
    iconUrlPlaceholder: "https://example.com/icon.jpg",
    iconUpload: "またはローカルアイコンをアップロード",
    iconChoose: "アイコンを選択",
    iconHint: "プロフィールページ・サイドバー・CSS にアイコンを適用。",
    iconApply: "アイコンを適用",
    iconRemove: "アイコンを削除",
    iconAllPlayers: "全プレイヤーに適用",
    iconAllPlayersHint:
      "(ソーシャル・チャット・ホバーカード — オフ = 自分のみ)",
    iconApplied: "アイコンを適用しました！",
    iconRemoved: "アイコンを削除しました。",
    cropButton: "アイコンを切り抜く",
    cropTitle: "アイコンを切り抜き (1:1)",
    cropHint: "枠をドラッグして表示領域を選択。LoLのアイコンは常に正方形です。",
    cropApply: "切り抜きを適用",
    cropCancel: "キャンセル",
    bannerCropButton: "バナーを切り抜く",
    bannerCropTitle: "バナーを切り抜き (4:1)",
    bannerCropHint: "枠をドラッグして表示領域を選択。LoLバナーは4:1比率 (1920 × 480) です。",
    noFile: "ファイルが選択されていません",
    rgbSection: "RGB エフェクト",
    rgbMode: "アニメーションモード",
    rgbModeNone: "オフ",
    rgbModeRainbow: "レインボー",
    rgbModeBlink: "点滅",
    rgbModePulse: "パルス",
    rgbSpeed: "速度",
    filterEffects: "ビジュアルエフェクト",
    filterBlur: "ぼかし",
    filterBrightness: "明るさ",
    filterSaturate: "彩度",
    filterContrast: "コントラスト",
    filterReset: "エフェクトをリセット",
    saveAll: "すべての設定を保存",
    saveAllDone: "設定を保存しました！",
    interfaceSection: "インターフェース",
    iconSyncNavbar: "トップバーにプロフィールアイコン",
    iconSwapMastery: "マスタリーアイコンをプロフィールアイコンに置換",
    lolColorScheme: "Leagueのカラースキーム",
    bannerHidden: "プロフィールバナーを隠す",
    profileBgTransparent: "プロフィール背景を透明に",
    gearAlwaysVisible: "設定ボタンを常に表示",
    lorAlwaysVisible: "LoRボタンを常に表示",
    playVanilla: "バニラのプレイボタン",
    playBgOpacity: "プレイボタンの不透明度",
    playBgBlur: "プレイボタンのぼかし",
    socialBlur: "ソーシャルパネルのぼかし",
    welcomeTitle: "Kyso UI Editor へようこそ",
    welcomeSubtitle: "クイック設定 — 後で設定から変更可能",
    welcomePlay: "プレイボタン",
    welcomeThemed: "テーマ",
    welcomeBanner: "プロフィールバナー",
    welcomeButtons: "ボタン + LoR",
    welcomeAlways: "常に",
    welcomeHover: "ホバー時",
    welcomeProfileBg: "プロフィール背景",
    welcomeKeep: "保持",
    welcomeTransparent: "透明",
    welcomeOn: "オン",
    welcomeOff: "オフ",
    welcomeApply: "適用",
    welcomeSkip: "スキップ",
  },
  ko: {
    bgSection: "배경",
    bgPreset: "프리셋",
    bgPresetNone: "프리셋 없음",
    bgUrl: "이미지 / GIF / 동영상 URL",
    bgUrlPlaceholder: "//plugins/KysoTheme/assets/Main/file.webm",
    bgUrlHint:
      "로컬 파일은 //plugins/KysoTheme/assets/<파일>. 동영상은 base64 불가.",
    bgUpload: "또는 로컬 파일 업로드",
    bgChoose: "파일 선택",
    bgOpenFolder: "assets 폴더 열기",
    bgType: "미디어 유형",
    bgTypeAuto: "자동 감지",
    bgTypeImage: "이미지 (jpg, png, webp…)",
    bgTypeGif: "애니메이션 GIF",
    bgTypeVideo: "동영상 (mp4, webm…)",
    bgApply: "배경 적용",
    bgRemove: "배경 제거",
    assetsSection: "플레이어 에셋",
    bannerLabel: "배너",
    crestLabel: "문장",
    profileIconLabel: "프로필 아이콘",
    loadingBgLabel: "로딩 화면 배경",
    loadingIconLabel: "로딩 화면 아이콘",
    sourceLocal: "로컬",
    sourceWeb: "웹",
    selectPlaceholder: "선택...",
    noLocalAssets: "매니페스트에 로컬 에셋 없음",
    addImage: "이미지 추가",
    resetToDefault: "기본값으로 재설정",
    webUrlPlaceholder: "https://example.com/image.png",
    applyAsset: "적용",
    bgApplied: "배경이 적용되었습니다!",
    bgRemoved: "배경이 제거되었습니다.",
    visSection: "표시 설정",
    hideRP: "RP 숨기기",
    showHover: "항상 호버 요소 표시",
    showHoverHint: "(임무, 채팅, 프로필, 상태…)",
    hideTFT: "TFT 숨기기",
    hideSocialOnly: "소셜 패널만 숨기기 (호버)",
    hideSocialPanel: "소셜 패널 + 우측 내비 숨기기 (호버)",
    enableHideNavbarBtn: "내비 숨김 슬라이딩 버튼 표시",
    enableHideNavbarBtnHint:
      "(왼쪽 가장자리에 상단 내비 바를 숨기는 수직 탭 추가)",
    enableHideSocialBtn: "소셜 숨김 슬라이딩 버튼 표시",
    enableHideSocialBtnHint:
      "(오른쪽 가장자리에 소셜 패널을 밀어내는 수직 탭 추가)",
    showBlueEssence: "내비 숨김 중 항상 블루 에센스 표시",
    colorSection: "색상 테마",
    colorAccent: "강조 색상",
    colorAutoLabel: "배경에서 자동",
    colorAutoHint: "(배경 이미지에서 주요 색상 추출)",
    colorPresets: "프리셋",
    colorApply: "적용",
    colorReset: "흰색으로 초기화",
    colorApplied: "색상이 적용되었습니다!",
    colorResetDone: "색상이 흰색으로 초기화되었습니다.",
    fontSection: "폰트",
    fontFamily: "폰트 이름",
    fontFamilyPlaceholder: "예: Orbitron 또는 Mulish",
    fontUrl: "가져오기 URL (Google Fonts 등)",
    fontUrlPlaceholder:
      "https://fonts.googleapis.com/css2?family=Orbitron&display=swap",
    fontUrlHint: "시스템 폰트를 사용하려면 비워두세요.",
    fontUpload: "또는 로컬 폰트 파일 업로드",
    fontChoose: "폰트 선택",
    fontApply: "폰트 적용",
    fontRemove: "폰트 제거",
    fontApplied: "폰트가 적용되었습니다!",
    fontRemoved: "폰트가 제거되었습니다.",
    iconSection: "프로필 아이콘",
    iconUrl: "아이콘 URL (원격 이미지)",
    iconUrlPlaceholder: "https://example.com/icon.jpg",
    iconUpload: "또는 로컬 아이콘 업로드",
    iconChoose: "아이콘 선택",
    iconHint: "프로필 페이지, 사이드바 및 CSS에 아이콘을 적용합니다.",
    iconApply: "아이콘 적용",
    iconRemove: "아이콘 제거",
    iconAllPlayers: "모든 플레이어에게 적용",
    iconAllPlayersHint: "(소셜 패널, 채팅, 호버 카드 — 꺼짐 = 내 아이콘만)",
    iconApplied: "아이콘이 적용되었습니다!",
    iconRemoved: "아이콘이 제거되었습니다.",
    cropButton: "아이콘 자르기",
    cropTitle: "아이콘 자르기 (1:1)",
    cropHint:
      "상자를 드래그하여 표시 영역을 선택하세요. LoL 아이콘은 항상 정사각형입니다.",
    cropApply: "자르기 적용",
    cropCancel: "취소",
    bannerCropButton: "배너 자르기",
    bannerCropTitle: "배너 자르기 (4:1)",
    bannerCropHint:
      "상자를 드래그하여 표시 영역을 선택하세요. LoL 배너는 4:1 비율 (1920 × 480)을 사용합니다.",
    noFile: "선택된 파일 없음",
    rgbSection: "RGB 효과",
    rgbMode: "애니메이션 모드",
    rgbModeNone: "끄기",
    rgbModeRainbow: "레인보우",
    rgbModeBlink: "깜박임",
    rgbModePulse: "펄스",
    rgbSpeed: "속도",
    filterEffects: "비주얼 이펙트",
    filterBlur: "블러",
    filterBrightness: "밝기",
    filterSaturate: "채도",
    filterContrast: "대비",
    filterReset: "이펙트 초기화",
    saveAll: "모든 설정 저장",
    saveAllDone: "설정이 저장되었습니다!",
    interfaceSection: "인터페이스",
    iconSyncNavbar: "상단 바에 프로필 아이콘",
    iconSwapMastery: "프로필 아이콘으로 숙련도 아이콘 교체",
    lolColorScheme: "리그 색상 구성",
    bannerHidden: "프로필 배너 숨기기",
    profileBgTransparent: "프로필 배경 투명하게",
    gearAlwaysVisible: "설정 버튼 항상 표시",
    lorAlwaysVisible: "LoR 버튼 항상 표시",
    playVanilla: "기본 플레이 버튼",
    playBgOpacity: "플레이 버튼 불투명도",
    playBgBlur: "플레이 버튼 흐림",
    socialBlur: "소셜 패널 흐림",
    welcomeTitle: "Kyso UI Editor에 오신 것을 환영합니다",
    welcomeSubtitle: "빠른 설정 — 나중에 설정에서 변경 가능",
    welcomePlay: "플레이 버튼",
    welcomeThemed: "테마",
    welcomeBanner: "프로필 배너",
    welcomeButtons: "버튼 + LoR",
    welcomeAlways: "항상",
    welcomeHover: "마우스 오버 시",
    welcomeProfileBg: "프로필 배경",
    welcomeKeep: "유지",
    welcomeTransparent: "투명",
    welcomeOn: "켜기",
    welcomeOff: "끄기",
    welcomeApply: "적용",
    welcomeSkip: "건너뛰기",
  },
};

function detectLocale() {
  const raw =
    window.__locale__ ?? window.locale ?? document.documentElement.lang ?? "";
  const code = String(raw).toLowerCase().split(/[-_]/)[0];
  if (code === "pt") return "pt";
  if (code === "es") return "es";
  if (code === "de") return "de";
  if (code === "ja") return "ja";
  if (code === "ko") return "ko";
  return "en";
}

const _lang = detectLocale();
function t(key) {
  return (
    (TRANSLATIONS[_lang] ?? TRANSLATIONS.en)[key] ?? TRANSLATIONS.en[key] ?? key
  );
}

// ─────────────────────────────────────────────
//  Ícones SVG inline – desenhados sob medida
// ─────────────────────────────────────────────
// stroke=currentColor permite recolorir via CSS color
const _svg = (paths, extra = "") =>
  `<svg class="kyso-svg-icon ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const ICONS = {
  // Moldura com sol + montanha (background)
  picture: _svg(
    '<rect x="3" y="4" width="18" height="16" rx="2"/>' +
      '<circle cx="8.5" cy="9.5" r="1.6" fill="currentColor" stroke="none"/>' +
      '<path d="M3 17l5-5 4 4 3-3 6 6"/>',
  ),
  // Olho aberto (visibility)
  eye: _svg(
    '<path d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"/>' +
      '<circle cx="12" cy="12" r="3.2"/>',
  ),
  // Letra A estilizada (font)
  font: _svg('<path d="M5 20L12 4l7 16"/>' + '<path d="M7.6 14.2h8.8"/>'),
  // Chapéu de mago com estrelinhas (icon de perfil)
  wizard: _svg(
    '<path d="M12 2.5L6 18h12L12 2.5z"/>' +
      '<path d="M4 18.5h16l-1 3H5l-1-3z"/>' +
      '<path d="M9.5 8.2l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4z" fill="currentColor" stroke="none"/>' +
      '<path d="M13 13l.3.8.8.3-.8.3-.3.8-.3-.8-.8-.3.8-.3z" fill="currentColor" stroke="none"/>',
  ),
  // Tesoura (crop)
  scissors: _svg(
    '<circle cx="6" cy="6" r="3"/>' +
      '<circle cx="6" cy="18" r="3"/>' +
      '<line x1="20" y1="4" x2="8.12" y2="15.88"/>' +
      '<line x1="14.47" y1="14.48" x2="20" y2="20"/>' +
      '<line x1="8.12" y1="8.12" x2="12" y2="12"/>',
  ),
  // Pasta com seta pra cima (upload)
  folder: _svg(
    '<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>' +
      '<path d="M12 17v-5"/>' +
      '<path d="M9.5 14.5L12 12l2.5 2.5"/>',
  ),
  // Disquete (save)
  save: _svg(
    '<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>' +
      '<polyline points="17 21 17 13 7 13 7 21"/>' +
      '<polyline points="7 3 7 8 15 8"/>',
  ),
  // Check (sucesso/feedback)
  check: _svg('<polyline points="20 6 9 17 4 12"/>'),
  // Paleta de cores
  palette: _svg(
    '<path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2v-.5c0-.5.4-1 1-1h2a4 4 0 0 0 4-4c0-5.5-4.5-10-9-10z"/>' +
      '<circle cx="7" cy="10.5" r="1.5" fill="currentColor" stroke="none"/>' +
      '<circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none"/>' +
      '<circle cx="17" cy="10.5" r="1.5" fill="currentColor" stroke="none"/>' +
      '<circle cx="10" cy="15" r="1.5" fill="currentColor" stroke="none"/>',
  ),
  // Sparkle / efeito RGB (animação de cor)
  rgb: _svg(
    '<path d="M12 2l1.4 4.2L18 8l-4.6 1.8L12 14l-1.4-4.2L6 8l4.6-1.8z" fill="currentColor" stroke="none"/>' +
      '<path d="M5 3l.7 2.1L8 6.5l-2.3.9L5 9.5l-.7-2.1L2 6.5l2.3-.9z" fill="currentColor" stroke="none"/>' +
      '<path d="M19 15l.7 2.1L22 18.5l-2.3.9L19 21.5l-.7-2.1L16 18.5l2.3-.9z" fill="currentColor" stroke="none"/>',
  ),
};

// ─────────────────────────────────────────────
//  Helpers de persistência
// ─────────────────────────────────────────────
const STORE_KEY = "KysoTheme.settings";

function loadSettings() {
  try {
    const raw = DataStore.get(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSettings(settings) {
  const _toSave = {
    ...settings,
    // Legacy mirror — derived from new triple so external readers still work
    backgroundUrl: resolveAsset("background", { ...DEFAULTS, ...settings }),
  };
  DataStore.set(STORE_KEY, JSON.stringify(_toSave));
}

// ─────────────────────────────────────────────
//  Configurações padrão
// ─────────────────────────────────────────────
const DEFAULTS = {
  // Legacy mirrors (write-only after migration — never read internally)
  backgroundUrl: "",
  iconUrl: "",
  // Background — Local|Web triple
  backgroundSource: "local",
  backgroundLocal: "Main/background.jpg",
  backgroundWeb: "",
  backgroundType: "auto", // "auto" | "gif" | "image" | "video"
  // Banner
  bannerSource: "local",
  bannerLocal: "",
  bannerWeb: "",
  // Crest
  crestSource: "local",
  crestLocal: "",
  crestWeb: "",
  crestRank: "", // override rank crest to a LoL tier default (caps) e.g. "GOLD"; "" = off
  crestDivision: "I", // division I-IV for non-apex tiers (apex forced to "O")
  crestChangeAll: false, // override all ranked-tooltip queues vs only the displayed one
  crestLP: "",           // override the LP shown in the rank tooltip ("" = leave real)
  hoverBackdrop: "",     // self-only regalia hovercard splash (dataURL/web URL); "" = client default
  // Profile icon (self-only — no allPlayers toggle)
  profileIconSource: "local",
  profileIconLocal: "",
  profileIconWeb: "",
  // Loading screen
  loadingBgSource: "local",
  loadingBgLocal: "Loading Screen/loading-background.jpg",
  loadingBgWeb: "",
  loadingIconSource: "local",
  loadingIconLocal: "Loading Screen/loading-icon.gif",
  loadingIconWeb: "",
  // Visibility / hide features
  hideRP: false,
  hideHoverElements: false, // legacy bundle (OR'd with the granular flags below)
  // Granular "always show" toggles — split out of hideHoverElements so each
  // hover-faded element is its own option. false → fades until hover (legacy
  // default); true → always visible.
  alwaysShowChat: false,
  alwaysShowInvite: false,
  alwaysShowNotifications: false,
  alwaysShowXpRing: false,
  alwaysShowStatus: false,
  alwaysShowSocialActions: false,
  alwaysShowVersion: false,
  activityTabsAlwaysVisible: false, // force #activity-center tabs always visible
  // ── v3.2 Bucket A: hide/show toggles (default = current theme look) ──
  alwaysShowXpRadial: false,        // .summoner-xp-radial-container
  alwaysShowRuneRec: false,         // .rune-recommender-button-component
  alwaysShowDeepLinks: false,       // .deep-links-promo
  showLootBackdrop: false,          // .loot-backdrop
  showIncidentTicker: false,        // .navigation-status-ticker.has-incidents
  showRestrictionWarning: false,    // .player-restriction-warning-icon
  showLoadingSpinner: false,        // .lol-loading-screen-spinner
  showLobbyOverlay: false,          // .lobby-header-overlay
  showNavDividers: false,           // .right-nav-vertical-rule
  showActivityDivider: false,       // .activity-center__tabs_section-divider
  // ── v3.2 Bucket C: visual-effect toggles (default ON = current look) ──
  killClientBlur: true,             // *{backdrop-filter:none} + parties blur collapse
  storeHueOverlay: true,            // store/yourshop accent hue blend
  readyCheckAnim: true,             // ready-check fadeIn animations
  viewportGlow: true,               // #rcp-fe-viewport-root accent drop-shadow
  // ── v3.2 Bucket B: per-screen backgrounds ──
  collectionsBgSource: "local", collectionsBgLocal: "Collections/collections-bg22.jpg", collectionsBgWeb: "", collectionsBgEnabled: false,
  champSelectBgSource: "local", champSelectBgLocal: "Runes and Select/champ-select-and-runes.jpg", champSelectBgWeb: "", champSelectBgEnabled: true,
  runesBgSource: "local", runesBgLocal: "Runes and Select/champ-select-and-runes.jpg", runesBgWeb: "", runesBgEnabled: true,
  modeSwitcherBgSource: "local", modeSwitcherBgLocal: "ModeSwitcher/switch.jpg", modeSwitcherBgWeb: "", modeSwitcherBgEnabled: false,
  hideTFT: false,
  hideSocialOnly: false,
  hideSocialPanel: false,
  fontUrl: "",
  fontFamily: "",
  // Sliding-door hide-navbar
  enableHideNavbarBtn: false,
  navbarHidden: false,
  showBlueEssenceOnHide: false,
  // Sliding-door hide-social-panel
  enableHideSocialBtn: false,
  socialHidden: false,
  // Color accent
  accentColor: "",
  accentAuto: false,
  lolColorScheme: false,       // force League's native gold accent (themed buttons kept)
  // Background filters (CSS filter on #kyso-global-bg)
  filterBlur: 0,        // px (0-20)
  filterBrightness: 100, // % (50-200)
  filterSaturate: 100,  // % (0-200)
  filterContrast: 100,  // % (50-200)
  // RGB accent animation (PR C)
  rgbMode: "none",
  rgbSpeed: 3,
  // Icon (self or all-players)
  iconUrl: "",
  iconAllPlayers: false,
  // ── Kyso UI Editor (v3.1) ─────────────────────────────────────────────
  iconSyncNavbar: true,        // sync chosen profile icon to top navbar
  iconSwapMastery: false,      // also replace the champ mastery icon (.style-profile-champion-icon-masked) — opt-in
  bannerHidden: false,         // fully hide profile banner
  profileBgTransparent: false, // transparent profile champ-splash bg
  gearAlwaysVisible: false,    // profile-skin-picker gear: always vs hover
  lorAlwaysVisible: false,     // LoR button: always vs hover
  playVanilla: false,          // revert play button to vanilla
  playBgOpacity: 0,            // themed play button backdrop alpha % (0-100)
  playBgBlur: 0,               // themed play button backdrop blur px (0-20)
  socialBlur: 0,               // social panel backdrop blur px (0-20)
  hasSeenWelcome: false,       // first-run modal gate
};

// ─────────────────────────────────────────────
//  Aplicação das configurações no DOM / CSS
// ─────────────────────────────────────────────
let dynamicStyle = null;
let _rgbAnimHandle = null;
let _accentAutoGen = 0;

function getOrCreateDynamicStyle() {
  if (!dynamicStyle) {
    dynamicStyle = document.createElement("style");
    dynamicStyle.id = "kyso-theme-dynamic";
    document.head.appendChild(dynamicStyle);
  }
  return dynamicStyle;
}

function detectMediaType(url) {
  if (!url) return "image";
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".gif")) return "gif";
  // Tipos extras suportados
  const videoExts = [".mp4", ".webm", ".ogg", ".ogv"];
  if (videoExts.some((e) => clean.endsWith(e))) return "video";
  return "image";
}

// ─────────────────────────────────────────────
//  Asset paths (Pengu Loader)
// ─────────────────────────────────────────────
// Pengu Loader serve plugin folder em //plugins/<themeName>/. Relativos
// ./ resolvem contra https://riot:port/ (URL do client), NÃO contra o
// plugin → precisa caminho absoluto p/ que img.src / video.src funcionem.
const PLUGIN_NAME = "KysoTheme";
const PLUGIN_ASSETS_BASE = `//plugins/${PLUGIN_NAME}/assets/`;

function pluginAsset(relPath) {
  // relPath = "Main/background.jpg" → "//plugins/KysoTheme/assets/Main/background.jpg"
  // Absolute URLs (http(s), //, data:) pass through unchanged so manifest entries
  // can point at LCU built-in plugins (ex.: //plugins/rcp-fe-lol-static-assets/...).
  if (!relPath) return "";
  const s = String(relPath);
  if (/^(https?:)?\/\//.test(s) || s.startsWith("data:")) return s;
  return PLUGIN_ASSETS_BASE + s.replace(/^\/+/, "");
}

// Resolves a {cat}Source/{cat}Local/{cat}Web triple into a final URL.
// cat = "background" | "banner" | "crest" | "profileIcon" | "loadingBg" | "loadingIcon"
function resolveAsset(cat, settings) {
  const source = settings[cat + "Source"];
  if (source === "web") return settings[cat + "Web"] || "";
  const local = settings[cat + "Local"] || "";
  return local ? pluginAsset(local) : "";
}

// Builds the HTML for one asset category section (no collapse — always expanded).
// cat: prefix used in DEFAULTS keys (e.g. "banner" → bannerSource/bannerLocal/bannerWeb).
// labelKey: i18n key for the section heading.
// manifestEntries: array from manifest.categories[<cat plural>].
// opts.extraControls: HTML inserted before the reset row (e.g. bg-type select, banner upload).
// opts.icon: ICONS key (default ICONS.picture).
function buildAssetBlock(cat, labelKey, manifestEntries, settings, opts = {}) {
  const source = settings[cat + "Source"] || "local";
  const local = settings[cat + "Local"] || "";
  const web = settings[cat + "Web"] || "";
  const extraControls = opts.extraControls || "";
  const headerIcon = opts.icon || ICONS.picture;

  const thumbsHTML = manifestEntries
    .map((e) => {
      const sel = e.path === local ? " kyso-thumb--active" : "";
      const safeLabel = String(e.label)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
      return `
        <button class="kyso-thumb${sel}" type="button"
                data-cat="${cat}" data-path="${e.path.replace(/"/g, "&quot;")}"
                title="${safeLabel}">
          <img class="kyso-thumb-img" src="${pluginAsset(e.path)}" alt="" loading="lazy" decoding="async">
          <span class="kyso-thumb-label">${safeLabel}</span>
        </button>`;
    })
    .join("");

  // Upload tile — last slot in the grid, accepts an image file and
  // applies it as a web dataURL. Always rendered so users can add a
  // custom image even when the manifest list is empty.
  const uploadTile = `
    <label class="kyso-thumb kyso-thumb--upload" data-cat="${cat}" title="${t("addImage")}">
      <input type="file" class="kyso-thumb-upload-input" accept="image/*" data-cat="${cat}" style="display:none;">
      <div class="kyso-thumb-img kyso-thumb-img--upload" aria-hidden="true">+</div>
      <span class="kyso-thumb-label">${t("addImage")}</span>
    </label>`;

  const thumbs = manifestEntries.length
    ? thumbsHTML + uploadTile
    : `<div class="kyso-thumb-empty">${t("noLocalAssets")}</div>${uploadTile}`;

  return `
    <section class="kyso-settings-section kyso-asset-section" data-cat="${cat}">
      <h3 class="kyso-settings-section-title">${headerIcon}<span>${t(labelKey)}</span></h3>

      <div class="kyso-settings-row kyso-asset-source-row">
        <span class="kyso-asset-source-label ${source === "local" ? "kyso-asset-source-label--active" : ""}">${t("sourceLocal")}</span>
        <label class="kyso-toggle">
          <input type="checkbox" id="kyso-${cat}-source-toggle" ${source === "web" ? "checked" : ""}>
          <span class="kyso-toggle-slider"></span>
        </label>
        <span class="kyso-asset-source-label ${source === "web" ? "kyso-asset-source-label--active" : ""}">${t("sourceWeb")}</span>
      </div>

      <div class="kyso-settings-row kyso-asset-local-row" ${source === "local" ? "" : 'style="display:none"'}>
        <div class="kyso-thumb-grid">${thumbs}</div>
      </div>

      <div class="kyso-settings-row kyso-asset-web-row" ${source === "web" ? "" : 'style="display:none"'}>
        <input id="kyso-${cat}-web" class="kyso-input" type="text"
               placeholder="${t("webUrlPlaceholder")}"
               value="${web.replace(/"/g, "&quot;")}">
        <button class="kyso-btn kyso-btn--primary kyso-${cat}-apply" data-cat="${cat}">${t("applyAsset")}</button>
      </div>

      ${extraControls}

      <div class="kyso-settings-row">
        <button class="kyso-btn kyso-btn--secondary kyso-${cat}-reset" data-cat="${cat}">${t("resetToDefault")}</button>
      </div>
    </section>
  `;
}

// Default bg usado quando settings.backgroundUrl está vazia.
const DEFAULT_BG_URL = pluginAsset("Main/background.jpg");

// Presets ship-com-tema (lista hardcoded — adicione arquivos em
// assets/Main/ e estenda este array). Caminhos relativos ao assets/.
const PRESET_BACKGROUNDS = [
  { label: "Default", path: "Main/background.jpg" },
  { label: "Alt 1", path: "Main/1.jpg" },
  { label: "Alt 2", path: "Main/2.jpg" },
  { label: "Animated GIF", path: "Main/background.gif" },
];

// Tamanho máximo (bytes) p/ aceitar upload local como dataURL persistente.
// Acima disso, recomendar arquivo na pasta + caminho manual. Vídeos
// SEMPRE rejeitam base64 — codificá-los trava o client.
const MAX_BASE64_BYTES = 2 * 1024 * 1024; // 2 MB

function ensureGlobalBgContainer() {
  let container = document.querySelector("#kyso-global-bg");
  if (!container) {
    container = document.createElement("div");
    container.id = "kyso-global-bg";
    // Insere como primeiro filho do body — fica atrás de todo o cliente
    // (z-index:-1 vem do CSS em theme.css).
    if (document.body.firstChild) {
      document.body.insertBefore(container, document.body.firstChild);
    } else {
      document.body.appendChild(container);
    }
  }
  return container;
}

// ─────────────────────────────────────────────
//  Accent color helpers
// ─────────────────────────────────────────────
function _hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function _hexToHsl(hex) {
  let { r, g, b } = _hexToRgb(hex);
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

/** HSL (h=0-360, s=0-100, l=0-100) → { r, g, b } (0-255) */
function _hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
}

function _toHexStr(r, g, b) {
  return (
    "#" +
    [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
  );
}

/** Aplica filtros CSS no container de background (blur, brilho, saturação, contraste) */
function applyBgFilters(settings) {
  const blur = Number(settings.filterBlur) || 0;
  const bright = Number(settings.filterBrightness) || 100;
  const sat = Number(settings.filterSaturate) || 100;
  const cont = Number(settings.filterContrast) || 100;
  const container = ensureGlobalBgContainer();
  if (!container) return;
  const parts = [];
  if (blur > 0) parts.push(`blur(${blur}px)`);
  if (bright !== 100) parts.push(`brightness(${bright}%)`);
  if (sat !== 100) parts.push(`saturate(${sat}%)`);
  if (cont !== 100) parts.push(`contrast(${cont}%)`);
  container.style.filter = parts.length ? parts.join(" ") : "";
}

// League's canonical border gold. Used by the "League color scheme" switch to
// recolor the themed UI to vanilla LoL gold without touching button shapes.
const LOL_GOLD = "#C8AA6E";

/** Aplica a cor de acento nas CSS custom properties de :root */
function applyAccentColor(hex) {
  const color = hex && hex !== "" ? hex : "#ffffff";
  const { r, g, b } = _hexToRgb(color);
  const { h, s, l } = _hexToHsl(color);
  const root = document.documentElement;
  root.style.setProperty("--kyso-accent", color);
  root.style.setProperty("--kyso-accent-glow", `rgba(${r},${g},${b},0.5)`);
  root.style.setProperty("--kyso-accent-r", r);
  root.style.setProperty("--kyso-accent-g", g);
  root.style.setProperty("--kyso-accent-b", b);
  root.style.setProperty("--kyso-accent-h", Math.round(h));
  root.style.setProperty("--kyso-accent-s", Math.round(s));
  root.style.setProperty("--kyso-accent-l", Math.round(l));
}

// ─────────────────────────────────────────────
//  RGB accent animation engine (PR C)
// ─────────────────────────────────────────────
function _stopRgbAnim() {
  if (_rgbAnimHandle !== null) {
    cancelAnimationFrame(_rgbAnimHandle);
    _rgbAnimHandle = null;
  }
}

/**
 * Starts / stops the accent RGB animation.
 * @param {string} mode     "none" | "rainbow" | "blink" | "pulse"
 * @param {number} speed    1-5
 * @param {string} baseHex  Current saved accent hex
 */
function applyRgbEffect(mode, speed, baseHex) {
  _stopRgbAnim();
  if (!mode || mode === "none") return; // applyAccentColor already called by caller

  const sp = Math.max(1, Math.min(5, speed || 3));
  const root = document.documentElement;
  // Throttle: update CSS vars at ~20fps max regardless of display refresh rate.
  // Each setProperty on :root triggers style recalc on every element using that
  // custom property — limiting to 50ms intervals cuts CPU load significantly.
  const TICK_INTERVAL = 50; // ms → ~20 fps

  if (mode === "rainbow") {
    let startTime = null, lastTick = 0;
    function rainbowTick(ts) {
      _rgbAnimHandle = requestAnimationFrame(rainbowTick);
      if (startTime === null) startTime = ts;
      if (ts - lastTick < TICK_INTERVAL) return;
      lastTick = ts;
      const h = ((ts - startTime) * sp * 0.04) % 360;
      const { r, g, b } = _hslToRgb(h, 80, 50);
      root.style.setProperty("--kyso-accent-h", h.toFixed(0));
      root.style.setProperty("--kyso-accent-s", "80");
      root.style.setProperty("--kyso-accent-l", "50");
      root.style.setProperty("--kyso-accent", _toHexStr(r, g, b));
      root.style.setProperty("--kyso-accent-glow", `rgba(${r},${g},${b},0.5)`);
    }
    _rgbAnimHandle = requestAnimationFrame(rainbowTick);
  } else if (mode === "blink") {
    const { h, s } = _hexToHsl(baseHex || "#c8a040");
    const period = 500 / sp; // ms per on/off phase
    let startTime = null, lastTick = 0;
    root.style.setProperty("--kyso-accent-h", Math.round(h).toString());
    root.style.setProperty("--kyso-accent-s", Math.round(s).toString());
    function blinkTick(ts) {
      _rgbAnimHandle = requestAnimationFrame(blinkTick);
      if (startTime === null) startTime = ts;
      if (ts - lastTick < TICK_INTERVAL) return;
      lastTick = ts;
      const on = Math.floor((ts - startTime) / period) % 2 === 0;
      const l = on ? 50 : 8;
      const { r, g, b } = _hslToRgb(h, s, l);
      root.style.setProperty("--kyso-accent-l", l);
      root.style.setProperty("--kyso-accent", _toHexStr(r, g, b));
      root.style.setProperty("--kyso-accent-glow", `rgba(${r},${g},${b},0.5)`);
    }
    _rgbAnimHandle = requestAnimationFrame(blinkTick);
  } else if (mode === "pulse") {
    const { h, s } = _hexToHsl(baseHex || "#c8a040");
    const freq = sp * 0.001; // rad/ms
    let startTime = null, lastTick = 0;
    root.style.setProperty("--kyso-accent-h", Math.round(h).toString());
    root.style.setProperty("--kyso-accent-s", Math.round(s).toString());
    function pulseTick(ts) {
      _rgbAnimHandle = requestAnimationFrame(pulseTick);
      if (startTime === null) startTime = ts;
      if (ts - lastTick < TICK_INTERVAL) return;
      lastTick = ts;
      const l = Math.round(35 + 30 * Math.sin((ts - startTime) * freq));
      const { r, g, b } = _hslToRgb(h, s, l);
      root.style.setProperty("--kyso-accent-l", l);
      root.style.setProperty("--kyso-accent", _toHexStr(r, g, b));
      root.style.setProperty("--kyso-accent-glow", `rgba(${r},${g},${b},0.5)`);
    }
    _rgbAnimHandle = requestAnimationFrame(pulseTick);
  }
}

/**
 * Extrai a cor mais vibrante de uma imagem via <canvas>.
 * Retorna uma Promise<string> com o hex da cor dominante.
 */
async function extractAccentFromBackground(bgUrl) {
  if (!bgUrl) return Promise.resolve("#ffffff");
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        // Reduz para 96×96 — suficiente para frequência sem custo excessivo
        const SIZE = 96;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = SIZE;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, SIZE, SIZE);
        const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

        // Quantiza cada canal em 8 níveis (passo 32) → 512 buckets possíveis.
        // Isso agrupa cores similares para contar frequência real.
        const STEP = 32;
        const freq = new Map();
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue; // ignora pixels transparentes
          const r = Math.floor(data[i] / STEP) * STEP;
          const g = Math.floor(data[i + 1] / STEP) * STEP;
          const b = Math.floor(data[i + 2] / STEP) * STEP;
          const key = (r << 16) | (g << 8) | b;
          freq.set(key, (freq.get(key) || 0) + 1);
        }

        // Ordena por frequência decrescente
        const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);

        // Percorre do mais frequente para o menos:
        // - Ignora pretos (l < 12) e brancos (l > 88)
        // - Pega o primeiro com saturação ≥ 20 (cor dominante)
        // - Guarda o mais saturado como fallback para imagens dessaturadas
        let bestHex = null;
        let bestSatFallback = null;
        let bestSatVal = -1;
        for (const [key] of sorted) {
          const r = (key >> 16) & 0xff;
          const g = (key >> 8) & 0xff;
          const b = key & 0xff;
          const hex =
            "#" +
            [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
          const { s, l } = _hexToHsl(hex);
          if (l < 12 || l > 88) continue; // pula preto/branco
          if (s >= 20) {
            bestHex = hex; // cor colorida mais frequente
            break;
          }
          if (s > bestSatVal) {
            bestSatVal = s;
            bestSatFallback = hex; // fallback: mais saturada entre as acinzentadas
          }
        }

        resolve(
          bestHex ?? (bestSatVal >= 8 ? bestSatFallback : null) ?? "#ffffff",
        );
      } catch {
        resolve("#ffffff");
      }
    };
    img.onerror = () => resolve("#ffffff");
    img.src = bgUrl;
  });
}

function applyBackground(url, type) {
  const container = ensureGlobalBgContainer();
  // Limpa qualquer mídia anterior (img/video)
  container.innerHTML = "";

  // Limpa também vestígios do sistema antigo (#kyso-bg-video em body, e
  // inline backgroundImage em #rcp-fe-viewport-root) por segurança.
  const oldVideo = document.querySelector("#kyso-bg-video");
  if (oldVideo) oldVideo.remove();
  const root = document.querySelector("#rcp-fe-viewport-root");
  if (root) root.style.backgroundImage = "";

  const finalUrl = url && url.trim() ? url : DEFAULT_BG_URL;
  const resolvedType = type === "auto" ? detectMediaType(finalUrl) : type;

  if (resolvedType === "video") {
    // dataURL p/ vídeo = morte (decode síncrono de 50MB+ string). Rejeita.
    if (finalUrl.startsWith("data:")) {
      console.error(
        "[KysoTheme] Vídeo via dataURL bloqueado. Copie o arquivo para " +
          "plugins/KysoTheme/assets/ e use //plugins/KysoTheme/assets/<arquivo>",
      );
      // Fallback: bg preto até usuário corrigir
      return;
    }
    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("muted", ""); // alguns engines exigem attr além de prop
    video.setAttribute("playsinline", "");
    video.setAttribute("disableremoteplayback", "");
    video.disableRemotePlayback = true;
    // src por ÚLTIMO p/ que attrs já estejam set quando load começar
    video.src = finalUrl;
    container.appendChild(video);
    // Autoplay policy: chama play() depois do append + catch silencioso
    const tryPlay = () => video.play().catch(() => {});
    if (video.readyState >= 2) tryPlay();
    else video.addEventListener("loadeddata", tryPlay, { once: true });
  } else {
    // image, gif, qualquer raster
    const img = document.createElement("img");
    img.alt = "";
    img.draggable = false;
    img.decoding = "async";
    img.loading = "eager";
    img.src = finalUrl;
    container.appendChild(img);
  }
}

// ─────────────────────────────────────────────
//  Hide top navbar (estilo Elaina-theme)
//  Botão dentro de .right-nav-menu via prepend. Click translateX em
//  .main-navigation-menu-item, .right-nav-vertical-rule, .wallet-and-badges.
// ─────────────────────────────────────────────
let _navbarMutationObserver = null;

function applyTopNavbarHiddenState(hidden, showBlueEssence) {
  if (showBlueEssence === undefined) {
    showBlueEssence = !!loadSettings().showBlueEssenceOnHide;
  }
  const nav = document.querySelector(".right-nav-menu");
  if (!nav) return;
  const navWidth = nav.offsetWidth || 0;
  const offset = Math.max(navWidth - 40, 0);
  const items = document.querySelectorAll(
    ".right-nav-menu > .main-navigation-menu-item",
  );
  const rules = document.querySelectorAll(".right-nav-vertical-rule");
  const wallet = document.querySelector(".wallet-and-badges");
  const btn = document.querySelector(".hide-top-navbar");
  const icon = document.querySelector(".hide-top-navbar-icon");

  // Helper: set inline css with !important so Riot's class rules can't win.
  const apply = (el, tx, opacity, pe) => {
    if (!el) return;
    el.style.setProperty("transform", `translateX(${tx}px)`, "important");
    el.style.setProperty("opacity", String(opacity), "important");
    el.style.setProperty("pointer-events", pe, "important");
  };

  // Botão desliza junto: ao esconder vai até o fim (translateX = offset). Se
  // "always show blue essence" estiver ligado, a carteira (BE) permanece
  // visível em translateX(0), então o botão gruda logo à esquerda dela em vez
  // de ir até o fim. Ao mostrar, volta para translateX(0). offsetLeft é a
  // posição base (ignora transform), então o cálculo é estável entre toggles.
  if (btn) {
    let btx = 0;
    if (hidden) {
      if (showBlueEssence && wallet) {
        btx = Math.max(0, wallet.offsetLeft - btn.offsetLeft - btn.offsetWidth);
      } else {
        btx = offset;
      }
    }
    btn.style.setProperty("transform", `translateX(${btx}px)`, "important");
    btn.style.setProperty("opacity", "1", "important");
    btn.style.setProperty("pointer-events", "auto", "important");
  }

  if (hidden) {
    items.forEach((el) => apply(el, offset, 0, "none"));
    rules.forEach((el) => apply(el, offset, 0, "none"));
    if (wallet) {
      if (showBlueEssence) apply(wallet, 0, 1, "auto");
      else apply(wallet, offset, 0, "none");
    }
    if (icon) icon.textContent = "‹";
  } else {
    items.forEach((el) => apply(el, 0, 1, "auto"));
    rules.forEach((el) => apply(el, 0, 1, "auto"));
    if (wallet) apply(wallet, 0, 1, "auto");
    if (icon) icon.textContent = "›";
  }
}

function removeTopNavbarToggleButton() {
  document.querySelectorAll(".hide-top-navbar").forEach((b) => b.remove());
  // Restaura itens ao remover botão
  applyTopNavbarHiddenState(false);
  if (_navbarMutationObserver) {
    _navbarMutationObserver.disconnect();
    _navbarMutationObserver = null;
  }
}

function createTopNavbarToggleButton() {
  const nav = document.querySelector(".right-nav-menu");
  if (!nav) return null;
  if (nav.querySelector(".hide-top-navbar")) return null;

  const btn = document.createElement("div");
  btn.className = "hide-top-navbar";
  const icon = document.createElement("div");
  icon.className = "hide-top-navbar-icon";
  icon.textContent = "‹";
  btn.appendChild(icon);

  btn.addEventListener("click", () => {
    const s = { ...DEFAULTS, ...loadSettings() };
    const next = !s.navbarHidden;
    saveSettings({ ...s, navbarHidden: next });
    applyTopNavbarHiddenState(next);
  });

  nav.prepend(btn);
  return btn;
}

// ─────────────────────────────────────────────
//  Hide social panel (sliding-door estilo Elaina hideFriendList)
// ─────────────────────────────────────────────
const SOCIAL_SLIDE_TARGETS = [
  ".lol-social-lower-pane-container",
  ".sidebar-background",
  ".alpha-version-panel",
  "lol-parties-game-info-panel",
  ".watermark",
];
const SOCIAL_SLIDE_OFFSET = 225; // px — largura do social panel + margem

let _socialMutationObserver = null;

// v3.2 perf: coalesce MutationObserver bursts so the whole-body observers
// (navbar/social drawer-button keep-alive) don't thrash the main thread on the
// constantly-mutating client DOM. Trailing debounce — runs once after quiet.
function _debounce(fn, ms) {
  let h = null;
  return () => {
    if (h) clearTimeout(h);
    h = setTimeout(fn, ms);
  };
}

function applySocialHiddenState(hidden) {
  const btn = document.querySelector(".hide-friendslist");
  const icon = document.querySelector(".hide-friendslist-icon");
  const offset = hidden ? SOCIAL_SLIDE_OFFSET : 0;

  SOCIAL_SLIDE_TARGETS.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      el.style.transform = `translateX(${offset}px)`;
    });
  });

  if (btn) {
    btn.style.transform = `translateX(${hidden ? SOCIAL_SLIDE_OFFSET : 0}px)`;
  }
  if (icon) icon.textContent = hidden ? "‹" : "›";
}

function removeSocialToggleButton() {
  document.querySelectorAll(".hide-friendslist").forEach((b) => b.remove());
  applySocialHiddenState(false);
  if (_socialMutationObserver) {
    _socialMutationObserver.disconnect();
    _socialMutationObserver = null;
  }
}

function createSocialToggleButton() {
  const host = document.querySelector("#rcp-fe-viewport-root");
  if (!host) return null;
  if (host.querySelector(".hide-friendslist")) return null;

  const btn = document.createElement("div");
  btn.className = "hide-friendslist";
  const icon = document.createElement("div");
  icon.className = "hide-friendslist-icon";
  icon.textContent = "›";
  btn.appendChild(icon);

  btn.addEventListener("click", () => {
    const s = { ...DEFAULTS, ...loadSettings() };
    const next = !s.socialHidden;
    saveSettings({ ...s, socialHidden: next });
    applySocialHiddenState(next);
  });

  host.appendChild(btn);
  return btn;
}

function applyHideSocialBtnSetting(settings) {
  if (settings.enableHideSocialBtn) {
    const ensureButton = () => {
      // Only show the drawer button when the social panel is actually present.
      // In champion select and other non-lobby views the sidebar is unmounted,
      // so the button must be hidden there to avoid floating over the UI.
      const socialPresent = !!document.querySelector(
        ".lol-social-lower-pane-container, lol-social-roster"
      );
      const existingBtn = document.querySelector(".hide-friendslist");

      if (!socialPresent) {
        if (existingBtn) existingBtn.remove();
        return;
      }

      if (!existingBtn && document.querySelector("#rcp-fe-viewport-root")) {
        if (createSocialToggleButton()) {
          setTimeout(
            () => applySocialHiddenState(loadSettings().socialHidden),
            100,
          );
        }
      } else if (existingBtn) {
        // Button exists + social panel is present — reapply state for re-mounted elements
        applySocialHiddenState(loadSettings().socialHidden);
      }
    };

    ensureButton();

    if (_socialMutationObserver) _socialMutationObserver.disconnect();
    _socialMutationObserver = new MutationObserver(_debounce(ensureButton, 120));
    _socialMutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  } else {
    removeSocialToggleButton();
  }
}

function applyHideNavbarBtnSetting(settings) {
  if (settings.enableHideNavbarBtn) {
    const ensureButton = () => {
      // Se botão sumiu (page mount) + right-nav existe → recria
      if (
        !document.querySelector(".hide-top-navbar") &&
        document.querySelector(".right-nav-menu")
      ) {
        if (createTopNavbarToggleButton()) {
          // Espera items renderizarem antes de aplicar estado
          setTimeout(
            () => applyTopNavbarHiddenState(loadSettings().navbarHidden),
            100,
          );
        }
      }
    };

    ensureButton();

    // Observer persistente — sobrevive page changes que destroem right-nav
    if (_navbarMutationObserver) _navbarMutationObserver.disconnect();
    _navbarMutationObserver = new MutationObserver(_debounce(ensureButton, 120));
    _navbarMutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  } else {
    removeTopNavbarToggleButton();
  }
}

function applyFont(fontUrl, fontFamily) {
  const style = getOrCreateDynamicStyle();
  let css = "";

  if (fontUrl && fontFamily) {
    css += `@import url('${fontUrl}');\n`;
    css += `:root { --font-display: '${fontFamily}', sans-serif !important; --font-body: '${fontFamily}', sans-serif !important; }\n`;
  } else if (fontFamily) {
    css += `:root { --font-display: '${fontFamily}', sans-serif !important; --font-body: '${fontFamily}', sans-serif !important; }\n`;
  }

  // Manter o restante dos estilos já aplicados
  const current = style.textContent || "";
  const withoutFont = current
    .replace(/@import url\([^)]*\);\n?/g, "")
    .replace(/:root\s*\{[^}]*--font[^}]*\}\n?/g, "");
  style.textContent = css + withoutFont;
}

function applyHideOptions(settings) {
  const style = getOrCreateDynamicStyle();

  let css = "";

  if (settings.hideRP) {
    css += `.currency-rp-container-top-up-enabled { display: none !important; }\n`;
  }

  // Per-element hover-fade. Each element fades until hover UNLESS its own
  // granular "always show" flag is set. The legacy hideHoverElements bundle is
  // no longer honored (it OR'd into every condition and suppressed every
  // granular toggle); old saves with it true are migrated to the granular flags
  // at init (initSettingsPage).
  if (!(settings.alwaysShowVersion)) {
    css += `.alpha-version-panel { opacity: 0 !important; transition: 0.2s !important; }
.alpha-version-panel:hover { opacity: 1 !important; transition: 0.2s !important; }
`;
  }
  if (!(settings.alwaysShowChat)) {
    css += `.v2-footer-component .left-container .chat-container {
  opacity: 0 !important; transition: 0.2s !important; pointer-events: auto !important;
}
.v2-footer-component .left-container .chat-container:hover {
  opacity: 1 !important; transition: 0.2s !important;
}
`;
  }
  if (!(settings.alwaysShowInvite)) {
    css += `.invite-info-panel-container {
  opacity: 0 !important; transition: 0.2s !important; pointer-events: auto !important;
}
.invite-info-panel-container:hover { opacity: 1 !important; transition: 0.2s !important; }
`;
  }
  if (!(settings.alwaysShowXpRing)) {
    css += `.xp-ring { opacity: 0 !important; transition: 0.2s !important; }
.identity-icon:hover .xp-ring,
.summoner-level-icon:hover .xp-ring {
  opacity: 1 !important; transition: 0.2s !important;
}
`;
  }
  if (!(settings.alwaysShowNotifications)) {
    css += `.notifications-button { opacity: 0 !important; transition: 0.2s !important; }
.notifications-button:hover { opacity: 1 !important; transition: 0.2s !important; }
`;
  }
  if (!(settings.alwaysShowStatus)) {
    css += `.lower-details > .status,
.lower-details > lol-social-availability-hitbox {
  opacity: 0 !important; transition: 0.2s !important;
}
.lower-details:hover > .status,
.lower-details:hover > lol-social-availability-hitbox {
  opacity: 1 !important; transition: 0.2s !important;
}
`;
  }
  if (!(settings.alwaysShowSocialActions)) {
    css += `.lol-social-actions-bar .actions-bar .action-bar-button:not(:first-child) {
  opacity: 0; transition: 0.2s !important;
}
.lol-social-actions-bar:hover .actions-bar .action-bar-button:not(:first-child) {
  opacity: 1; transition: 0.2s !important;
}
`;
  }

  if (settings.activityTabsAlwaysVisible) {
    css += `#activity-center .activity-center__tabs_scrollable {
  opacity: 1 !important; visibility: visible !important; display: flex !important;
}
`;
  }

  if (settings.hideTFT) {
    css += `.menu_item_navbar_tft { opacity: 0 !important; transition: 0.2s !important; }
.menu_item_navbar_tft:hover { opacity: 1 !important; transition: 0.2s !important; }\n`;
  }

  // Mutex enforced no toggle handler; aqui apenas montamos o CSS.
  if (settings.hideSocialPanel) {
    // Modo "ambos": painel social + right-nav em hover.
    css += `.lol-social-lower-pane-container,
.right-nav-menu {
  opacity: 0 !important;
  transition: 0.2s !important;
  pointer-events: auto !important;
}
.lol-social-lower-pane-container:hover,
.right-nav-menu:hover {
  opacity: 1 !important;
  transition: 0.2s !important;
}\n`;
  } else if (settings.hideSocialOnly) {
    // Modo "só social": apenas painel social em hover.
    css += `.lol-social-lower-pane-container {
  opacity: 0 !important;
  transition: 0.2s !important;
  pointer-events: auto !important;
}
.lol-social-lower-pane-container:hover {
  opacity: 1 !important;
  transition: 0.2s !important;
}\n`;
  }

  // ── v3.2 Bucket A: hover-fade items (OFF = fade until hover; ON = always) ──
  if (!(settings.alwaysShowXpRadial)) {
    css += `.summoner-xp-radial-container { opacity: 0 !important; transition: 0.2s !important; }
.summoner-xp-radial-container:hover { opacity: 1 !important; transition: 0.2s !important; }
`;
  }
  if (!(settings.alwaysShowRuneRec)) {
    css += `.rune-recommender-button-component { opacity: 0 !important; transition: 0.2s !important; }
.rune-recommender-button-component:hover { opacity: 1 !important; transition: 0.2s !important; }
`;
  }
  if (!(settings.alwaysShowDeepLinks)) {
    css += `.deep-links-promo { opacity: 0 !important; transition: 0.2s !important; }
.deep-links-promo:hover { opacity: 1 !important; transition: 0.2s !important; }
`;
  }
  // ── v3.2 Bucket A: force-hidden items (OFF = hidden; ON = shown) ──
  if (!settings.showLootBackdrop) {
    css += `.loot-backdrop { opacity: 0 !important; }\n`;
  }
  if (!settings.showIncidentTicker) {
    css += `.navigation-status-ticker.has-incidents { visibility: hidden !important; }\n`;
  }
  if (!settings.showRestrictionWarning) {
    css += `.player-restriction-info-component .player-restriction-warning-icon { visibility: hidden !important; }\n`;
  }
  if (!settings.showLoadingSpinner) {
    css += `.lol-loading-screen-spinner { visibility: hidden !important; }\n`;
  }
  if (!settings.showLobbyOverlay) {
    css += `.v2-header-component .lobby-header-overlay { display: none !important; }\n`;
  }
  if (!settings.showNavDividers) {
    css += `.right-nav-vertical-rule { display: none !important; }\n`;
  }
  if (!settings.showActivityDivider) {
    css += `#activity-center .activity-center__tabs_section-divider { visibility: hidden !important; }\n`;
  }

  // Substitui apenas o bloco de hide options preservando font
  const existingStyle = style.textContent || "";
  const withoutHide = existingStyle.replace(
    /\/\* KYSO-HIDE-START \*\/[\s\S]*?\/\* KYSO-HIDE-END \*\//g,
    "",
  );
  style.textContent =
    withoutHide + `/* KYSO-HIDE-START */\n${css}/* KYSO-HIDE-END */\n`;
}

function applyIcon(url, allPlayers = false, syncNavbar = false, swapMastery = false) {
  const style = getOrCreateDynamicStyle();
  // Mastery champ icon (.style-profile-champion-icon-masked) is now opt-in via
  // swapMastery and INDEPENDENT of the top-bar sync. OFF keeps the real mastery icon.
  const masterySel = swapMastery
    ? ",\n.style-profile-champion-icon-masked > img"
    : "";
  let iconBlock;
  if (!url) {
    iconBlock = `/* KYSO-ICON-START *//* KYSO-ICON-END */\n`;
  } else if (allPlayers) {
    // Modo "todos": seletores globais (comportamento antigo)
    iconBlock = `/* KYSO-ICON-START */\n.icon-image.has-icon,\n.top > .icon-image.has-icon,\n.summoner-level-icon .icon-image {\n  background-image: url("${url}") !important;\n  background-size: cover !important;\n  background-position: center !important;\n}\nsummoner-icon,\nimg.icon-image.has-icon${masterySel} {\n  content: url("${url}") !important;\n}\n/* KYSO-ICON-END */\n`;
  } else {
    // Modo "só eu": escopo restrito ao avatar próprio na barra lateral.
    // navbarSel was a background-image rule on a SIBLING (.top > .icon-image)
    // which rendered a second icon BELOW the official one. Dropped — we now
    // override the real top-bar <img> (lol-uikit-radial-progress > .top > img)
    // directly via content:url(), so there is exactly one synced icon.
    const navbarSel = "";
    // Top-bar avatar gated by syncNavbar; mastery gated separately by swapMastery.
    const navbarContentSel =
      masterySel +
      (syncNavbar ? ",\nlol-uikit-radial-progress > div.top > img" : "");
    iconBlock = `/* KYSO-ICON-START */\nlol-social-avatar .icon-image.has-icon,\nlol-social-avatar .summoner-level-icon .icon-image${navbarSel} {\n  background-image: url("${url}") !important;\n  background-size: cover !important;\n  background-position: center !important;\n}\nlol-social-avatar img.icon-image.has-icon,\nlol-social-avatar summoner-icon${navbarContentSel} {\n  content: url("${url}") !important;\n}\n/* KYSO-ICON-END */\n`;
  }

  const current = style.textContent || "";
  const withoutIcon = current.replace(
    /\/\* KYSO-ICON-START \*\/[\s\S]*?\/\* KYSO-ICON-END \*\//g,
    "",
  );
  style.textContent = withoutIcon + iconBlock;

  if (url) updateIconInDOM(url, allPlayers);
}

function updateIconInDOM(url, allPlayers = false) {
  // Shadow DOM: ícone da página de perfil (sempre atualizado)
  const regaliaProfile = document.querySelector(
    "lol-regalia-profile-v2-element",
  );
  if (regaliaProfile && regaliaProfile.shadowRoot) {
    const icon = regaliaProfile.shadowRoot.querySelector(
      "div > div > div.regalia-profile-crest-hover-area.picker-enabled > lol-regalia-crest-v2-element",
    );
    if (icon) icon.setAttribute("profile-icon-url", url);
  }
  // Ícone da barra lateral – sempre o próprio (lol-social-avatar)
  const sidebarIcon = document.querySelector(
    "lol-social-avatar .summoner-level-icon .icon-image",
  );
  if (sidebarIcon) {
    if (sidebarIcon.tagName === "IMG") {
      sidebarIcon.setAttribute("src", url);
    } else {
      sidebarIcon.style.backgroundImage = `url("${url}")`;
      sidebarIcon.style.backgroundSize = "cover";
      sidebarIcon.style.backgroundPosition = "center";
    }
  }
  if (allPlayers) {
    // Modo "todos": atualiza img e div de todos os jogadores no DOM
    document.querySelectorAll("img.icon-image.has-icon").forEach((img) => {
      img.setAttribute("src", url);
    });
    document.querySelectorAll(".icon-image.has-icon:not(img)").forEach((el) => {
      el.style.backgroundImage = `url("${url}")`;
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
    });
  }
}

// Builds the themed play-button CSS (relocated from theme.css). When the user
// chooses vanilla, this is omitted entirely so the client's own art returns.
function _playButtonThemedCss(opacity, blur) {
  const alpha = Math.max(0, Math.min(100, Number(opacity) || 0)) / 100;
  const b = Math.max(0, Math.min(20, Number(blur) || 0));
  const bgRule = alpha > 0 ? `background: rgba(0,0,0,${alpha}) !important;` : `background: transparent !important;`;
  const blurRule = b > 0 ? `backdrop-filter: blur(${b}px) !important; -webkit-backdrop-filter: blur(${b}px) !important;` : "";
  return `
.play-button-frame { background-image: none !important; }
.play-button-content { left: 30px !important; width: calc(100% - 52px) !important; }
.play-button-container {
  ${bgRule}
  ${blurRule}
  border-radius: 50px !important;
  border: 1px solid var(--kyso-accent) !important;
  filter: drop-shadow(1px 1px 8px var(--kyso-accent-glow)) !important;
  transition: 0.2s !important;
  cursor: pointer;
}
.play-button-container:hover { filter: drop-shadow(1px 1px 15px var(--kyso-accent-glow)) !important; transition: 0.2s !important; }
.play-button-text { color: var(--kyso-accent) !important; font-family: "Open Sans", sans-serif !important; content: "▶" !important; visibility: hidden; z-index: 0 !important; }
.play-button-text:after { content: "▶"; visibility: visible; display: block; position: absolute; left: 28px; }
#rcp-fe-viewport-root > .rcp-fe-viewport-overlay > .screen-root[style*="visibility: hidden;"] ~ .play-button-text:after { visibility: hidden !important; }
.play-button-component[style*="visibility: hidden;"] ~ .play-button-text:after { visibility: hidden !important; }
.play-button-component[style*="visibility: hidden;"] + .play-button-text:after { visibility: hidden !important; }
.play-button-component[style*="visibility: hidden;"] .play-button-text:after { visibility: hidden !important; }
.screen-root[style*="visibility: hidden;"] .play-button-text:after { visibility: hidden !important; }
.screen-root[style*="visibility: hidden;"] ~ .play-button-text:after { visibility: hidden !important; }
.screen-root[style*="visibility: hidden;"] + .play-button-text:after { visibility: hidden !important; }
.champion-select-main-container:not(:hidden) ~ .play-button-text:after { display: none !important; visibility: hidden !important; }
.champion-select-main-container:visible .play-button-text:after { display: none !important; }
.play-button-container:hover .play-button-text:after { color: #c7c7c7 !important; }
.play-button-container:active .play-button-text:after { color: #c7c7c7 !important; }
`;
}

// Themed top-navigation layout (relocated from theme.css). Repositions the
// play button (.basic-button) and the nav items to build the centered themed
// nav. Omitted entirely in vanilla mode so the play button and nav return to
// their original positions.
function _themedNavCss() {
  return `
.main-navigation-menu-item .menu_item_navbar_event_hub .ember-view { left: -338px !important; }
.main-navigation-menu-item .menu_item_navbar_competitive .ember-view { left: -448px !important; }
.basic-button { left: 32vw !important; height: 48px !important; width: 122px !important; top: 15px !important; }
.left-nav-menu { position: relative !important; margin-left: -200px !important; }
/* Hide the League logo only in THEMED mode (the themed play button uses its
   own ▶ glyph). In vanilla mode this block is omitted, so the original animated
   League logo shows to the left of the play button. */
.league-logo { display: none !important; }
lol-uikit-video-state-machine { display: none !important; }
`;
}

// Injects the KYSO-INTERFACE delimited block: play button + nav layout (themed
// unless vanilla), gear/LoR always-visible overrides.
function applyInterfaceToggles(settings) {
  const style = getOrCreateDynamicStyle();
  let block = "/* KYSO-INTERFACE-START */\n";
  if (!settings.playVanilla) {
    block += _playButtonThemedCss(settings.playBgOpacity, settings.playBgBlur);
    block += _themedNavCss();
  }
  if (settings.gearAlwaysVisible) {
    block += `.style-profile-skin-picker-button { opacity: 1 !important; }\n`;
  } else {
    block += `.style-profile-skin-picker-button { opacity: 0; transition: 0.2s !important; }
.style-profile-skin-picker-button:hover { opacity: 1; transition: 0.2s !important; }
`;
  }
  if (settings.lorAlwaysVisible) {
    block += `.launch-lor-button-container,
.deep-links-promo-element .launch-lor-button-arrow { opacity: 1 !important; }\n`;
  } else {
    block += `.launch-lor-button-container,
.deep-links-promo-element .launch-lor-button-arrow { opacity: 0; transition: 0.2s !important; }
.launch-lor-button-container:hover,
.deep-links-promo-element:hover .launch-lor-button-arrow { opacity: 1; transition: 0.2s !important; }
`;
  }
  block += "/* KYSO-INTERFACE-END */\n";

  const current = style.textContent || "";
  const without = current.replace(
    /\/\* KYSO-INTERFACE-START \*\/[\s\S]*?\/\* KYSO-INTERFACE-END \*\//g,
    "",
  );
  style.textContent = without + block;
}

// v3.2 Bucket C — visual effects relocated from theme.css. Each emits its rule
// when ON (default) and nothing when OFF (native client look). Fence: KYSO-VIS.
function applyVisualToggles(settings) {
  const style = getOrCreateDynamicStyle();
  let block = "/* KYSO-VIS-START */\n";
  if (settings.killClientBlur) {
    block += `*, *::before, *::after { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
.parties-view .parties-background { height: 0px !important; }
.v2-lobby-root-component .navbar-blur { background: none !important; backdrop-filter: none !important; }
.rcp-fe-lol-navigation-app .navbar_backdrop { backdrop-filter: blur(0px) !important; }
`;
  }
  if (settings.storeHueOverlay) {
    block += `.yourshop-root { position: relative; isolation: isolate; }
.yourshop-root:before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; mix-blend-mode: hue; background-color: var(--kyso-accent) !important; z-index: 1; }
.yourshop-content-wrapper { position: relative; z-index: 2; }
.store-backdrop { position: relative; isolation: isolate; }
.store-backdrop:before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; mix-blend-mode: hue; background-color: var(--kyso-accent) !important; z-index: -1; }
.__rcp-fe-lol-store { position: relative; z-index: 1; }
`;
  }
  if (settings.readyCheckAnim) {
    block += `.ready-check-state-machine-timer { animation-name: fadeIn; animation-duration: 1s; filter: hue-rotate(0deg) !important; }
.ready-check-timer, .ready-check-timer.ember-view,
.ready-check-root-element, .ready-check-root-element.ember-view,
.fake-application-template { animation-name: fadeIn; animation-duration: 1s; }
`;
  }
  if (settings.viewportGlow) {
    block += `#rcp-fe-viewport-root { filter: drop-shadow(1px 1px 1px var(--kyso-accent-glow)) !important; }\n`;
  }
  block += "/* KYSO-VIS-END */\n";

  const current = style.textContent || "";
  const without = current.replace(
    /\/\* KYSO-VIS-START \*\/[\s\S]*?\/\* KYSO-VIS-END \*\//g,
    "",
  );
  style.textContent = without + block;
}

// Bridges the social-blur slider to index.js's blur scrubber.
function applySocialBlur(px) {
  window.__kysoSocialBlur = Math.max(0, Math.min(20, Number(px) || 0));
  if (typeof window.__kysoRescrub === "function") window.__kysoRescrub();
}

function showWelcomeModal() {
  if (document.querySelector("#kyso-welcome-overlay")) return;

  // CRITICAL — why interaction lives on `document`, not on the overlay:
  // After we append this overlay to <body>, the League client (CEF/rcp/Ember)
  // CLONES the subtree and swaps our node for a fresh copy. The clone keeps
  // attributes (id, class, data-*) but DROPS every JS-attached handler —
  // `el.onclick` AND `el.addEventListener` alike. Verified in-client:
  // immediately after build the skip button has onclick=function; a moment
  // later the live node is a different element (===) with onclick=null but the
  // same data-* attributes. So ANY handler bound to the overlay or its children
  // dies, which is why every previous approach (inline onclick, per-element
  // listeners, window-coordinate hit-testing) failed.
  //
  // Robust fix: one capture-phase `click` listener on `document` (which is
  // never cloned). On each click we resolve the control via
  // `e.target.closest("[data-act]")` — no coordinate math, so the client's CSS
  // `zoom` is irrelevant — and act on the LIVE overlay (re-queried by id every
  // time), never the captured-but-detached `overlay` reference.
  const state = {
    playVanilla: false,
    bannerHidden: false,
    buttonsAlways: false,
    profileBgTransparent: false,
    socialBlur: 0,
  };
  const onOff = (b) => (b ? t("welcomeOn") : t("welcomeOff"));
  const blurLabel = (n) => (n <= 0 ? t("welcomeOff") : `${n}px`);

  const overlay = document.createElement("div");
  overlay.id = "kyso-welcome-overlay";
  overlay.innerHTML = `
    <div class="kyso-welcome-card">
      <h2 class="kyso-welcome-title">${t("welcomeTitle")}</h2>
      <p class="kyso-welcome-sub">${t("welcomeSubtitle")}</p>
      <button class="kyso-w-opt" data-act="toggle:playVanilla"><span>${t("welcomePlay")} — ${t("playVanilla")}</span><b data-val="playVanilla">${onOff(state.playVanilla)}</b></button>
      <button class="kyso-w-opt" data-act="toggle:bannerHidden"><span>${t("welcomeBanner")} — ${t("bannerHidden")}</span><b data-val="bannerHidden">${onOff(state.bannerHidden)}</b></button>
      <button class="kyso-w-opt" data-act="toggle:buttonsAlways"><span>${t("welcomeButtons")} — ${t("welcomeAlways")}</span><b data-val="buttonsAlways">${onOff(state.buttonsAlways)}</b></button>
      <button class="kyso-w-opt" data-act="toggle:profileBgTransparent"><span>${t("welcomeProfileBg")} — ${t("welcomeTransparent")}</span><b data-val="profileBgTransparent">${onOff(state.profileBgTransparent)}</b></button>
      <button class="kyso-w-opt" data-act="cycle:socialBlur"><span>${t("socialBlur")}</span><b data-val="socialBlur">${blurLabel(state.socialBlur)}</b></button>
      <div class="kyso-welcome-actions">
        <button class="kyso-btn" data-act="skip">${t("welcomeSkip")}</button>
        <button class="kyso-btn kyso-btn--primary" data-act="apply">${t("welcomeApply")}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  // Visibility hardening (interaction is handled by the document listener).
  overlay.style.setProperty("position", "fixed", "important");
  overlay.style.setProperty("inset", "0", "important");
  overlay.style.setProperty("z-index", "2147483647", "important");
  overlay.style.setProperty("pointer-events", "auto", "important");

  let closed = false;

  // Always operate on the LIVE overlay — the original `overlay` node may have
  // been cloned-and-replaced by the client by the time the user clicks.
  const live = () => document.getElementById("kyso-welcome-overlay");

  const close = () => {
    closed = true;
    document.removeEventListener("click", onDocClick, true);
    const el = live();
    if (el) el.remove();
  };

  const skipChoices = () => {
    try {
      saveSettings({ ...DEFAULTS, ...loadSettings(), hasSeenWelcome: true });
    } finally {
      close();
    }
  };

  const applyChoices = () => {
    const next = {
      ...DEFAULTS,
      ...loadSettings(),
      playVanilla: state.playVanilla,
      bannerHidden: state.bannerHidden,
      gearAlwaysVisible: state.buttonsAlways,
      lorAlwaysVisible: state.buttonsAlways,
      profileBgTransparent: state.profileBgTransparent,
      socialBlur: state.socialBlur,
      hasSeenWelcome: true,
    };
    try {
      saveSettings(next);
      applyAllSettings(next);
    } finally {
      close();
    }
  };

  const refresh = (key) => {
    const root = live();
    if (!root) return;
    const el = root.querySelector(`[data-val="${key}"]`);
    if (!el) return;
    el.textContent = key === "socialBlur" ? blurLabel(state.socialBlur) : onOff(state[key]);
  };

  const runAction = (act) => {
    if (!act || closed) return;
    if (act === "skip") return skipChoices();
    if (act === "apply") return applyChoices();
    if (act.indexOf("toggle:") === 0) {
      const key = act.slice(7);
      state[key] = !state[key];
      refresh(key);
    } else if (act === "cycle:socialBlur") {
      state.socialBlur = state.socialBlur <= 0 ? 6 : state.socialBlur <= 6 ? 12 : 0;
      refresh("socialBlur");
    }
  };

  // Single capture-phase listener on `document` (survives the overlay being
  // cloned). Resolve the clicked control by DOM ancestry, not coordinates.
  function onDocClick(e) {
    const root = live();
    if (!root) return;
    const ctrl =
      e.target && e.target.closest ? e.target.closest("[data-act]") : null;
    if (!ctrl || !root.contains(ctrl)) return;
    e.preventDefault();
    e.stopPropagation();
    runAction(ctrl.getAttribute("data-act"));
  }
  document.addEventListener("click", onDocClick, true);
}

export function applyAllSettings(settings) {
  const merged = { ...DEFAULTS, ...settings };
  const bgUrl = resolveAsset("background", merged);
  applyBackground(bgUrl, merged.backgroundType);
  applyFont(merged.fontUrl, merged.fontFamily);
  applyHideOptions(merged);
  applyInterfaceToggles(merged);
  applyVisualToggles(merged);
  applySocialBlur(merged.socialBlur);
  // Asset replacers — self-only profile icon (shadow DOM), CSS icon injection
  assetReplacers.applyBanner(resolveAsset("banner", merged));
  assetReplacers.applyBannerVisibility(merged.bannerHidden);
  assetReplacers.applyCrest(resolveAsset("crest", merged));
  assetReplacers.applyCrestRank(merged.crestRank, merged.crestDivision, merged.crestChangeAll, merged.crestLP);
  assetReplacers.applyHovercard({ iconUrl: merged.iconUrl || "", lp: merged.crestLP || "", backdropUrl: merged.hoverBackdrop || "" });
  assetReplacers.applyProfileBgTransparent(merged.profileBgTransparent);
  const _iconUrl = merged.iconUrl || "";
  const _iconAll = merged.iconAllPlayers || false;
  applyIcon(_iconUrl, _iconAll, merged.iconSyncNavbar, merged.iconSwapMastery);
  assetReplacers.applyProfileIcon(_iconUrl);
  assetReplacers.applyLoadingScreen({
    bgUrl: resolveAsset("loadingBg", merged),
    iconUrl: resolveAsset("loadingIcon", merged),
  });
  assetReplacers.applyScreenBackgrounds(merged);
  applyHideNavbarBtnSetting(merged);
  applyHideSocialBtnSetting(merged);
  applyBgFilters(merged);
  // Color accent — "League color scheme" forces LoL gold + no RGB and wins over
  // both auto-extraction and the custom accent.
  if (merged.lolColorScheme) {
    applyAccentColor(LOL_GOLD);
    applyRgbEffect("none", merged.rgbSpeed || 3, LOL_GOLD);
  } else if (merged.accentAuto) {
    const _gen = ++_accentAutoGen;
    extractAccentFromBackground(bgUrl).then((hex) => {
      if (_gen !== _accentAutoGen) return; // discard stale async result
      applyAccentColor(hex);
      applyRgbEffect(merged.rgbMode || "none", merged.rgbSpeed || 3, hex);
    });
  } else {
    applyAccentColor(merged.accentColor || "");
    applyRgbEffect(
      merged.rgbMode || "none",
      merged.rgbSpeed || 3,
      merged.accentColor || "",
    );
  }
}

// ─────────────────────────────────────────────
//  Crop modal 1:1 — ícones do LoL são quadrados (Data Dragon 120×120).
//  Saída: PNG dataURL 256×256 (nítido em qualquer tamanho exibido).
// ─────────────────────────────────────────────
const CROP_OUTPUT_SIZE = 256;

// ─────────────────────────────────────────────
//  Crop modal 4:1 — banners do LoL são 1920×480.
//  Saída: PNG dataURL 960×240.
// ─────────────────────────────────────────────
const BANNER_CROP_W = 960;
const BANNER_CROP_H = 240;

// ─────────────────────────────────────────────
//  Crop modal for the hovercard backdrop — ≈ 402×137 (ratio 2.934).
//  Saída: PNG dataURL 804×274.
// ─────────────────────────────────────────────
const HOVER_BD_RATIO = 2.934;
const HOVER_BD_W = 804;
const HOVER_BD_H = 274;

function openIconCropModal(srcUrl, onConfirm) {
  const overlay = document.createElement("div");
  overlay.className = "kyso-crop-overlay";
  overlay.innerHTML = `
    <div class="kyso-crop-modal" role="dialog" aria-modal="true">
      <div class="kyso-crop-header">
        <span class="kyso-crop-title">${t("cropTitle")}</span>
      </div>
      <div class="kyso-crop-hint">${t("cropHint")}</div>
      <div class="kyso-crop-stage">
        <div class="kyso-crop-image-wrap">
          <img class="kyso-crop-image" alt="" draggable="false">
          <div class="kyso-crop-box">
            <div class="kyso-crop-handle" data-h="nw"></div>
            <div class="kyso-crop-handle" data-h="ne"></div>
            <div class="kyso-crop-handle" data-h="sw"></div>
            <div class="kyso-crop-handle" data-h="se"></div>
          </div>
        </div>
      </div>
      <div class="kyso-crop-actions">
        <button class="kyso-btn kyso-btn--secondary kyso-crop-cancel">${t("cropCancel")}</button>
        <button class="kyso-btn kyso-btn--primary kyso-crop-confirm">${t("cropApply")}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector(".kyso-crop-image");
  const box = overlay.querySelector(".kyso-crop-box");

  let dispW = 0;
  let dispH = 0;
  let cx = 0;
  let cy = 0;
  let cs = 0;

  const layoutBox = () => {
    box.style.left = `${cx}px`;
    box.style.top = `${cy}px`;
    box.style.width = `${cs}px`;
    box.style.height = `${cs}px`;
  };

  const init = () => {
    dispW = img.clientWidth;
    dispH = img.clientHeight;
    cs = Math.floor(Math.min(dispW, dispH) * 0.9);
    cx = Math.floor((dispW - cs) / 2);
    cy = Math.floor((dispH - cs) / 2);
    layoutBox();
  };

  img.addEventListener("load", init);
  // Tenta crossOrigin para URLs remotas. Se falhar no toDataURL,
  // alertamos o usuário (CORS).
  img.crossOrigin = "anonymous";
  img.src = srcUrl;

  let drag = null;
  box.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const handle = e.target.classList.contains("kyso-crop-handle")
      ? e.target.dataset.h
      : null;
    drag = {
      mode: handle ? "resize" : "move",
      handle,
      sx: e.clientX,
      sy: e.clientY,
      cx,
      cy,
      cs,
    };
  });

  const onMove = (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.sx;
    const dy = e.clientY - drag.sy;
    if (drag.mode === "move") {
      cx = Math.max(0, Math.min(dispW - drag.cs, drag.cx + dx));
      cy = Math.max(0, Math.min(dispH - drag.cs, drag.cy + dy));
    } else {
      // Resize mantendo 1:1
      const h = drag.handle;
      let delta;
      if (h === "se") delta = Math.min(dx, dy);
      else if (h === "sw") delta = Math.min(-dx, dy);
      else if (h === "ne") delta = Math.min(dx, -dy);
      else delta = Math.min(-dx, -dy);

      let newCs = Math.max(24, drag.cs + delta);
      if (h === "se") {
        newCs = Math.min(newCs, dispW - drag.cx, dispH - drag.cy);
        cx = drag.cx;
        cy = drag.cy;
      } else if (h === "sw") {
        newCs = Math.min(newCs, drag.cx + drag.cs, dispH - drag.cy);
        cx = drag.cx + drag.cs - newCs;
        cy = drag.cy;
      } else if (h === "ne") {
        newCs = Math.min(newCs, dispW - drag.cx, drag.cy + drag.cs);
        cx = drag.cx;
        cy = drag.cy + drag.cs - newCs;
      } else {
        newCs = Math.min(newCs, drag.cx + drag.cs, drag.cy + drag.cs);
        cx = drag.cx + drag.cs - newCs;
        cy = drag.cy + drag.cs - newCs;
      }
      cs = newCs;
    }
    layoutBox();
  };
  const onUp = () => {
    drag = null;
  };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);

  const cleanup = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    overlay.remove();
  };

  overlay.querySelector(".kyso-crop-cancel").addEventListener("click", cleanup);

  overlay.querySelector(".kyso-crop-confirm").addEventListener("click", () => {
    // Converte coords de exibição -> coords da imagem natural
    // (escala uniforme porque object-fit/aspect preservado).
    const scale = img.naturalWidth / dispW;
    const sx = Math.round(cx * scale);
    const sy = Math.round(cy * scale);
    const ss = Math.round(cs * scale);

    const canvas = document.createElement("canvas");
    canvas.width = CROP_OUTPUT_SIZE;
    canvas.height = CROP_OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      img,
      sx,
      sy,
      ss,
      ss,
      0,
      0,
      CROP_OUTPUT_SIZE,
      CROP_OUTPUT_SIZE,
    );

    let dataUrl;
    try {
      dataUrl = canvas.toDataURL("image/png");
    } catch (err) {
      console.error("[KysoTheme] Crop falhou (CORS):", err);
      alert(
        "Não foi possível recortar essa imagem (CORS). Faça upload de um arquivo local ou use uma URL que permita CORS.",
      );
      return;
    }
    cleanup();
    onConfirm(dataUrl);
  });
}

function openBannerCropModal(srcUrl, onConfirm) {
  const overlay = document.createElement("div");
  overlay.className = "kyso-crop-overlay";
  overlay.innerHTML = `
    <div class="kyso-crop-modal" role="dialog" aria-modal="true">
      <div class="kyso-crop-header">
        <span class="kyso-crop-title">${t("bannerCropTitle")}</span>
      </div>
      <div class="kyso-crop-hint">${t("bannerCropHint")}</div>
      <div class="kyso-crop-stage kyso-crop-stage--wide">
        <div class="kyso-crop-image-wrap">
          <img class="kyso-crop-image" alt="" draggable="false">
          <div class="kyso-crop-box">
            <div class="kyso-crop-handle" data-h="nw"></div>
            <div class="kyso-crop-handle" data-h="ne"></div>
            <div class="kyso-crop-handle" data-h="sw"></div>
            <div class="kyso-crop-handle" data-h="se"></div>
          </div>
        </div>
      </div>
      <div class="kyso-crop-actions">
        <button class="kyso-btn kyso-btn--secondary kyso-crop-cancel">${t("cropCancel")}</button>
        <button class="kyso-btn kyso-btn--primary kyso-crop-confirm">${t("cropApply")}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector(".kyso-crop-image");
  const box = overlay.querySelector(".kyso-crop-box");

  let dispW = 0, dispH = 0;
  let cx = 0, cy = 0, cw = 0, ch = 0;

  const layoutBox = () => {
    box.style.left = `${cx}px`;
    box.style.top = `${cy}px`;
    box.style.width = `${cw}px`;
    box.style.height = `${ch}px`;
  };

  const init = () => {
    dispW = img.clientWidth;
    dispH = img.clientHeight;
    cw = Math.floor(dispW * 0.9);
    ch = Math.round(cw / 4);
    if (ch > dispH * 0.9) {
      ch = Math.floor(dispH * 0.9);
      cw = ch * 4;
    }
    cx = Math.floor((dispW - cw) / 2);
    cy = Math.floor((dispH - ch) / 2);
    layoutBox();
  };

  img.addEventListener("load", init);
  img.crossOrigin = "anonymous";
  img.src = srcUrl;

  let drag = null;
  box.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const handle = e.target.classList.contains("kyso-crop-handle")
      ? e.target.dataset.h
      : null;
    drag = { mode: handle ? "resize" : "move", handle, sx: e.clientX, sy: e.clientY, cx, cy, cw, ch };
  });

  const onMove = (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.sx;
    const dy = e.clientY - drag.sy;
    if (drag.mode === "move") {
      cx = Math.max(0, Math.min(dispW - drag.cw, drag.cx + dx));
      cy = Math.max(0, Math.min(dispH - drag.ch, drag.cy + dy));
      cw = drag.cw;
      ch = drag.ch;
    } else {
      const h = drag.handle;
      let newCw;
      if (h === "se") {
        newCw = Math.max(40, Math.min(drag.cw + dx, dispW - drag.cx));
        cx = drag.cx;
        cy = drag.cy;
      } else if (h === "sw") {
        newCw = Math.max(40, Math.min(drag.cw - dx, drag.cx + drag.cw));
        cx = drag.cx + drag.cw - newCw;
        cy = drag.cy;
      } else if (h === "ne") {
        newCw = Math.max(40, Math.min(drag.cw + dx, dispW - drag.cx));
        cx = drag.cx;
        cy = drag.cy + drag.ch - Math.round(newCw / 4);
      } else { // nw
        newCw = Math.max(40, Math.min(drag.cw - dx, drag.cx + drag.cw));
        cx = drag.cx + drag.cw - newCw;
        cy = drag.cy + drag.ch - Math.round(newCw / 4);
      }
      cw = newCw;
      ch = Math.round(cw / 4);
      cx = Math.max(0, Math.min(cx, dispW - cw));
      cy = Math.max(0, Math.min(cy, dispH - ch));
    }
    layoutBox();
  };

  const onUp = () => { drag = null; };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);

  const cleanup = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    overlay.remove();
  };

  overlay.querySelector(".kyso-crop-cancel").addEventListener("click", cleanup);

  overlay.querySelector(".kyso-crop-confirm").addEventListener("click", () => {
    const scale = img.naturalWidth / dispW;
    const sx = Math.round(cx * scale);
    const sy = Math.round(cy * scale);
    const sW = Math.round(cw * scale);
    const sH = Math.round(ch * scale);

    const canvas = document.createElement("canvas");
    canvas.width = BANNER_CROP_W;
    canvas.height = BANNER_CROP_H;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, sW, sH, 0, 0, BANNER_CROP_W, BANNER_CROP_H);

    let dataUrl;
    try {
      dataUrl = canvas.toDataURL("image/png");
    } catch (err) {
      console.error("[KysoTheme] Banner crop falhou (CORS):", err);
      alert(
        "Não foi possível recortar essa imagem (CORS). Faça upload de um arquivo local ou use uma URL que permita CORS.",
      );
      return;
    }
    cleanup();
    onConfirm(dataUrl);
  });
}

function openHovercardBackdropCropModal(srcUrl, onConfirm) {
  const overlay = document.createElement("div");
  overlay.className = "kyso-crop-overlay";
  overlay.innerHTML = `
    <div class="kyso-crop-modal" role="dialog" aria-modal="true">
      <div class="kyso-crop-header">
        <span class="kyso-crop-title">${t("hoverBackdropCropTitle")}</span>
      </div>
      <div class="kyso-crop-hint">${t("hoverBackdropCropHint")}</div>
      <div class="kyso-crop-stage kyso-crop-stage--wide">
        <div class="kyso-crop-image-wrap">
          <img class="kyso-crop-image" alt="" draggable="false">
          <div class="kyso-crop-box">
            <div class="kyso-crop-handle" data-h="nw"></div>
            <div class="kyso-crop-handle" data-h="ne"></div>
            <div class="kyso-crop-handle" data-h="sw"></div>
            <div class="kyso-crop-handle" data-h="se"></div>
          </div>
        </div>
      </div>
      <div class="kyso-crop-actions">
        <button class="kyso-btn kyso-btn--secondary kyso-crop-cancel">${t("cropCancel")}</button>
        <button class="kyso-btn kyso-btn--primary kyso-crop-confirm">${t("cropApply")}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector(".kyso-crop-image");
  const box = overlay.querySelector(".kyso-crop-box");

  let dispW = 0, dispH = 0;
  let cx = 0, cy = 0, cw = 0, ch = 0;

  const layoutBox = () => {
    box.style.left = `${cx}px`;
    box.style.top = `${cy}px`;
    box.style.width = `${cw}px`;
    box.style.height = `${ch}px`;
  };

  const init = () => {
    dispW = img.clientWidth;
    dispH = img.clientHeight;
    cw = Math.floor(dispW * 0.9);
    ch = Math.round(cw / HOVER_BD_RATIO);
    if (ch > dispH * 0.9) {
      ch = Math.floor(dispH * 0.9);
      cw = Math.round(ch * HOVER_BD_RATIO);
    }
    cx = Math.floor((dispW - cw) / 2);
    cy = Math.floor((dispH - ch) / 2);
    layoutBox();
  };

  img.addEventListener("load", init);
  img.crossOrigin = "anonymous";
  img.src = srcUrl;

  let drag = null;
  box.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const handle = e.target.classList.contains("kyso-crop-handle")
      ? e.target.dataset.h
      : null;
    drag = { mode: handle ? "resize" : "move", handle, sx: e.clientX, sy: e.clientY, cx, cy, cw, ch };
  });

  const onMove = (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.sx;
    const dy = e.clientY - drag.sy;
    if (drag.mode === "move") {
      cx = Math.max(0, Math.min(dispW - drag.cw, drag.cx + dx));
      cy = Math.max(0, Math.min(dispH - drag.ch, drag.cy + dy));
      cw = drag.cw;
      ch = drag.ch;
    } else {
      const h = drag.handle;
      let newCw;
      if (h === "se") {
        newCw = Math.max(40, Math.min(drag.cw + dx, dispW - drag.cx));
        cx = drag.cx;
        cy = drag.cy;
      } else if (h === "sw") {
        newCw = Math.max(40, Math.min(drag.cw - dx, drag.cx + drag.cw));
        cx = drag.cx + drag.cw - newCw;
        cy = drag.cy;
      } else if (h === "ne") {
        newCw = Math.max(40, Math.min(drag.cw + dx, dispW - drag.cx));
        cx = drag.cx;
        cy = drag.cy + drag.ch - Math.round(newCw / HOVER_BD_RATIO);
      } else { // nw
        newCw = Math.max(40, Math.min(drag.cw - dx, drag.cx + drag.cw));
        cx = drag.cx + drag.cw - newCw;
        cy = drag.cy + drag.ch - Math.round(newCw / HOVER_BD_RATIO);
      }
      cw = newCw;
      ch = Math.round(cw / HOVER_BD_RATIO);
      cx = Math.max(0, Math.min(cx, dispW - cw));
      cy = Math.max(0, Math.min(cy, dispH - ch));
    }
    layoutBox();
  };

  const onUp = () => { drag = null; };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);

  const cleanup = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    overlay.remove();
  };

  overlay.querySelector(".kyso-crop-cancel").addEventListener("click", cleanup);

  overlay.querySelector(".kyso-crop-confirm").addEventListener("click", () => {
    const scale = img.naturalWidth / dispW;
    const sx = Math.round(cx * scale);
    const sy = Math.round(cy * scale);
    const sW = Math.round(cw * scale);
    const sH = Math.round(ch * scale);

    const canvas = document.createElement("canvas");
    canvas.width = HOVER_BD_W;
    canvas.height = HOVER_BD_H;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, sW, sH, 0, 0, HOVER_BD_W, HOVER_BD_H);

    let dataUrl;
    try {
      dataUrl = canvas.toDataURL("image/png");
    } catch (err) {
      console.error("[KysoTheme] Hovercard backdrop crop falhou (CORS):", err);
      alert(
        "Não foi possível recortar essa imagem (CORS). Faça upload de um arquivo local ou use uma URL que permita CORS.",
      );
      return;
    }
    cleanup();
    onConfirm(dataUrl);
  });
}
// ─────────────────────────────────────────────
async function buildSettingsPanel() {
  const settings = { ...DEFAULTS, ...loadSettings() };
  const manifest = await assetReplacers.loadManifest();

  const panel = document.createElement("div");
  panel.className = "kyso-settings-panel";
  panel.innerHTML = `
    <div class="kyso-settings-header">
      <span class="kyso-settings-title">Kyso UI Editor</span>
      <span class="kyso-settings-version">v3.1</span>
    </div>

    <!-- Visibility section moved to the dedicated UI Editor tab. -->

    <!-- Color Theme -->
    <section class="kyso-settings-section" id="kyso-color-section">
      <h3 class="kyso-settings-section-title">${ICONS.palette}<span>${t("colorSection")}</span></h3>

      <!-- Presets -->
      <div class="kyso-settings-row kyso-settings-row--label-top">
        <label class="kyso-label">${t("colorPresets")}</label>
        <div class="kyso-color-presets" id="kyso-color-presets">
          ${[
            { hex: "#ffffff", label: "White" },
            { hex: "#c8a040", label: "Gold" },
            { hex: "#00d4ff", label: "Cyan" },
            { hex: "#ff4d6d", label: "Rose" },
            { hex: "#9d4edd", label: "Purple" },
            { hex: "#00e5a0", label: "Green" },
            { hex: "#ff8c00", label: "Orange" },
          ]
            .map((p) => {
              const cur = settings.accentColor || "#ffffff";
              const active =
                cur.toLowerCase() === p.hex ? " kyso-color-swatch--active" : "";
              return `<button class="kyso-color-swatch${active}" data-color="${p.hex}" style="background:${p.hex}" title="${p.label}"></button>`;
            })
            .join("")}
        </div>
      </div>

      <!-- Custom picker + Apply/Reset -->
      <div class="kyso-settings-row kyso-color-picker-row">
        <label class="kyso-label">${t("colorAccent")}</label>
        <input type="color" id="kyso-accent-input" class="kyso-color-input"
               value="${settings.accentColor && settings.accentColor !== "" ? settings.accentColor : "#ffffff"}">
        <input type="text" id="kyso-accent-hex" class="kyso-color-hex-input"
               value="${settings.accentColor && settings.accentColor !== "" ? settings.accentColor.toUpperCase() : "#FFFFFF"}"
               maxlength="7" spellcheck="false" autocomplete="off">
        <button id="kyso-color-apply" class="kyso-btn kyso-btn--primary">${t("colorApply")}</button>
        <button id="kyso-color-reset" class="kyso-btn kyso-btn--secondary">${t("colorReset")}</button>
      </div>

      <!-- Feedback row -->
      <div class="kyso-settings-row kyso-settings-row--feedback" id="kyso-color-feedback" style="display:none">
        ${ICONS.check}<span id="kyso-color-feedback-text"></span>
      </div>

      <!-- Auto from background -->
      <div class="kyso-settings-row kyso-settings-row--toggle">
        <label class="kyso-label">
          ${t("colorAutoLabel")}
          <span class="kyso-hint">${t("colorAutoHint")}</span>
        </label>
        <label class="kyso-toggle">
          <input id="kyso-color-auto" type="checkbox" ${settings.accentAuto ? "checked" : ""}>
          <span class="kyso-toggle-slider"></span>
        </label>
      </div>

      <!-- Visual filters on background container -->
      <div class="kyso-filter-divider"></div>
      <div class="kyso-filter-title">${t("filterEffects")}</div>

      <div class="kyso-settings-row kyso-filter-row">
        <label class="kyso-label" for="kyso-filter-blur">${t("filterBlur")}</label>
        <input type="range" id="kyso-filter-blur" class="kyso-range" min="0" max="20" step="1" value="${settings.filterBlur || 0}">
        <span class="kyso-filter-value" id="kyso-filter-blur-value">${settings.filterBlur || 0}px</span>
      </div>

      <div class="kyso-settings-row kyso-filter-row">
        <label class="kyso-label" for="kyso-filter-bright">${t("filterBrightness")}</label>
        <input type="range" id="kyso-filter-bright" class="kyso-range" min="50" max="200" step="5" value="${settings.filterBrightness || 100}">
        <span class="kyso-filter-value" id="kyso-filter-bright-value">${settings.filterBrightness || 100}%</span>
      </div>

      <div class="kyso-settings-row kyso-filter-row">
        <label class="kyso-label" for="kyso-filter-sat">${t("filterSaturate")}</label>
        <input type="range" id="kyso-filter-sat" class="kyso-range" min="0" max="200" step="5" value="${settings.filterSaturate || 100}">
        <span class="kyso-filter-value" id="kyso-filter-sat-value">${settings.filterSaturate || 100}%</span>
      </div>

      <div class="kyso-settings-row kyso-filter-row">
        <label class="kyso-label" for="kyso-filter-cont">${t("filterContrast")}</label>
        <input type="range" id="kyso-filter-cont" class="kyso-range" min="50" max="200" step="5" value="${settings.filterContrast || 100}">
        <span class="kyso-filter-value" id="kyso-filter-cont-value">${settings.filterContrast || 100}%</span>
      </div>

      <div class="kyso-settings-row">
        <button id="kyso-filter-reset" class="kyso-btn kyso-btn--secondary">${t("filterReset")}</button>
      </div>
    </section>

    <!-- RGB Effects -->
    <section class="kyso-settings-section" id="kyso-rgb-section">
      <h3 class="kyso-settings-section-title">${ICONS.rgb}<span>${t("rgbSection")}</span></h3>

      <div class="kyso-settings-row">
        <label class="kyso-label" for="kyso-rgb-mode">${t("rgbMode")}</label>
        <select id="kyso-rgb-mode" class="kyso-select">
          <option value="none" ${!settings.rgbMode || settings.rgbMode === "none" ? "selected" : ""}>${t("rgbModeNone")}</option>
          <option value="rainbow" ${settings.rgbMode === "rainbow" ? "selected" : ""}>${t("rgbModeRainbow")}</option>
          <option value="blink" ${settings.rgbMode === "blink" ? "selected" : ""}>${t("rgbModeBlink")}</option>
          <option value="pulse" ${settings.rgbMode === "pulse" ? "selected" : ""}>${t("rgbModePulse")}</option>
        </select>
      </div>

      <div class="kyso-settings-row" id="kyso-rgb-speed-row" ${!settings.rgbMode || settings.rgbMode === "none" ? 'style="display:none"' : ""}>
        <label class="kyso-label" for="kyso-rgb-speed">${t("rgbSpeed")}: <span id="kyso-rgb-speed-value">${settings.rgbSpeed || 3}</span></label>
        <input type="range" id="kyso-rgb-speed" class="kyso-range" min="1" max="5" step="1" value="${settings.rgbSpeed || 3}">
      </div>
    </section>

    <!-- Interface controls (icon-navbar + play/banner/profilebg/gear/lor/blur)
         moved to the dedicated UI Editor tab. -->

    <!-- Font -->
    <section class="kyso-settings-section">
      <h3 class="kyso-settings-section-title">${ICONS.font}<span>${t("fontSection")}</span></h3>

      <div class="kyso-settings-row">
        <label class="kyso-label" for="kyso-font-family">${t("fontFamily")}</label>
        <input id="kyso-font-family" class="kyso-input" type="text"
          placeholder="${t("fontFamilyPlaceholder")}"
          value="${settings.fontFamily || ""}">
      </div>

      <div class="kyso-settings-row">
        <label class="kyso-label" for="kyso-font-url">${t("fontUrl")}</label>
        <input id="kyso-font-url" class="kyso-input" type="text"
          placeholder="${t("fontUrlPlaceholder")}"
          value="${settings.fontUrl || ""}">
        <span class="kyso-hint">${t("fontUrlHint")}</span>
      </div>

      <div class="kyso-settings-row kyso-settings-row--upload">
        <label class="kyso-label">${t("fontUpload")}</label>
        <label class="kyso-btn kyso-btn--secondary kyso-upload-label">
          ${ICONS.folder}<span>${t("fontChoose")}</span>
          <input id="kyso-font-file" type="file" accept=".ttf,.otf,.woff,.woff2" style="display:none;">
        </label>
        <span id="kyso-font-filename" class="kyso-filename">${t("noFile")}</span>
      </div>

      <div class="kyso-settings-row">
        <button id="kyso-font-apply" class="kyso-btn kyso-btn--primary">${t("fontApply")}</button>
        <button id="kyso-font-reset" class="kyso-btn kyso-btn--danger">${t("fontRemove")}</button>
      </div>
    </section>

    <!-- Save -->
    <div class="kyso-settings-footer">
      <button id="kyso-save-all" class="kyso-btn kyso-btn--save">${ICONS.save}<span>${t("saveAll")}</span></button>
      <span id="kyso-save-feedback" class="kyso-save-feedback"></span>
    </div>
  `;

  // ── Wiring de eventos ──────────────────────────────
  // (Asset / Icon / Banner / Background-type handlers live in buildAssetsPanel.)

  // Toggles – persistência em tempo real
  const toggles = [
    { id: "kyso-hide-rp", key: "hideRP" },
    { id: "kyso-show-hover", key: "hideHoverElements" },
    { id: "kyso-hide-tft", key: "hideTFT" },
    { id: "kyso-hide-social-only", key: "hideSocialOnly" },
    { id: "kyso-hide-social", key: "hideSocialPanel" },
    { id: "kyso-enable-hide-navbar", key: "enableHideNavbarBtn" },
    { id: "kyso-show-blue-essence", key: "showBlueEssenceOnHide" },
    { id: "kyso-enable-hide-social-btn", key: "enableHideSocialBtn" },
    { id: "kyso-icon-navbar", key: "iconSyncNavbar" },
    { id: "kyso-banner-hidden", key: "bannerHidden" },
    { id: "kyso-profilebg", key: "profileBgTransparent" },
    { id: "kyso-gear-always", key: "gearAlwaysVisible" },
    { id: "kyso-lor-always", key: "lorAlwaysVisible" },
    { id: "kyso-play-vanilla", key: "playVanilla" },
  ];
  toggles.forEach(({ id, key }) => {
    const _ctrl = panel.querySelector(`#${id}`);
    if (!_ctrl) return; // control may live in another panel (moved to UI Editor)
    _ctrl.addEventListener("change", (e) => {
      const s = { ...DEFAULTS, ...loadSettings(), [key]: e.target.checked };

      // Mutex: hideSocialOnly e hideSocialPanel não coexistem entre si.
      if (key === "hideSocialOnly" && e.target.checked) {
        s.hideSocialPanel = false;
        const other = panel.querySelector("#kyso-hide-social");
        if (other) other.checked = false;
      } else if (key === "hideSocialPanel" && e.target.checked) {
        s.hideSocialOnly = false;
        const other = panel.querySelector("#kyso-hide-social-only");
        if (other) other.checked = false;
      }

      // Mutex sliding-doors × hover: ao ligar qualquer sliding-door,
      // desliga os toggles de hover (hideSocialOnly + hideSocialPanel).
      if (
        (key === "enableHideNavbarBtn" || key === "enableHideSocialBtn") &&
        e.target.checked
      ) {
        s.hideSocialOnly = false;
        s.hideSocialPanel = false;
        const so = panel.querySelector("#kyso-hide-social-only");
        const sp = panel.querySelector("#kyso-hide-social");
        if (so) so.checked = false;
        if (sp) sp.checked = false;
        applyHideOptions(s);
      }

      // Sub-toggle essência azul: visível apenas quando navbar-slider está ativo.
      if (key === "enableHideNavbarBtn") {
        const row = panel.querySelector("#kyso-blue-essence-row");
        if (row) row.style.display = e.target.checked ? "" : "none";
      }

      saveSettings(s);

      // Aplicação específica por toggle
      if (key === "enableHideNavbarBtn") {
        applyHideNavbarBtnSetting(s);
      } else if (key === "enableHideSocialBtn") {
        applyHideSocialBtnSetting(s);
      } else if (key === "showBlueEssenceOnHide") {
        // Reaplicar estado atual da navbar com novo valor de essência
        applyTopNavbarHiddenState(s.navbarHidden, s.showBlueEssenceOnHide);
      } else if (key === "iconSyncNavbar") {
        const u = s.iconUrl || "";
        applyIcon(u, s.iconAllPlayers || false, s.iconSyncNavbar, s.iconSwapMastery);
      } else if (key === "bannerHidden") {
        assetReplacers.applyBannerVisibility(s.bannerHidden);
      } else if (key === "profileBgTransparent") {
        assetReplacers.applyProfileBgTransparent(s.profileBgTransparent);
      } else if (key === "gearAlwaysVisible" || key === "lorAlwaysVisible" || key === "playVanilla") {
        applyInterfaceToggles(s);
      } else {
        applyHideOptions(s);
      }
    });
  });

  // ─── Color Theme handlers ────────────────────────────────────────────────
  const accentInput = panel.querySelector("#kyso-accent-input");
  const hexInput = panel.querySelector("#kyso-accent-hex");
  const colorFeedback = panel.querySelector("#kyso-color-feedback");
  const colorFeedbackText = panel.querySelector("#kyso-color-feedback-text");
  const presetsContainer = panel.querySelector("#kyso-color-presets");

  function showColorFeedback(msg) {
    colorFeedbackText.textContent = msg;
    colorFeedback.style.display = "";
    setTimeout(() => {
      colorFeedback.style.display = "none";
    }, 2500);
  }

  function setActiveSwatch(hex) {
    presetsContainer.querySelectorAll(".kyso-color-swatch").forEach((btn) => {
      btn.classList.toggle(
        "kyso-color-swatch--active",
        btn.dataset.color.toLowerCase() === hex.toLowerCase(),
      );
    });
    hexInput.value = hex.toUpperCase();
    hexInput.classList.remove("kyso-color-hex-input--invalid");
  }

  // Sync: color picker → hex text
  accentInput.addEventListener("input", () => {
    hexInput.value = accentInput.value.toUpperCase();
    hexInput.classList.remove("kyso-color-hex-input--invalid");
    setActiveSwatch(accentInput.value);
  });

  // Sync: hex text → color picker (valida formato #rrggbb)
  hexInput.addEventListener("input", () => {
    const val = hexInput.value.trim();
    const valid = /^#[0-9a-fA-F]{6}$/.test(val);
    hexInput.classList.toggle(
      "kyso-color-hex-input--invalid",
      val.length > 1 && !valid,
    );
    if (valid) {
      accentInput.value = val;
      setActiveSwatch(val);
    }
  });

  // Swatch preset click
  presetsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".kyso-color-swatch");
    if (!btn) return;
    const hex = btn.dataset.color;
    accentInput.value = hex;
    applyAccentColor(hex);
    setActiveSwatch(hex);
    const s = {
      ...DEFAULTS,
      ...loadSettings(),
      accentColor: hex,
      accentAuto: false,
    };
    saveSettings(s);
    panel.querySelector("#kyso-color-auto").checked = false;
    showColorFeedback(t("colorApplied"));
  });

  // Apply button
  panel.querySelector("#kyso-color-apply").addEventListener("click", () => {
    const hex = accentInput.value;
    applyAccentColor(hex);
    setActiveSwatch(hex);
    const s = {
      ...DEFAULTS,
      ...loadSettings(),
      accentColor: hex,
      accentAuto: false,
    };
    saveSettings(s);
    panel.querySelector("#kyso-color-auto").checked = false;
    showColorFeedback(t("colorApplied"));
  });

  // Reset button
  panel.querySelector("#kyso-color-reset").addEventListener("click", () => {
    accentInput.value = "#ffffff";
    applyAccentColor("#ffffff");
    setActiveSwatch("#ffffff");
    const s = {
      ...DEFAULTS,
      ...loadSettings(),
      accentColor: "",
      accentAuto: false,
    };
    saveSettings(s);
    panel.querySelector("#kyso-color-auto").checked = false;
    showColorFeedback(t("colorResetDone"));
  });

  // Auto toggle
  panel.querySelector("#kyso-color-auto").addEventListener("change", (e) => {
    const auto = e.target.checked;
    const s = { ...DEFAULTS, ...loadSettings(), accentAuto: auto };
    saveSettings(s);
    if (auto) {
      extractAccentFromBackground(s.backgroundUrl).then((hex) => {
        accentInput.value = hex;
        applyAccentColor(hex);
        setActiveSwatch(hex);
        showColorFeedback(t("colorApplied"));
      });
    }
  });

  // Fonte – upload local
  const fontFileInput = panel.querySelector("#kyso-font-file");
  const fontFilename = panel.querySelector("#kyso-font-filename");
  fontFileInput.addEventListener("change", () => {
    const file = fontFileInput.files[0];
    if (!file) return;
    fontFilename.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      // Cria um @font-face inline com o base64
      const familyGuess = file.name.replace(/\.[^.]+$/, "");
      panel.querySelector("#kyso-font-family").value = familyGuess;
      // Armazena o data URL no campo de URL de forma transparente
      panel.querySelector("#kyso-font-url").value = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Fonte – aplicar
  panel.querySelector("#kyso-font-apply").addEventListener("click", () => {
    const fontUrl = panel.querySelector("#kyso-font-url").value.trim();
    const fontFamily = panel.querySelector("#kyso-font-family").value.trim();
    const s = { ...DEFAULTS, ...loadSettings(), fontUrl, fontFamily };
    saveSettings(s);
    applyFont(fontUrl, fontFamily);
    showFeedback(panel, t("fontApplied"));
  });

  // Fonte – remover
  panel.querySelector("#kyso-font-reset").addEventListener("click", () => {
    panel.querySelector("#kyso-font-url").value = "";
    panel.querySelector("#kyso-font-family").value = "";
    fontFilename.textContent = t("noFile");
    const s = { ...DEFAULTS, ...loadSettings(), fontUrl: "", fontFamily: "" };
    saveSettings(s);
    applyFont("", "");
    showFeedback(panel, t("fontRemoved"));
  });

  // ── Background filter sliders (blur/brightness/saturate/contrast) ───────
  const filterRanges = [
    { id: "kyso-filter-blur",   key: "filterBlur",       valueId: "kyso-filter-blur-value",   unit: "px" },
    { id: "kyso-filter-bright", key: "filterBrightness", valueId: "kyso-filter-bright-value", unit: "%"  },
    { id: "kyso-filter-sat",    key: "filterSaturate",   valueId: "kyso-filter-sat-value",    unit: "%"  },
    { id: "kyso-filter-cont",   key: "filterContrast",   valueId: "kyso-filter-cont-value",   unit: "%"  },
  ];

  filterRanges.forEach(({ id, key, valueId, unit }) => {
    const input = panel.querySelector(`#${id}`);
    const display = panel.querySelector(`#${valueId}`);
    if (!input) return;
    input.addEventListener("input", () => {
      const v = Number(input.value) || 0;
      if (display) display.textContent = `${v}${unit}`;
      const s = { ...DEFAULTS, ...loadSettings(), [key]: v };
      saveSettings(s);
      applyBgFilters(s);
    });
  });

  // ── Interface sliders (play opacity/blur, social blur) ─────────────────
  const interfaceRanges = [
    { id: "kyso-play-opacity", key: "playBgOpacity", valueId: "kyso-play-opacity-value", unit: "%", apply: (s) => applyInterfaceToggles(s) },
    { id: "kyso-play-blur",    key: "playBgBlur",    valueId: "kyso-play-blur-value",    unit: "px", apply: (s) => applyInterfaceToggles(s) },
    { id: "kyso-social-blur",  key: "socialBlur",    valueId: "kyso-social-blur-value",  unit: "px", apply: (s) => applySocialBlur(s.socialBlur) },
  ];
  interfaceRanges.forEach(({ id, key, valueId, unit, apply }) => {
    const input = panel.querySelector(`#${id}`);
    const display = panel.querySelector(`#${valueId}`);
    if (!input) return;
    input.addEventListener("input", () => {
      const v = Number(input.value) || 0;
      if (display) display.textContent = `${v}${unit}`;
      const s = { ...DEFAULTS, ...loadSettings(), [key]: v };
      saveSettings(s);
      apply(s);
    });
  });

  const filterResetBtn = panel.querySelector("#kyso-filter-reset");
  if (filterResetBtn) {
    filterResetBtn.addEventListener("click", () => {
      const s = {
        ...DEFAULTS,
        ...loadSettings(),
        filterBlur: DEFAULTS.filterBlur,
        filterBrightness: DEFAULTS.filterBrightness,
        filterSaturate: DEFAULTS.filterSaturate,
        filterContrast: DEFAULTS.filterContrast,
      };
      saveSettings(s);
      applyBgFilters(s);
      filterRanges.forEach(({ id, key, valueId, unit }) => {
        const inp = panel.querySelector(`#${id}`);
        const disp = panel.querySelector(`#${valueId}`);
        if (inp) inp.value = String(DEFAULTS[key]);
        if (disp) disp.textContent = `${DEFAULTS[key]}${unit}`;
      });
    });
  }

  // RGB Effects — mode selector + speed slider
  const rgbModeSelect = panel.querySelector("#kyso-rgb-mode");
  const rgbSpeedInput = panel.querySelector("#kyso-rgb-speed");
  const rgbSpeedValue = panel.querySelector("#kyso-rgb-speed-value");
  const rgbSpeedRow = panel.querySelector("#kyso-rgb-speed-row");

  rgbModeSelect.addEventListener("change", () => {
    const mode = rgbModeSelect.value;
    rgbSpeedRow.style.display = mode === "none" ? "none" : "";
    const s = { ...DEFAULTS, ...loadSettings(), rgbMode: mode };
    saveSettings(s);
    applyRgbEffect(mode, s.rgbSpeed || 3, s.accentColor || "");
  });

  rgbSpeedInput.addEventListener("input", () => {
    const speed = parseInt(rgbSpeedInput.value, 10);
    rgbSpeedValue.textContent = speed;
    const s = { ...DEFAULTS, ...loadSettings(), rgbSpeed: speed };
    saveSettings(s);
    applyRgbEffect(s.rgbMode || "none", speed, s.accentColor || "");
  });

  // Salvar tudo (apenas valores controlados por este painel — assets ficam na aba Player Assets)
  panel.querySelector("#kyso-save-all").addEventListener("click", () => {
    const prev = { ...DEFAULTS, ...loadSettings() };
    // Null-safe readers: many controls moved to the UI Editor panel and are
    // absent here — keep the previously saved value for those.
    const boolOf = (sel, def) => { const el = panel.querySelector(sel); return el ? el.checked : def; };
    const valOf = (sel, def) => { const el = panel.querySelector(sel); return el ? el.value : def; };
    const numOf = (sel, def) => { const el = panel.querySelector(sel); if (!el) return def; const n = Number(el.value); return Number.isFinite(n) ? n : def; };
    const s = {
      ...prev,
      hideRP: boolOf("#kyso-hide-rp", prev.hideRP),
      hideHoverElements: boolOf("#kyso-show-hover", prev.hideHoverElements),
      hideTFT: boolOf("#kyso-hide-tft", prev.hideTFT),
      hideSocialOnly: boolOf("#kyso-hide-social-only", prev.hideSocialOnly),
      hideSocialPanel: boolOf("#kyso-hide-social", prev.hideSocialPanel),
      fontUrl: valOf("#kyso-font-url", prev.fontUrl).trim(),
      fontFamily: valOf("#kyso-font-family", prev.fontFamily).trim(),
      enableHideNavbarBtn: boolOf("#kyso-enable-hide-navbar", prev.enableHideNavbarBtn),
      navbarHidden: prev.navbarHidden, // preserva estado de runtime
      showBlueEssenceOnHide: boolOf("#kyso-show-blue-essence", prev.showBlueEssenceOnHide),
      accentColor: valOf("#kyso-accent-input", prev.accentColor),
      accentAuto: boolOf("#kyso-color-auto", prev.accentAuto),
      enableHideSocialBtn: boolOf("#kyso-enable-hide-social-btn", prev.enableHideSocialBtn),
      socialHidden: prev.socialHidden,
      filterBlur:       numOf("#kyso-filter-blur",   prev.filterBlur),
      filterBrightness: numOf("#kyso-filter-bright", prev.filterBrightness),
      filterSaturate:   numOf("#kyso-filter-sat",    prev.filterSaturate),
      filterContrast:   numOf("#kyso-filter-cont",   prev.filterContrast),
      iconSyncNavbar: boolOf("#kyso-icon-navbar", prev.iconSyncNavbar),
      bannerHidden: boolOf("#kyso-banner-hidden", prev.bannerHidden),
      profileBgTransparent: boolOf("#kyso-profilebg", prev.profileBgTransparent),
      gearAlwaysVisible: boolOf("#kyso-gear-always", prev.gearAlwaysVisible),
      lorAlwaysVisible: boolOf("#kyso-lor-always", prev.lorAlwaysVisible),
      playVanilla: boolOf("#kyso-play-vanilla", prev.playVanilla),
      playBgOpacity: numOf("#kyso-play-opacity", prev.playBgOpacity),
      playBgBlur: numOf("#kyso-play-blur", prev.playBgBlur),
      socialBlur: numOf("#kyso-social-blur", prev.socialBlur),
      rgbMode: valOf("#kyso-rgb-mode", prev.rgbMode),
      rgbSpeed: parseInt(valOf("#kyso-rgb-speed", String(prev.rgbSpeed)), 10) || prev.rgbSpeed || 3,
    };
    saveSettings(s);
    applyAllSettings(s);
    showFeedback(panel, t("saveAllDone"));
  });

  return panel;
}

// ─────────────────────────────────────────────
//  Player Assets — painel dedicado (sibling tab da KysoTheme)
// ─────────────────────────────────────────────
async function buildAssetsPanel() {
  const settings = { ...DEFAULTS, ...loadSettings() };
  const manifest = await assetReplacers.loadManifest();

  const panel = document.createElement("div");
  panel.className = "kyso-settings-panel kyso-assets-panel";

  // Background extra controls — type override select
  const bgExtra = `
    <div class="kyso-settings-row kyso-asset-bg-type-row">
      <label class="kyso-label" for="kyso-bg-type">${t("bgType")}</label>
      <select id="kyso-bg-type" class="kyso-select">
        <option value="auto" ${settings.backgroundType === "auto" ? "selected" : ""}>${t("bgTypeAuto")}</option>
        <option value="image" ${settings.backgroundType === "image" ? "selected" : ""}>${t("bgTypeImage")}</option>
        <option value="gif" ${settings.backgroundType === "gif" ? "selected" : ""}>${t("bgTypeGif")}</option>
        <option value="video" ${settings.backgroundType === "video" ? "selected" : ""}>${t("bgTypeVideo")}</option>
      </select>
    </div>`;

  // Banner extra controls — upload + crop 4:1
  const bannerExtra = `
    <div class="kyso-settings-row kyso-settings-row--upload">
      <label class="kyso-label">${t("bgUpload")}</label>
      <label class="kyso-btn kyso-btn--secondary kyso-upload-label">
        ${ICONS.folder}<span>${t("bgChoose")}</span>
        <input id="kyso-banner-file" type="file" accept="image/*" style="display:none;">
      </label>
      <span id="kyso-banner-filename" class="kyso-filename">${t("noFile")}</span>
    </div>
    <div class="kyso-settings-row">
      <button id="kyso-banner-crop" class="kyso-btn kyso-btn--secondary" disabled>
        ${ICONS.scissors}<span>${t("bannerCropButton")}</span>
      </button>
    </div>`;

  panel.innerHTML = `
    <div class="kyso-settings-header">
      <span class="kyso-settings-title">${t("assetsSection")}</span>
      <span class="kyso-settings-version">v3.1</span>
    </div>

    ${buildAssetBlock("background", "bgSection", manifest.categories.backgrounds, settings, { extraControls: bgExtra, icon: ICONS.picture })}

    ${buildAssetBlock("banner", "bannerLabel", manifest.categories.banners, settings, { extraControls: bannerExtra, icon: ICONS.picture })}

    ${buildAssetBlock("crest", "crestLabel", manifest.categories.crests, settings, { icon: ICONS.palette })}

    <section class="kyso-settings-section" id="kyso-crest-rank-section">
      <div class="kyso-settings-row">
        <label class="kyso-label" for="kyso-crest-rank">${t("crestRankLabel")}</label>
        <select id="kyso-crest-rank" class="kyso-select">
          ${["", "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"]
            .map((v) => `<option value="${v}" ${settings.crestRank === v ? "selected" : ""}>${v === "" ? t("crestRankOff") : v.charAt(0) + v.slice(1).toLowerCase()}</option>`)
            .join("")}
        </select>
      </div>
      <div class="kyso-settings-row" id="kyso-crest-division-row" ${settings.crestRank && !["MASTER", "GRANDMASTER", "CHALLENGER"].includes(settings.crestRank) ? "" : 'style="display:none"'}>
        <label class="kyso-label" for="kyso-crest-division">${t("crestDivisionLabel")}</label>
        <select id="kyso-crest-division" class="kyso-select">
          ${["I", "II", "III", "IV"].map((v) => `<option value="${v}" ${settings.crestDivision === v ? "selected" : ""}>${v}</option>`).join("")}
        </select>
      </div>
      <div class="kyso-settings-row kyso-settings-row--toggle" id="kyso-crest-changeall-row" ${settings.crestRank ? "" : 'style="display:none"'}>
        <label class="kyso-label">${t("crestChangeAll")}</label>
        <label class="kyso-toggle"><input id="kyso-crest-changeall" type="checkbox" ${settings.crestChangeAll ? "checked" : ""}><span class="kyso-toggle-slider"></span></label>
      </div>
      <div class="kyso-settings-row">
        <label class="kyso-label" for="kyso-crest-lp">${t("crestLP")}</label>
        <input id="kyso-crest-lp" class="kyso-input" type="text" inputmode="numeric" placeholder="LP" value="${(settings.crestLP || "").toString().replace(/"/g, "&quot;")}">
      </div>
      <div class="kyso-settings-row"><span class="kyso-hint">${t("crestRankHint")}</span></div>
    </section>

    <!-- Profile Icon — own section (uses iconUrl / iconAllPlayers, not the source/local/web triple) -->
    <section class="kyso-settings-section" id="kyso-icon-section">
      <h3 class="kyso-settings-section-title">${ICONS.wizard}<span>${t("iconSection")}</span></h3>

      <div class="kyso-settings-row">
        <label class="kyso-label" for="kyso-icon-url">${t("iconUrl")}</label>
        <input id="kyso-icon-url" class="kyso-input" type="text"
          placeholder="${t("iconUrlPlaceholder")}"
          value="${(settings.iconUrl || "").replace(/"/g, "&quot;")}">
      </div>

      <div class="kyso-settings-row kyso-settings-row--upload">
        <label class="kyso-label">${t("iconUpload")}</label>
        <label class="kyso-btn kyso-btn--secondary kyso-upload-label">
          ${ICONS.folder}<span>${t("iconChoose")}</span>
          <input id="kyso-icon-file" type="file" accept="image/*" style="display:none;">
        </label>
        <span id="kyso-icon-filename" class="kyso-filename">${t("noFile")}</span>
      </div>

      <div class="kyso-settings-row">
        <span class="kyso-hint">${t("iconHint")}</span>
      </div>

      <div class="kyso-settings-row">
        <button id="kyso-icon-crop" class="kyso-btn kyso-btn--secondary" ${settings.iconUrl ? "" : "disabled"}>${ICONS.scissors}<span>${t("cropButton")}</span></button>
        <button id="kyso-icon-apply" class="kyso-btn kyso-btn--primary">${t("iconApply")}</button>
        <button id="kyso-icon-reset" class="kyso-btn kyso-btn--danger">${t("iconRemove")}</button>
      </div>

      <div class="kyso-settings-row kyso-settings-row--toggle">
        <label class="kyso-label">${t("iconAllPlayers")}
          <span class="kyso-hint">${t("iconAllPlayersHint")}</span>
        </label>
        <label class="kyso-toggle">
          <input id="kyso-icon-all-players" type="checkbox" ${settings.iconAllPlayers ? "checked" : ""}>
          <span class="kyso-toggle-slider"></span>
        </label>
      </div>
    </section>

    <!-- Hovercard backdrop — self-only regalia hover-card splash (single dataURL/web string) -->
    <section class="kyso-settings-section" id="kyso-hoverbd-section">
      <h3 class="kyso-settings-section-title">${ICONS.picture}<span>${t("hoverBackdropLabel")}</span></h3>

      <div class="kyso-settings-row">
        <label class="kyso-label" for="kyso-hoverbd-url">${t("iconUrl")}</label>
        <input id="kyso-hoverbd-url" class="kyso-input" type="text"
          placeholder="${t("iconUrlPlaceholder")}"
          value="${(settings.hoverBackdrop || "").replace(/"/g, "&quot;")}">
      </div>

      <div class="kyso-settings-row kyso-settings-row--upload">
        <label class="kyso-label">${t("iconUpload")}</label>
        <label class="kyso-btn kyso-btn--secondary kyso-upload-label">
          ${ICONS.folder}<span>${t("iconChoose")}</span>
          <input id="kyso-hoverbd-file" type="file" accept="image/*" style="display:none;">
        </label>
        <span id="kyso-hoverbd-filename" class="kyso-filename">${t("noFile")}</span>
      </div>

      <div class="kyso-settings-row"><span class="kyso-hint">${t("hoverBackdropHint")}</span></div>

      <div class="kyso-settings-row">
        <button id="kyso-hoverbd-crop" class="kyso-btn kyso-btn--secondary" ${settings.hoverBackdrop ? "" : "disabled"}>${ICONS.scissors}<span>${t("hoverBackdropCropButton")}</span></button>
        <button id="kyso-hoverbd-apply" class="kyso-btn kyso-btn--primary">${t("iconApply")}</button>
        <button id="kyso-hoverbd-reset" class="kyso-btn kyso-btn--danger">${t("iconRemove")}</button>
      </div>
    </section>

    ${buildAssetBlock("loadingBg", "loadingBgLabel", manifest.categories.loadingBackgrounds, settings, { icon: ICONS.picture })}

    ${buildAssetBlock("loadingIcon", "loadingIconLabel", manifest.categories.loadingIcons, settings, { icon: ICONS.picture })}

    <h3 class="kyso-settings-section-title" style="margin-top:18px;"><span>${t("screenBgSection")}</span></h3>
    ${buildAssetBlock("collectionsBg", "collectionsBgLabel", manifest.categories.collectionsBackgrounds || [], settings, { icon: ICONS.picture })}
    ${buildAssetBlock("champSelectBg", "champSelectBgLabel", manifest.categories.champSelectBackgrounds || [], settings, { icon: ICONS.picture })}
    ${buildAssetBlock("runesBg", "runesBgLabel", manifest.categories.runesBackgrounds || [], settings, { icon: ICONS.picture })}
    ${buildAssetBlock("modeSwitcherBg", "modeSwitcherBgLabel", manifest.categories.modeSwitcherBackgrounds || [], settings, { icon: ICONS.picture })}

    <div class="kyso-settings-footer">
      <span id="kyso-save-feedback" class="kyso-save-feedback"></span>
    </div>
  `;

  // Crest rank override (elo default crest) — sets ranked-tier/division
  // attributes via assetReplacers.applyCrestRank. Division dropdown (I-IV)
  // applies to non-apex tiers; hidden for apex (forced to "O") and "Off".
  const crestRankSel = panel.querySelector("#kyso-crest-rank");
  const crestDivSel = panel.querySelector("#kyso-crest-division");
  const crestDivRow = panel.querySelector("#kyso-crest-division-row");
  const crestChangeAllEl = panel.querySelector("#kyso-crest-changeall");
  const crestChangeAllRow = panel.querySelector("#kyso-crest-changeall-row");
  const crestLpEl = panel.querySelector("#kyso-crest-lp");
  const _APEX = ["MASTER", "GRANDMASTER", "CHALLENGER"];
  const applyCrestRankNow = () => {
    const s = {
      ...DEFAULTS,
      ...loadSettings(),
      crestRank: crestRankSel ? crestRankSel.value : "",
      crestDivision: crestDivSel ? crestDivSel.value : "I",
      crestChangeAll: crestChangeAllEl ? crestChangeAllEl.checked : false,
      crestLP: crestLpEl ? crestLpEl.value.trim() : "",
    };
    saveSettings(s);
    assetReplacers.applyCrestRank(s.crestRank, s.crestDivision, s.crestChangeAll, s.crestLP);
    if (crestDivRow) {
      crestDivRow.style.display =
        s.crestRank && !_APEX.includes(s.crestRank) ? "" : "none";
    }
    if (crestChangeAllRow) crestChangeAllRow.style.display = s.crestRank ? "" : "none";
  };
  if (crestRankSel) crestRankSel.addEventListener("change", applyCrestRankNow);
  if (crestDivSel) crestDivSel.addEventListener("change", applyCrestRankNow);
  if (crestChangeAllEl) crestChangeAllEl.addEventListener("change", applyCrestRankNow);
  if (crestLpEl) crestLpEl.addEventListener("change", applyCrestRankNow);

  // ── Per-category handlers: source toggle, thumb click, web apply, reset.
  // Each asset uses its targeted apply* so we don't redo full applyAllSettings on every click.
  const ASSET_APPLIERS = {
    background: (s) => applyBackground(resolveAsset("background", s), s.backgroundType),
    banner:     (s) => assetReplacers.applyBanner(resolveAsset("banner", s)),
    crest:      (s) => assetReplacers.applyCrest(resolveAsset("crest", s)),
    loadingBg:  (s) => assetReplacers.applyLoadingScreen({ bgUrl: resolveAsset("loadingBg", s), iconUrl: resolveAsset("loadingIcon", s) }),
    loadingIcon:(s) => assetReplacers.applyLoadingScreen({ bgUrl: resolveAsset("loadingBg", s), iconUrl: resolveAsset("loadingIcon", s) }),
    collectionsBg: (s) => assetReplacers.applyScreenBackgrounds(s),
    champSelectBg: (s) => assetReplacers.applyScreenBackgrounds(s),
    runesBg:       (s) => assetReplacers.applyScreenBackgrounds(s),
    modeSwitcherBg:(s) => assetReplacers.applyScreenBackgrounds(s),
  };

  function updateActiveThumb(cat, path, block) {
    block.querySelectorAll(".kyso-thumb").forEach((t) => {
      t.classList.toggle("kyso-thumb--active", t.dataset.path === path);
    });
  }

  function updateSourceUI(cat, newSource, block) {
    block.querySelector(".kyso-asset-local-row").style.display = newSource === "local" ? "" : "none";
    block.querySelector(".kyso-asset-web-row").style.display = newSource === "web" ? "" : "none";
    block.querySelectorAll(".kyso-asset-source-label").forEach((lbl, i) => {
      lbl.classList.toggle("kyso-asset-source-label--active", i === (newSource === "local" ? 0 : 1));
    });
  }

  Object.keys(ASSET_APPLIERS).forEach((cat) => {
    const apply = ASSET_APPLIERS[cat];
    const block = panel.querySelector(`.kyso-asset-section[data-cat="${cat}"]`);
    if (!block) return;

    // Source toggle
    const sourceToggle = block.querySelector(`#kyso-${cat}-source-toggle`);
    if (sourceToggle) {
      sourceToggle.addEventListener("change", (e) => {
        const newSource = e.target.checked ? "web" : "local";
        updateSourceUI(cat, newSource, block);
        const s = { ...DEFAULTS, ...loadSettings(), [cat + "Source"]: newSource };
        saveSettings(s);
        apply(s);
      });
    }

    // Thumbnail click → pick local + auto switch to local mode.
    // Skip the upload tile — it's a <label> and triggers its own file input.
    block.querySelectorAll(".kyso-thumb:not(.kyso-thumb--upload)").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const path = thumb.dataset.path;
        updateActiveThumb(cat, path, block);
        if (sourceToggle) sourceToggle.checked = false;
        updateSourceUI(cat, "local", block);
        const s = {
          ...DEFAULTS, ...loadSettings(),
          [cat + "Local"]: path,
          [cat + "Source"]: "local",
        };
        saveSettings(s);
        apply(s);
      });
    });

    // Upload tile (+) — read file as dataURL, save as web URL, switch to web mode.
    const uploadInput = block.querySelector(".kyso-thumb-upload-input");
    if (uploadInput) {
      uploadInput.addEventListener("change", () => {
        const file = uploadInput.files[0];
        if (!file) return;
        if (file.size > 4 * 1024 * 1024) {
          showFeedback(panel, "File too large (>4MB)");
          uploadInput.value = "";
          return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target.result;
          const s = {
            ...DEFAULTS, ...loadSettings(),
            [cat + "Web"]: dataUrl,
            [cat + "Source"]: "web",
          };
          saveSettings(s);
          apply(s);
          if (sourceToggle) sourceToggle.checked = true;
          updateSourceUI(cat, "web", block);
          updateActiveThumb(cat, "", block);
          const webIn = block.querySelector(`#kyso-${cat}-web`);
          if (webIn) webIn.value = dataUrl;
          uploadInput.value = "";
          showFeedback(panel, t("applyAsset"));
        };
        reader.readAsDataURL(file);
      });
    }

    // Web apply
    const webApply = block.querySelector(`.kyso-${cat}-apply`);
    const webInput = block.querySelector(`#kyso-${cat}-web`);
    if (webApply && webInput) {
      webApply.addEventListener("click", () => {
        const s = {
          ...DEFAULTS, ...loadSettings(),
          [cat + "Web"]: webInput.value.trim(),
          [cat + "Source"]: "web",
        };
        if (sourceToggle) sourceToggle.checked = true;
        updateSourceUI(cat, "web", block);
        saveSettings(s);
        apply(s);
      });
    }

    // Reset
    const resetBtn = block.querySelector(`.kyso-${cat}-reset`);
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const s = {
          ...DEFAULTS, ...loadSettings(),
          [cat + "Source"]: DEFAULTS[cat + "Source"],
          [cat + "Local"]: DEFAULTS[cat + "Local"],
          [cat + "Web"]: DEFAULTS[cat + "Web"],
        };
        saveSettings(s);
        apply(s);
        const defSource = DEFAULTS[cat + "Source"];
        if (sourceToggle) sourceToggle.checked = defSource === "web";
        if (webInput) webInput.value = DEFAULTS[cat + "Web"];
        updateSourceUI(cat, defSource, block);
        updateActiveThumb(cat, DEFAULTS[cat + "Local"], block);
      });
    }
  });

  // Background-type override
  const bgTypeSel = panel.querySelector("#kyso-bg-type");
  if (bgTypeSel) {
    bgTypeSel.addEventListener("change", (e) => {
      const s = { ...DEFAULTS, ...loadSettings(), backgroundType: e.target.value };
      saveSettings(s);
      applyBackground(resolveAsset("background", s), s.backgroundType);
    });
  }

  // Banner upload + 4:1 crop
  const bannerFileInput = panel.querySelector("#kyso-banner-file");
  const bannerFilename  = panel.querySelector("#kyso-banner-filename");
  const bannerCropBtn   = panel.querySelector("#kyso-banner-crop");
  let _bannerPendingUrl = "";

  if (bannerFileInput && bannerCropBtn) {
    bannerFileInput.addEventListener("change", () => {
      const file = bannerFileInput.files[0];
      if (!file) return;
      bannerFilename.textContent = file.name;
      const reader = new FileReader();
      reader.onload = (ev) => {
        _bannerPendingUrl = ev.target.result;
        bannerCropBtn.disabled = false;
      };
      reader.readAsDataURL(file);
    });

    bannerCropBtn.addEventListener("click", () => {
      if (!_bannerPendingUrl) return;
      openBannerCropModal(_bannerPendingUrl, (dataUrl) => {
        const s = {
          ...DEFAULTS, ...loadSettings(),
          bannerWeb: dataUrl,
          bannerSource: "web",
        };
        saveSettings(s);
        assetReplacers.applyBanner(resolveAsset("banner", s));
        const block = panel.querySelector('.kyso-asset-section[data-cat="banner"]');
        if (block) {
          updateSourceUI("banner", "web", block);
          const webIn = block.querySelector("#kyso-banner-web");
          if (webIn) webIn.value = dataUrl;
          const srcToggle = block.querySelector("#kyso-banner-source-toggle");
          if (srcToggle) srcToggle.checked = true;
        }
        bannerFilename.textContent = t("noFile");
        bannerCropBtn.disabled = true;
        _bannerPendingUrl = "";
        showFeedback(panel, t("saveAllDone"));
      });
    });
  }

  // Profile Icon section handlers
  const iconUrlInput     = panel.querySelector("#kyso-icon-url");
  const iconFileInput    = panel.querySelector("#kyso-icon-file");
  const iconFilename     = panel.querySelector("#kyso-icon-filename");
  const iconCropBtn      = panel.querySelector("#kyso-icon-crop");
  const iconApplyBtn     = panel.querySelector("#kyso-icon-apply");
  const iconResetBtn     = panel.querySelector("#kyso-icon-reset");
  const iconAllPlayersChk = panel.querySelector("#kyso-icon-all-players");
  let _iconPendingUrl = "";

  function _enableIconCrop() {
    iconCropBtn.disabled = !(iconUrlInput.value.trim() || _iconPendingUrl);
  }

  iconUrlInput.addEventListener("input", _enableIconCrop);

  iconFileInput.addEventListener("change", () => {
    const file = iconFileInput.files[0];
    if (!file) return;
    iconFilename.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (ev) => {
      _iconPendingUrl = ev.target.result;
      iconUrlInput.value = "";
      _enableIconCrop();
    };
    reader.readAsDataURL(file);
  });

  iconCropBtn.addEventListener("click", () => {
    const src = _iconPendingUrl || iconUrlInput.value.trim();
    if (!src) return;
    openIconCropModal(src, (dataUrl) => {
      _iconPendingUrl = "";
      iconFilename.textContent = t("noFile");
      iconUrlInput.value = dataUrl;
      _enableIconCrop();
      const allPlayers = iconAllPlayersChk ? iconAllPlayersChk.checked : false;
      const s = { ...DEFAULTS, ...loadSettings(), iconUrl: dataUrl, iconAllPlayers: allPlayers };
      saveSettings(s);
      applyIcon(dataUrl, allPlayers, s.iconSyncNavbar, s.iconSwapMastery);
      assetReplacers.applyProfileIcon(dataUrl);
      showFeedback(panel, t("iconApplied"));
    });
  });

  iconApplyBtn.addEventListener("click", () => {
    const url = iconUrlInput.value.trim();
    const allPlayers = iconAllPlayersChk ? iconAllPlayersChk.checked : false;
    const s = { ...DEFAULTS, ...loadSettings(), iconUrl: url, iconAllPlayers: allPlayers };
    saveSettings(s);
    applyIcon(url, allPlayers, s.iconSyncNavbar, s.iconSwapMastery);
    assetReplacers.applyProfileIcon(url);
    showFeedback(panel, t("iconApplied"));
  });

  iconResetBtn.addEventListener("click", () => {
    iconUrlInput.value = "";
    _iconPendingUrl = "";
    iconFilename.textContent = t("noFile");
    iconCropBtn.disabled = true;
    const s = { ...DEFAULTS, ...loadSettings(), iconUrl: "", iconAllPlayers: false };
    if (iconAllPlayersChk) iconAllPlayersChk.checked = false;
    saveSettings(s);
    applyIcon("", false);
    assetReplacers.applyProfileIcon("");
    showFeedback(panel, t("iconRemoved"));
  });

  if (iconAllPlayersChk) {
    iconAllPlayersChk.addEventListener("change", () => {
      const url = iconUrlInput.value.trim();
      const allPlayers = iconAllPlayersChk.checked;
      const s = { ...DEFAULTS, ...loadSettings(), iconUrl: url, iconAllPlayers: allPlayers };
      saveSettings(s);
      applyIcon(url, allPlayers, s.iconSyncNavbar, s.iconSwapMastery);
    });
  }

  // Hovercard backdrop section handlers (self-only splash; single dataURL/web string)
  const hbdUrlInput  = panel.querySelector("#kyso-hoverbd-url");
  const hbdFileInput = panel.querySelector("#kyso-hoverbd-file");
  const hbdFilename  = panel.querySelector("#kyso-hoverbd-filename");
  const hbdCropBtn   = panel.querySelector("#kyso-hoverbd-crop");
  const hbdApplyBtn  = panel.querySelector("#kyso-hoverbd-apply");
  const hbdResetBtn  = panel.querySelector("#kyso-hoverbd-reset");
  let _hbdPendingUrl = "";
  const _enableHbdCrop = () => { if (hbdCropBtn) hbdCropBtn.disabled = !(hbdUrlInput.value.trim() || _hbdPendingUrl); };
  const _saveHbd = (url) => {
    const s = { ...DEFAULTS, ...loadSettings(), hoverBackdrop: url };
    saveSettings(s);
    assetReplacers.applyHovercard({ iconUrl: s.iconUrl || "", lp: s.crestLP || "", backdropUrl: url });
  };
  if (hbdUrlInput) hbdUrlInput.addEventListener("input", _enableHbdCrop);
  if (hbdFileInput) hbdFileInput.addEventListener("change", () => {
    const file = hbdFileInput.files[0];
    if (!file) return;
    hbdFilename.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (ev) => { _hbdPendingUrl = ev.target.result; hbdUrlInput.value = ""; _enableHbdCrop(); };
    reader.readAsDataURL(file);
  });
  if (hbdCropBtn) hbdCropBtn.addEventListener("click", () => {
    const src = _hbdPendingUrl || hbdUrlInput.value.trim();
    if (!src) return;
    openHovercardBackdropCropModal(src, (dataUrl) => {
      _hbdPendingUrl = "";
      hbdFilename.textContent = t("noFile");
      hbdUrlInput.value = dataUrl;
      _enableHbdCrop();
      _saveHbd(dataUrl);
      showFeedback(panel, t("iconApplied"));
    });
  });
  if (hbdApplyBtn) hbdApplyBtn.addEventListener("click", () => {
    _saveHbd(hbdUrlInput.value.trim());
    showFeedback(panel, t("iconApplied"));
  });
  if (hbdResetBtn) hbdResetBtn.addEventListener("click", () => {
    hbdUrlInput.value = ""; _hbdPendingUrl = ""; hbdFilename.textContent = t("noFile");
    if (hbdCropBtn) hbdCropBtn.disabled = true;
    _saveHbd("");
    showFeedback(panel, t("iconRemoved"));
  });

  assetReplacers.applyScreenBgDisabledUI(panel, { ...settings, _enableHint: t("enableInUiEditor") });

  return panel;
}

function showFeedback(panel, msg) {
  const el = panel.querySelector("#kyso-save-feedback");
  if (!el) return;
  // Escape básico de HTML pra evitar injeção via traduções
  const safe = String(msg)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  el.innerHTML = `${ICONS.check}<span>${safe}</span>`;
  el.classList.add("visible");
  setTimeout(() => el.classList.remove("visible"), 2500);
}

// ─────────────────────────────────────────────
//  Injeção na aba de Settings do LoL
// ─────────────────────────────────────────────
// Seletor sentinela: detecta quando o painel de configurações está aberto.
// Não usa o ID #emberXXXX porque ele é gerado dinamicamente e muda a cada sessão.
// Dedicated "UI Editor" panel — gathers the welcome-modal quick options plus a
// bit more (play opacity/blur, gear/LoR split). Controls read/write the same
// DataStore keys as the welcome modal and the KysoTheme panel, so everything
// stays in sync. Self-contained: each control persists + applies on change.
function buildUIEditorPanel() {
  const settings = { ...DEFAULTS, ...loadSettings() };
  const panel = document.createElement("div");
  panel.className = "kyso-settings-panel kyso-ui-editor-panel";

  const tog = (id, key, sub = false) => `
      <div class="kyso-settings-row kyso-settings-row--toggle${sub ? " kyso-settings-row--sub" : ""}"${sub ? ` id="${id}-row"${settings[key] ? "" : ' style="display:none"'}` : ""}>
        <label class="kyso-label">${t(key)}</label>
        <label class="kyso-toggle"><input id="${id}" type="checkbox" ${settings[key] ? "checked" : ""}><span class="kyso-toggle-slider"></span></label>
      </div>`;
  const rng = (id, key, max, unit) => `
      <div class="kyso-settings-row kyso-filter-row">
        <label class="kyso-label" for="${id}">${t(key)}</label>
        <input type="range" id="${id}" class="kyso-range" min="0" max="${max}" step="1" value="${settings[key] || 0}">
        <span class="kyso-filter-value" id="${id}-value">${settings[key] || 0}${unit}</span>
      </div>`;

  panel.innerHTML = `
    <div class="kyso-ue-search">
      <input id="kyso-ue-search-input" class="kyso-input" type="text" placeholder="${t("searchPlaceholder")}" autocomplete="off">
      <button id="kyso-ue-search-clear" class="kyso-ue-search-clear" type="button" aria-label="clear">×</button>
    </div>
    <div id="kyso-ue-search-empty" class="kyso-ue-search-empty" style="display:none;">${t("searchNoResults")}</div>
    <section class="kyso-settings-section">
      <h3 class="kyso-settings-section-title"><span>${t("interfaceSection")}</span></h3>
      ${tog("kyso-ue-icon-navbar", "iconSyncNavbar")}
      ${tog("kyso-ue-icon-swap-mastery", "iconSwapMastery")}
      ${tog("kyso-ue-lol-colors", "lolColorScheme")}
      ${tog("kyso-ue-play-vanilla", "playVanilla")}
      ${rng("kyso-ue-play-opacity", "playBgOpacity", 100, "%")}
      ${rng("kyso-ue-play-blur", "playBgBlur", 20, "px")}
      ${tog("kyso-ue-banner-hidden", "bannerHidden")}
      ${tog("kyso-ue-profilebg", "profileBgTransparent")}
      ${tog("kyso-ue-gear-always", "gearAlwaysVisible")}
      ${tog("kyso-ue-lor-always", "lorAlwaysVisible")}
      ${rng("kyso-ue-social-blur", "socialBlur", 20, "px")}
    </section>
    <section class="kyso-settings-section">
      <h3 class="kyso-settings-section-title"><span>${t("visSection")}</span></h3>
      ${tog("kyso-ue-hide-rp", "hideRP")}
      ${tog("kyso-ue-hide-tft", "hideTFT")}
      ${tog("kyso-ue-hide-social-only", "hideSocialOnly")}
      ${tog("kyso-ue-hide-social", "hideSocialPanel")}
      ${tog("kyso-ue-enable-hide-navbar", "enableHideNavbarBtn")}
      <div class="kyso-settings-row kyso-settings-row--toggle kyso-settings-row--sub" id="kyso-ue-show-blue-essence-row" ${settings.enableHideNavbarBtn ? "" : 'style="display:none"'}>
        <label class="kyso-label">${t("showBlueEssence")}</label>
        <label class="kyso-toggle"><input id="kyso-ue-show-blue-essence" type="checkbox" ${settings.showBlueEssenceOnHide ? "checked" : ""}><span class="kyso-toggle-slider"></span></label>
      </div>
      ${tog("kyso-ue-enable-hide-social-btn", "enableHideSocialBtn")}
    </section>
    <section class="kyso-settings-section">
      <h3 class="kyso-settings-section-title"><span>${t("moreVisSection")}</span></h3>
      ${tog("kyso-ue-xp-radial", "alwaysShowXpRadial")}
      ${tog("kyso-ue-rune-rec", "alwaysShowRuneRec")}
      ${tog("kyso-ue-deeplinks", "alwaysShowDeepLinks")}
      ${tog("kyso-ue-loot", "showLootBackdrop")}
      ${tog("kyso-ue-incident", "showIncidentTicker")}
      ${tog("kyso-ue-restriction", "showRestrictionWarning")}
      ${tog("kyso-ue-loading-spinner", "showLoadingSpinner")}
      ${tog("kyso-ue-lobby-overlay", "showLobbyOverlay")}
      ${tog("kyso-ue-nav-dividers", "showNavDividers")}
      ${tog("kyso-ue-activity-divider", "showActivityDivider")}
    </section>
    <section class="kyso-settings-section">
      <h3 class="kyso-settings-section-title"><span>${t("effectsSection")}</span></h3>
      ${tog("kyso-ue-kill-blur", "killClientBlur")}
      ${tog("kyso-ue-store-hue", "storeHueOverlay")}
      ${tog("kyso-ue-readycheck-anim", "readyCheckAnim")}
      ${tog("kyso-ue-viewport-glow", "viewportGlow")}
    </section>
    <section class="kyso-settings-section">
      <h3 class="kyso-settings-section-title"><span>${t("screenBgSection")}</span></h3>
      ${tog("kyso-ue-bg-collections", "collectionsBgEnabled")}
      ${tog("kyso-ue-bg-champselect", "champSelectBgEnabled")}
      ${tog("kyso-ue-bg-runes", "runesBgEnabled")}
      ${tog("kyso-ue-bg-modeswitch", "modeSwitcherBgEnabled")}
    </section>
    <section class="kyso-settings-section">
      <h3 class="kyso-settings-section-title"><span>${t("hoverGroupTitle")}</span></h3>
      ${tog("kyso-ue-always-chat", "alwaysShowChat")}
      ${tog("kyso-ue-always-invite", "alwaysShowInvite")}
      ${tog("kyso-ue-always-notifications", "alwaysShowNotifications")}
      ${tog("kyso-ue-always-xpring", "alwaysShowXpRing")}
      ${tog("kyso-ue-always-status", "alwaysShowStatus")}
      ${tog("kyso-ue-always-social-actions", "alwaysShowSocialActions")}
      ${tog("kyso-ue-always-version", "alwaysShowVersion")}
      ${tog("kyso-ue-activity-tabs", "activityTabsAlwaysVisible")}
    </section>
  `;

  const persist = (patch) => {
    const s = { ...DEFAULTS, ...loadSettings(), ...patch };
    saveSettings(s);
    return s;
  };
  const bindToggle = (id, key, apply) => {
    const el = panel.querySelector(id);
    if (!el) return;
    el.addEventListener("change", () => apply(persist({ [key]: el.checked })));
  };
  const bindRange = (id, key, unit, apply) => {
    const el = panel.querySelector(id);
    const out = panel.querySelector(`${id}-value`);
    if (!el) return;
    el.addEventListener("input", () => { if (out) out.textContent = el.value + unit; });
    el.addEventListener("change", () => apply(persist({ [key]: Number(el.value) })));
  };

  // ── Interface ──
  bindToggle("#kyso-ue-icon-navbar", "iconSyncNavbar", (s) => applyIcon(s.iconUrl || "", s.iconAllPlayers || false, s.iconSyncNavbar, s.iconSwapMastery));
  bindToggle("#kyso-ue-icon-swap-mastery", "iconSwapMastery", (s) => applyIcon(s.iconUrl || "", s.iconAllPlayers || false, s.iconSyncNavbar, s.iconSwapMastery));
  bindToggle("#kyso-ue-lol-colors", "lolColorScheme", (s) => {
    if (s.lolColorScheme) {
      applyAccentColor(LOL_GOLD);
      applyRgbEffect("none", s.rgbSpeed || 3, LOL_GOLD);
    } else {
      applyAccentColor(s.accentColor || "");
      applyRgbEffect(s.rgbMode || "none", s.rgbSpeed || 3, s.accentColor || "");
    }
  });
  bindToggle("#kyso-ue-play-vanilla", "playVanilla", (s) => applyInterfaceToggles(s));
  bindRange("#kyso-ue-play-opacity", "playBgOpacity", "%", (s) => applyInterfaceToggles(s));
  bindRange("#kyso-ue-play-blur", "playBgBlur", "px", (s) => applyInterfaceToggles(s));
  bindToggle("#kyso-ue-banner-hidden", "bannerHidden", (s) => assetReplacers.applyBannerVisibility(s.bannerHidden));
  bindToggle("#kyso-ue-profilebg", "profileBgTransparent", (s) => assetReplacers.applyProfileBgTransparent(s.profileBgTransparent));
  bindToggle("#kyso-ue-gear-always", "gearAlwaysVisible", (s) => applyInterfaceToggles(s));
  bindToggle("#kyso-ue-lor-always", "lorAlwaysVisible", (s) => applyInterfaceToggles(s));
  bindRange("#kyso-ue-social-blur", "socialBlur", "px", (s) => applySocialBlur(s.socialBlur));

  // ── Visibility (simple) ──
  bindToggle("#kyso-ue-hide-rp", "hideRP", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-hide-tft", "hideTFT", (s) => applyHideOptions(s));

  // ── Granular hover toggles ──
  bindToggle("#kyso-ue-always-chat", "alwaysShowChat", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-always-invite", "alwaysShowInvite", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-always-notifications", "alwaysShowNotifications", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-always-xpring", "alwaysShowXpRing", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-always-status", "alwaysShowStatus", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-always-social-actions", "alwaysShowSocialActions", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-always-version", "alwaysShowVersion", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-activity-tabs", "activityTabsAlwaysVisible", (s) => applyHideOptions(s));

  // ── v3.2 Bucket A ──
  bindToggle("#kyso-ue-xp-radial", "alwaysShowXpRadial", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-rune-rec", "alwaysShowRuneRec", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-deeplinks", "alwaysShowDeepLinks", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-loot", "showLootBackdrop", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-incident", "showIncidentTicker", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-restriction", "showRestrictionWarning", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-loading-spinner", "showLoadingSpinner", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-lobby-overlay", "showLobbyOverlay", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-nav-dividers", "showNavDividers", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-activity-divider", "showActivityDivider", (s) => applyHideOptions(s));

  // ── v3.2 Bucket C ──
  bindToggle("#kyso-ue-kill-blur", "killClientBlur", (s) => applyVisualToggles(s));
  bindToggle("#kyso-ue-store-hue", "storeHueOverlay", (s) => applyVisualToggles(s));
  bindToggle("#kyso-ue-readycheck-anim", "readyCheckAnim", (s) => applyVisualToggles(s));
  bindToggle("#kyso-ue-viewport-glow", "viewportGlow", (s) => applyVisualToggles(s));

  // ── v3.2 Bucket B screen-background enable toggles ──
  const _bgRefresh = (s) => {
    assetReplacers.applyScreenBackgrounds(s);
    const assetsPanel = document.querySelector(".kyso-assets-panel");
    if (assetsPanel) assetReplacers.applyScreenBgDisabledUI(assetsPanel, { ...s, _enableHint: t("enableInUiEditor") });
  };
  bindToggle("#kyso-ue-bg-collections", "collectionsBgEnabled", _bgRefresh);
  bindToggle("#kyso-ue-bg-champselect", "champSelectBgEnabled", _bgRefresh);
  bindToggle("#kyso-ue-bg-runes", "runesBgEnabled", _bgRefresh);
  bindToggle("#kyso-ue-bg-modeswitch", "modeSwitcherBgEnabled", _bgRefresh);

  // ── Social hover toggles (mutex) + sliding-door buttons (conflict w/ hover) ──
  const soEl = panel.querySelector("#kyso-ue-hide-social-only");
  const spEl = panel.querySelector("#kyso-ue-hide-social");
  const navEl = panel.querySelector("#kyso-ue-enable-hide-navbar");
  const socEl = panel.querySelector("#kyso-ue-enable-hide-social-btn");
  const beRow = panel.querySelector("#kyso-ue-show-blue-essence-row");

  // Hover modes are mutually exclusive with each other AND with both sliding
  // doors (a door + a hover mode on the same panel fight each other). The two
  // doors target different things (top-nav vs social panel) so they may coexist.
  const _exclusiveHover = (which, checked) => {
    const patch = { [which]: checked };
    if (checked) {
      const other = which === "hideSocialOnly" ? "hideSocialPanel" : "hideSocialOnly";
      const otherEl = which === "hideSocialOnly" ? spEl : soEl;
      if (otherEl) otherEl.checked = false;
      patch[other] = false;
      if (navEl && navEl.checked) { navEl.checked = false; patch.enableHideNavbarBtn = false; if (beRow) beRow.style.display = "none"; }
      if (socEl && socEl.checked) { socEl.checked = false; patch.enableHideSocialBtn = false; }
    }
    const s = persist(patch);
    if (patch.enableHideNavbarBtn === false) applyHideNavbarBtnSetting(s);
    if (patch.enableHideSocialBtn === false) applyHideSocialBtnSetting(s);
    applyHideOptions(s);
  };
  if (soEl) soEl.addEventListener("change", () => _exclusiveHover("hideSocialOnly", soEl.checked));
  if (spEl) spEl.addEventListener("change", () => _exclusiveHover("hideSocialPanel", spEl.checked));
  if (navEl) navEl.addEventListener("change", () => {
    const patch = { enableHideNavbarBtn: navEl.checked };
    if (navEl.checked) {
      patch.hideSocialOnly = false; patch.hideSocialPanel = false;
      if (soEl) soEl.checked = false;
      if (spEl) spEl.checked = false;
    }
    if (beRow) beRow.style.display = navEl.checked ? "" : "none";
    const s = persist(patch);
    applyHideNavbarBtnSetting(s);
    applyHideOptions(s);
  });
  if (socEl) socEl.addEventListener("change", () => {
    const patch = { enableHideSocialBtn: socEl.checked };
    if (socEl.checked) {
      patch.hideSocialOnly = false; patch.hideSocialPanel = false;
      if (soEl) soEl.checked = false;
      if (spEl) spEl.checked = false;
    }
    const s = persist(patch);
    applyHideSocialBtnSetting(s);
    applyHideOptions(s);
  });
  const beEl = panel.querySelector("#kyso-ue-show-blue-essence");
  if (beEl) beEl.addEventListener("change", () => {
    const s = persist({ showBlueEssenceOnHide: beEl.checked });
    applyTopNavbarHiddenState(s.navbarHidden, s.showBlueEssenceOnHide);
  });

  // ── v3.2 search filter (scoped to this panel) ──
  const searchInput = panel.querySelector("#kyso-ue-search-input");
  const searchClear = panel.querySelector("#kyso-ue-search-clear");
  const searchEmpty = panel.querySelector("#kyso-ue-search-empty");
  const searchRows = Array.from(panel.querySelectorAll(".kyso-settings-row"));
  // Tag each row with its lowercased label text once.
  searchRows.forEach((row) => {
    const lbl = row.querySelector(".kyso-label");
    row.dataset.kysoSearch = (lbl ? lbl.textContent : "").toLowerCase();
  });
  const sections = Array.from(panel.querySelectorAll(".kyso-settings-section"));
  const runSearch = (qRaw) => {
    const q = (qRaw || "").trim().toLowerCase();
    let anyVisible = false;
    searchRows.forEach((row) => {
      const match = !q || row.dataset.kysoSearch.indexOf(q) !== -1;
      row.style.display = match ? "" : "none";
      if (match) anyVisible = true;
    });
    // Hide a section header whose rows are all hidden.
    sections.forEach((sec) => {
      const visibleRow = sec.querySelector(".kyso-settings-row:not([style*='display: none'])");
      const header = sec.querySelector(".kyso-settings-section-title");
      if (header) header.style.display = q && !visibleRow ? "none" : "";
      sec.style.display = q && !visibleRow ? "none" : "";
    });
    if (searchEmpty) searchEmpty.style.display = q && !anyVisible ? "" : "none";
  };
  if (searchInput) searchInput.addEventListener("input", () => runSearch(searchInput.value));
  if (searchClear) searchClear.addEventListener("click", () => { if (searchInput) { searchInput.value = ""; runSearch(""); searchInput.focus(); } });

  return panel;
}

const SETTINGS_SENTINEL =
  "div.lol-settings-content > settings-plugin-navigation-bar";

let injected = false;

async function tryInjectSettingsTab() {
  if (injected) return;

  // Verifica se a janela de Settings está aberta
  const navPlugin = document.querySelector(SETTINGS_SENTINEL);
  if (!navPlugin) return;

  // Verifica se já existe alguma aba nossa
  if (document.querySelector(".kyso-nav-item")) return;

  // Encontra a segunda lol-uikit-navigation-bar (a de seções, não a de abas)
  const scrollable = navPlugin.querySelector("lol-uikit-scrollable");
  if (!scrollable) return;

  const navBars = scrollable.querySelectorAll("lol-uikit-navigation-bar");
  const navBar = navBars[navBars.length - 1] ?? navBars[0];
  if (!navBar) return;

  const settingsContent = document.querySelector(".lol-settings-content");
  if (!settingsContent) return;

  // Retorna filhos DIRETOS que não são o nav plugin nem nossos painéis.
  const getNativeChildren = () =>
    Array.from(settingsContent.children).filter(
      (el) =>
        el.tagName.toLowerCase() !== "settings-plugin-navigation-bar" &&
        el.id !== "kyso-settings-content" &&
        el.id !== "kyso-assets-content" &&
        el.id !== "kyso-uieditor-content",
    );

  // Build both panels in parallel so the second tab opens instantly after the first
  const [kysoPanel, assetsPanel] = await Promise.all([
    buildSettingsPanel(),
    buildAssetsPanel(),
  ]);
  const uiEditorPanel = buildUIEditorPanel();

  // ── Painel KysoTheme ──
  const kysoNavItem = document.createElement("lol-uikit-navigation-item");
  kysoNavItem.className = "kyso-nav-item";
  kysoNavItem.setAttribute("data-id", "kyso-theme");
  const kysoLabel = document.createElement("div");
  kysoLabel.className = "kyso-nav-label";
  kysoLabel.textContent = "KysoTheme";
  kysoNavItem.appendChild(kysoLabel);
  navBar.appendChild(kysoNavItem);

  const kysoContent = document.createElement("div");
  kysoContent.id = "kyso-settings-content";
  kysoContent.className = "kyso-settings-content-wrapper";
  kysoContent.style.display = "none";
  kysoContent.appendChild(kysoPanel);
  settingsContent.appendChild(kysoContent);

  // ── Painel Player Assets ──
  const assetsNavItem = document.createElement("lol-uikit-navigation-item");
  assetsNavItem.className = "kyso-nav-item kyso-assets-nav-item";
  assetsNavItem.setAttribute("data-id", "kyso-assets");
  const assetsLabel = document.createElement("div");
  assetsLabel.className = "kyso-nav-label";
  assetsLabel.textContent = t("assetsSection");
  assetsNavItem.appendChild(assetsLabel);
  navBar.appendChild(assetsNavItem);

  const assetsContent = document.createElement("div");
  assetsContent.id = "kyso-assets-content";
  assetsContent.className = "kyso-settings-content-wrapper";
  assetsContent.style.display = "none";
  assetsContent.appendChild(assetsPanel);
  settingsContent.appendChild(assetsContent);

  // ── Painel UI Editor (abaixo de Player Assets) ──
  const uiEditorNavItem = document.createElement("lol-uikit-navigation-item");
  uiEditorNavItem.className = "kyso-nav-item kyso-uieditor-nav-item";
  uiEditorNavItem.setAttribute("data-id", "kyso-uieditor");
  const uiEditorLabel = document.createElement("div");
  uiEditorLabel.className = "kyso-nav-label";
  uiEditorLabel.textContent = "UI Editor";
  uiEditorNavItem.appendChild(uiEditorLabel);
  navBar.appendChild(uiEditorNavItem);

  const uiEditorContent = document.createElement("div");
  uiEditorContent.id = "kyso-uieditor-content";
  uiEditorContent.className = "kyso-settings-content-wrapper";
  uiEditorContent.style.display = "none";
  uiEditorContent.appendChild(uiEditorPanel);
  settingsContent.appendChild(uiEditorContent);

  // ── Switching logic ──
  function showKysoPanel(which) {
    navBar.querySelectorAll("lol-uikit-navigation-item").forEach((item) => {
      item.removeAttribute("active");
    });
    getNativeChildren().forEach((el) => { el.style.display = "none"; });
    kysoContent.style.display = which === "kyso" ? "flex" : "none";
    assetsContent.style.display = which === "assets" ? "flex" : "none";
    uiEditorContent.style.display = which === "uieditor" ? "flex" : "none";
    if (which === "kyso") kysoNavItem.setAttribute("active", "");
    else if (which === "assets") assetsNavItem.setAttribute("active", "");
    else uiEditorNavItem.setAttribute("active", "");
  }

  kysoNavItem.addEventListener("click", () => showKysoPanel("kyso"));
  assetsNavItem.addEventListener("click", () => showKysoPanel("assets"));
  uiEditorNavItem.addEventListener("click", () => showKysoPanel("uieditor"));

  // Quando qualquer item nativo é clicado, esconde nossos painéis
  navBar
    .querySelectorAll("lol-uikit-navigation-item:not(.kyso-nav-item)")
    .forEach((item) => {
      item.addEventListener("click", () => {
        kysoNavItem.removeAttribute("active");
        assetsNavItem.removeAttribute("active");
        uiEditorNavItem.removeAttribute("active");
        kysoContent.style.display = "none";
        assetsContent.style.display = "none";
        uiEditorContent.style.display = "none";
        getNativeChildren().forEach((el) => { el.style.display = ""; });
      });
    });

  injected = true;
  console.log("[KysoTheme] Aba de configurações injetada com sucesso.");
}

// ─────────────────────────────────────────────
//  Migração de chaves legacy → triples Source/Local/Web
// ─────────────────────────────────────────────
// Roda 1x no boot dentro de initSettingsPage. Idempotente: re-rodar com chaves
// novas presentes é no-op para essas chaves.
function migrateSettings(saved) {
  if (!saved || typeof saved !== "object") return saved;
  const out = { ...saved };

  const ASSETS_PREFIX = "//plugins/KysoTheme/assets/";

  // Background: derive Source/Local/Web from legacy backgroundUrl
  if (out.backgroundUrl && out.backgroundSource === undefined) {
    if (out.backgroundUrl.startsWith(ASSETS_PREFIX)) {
      out.backgroundSource = "local";
      out.backgroundLocal = out.backgroundUrl.slice(ASSETS_PREFIX.length);
    } else {
      out.backgroundSource = "web";
      out.backgroundWeb = out.backgroundUrl;
    }
  }

  // Profile icon triple → iconUrl (triple was used in an older version;
  // the icon section now uses iconUrl directly).
  if (!out.iconUrl && out.profileIconSource) {
    if (out.profileIconSource === "web" && out.profileIconWeb) {
      out.iconUrl = out.profileIconWeb;
    } else if (out.profileIconSource === "local" && out.profileIconLocal) {
      out.iconUrl = ASSETS_PREFIX + out.profileIconLocal;
    }
  }

  return out;
}

// ─────────────────────────────────────────────
//  Inicialização
// ─────────────────────────────────────────────
export function initSettingsPage() {
  // Aplica configurações (merged com DEFAULTS) — sempre, mesmo sem settings
  // salvas, p/ garantir bg default + botão navbar conforme toggle.
  let saved = loadSettings();

  // Sanitização de migração: usuários antigos podem ter um dataURL gigante
  // salvo em backgroundUrl (vídeo base64 trava client). Limpa antes de aplicar.
  if (saved && typeof saved.backgroundUrl === "string") {
    const url = saved.backgroundUrl;
    const isDataUrl = url.startsWith("data:");
    const isVideoData = isDataUrl && url.startsWith("data:video/");
    const tooBig = isDataUrl && url.length > 3 * 1024 * 1024; // ~2 MB binário
    if (isVideoData || tooBig) {
      console.warn(
        "[KysoTheme] Purgando background dataURL pesado (provável vídeo " +
          "base64 de versão anterior). Reaplique via Settings.",
      );
      saved = { ...saved, backgroundUrl: "", backgroundType: "auto" };
      saveSettings(saved);
    }
  }

  // Migração PR A: chaves legacy → triples Source/Local/Web
  const _migrated = migrateSettings(saved);
  if (JSON.stringify(_migrated) !== JSON.stringify(saved)) {
    saveSettings(_migrated);
    saved = _migrated;
  }

  // Migração v3.2: o bundle legacy hideHoverElements (true = "mostrar tudo")
  // suprimia TODOS os toggles granulares de hover (via _showAll), deixando-os
  // inertes. Converte para os flags granulares (preserva "tudo visível") e
  // desliga o bundle, para que cada toggle volte a funcionar.
  if (saved && saved.hideHoverElements === true) {
    saved = {
      ...saved,
      hideHoverElements: false,
      alwaysShowChat: true, alwaysShowInvite: true, alwaysShowNotifications: true,
      alwaysShowXpRing: true, alwaysShowStatus: true, alwaysShowSocialActions: true,
      alwaysShowVersion: true, alwaysShowXpRadial: true, alwaysShowRuneRec: true,
      alwaysShowDeepLinks: true,
    };
    saveSettings(saved);
  }

  applyAllSettings(saved);

  const _s = { ...DEFAULTS, ...loadSettings() };
  if (!_s.hasSeenWelcome) {
    // Defer until body is ready so the overlay mounts visibly.
    if (document.body) showWelcomeModal();
    else window.addEventListener("load", showWelcomeModal, { once: true });
  }

  // Pré-aquece o manifest pra a primeira abertura de settings já achar cache
  assetReplacers.loadManifest().catch(() => {});

  // Observer agressivo (childList+subtree em body) dispara dezenas de vezes
  // por segundo durante navegação do LCU. Coalesce com rAF: 1 check por frame,
  // mais que suficiente pra UX de abertura de painel.
  let _rafPending = false;
  const observer = new MutationObserver(() => {
    if (_rafPending) return;
    _rafPending = true;
    requestAnimationFrame(() => {
      _rafPending = false;
      tryInjectSettingsTab();
      if (!document.querySelector(SETTINGS_SENTINEL)) {
        injected = false;
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
