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
    bgApplied: "Background applied!",
    bgRemoved: "Background removed.",
    visSection: "Visibility",
    hideRP: "Hide RP (store currency)",
    showHover: "Always show hover elements",
    showHoverHint: "(missions, chat, profile, status…)",
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
    noFile: "No file selected",
    saveAll: "Save all settings",
    saveAllDone: "Settings saved!",
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
    bgApplied: "Background aplicado!",
    bgRemoved: "Background removido.",
    visSection: "Visibilidade",
    hideRP: "Ocultar RP (moeda da loja)",
    showHover: "Exibir elementos hover sempre visíveis",
    showHoverHint: "(missions, chat, perfil, status…)",
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
    noFile: "Nenhum arquivo selecionado",
    saveAll: "Salvar todas as configurações",
    saveAllDone: "Configurações salvas!",
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
    noFile: "Ningún archivo seleccionado",
    saveAll: "Guardar configuración",
    saveAllDone: "¡Configuración guardada!",
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
    noFile: "Keine Datei ausgewählt",
    saveAll: "Alle Einstellungen speichern",
    saveAllDone: "Einstellungen gespeichert!",
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
    noFile: "ファイルが選択されていません",
    saveAll: "すべての設定を保存",
    saveAllDone: "設定を保存しました！",
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
    noFile: "선택된 파일 없음",
    saveAll: "모든 설정 저장",
    saveAllDone: "설정이 저장되었습니다!",
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
  DataStore.set(STORE_KEY, JSON.stringify(settings));
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
  hideHoverElements: false,
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
};

// ─────────────────────────────────────────────
//  Aplicação das configurações no DOM / CSS
// ─────────────────────────────────────────────
let dynamicStyle = null;

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
  return PLUGIN_ASSETS_BASE + String(relPath).replace(/^\/+/, "");
}

// Resolves a {cat}Source/{cat}Local/{cat}Web triple into a final URL.
// cat = "background" | "banner" | "crest" | "profileIcon" | "loadingBg" | "loadingIcon"
function resolveAsset(cat, settings) {
  const source = settings[cat + "Source"];
  if (source === "web") return settings[cat + "Web"] || "";
  const local = settings[cat + "Local"] || "";
  return local ? pluginAsset(local) : "";
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

/** Converte uma cor hex em string de CSS filter que reproduz aproximadamente essa cor */
function _hexToFilter(hex) {
  const normalized = hex.replace("#", "").toLowerCase();
  if (!normalized || normalized === "ffffff" || normalized === "fff") {
    return "grayscale(100%)";
  }
  const { h, s, l } = _hexToHsl(hex);
  // sepia base ≈ 38°; hue-rotate compensa
  const rotate = Math.round((h - 38 + 360) % 360);
  const sat = Math.min(Math.round(s * 4 + 100), 800);
  const bright = l < 30 ? 1.5 : l > 75 ? 0.85 : 1;
  return `grayscale(0%) sepia(100%) hue-rotate(${rotate}deg) saturate(${sat}%) brightness(${bright})`;
}

/** Aplica a cor de acento nas CSS custom properties de :root */
function applyAccentColor(hex) {
  const color = hex && hex !== "" ? hex : "#ffffff";
  const { r, g, b } = _hexToRgb(color);
  const root = document.documentElement;
  root.style.setProperty("--kyso-accent", color);
  root.style.setProperty("--kyso-accent-glow", `rgba(${r},${g},${b},0.5)`);
  root.style.setProperty("--kyso-filter", _hexToFilter(color));
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

  if (hidden) {
    // Quando BE visível, o botão para à esquerda do wallet em vez de ir até o fim
    const btnOffset =
      showBlueEssence && wallet && btn
        ? Math.max(wallet.offsetLeft - btn.offsetWidth - 4, 0)
        : offset;
    if (btn) btn.style.cssText = `transform: translateX(${btnOffset}px);`;
    items.forEach((el) => {
      el.style.cssText = `transform: translateX(${offset}px); opacity: 0; pointer-events: none;`;
    });
    rules.forEach((el) => {
      el.style.cssText = `transform: translateX(${offset}px); opacity: 0; pointer-events: none;`;
    });
    if (wallet) {
      if (showBlueEssence) {
        // Mantém wallet visível e no lugar — só esconde o resto
        wallet.style.cssText = `transform: translateX(0px); opacity: 1; pointer-events: auto;`;
      } else {
        wallet.style.cssText = `transform: translateX(${offset}px); opacity: 0; pointer-events: none;`;
      }
    }
    if (icon) icon.textContent = "‹";
  } else {
    if (btn) btn.style.cssText = `transform: translateX(0px);`;
    items.forEach((el) => {
      el.style.cssText = `transform: translateX(0px); opacity: 1; pointer-events: auto;`;
    });
    rules.forEach((el) => {
      el.style.cssText = `transform: translateX(0px); opacity: 1; pointer-events: auto;`;
    });
    if (wallet) {
      wallet.style.cssText = `transform: translateX(0px); opacity: 1; pointer-events: auto;`;
    }
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
      if (
        !document.querySelector(".hide-friendslist") &&
        document.querySelector("#rcp-fe-viewport-root")
      ) {
        if (createSocialToggleButton()) {
          setTimeout(
            () => applySocialHiddenState(loadSettings().socialHidden),
            100,
          );
        }
      } else if (document.querySelector(".hide-friendslist")) {
        // Botão existe — reaplica estado p/ elementos que foram remontados
        applySocialHiddenState(loadSettings().socialHidden);
      }
    };

    ensureButton();

    if (_socialMutationObserver) _socialMutationObserver.disconnect();
    _socialMutationObserver = new MutationObserver(ensureButton);
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
    _navbarMutationObserver = new MutationObserver(ensureButton);
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

  // Hover-fade rules: aplicados APENAS quando o toggle "Always show hover
  // elements" está DESLIGADO. Quando ligado, nenhuma regra é injetada e
  // os elementos permanecem 100% visíveis (estado natural do cliente).
  if (!settings.hideHoverElements) {
    css += `
.alpha-version-panel { opacity: 0 !important; transition: 0.2s !important; }
.alpha-version-panel:hover { opacity: 1 !important; transition: 0.2s !important; }

.v2-footer-component .left-container .chat-container {
  opacity: 0 !important; transition: 0.2s !important; pointer-events: auto !important;
}
.v2-footer-component .left-container .chat-container:hover {
  opacity: 1 !important; transition: 0.2s !important;
}

.invite-info-panel-container {
  opacity: 0 !important; transition: 0.2s !important; pointer-events: auto !important;
}
.invite-info-panel-container:hover { opacity: 1 !important; transition: 0.2s !important; }

.xp-ring { opacity: 0 !important; transition: 0.2s !important; }
.identity-icon:hover > .summoner-level-icon > .xp-ring {
  opacity: 1 !important; transition: 0.2s !important;
}

.notifications-button { opacity: 0 !important; transition: 0.2s !important; }
.notifications-button:hover { opacity: 1 !important; transition: 0.2s !important; }

.lower-details > .status,
.lower-details > lol-social-availability-hitbox {
  opacity: 0 !important; transition: 0.2s !important;
}
.lower-details:hover > .status,
.lower-details:hover > lol-social-availability-hitbox {
  opacity: 1 !important; transition: 0.2s !important;
}

.lol-social-actions-bar > .actions-bar > buttons:not(:first-child) {
  opacity: 0; transition: 0.2s !important;
}
.lol-social-actions-bar:hover > .actions-bar > buttons:not(:first-child) {
  opacity: 1; transition: 0.2s !important;
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

  // Substitui apenas o bloco de hide options preservando font
  const existingStyle = style.textContent || "";
  const withoutHide = existingStyle.replace(
    /\/\* KYSO-HIDE-START \*\/[\s\S]*?\/\* KYSO-HIDE-END \*\//g,
    "",
  );
  style.textContent =
    withoutHide + `/* KYSO-HIDE-START */\n${css}/* KYSO-HIDE-END */\n`;
}

function applyIcon(url, allPlayers = false) {
  const style = getOrCreateDynamicStyle();
  let iconBlock;
  if (!url) {
    iconBlock = `/* KYSO-ICON-START *//* KYSO-ICON-END */\n`;
  } else if (allPlayers) {
    // Modo "todos": seletores globais (comportamento antigo)
    iconBlock = `/* KYSO-ICON-START */\n.icon-image.has-icon,\n.top > .icon-image.has-icon,\n.summoner-level-icon .icon-image {\n  background-image: url("${url}") !important;\n  background-size: cover !important;\n  background-position: center !important;\n}\nsummoner-icon,\nimg.icon-image.has-icon,\n.style-profile-champion-icon-masked > img {\n  content: url("${url}") !important;\n}\n/* KYSO-ICON-END */\n`;
  } else {
    // Modo "só eu": escopo restrito ao avatar próprio na barra lateral
    iconBlock = `/* KYSO-ICON-START */\nlol-social-avatar .icon-image.has-icon,\nlol-social-avatar .summoner-level-icon .icon-image {\n  background-image: url("${url}") !important;\n  background-size: cover !important;\n  background-position: center !important;\n}\nlol-social-avatar img.icon-image.has-icon,\nlol-social-avatar summoner-icon {\n  content: url("${url}") !important;\n}\n/* KYSO-ICON-END */\n`;
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

export function applyAllSettings(settings) {
  const merged = { ...DEFAULTS, ...settings };
  applyBackground(merged.backgroundUrl, merged.backgroundType);
  applyFont(merged.fontUrl, merged.fontFamily);
  applyHideOptions(merged);
  applyIcon(merged.iconUrl, merged.iconAllPlayers);
  applyHideNavbarBtnSetting(merged);
  applyHideSocialBtnSetting(merged);
  // Color accent
  if (merged.accentAuto) {
    extractAccentFromBackground(merged.backgroundUrl).then((hex) =>
      applyAccentColor(hex),
    );
  } else {
    applyAccentColor(merged.accentColor || "");
  }
}

// ─────────────────────────────────────────────
//  Crop modal 1:1 — ícones do LoL são quadrados (Data Dragon 120×120).
//  Saída: PNG dataURL 256×256 (nítido em qualquer tamanho exibido).
// ─────────────────────────────────────────────
const CROP_OUTPUT_SIZE = 256;

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

// ─────────────────────────────────────────────
//  Construção da UI de configurações
// ─────────────────────────────────────────────
function buildSettingsPanel() {
  const settings = { ...DEFAULTS, ...loadSettings() };

  const panel = document.createElement("div");
  panel.className = "kyso-settings-panel";
  panel.innerHTML = `
    <div class="kyso-settings-header">
      <span class="kyso-settings-title">KysoTheme</span>
      <span class="kyso-settings-version">v2.0</span>
    </div>

    <!-- Background -->
    <section class="kyso-settings-section">
      <h3 class="kyso-settings-section-title">${ICONS.picture}<span>${t("bgSection")}</span></h3>

      <div class="kyso-settings-row">
        <label class="kyso-label" for="kyso-bg-preset">${t("bgPreset")}</label>
        <select id="kyso-bg-preset" class="kyso-select">
          <option value="">— ${t("bgPresetNone")} —</option>
          ${PRESET_BACKGROUNDS.map(
            (p) => `<option value="${pluginAsset(p.path)}">${p.label}</option>`,
          ).join("")}
        </select>
      </div>

      <div class="kyso-settings-row">
        <label class="kyso-label" for="kyso-bg-url">${t("bgUrl")}</label>
        <input id="kyso-bg-url" class="kyso-input" type="text"
          placeholder="${t("bgUrlPlaceholder")}"
          value="${settings.backgroundUrl || ""}">
        <span class="kyso-hint">${t("bgUrlHint")}</span>
      </div>

      <div class="kyso-settings-row kyso-settings-row--upload">
        <label class="kyso-label">${t("bgUpload")}</label>
        <label class="kyso-btn kyso-btn--secondary kyso-upload-label">
          ${ICONS.folder}<span>${t("bgChoose")}</span>
          <input id="kyso-bg-file" type="file" accept="image/*,video/*,.gif" style="display:none;">
        </label>
        <button id="kyso-bg-open-folder" class="kyso-btn kyso-btn--secondary" type="button">
          ${ICONS.folder}<span>${t("bgOpenFolder")}</span>
        </button>
        <span id="kyso-bg-filename" class="kyso-filename">${t("noFile")}</span>
      </div>

      <div class="kyso-settings-row">
        <label class="kyso-label" for="kyso-bg-type">${t("bgType")}</label>
        <select id="kyso-bg-type" class="kyso-select">
          <option value="auto" ${settings.backgroundType === "auto" ? "selected" : ""}>${t("bgTypeAuto")}</option>
          <option value="image" ${settings.backgroundType === "image" ? "selected" : ""}>${t("bgTypeImage")}</option>
          <option value="gif" ${settings.backgroundType === "gif" ? "selected" : ""}>${t("bgTypeGif")}</option>
          <option value="video" ${settings.backgroundType === "video" ? "selected" : ""}>${t("bgTypeVideo")}</option>
        </select>
      </div>

      <div class="kyso-settings-row">
        <button id="kyso-bg-apply" class="kyso-btn kyso-btn--primary">${t("bgApply")}</button>
        <button id="kyso-bg-reset" class="kyso-btn kyso-btn--danger">${t("bgRemove")}</button>
      </div>
    </section>

    <!-- Visibility -->
    <section class="kyso-settings-section">
      <h3 class="kyso-settings-section-title">${ICONS.eye}<span>${t("visSection")}</span></h3>

      <div class="kyso-settings-row kyso-settings-row--toggle">
        <label class="kyso-label">${t("hideRP")}</label>
        <label class="kyso-toggle">
          <input id="kyso-hide-rp" type="checkbox" ${settings.hideRP ? "checked" : ""}>
          <span class="kyso-toggle-slider"></span>
        </label>
      </div>

      <div class="kyso-settings-row kyso-settings-row--toggle">
        <label class="kyso-label">${t("showHover")}
          <span class="kyso-hint">${t("showHoverHint")}</span>
        </label>
        <label class="kyso-toggle">
          <input id="kyso-show-hover" type="checkbox" ${settings.hideHoverElements ? "checked" : ""}>
          <span class="kyso-toggle-slider"></span>
        </label>
      </div>

      <div class="kyso-settings-row kyso-settings-row--toggle">
        <label class="kyso-label">${t("hideTFT")}</label>
        <label class="kyso-toggle">
          <input id="kyso-hide-tft" type="checkbox" ${settings.hideTFT ? "checked" : ""}>
          <span class="kyso-toggle-slider"></span>
        </label>
      </div>

      <div class="kyso-settings-row kyso-settings-row--toggle">
        <label class="kyso-label">${t("hideSocialOnly")}</label>
        <label class="kyso-toggle">
          <input id="kyso-hide-social-only" type="checkbox" ${settings.hideSocialOnly ? "checked" : ""}>
          <span class="kyso-toggle-slider"></span>
        </label>
      </div>

      <div class="kyso-settings-row kyso-settings-row--toggle">
        <label class="kyso-label">${t("hideSocialPanel")}</label>
        <label class="kyso-toggle">
          <input id="kyso-hide-social" type="checkbox" ${settings.hideSocialPanel ? "checked" : ""}>
          <span class="kyso-toggle-slider"></span>
        </label>
      </div>

      <div class="kyso-settings-row kyso-settings-row--toggle">
        <label class="kyso-label">${t("enableHideNavbarBtn")}
          <span class="kyso-hint">${t("enableHideNavbarBtnHint")}</span>
        </label>
        <label class="kyso-toggle">
          <input id="kyso-enable-hide-navbar" type="checkbox" ${settings.enableHideNavbarBtn ? "checked" : ""}>
          <span class="kyso-toggle-slider"></span>
        </label>
      </div>

      <div class="kyso-settings-row kyso-settings-row--toggle kyso-settings-row--sub" id="kyso-blue-essence-row" ${settings.enableHideNavbarBtn ? "" : 'style="display:none"'}>
        <label class="kyso-label">${t("showBlueEssence")}</label>
        <label class="kyso-toggle">
          <input id="kyso-show-blue-essence" type="checkbox" ${settings.showBlueEssenceOnHide ? "checked" : ""}>
          <span class="kyso-toggle-slider"></span>
        </label>
      </div>

      <div class="kyso-settings-row kyso-settings-row--toggle">
        <label class="kyso-label">${t("enableHideSocialBtn")}
          <span class="kyso-hint">${t("enableHideSocialBtnHint")}</span>
        </label>
        <label class="kyso-toggle">
          <input id="kyso-enable-hide-social-btn" type="checkbox" ${settings.enableHideSocialBtn ? "checked" : ""}>
          <span class="kyso-toggle-slider"></span>
        </label>
      </div>
    </section>

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
    </section>


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

    <!-- Icon -->
    <section class="kyso-settings-section">
      <h3 class="kyso-settings-section-title">${ICONS.wizard}<span>${t("iconSection")}</span></h3>

      <div class="kyso-settings-row">
        <label class="kyso-label" for="kyso-icon-url">${t("iconUrl")}</label>
        <input id="kyso-icon-url" class="kyso-input" type="text"
          placeholder="${t("iconUrlPlaceholder")}"
          value="${settings.iconUrl || ""}">
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
        <button id="kyso-icon-crop" class="kyso-btn kyso-btn--secondary">${ICONS.scissors}<span>${t("cropButton")}</span></button>
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

    <!-- Save -->
    <div class="kyso-settings-footer">
      <button id="kyso-save-all" class="kyso-btn kyso-btn--save">${ICONS.save}<span>${t("saveAll")}</span></button>
      <span id="kyso-save-feedback" class="kyso-save-feedback"></span>
    </div>
  `;

  // ── Wiring de eventos ──────────────────────────────
  // Background – upload local. Estratégia em camadas:
  //   1. Vídeo:  NUNCA base64 (trava client). Mostra instrução p/ dropar
  //              arquivo em assets/ e colar caminho manualmente.
  //   2. Imagem: se < 2 MB, encoda dataURL (persiste em DataStore). Acima,
  //              instrui mesma estratégia do vídeo.
  const bgFileInput = panel.querySelector("#kyso-bg-file");
  const bgFilename = panel.querySelector("#kyso-bg-filename");
  const bgUrlInput = panel.querySelector("#kyso-bg-url");
  const bgPresetSelect = panel.querySelector("#kyso-bg-preset");
  const bgTypeSelect = panel.querySelector("#kyso-bg-type");

  // Preset escolhido → preenche URL + auto-detecta tipo
  bgPresetSelect.addEventListener("change", () => {
    const val = bgPresetSelect.value;
    if (!val) return;
    bgUrlInput.value = val;
    bgFilename.textContent = val.split("/").pop();
    bgTypeSelect.value = "auto";
  });

  // Open folder button
  const openFolderBtn = panel.querySelector("#kyso-bg-open-folder");
  if (openFolderBtn) {
    openFolderBtn.addEventListener("click", () => {
      try {
        if (window.openPluginsFolder) {
          window.openPluginsFolder(`${PLUGIN_NAME}/assets/Main`);
        }
      } catch (e) {
        console.error("[KysoTheme] openPluginsFolder não disponível:", e);
      }
    });
  }

  bgFileInput.addEventListener("change", () => {
    const file = bgFileInput.files[0];
    if (!file) return;
    bgFilename.textContent = file.name;

    const isVideo =
      file.type.startsWith("video/") ||
      /\.(mp4|webm|ogv|ogg)$/i.test(file.name);
    const tooBig = file.size > MAX_BASE64_BYTES;

    if (isVideo || tooBig) {
      // Mostra instrução e abre folder explorer p/ usuário.
      const suggested = pluginAsset(`Main/${file.name}`);
      bgUrlInput.value = suggested;
      // Auto-set type p/ video se for vídeo
      const typeSelect = panel.querySelector("#kyso-bg-type");
      if (isVideo) typeSelect.value = "video";
      showFeedback(
        panel,
        `Copie "${file.name}" para a pasta assets/Main/ e clique Aplicar. ` +
          `(${isVideo ? "vídeos" : "arquivos grandes"} não podem virar base64)`,
      );
      // Tenta abrir a pasta pra facilitar
      try {
        if (window.openPluginsFolder) {
          window.openPluginsFolder(`${PLUGIN_NAME}/assets/Main`);
        }
      } catch {}
      return;
    }

    // Imagem pequena → dataURL OK
    const reader = new FileReader();
    reader.onload = (e) => {
      bgUrlInput.value = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Background – aplicar
  panel.querySelector("#kyso-bg-apply").addEventListener("click", () => {
    const url = panel.querySelector("#kyso-bg-url").value.trim();
    const type = panel.querySelector("#kyso-bg-type").value;
    const s = {
      ...DEFAULTS,
      ...loadSettings(),
      backgroundUrl: url,
      backgroundType: type,
    };
    saveSettings(s);
    applyBackground(url, type);
    showFeedback(panel, t("bgApplied"));
  });

  // Background – remover
  panel.querySelector("#kyso-bg-reset").addEventListener("click", () => {
    panel.querySelector("#kyso-bg-url").value = "";
    bgFilename.textContent = t("noFile");
    const s = {
      ...DEFAULTS,
      ...loadSettings(),
      backgroundUrl: "",
      backgroundType: "auto",
    };
    saveSettings(s);
    applyBackground("", "auto");
    showFeedback(panel, t("bgRemoved"));
  });

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
  ];
  toggles.forEach(({ id, key }) => {
    panel.querySelector(`#${id}`).addEventListener("change", (e) => {
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

  // Ícone – upload local (abre o crop modal automaticamente)
  const iconFileInput = panel.querySelector("#kyso-icon-file");
  const iconFilename = panel.querySelector("#kyso-icon-filename");
  iconFileInput.addEventListener("change", () => {
    const file = iconFileInput.files[0];
    if (!file) return;
    iconFilename.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      openIconCropModal(dataUrl, (cropped) => {
        panel.querySelector("#kyso-icon-url").value = cropped;
      });
    };
    reader.readAsDataURL(file);
  });

  // Ícone – botão de crop (também usado para URL remota)
  panel.querySelector("#kyso-icon-crop").addEventListener("click", () => {
    const url = panel.querySelector("#kyso-icon-url").value.trim();
    if (!url) {
      showFeedback(panel, t("noFile"));
      return;
    }
    openIconCropModal(url, (cropped) => {
      panel.querySelector("#kyso-icon-url").value = cropped;
    });
  });

  // Ícone – aplicar
  panel.querySelector("#kyso-icon-apply").addEventListener("click", () => {
    const iconUrl = panel.querySelector("#kyso-icon-url").value.trim();
    const iconAllPlayers = panel.querySelector(
      "#kyso-icon-all-players",
    ).checked;
    const s = { ...DEFAULTS, ...loadSettings(), iconUrl, iconAllPlayers };
    saveSettings(s);
    applyIcon(iconUrl, iconAllPlayers);
    showFeedback(panel, t("iconApplied"));
  });

  // Ícone – remover
  panel.querySelector("#kyso-icon-reset").addEventListener("click", () => {
    panel.querySelector("#kyso-icon-url").value = "";
    iconFilename.textContent = t("noFile");
    const s = {
      ...DEFAULTS,
      ...loadSettings(),
      iconUrl: "",
      iconAllPlayers: panel.querySelector("#kyso-icon-all-players").checked,
    };
    saveSettings(s);
    applyIcon("");
    showFeedback(panel, t("iconRemoved"));
  });

  // Salvar tudo
  panel.querySelector("#kyso-save-all").addEventListener("click", () => {
    const prev = { ...DEFAULTS, ...loadSettings() };
    const s = {
      backgroundUrl: panel.querySelector("#kyso-bg-url").value.trim(),
      backgroundType: panel.querySelector("#kyso-bg-type").value,
      hideRP: panel.querySelector("#kyso-hide-rp").checked,
      hideHoverElements: panel.querySelector("#kyso-show-hover").checked,
      hideTFT: panel.querySelector("#kyso-hide-tft").checked,
      hideSocialOnly: panel.querySelector("#kyso-hide-social-only").checked,
      hideSocialPanel: panel.querySelector("#kyso-hide-social").checked,
      fontUrl: panel.querySelector("#kyso-font-url").value.trim(),
      fontFamily: panel.querySelector("#kyso-font-family").value.trim(),
      iconUrl: panel.querySelector("#kyso-icon-url").value.trim(),
      iconAllPlayers: panel.querySelector("#kyso-icon-all-players").checked,
      enableHideNavbarBtn: panel.querySelector("#kyso-enable-hide-navbar")
        .checked,
      navbarHidden: prev.navbarHidden, // preserva estado de runtime
      showBlueEssenceOnHide: panel.querySelector("#kyso-show-blue-essence")
        .checked,
      accentColor: panel.querySelector("#kyso-accent-input").value,
      accentAuto: panel.querySelector("#kyso-color-auto").checked,
      enableHideSocialBtn: panel.querySelector("#kyso-enable-hide-social-btn")
        .checked,
      socialHidden: prev.socialHidden,
    };
    saveSettings(s);
    applyAllSettings(s);
    showFeedback(panel, t("saveAllDone"));
  });

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
const SETTINGS_SENTINEL =
  "div.lol-settings-content > settings-plugin-navigation-bar";

let injected = false;

function tryInjectSettingsTab() {
  if (injected) return;

  // Verifica se a janela de Settings está aberta
  const navPlugin = document.querySelector(SETTINGS_SENTINEL);
  if (!navPlugin) return;

  // Verifica se já existe nossa aba
  if (document.querySelector(".kyso-nav-item")) return;

  // Encontra a segunda lol-uikit-navigation-bar (a de seções, não a de abas)
  const scrollable = navPlugin.querySelector("lol-uikit-scrollable");
  if (!scrollable) return;

  const navBars = scrollable.querySelectorAll("lol-uikit-navigation-bar");
  // Usa a última barra de nav encontrada (a que contém os itens de seção)
  const navBar = navBars[navBars.length - 1] ?? navBars[0];
  if (!navBar) return;

  const settingsContent = document.querySelector(".lol-settings-content");
  if (!settingsContent) return;

  // Retorna sempre os filhos DIRETOS que não são o nav plugin nem nosso painel.
  const getNativeChildren = () =>
    Array.from(settingsContent.children).filter(
      (el) =>
        el.tagName.toLowerCase() !== "settings-plugin-navigation-bar" &&
        el.id !== "kyso-settings-content",
    );

  // ── Cria o item de navegação ──
  const kysoNavItem = document.createElement("lol-uikit-navigation-item");
  kysoNavItem.className = "kyso-nav-item";
  kysoNavItem.setAttribute("data-id", "kyso-theme");

  const navLabel = document.createElement("div");
  navLabel.className = "kyso-nav-label";
  navLabel.textContent = "KysoTheme";
  kysoNavItem.appendChild(navLabel);

  navBar.appendChild(kysoNavItem);

  // ── Cria o painel de conteúdo como filho DIRETO de settingsContent ──
  const kysoContent = document.createElement("div");
  kysoContent.id = "kyso-settings-content";
  kysoContent.className = "kyso-settings-content-wrapper";
  kysoContent.style.display = "none";
  kysoContent.appendChild(buildSettingsPanel());
  settingsContent.appendChild(kysoContent);

  kysoNavItem.addEventListener("click", () => {
    navBar.querySelectorAll("lol-uikit-navigation-item").forEach((item) => {
      item.removeAttribute("active");
    });
    kysoNavItem.setAttribute("active", "");

    // Esconde TODOS os filhos diretos nativos e exibe o nosso
    getNativeChildren().forEach((el) => {
      el.style.display = "none";
    });
    kysoContent.style.display = "flex";
  });

  // Quando qualquer outro item for clicado, restaura o conteúdo nativo
  navBar
    .querySelectorAll("lol-uikit-navigation-item:not(.kyso-nav-item)")
    .forEach((item) => {
      item.addEventListener("click", () => {
        kysoNavItem.removeAttribute("active");
        kysoContent.style.display = "none";
        getNativeChildren().forEach((el) => {
          el.style.display = "";
        });
      });
    });

  injected = true;
  console.log("[KysoTheme] Aba de configurações injetada com sucesso.");
}

// ─────────────────────────────────────────────
//  Migração de chaves legacy → triples Source/Local/Web (PR A)
// ─────────────────────────────────────────────
// Roda 1x no boot dentro de initSettingsPage. Idempotente: re-rodar com chaves
// novas presentes é no-op para essas chaves.
function migrateSettings(saved) {
  if (!saved || typeof saved !== "object") return saved;
  const out = { ...saved };

  // Remove chave descontinuada
  if (out.iconAllPlayers !== undefined) delete out.iconAllPlayers;

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

  // Profile icon: derive from legacy iconUrl
  if (out.iconUrl && out.profileIconSource === undefined) {
    if (out.iconUrl.startsWith(ASSETS_PREFIX)) {
      out.profileIconSource = "local";
      out.profileIconLocal = out.iconUrl.slice(ASSETS_PREFIX.length);
    } else {
      out.profileIconSource = "web";
      out.profileIconWeb = out.iconUrl;
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

  applyAllSettings(saved);

  // Observa o DOM para detectar quando a janela de Settings abre
  const observer = new MutationObserver(() => {
    tryInjectSettingsTab();

    // Se a janela foi fechada, reseta o flag para reinjetar na próxima abertura
    if (!document.querySelector(SETTINGS_SENTINEL)) {
      injected = false;
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
