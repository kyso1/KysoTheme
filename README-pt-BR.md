<div align="center">

# Kyso UI Editor

![image](https://github.com/user-attachments/assets/b0932804-79ab-458e-b8cc-dc776ef4258a)

**Um tema limpo, minimalista e profundamente customizável para o cliente do League of Legends.**  
Construído para [Pengu Loader](https://pengu.lol) — configure tudo sem precisar editar nenhum arquivo.

<br>

[![Version](https://img.shields.io/badge/version-3.5.1-blue?style=for-the-badge&logo=github)](https://github.com/kyso1/KysoTheme/releases)
[![Pengu Loader](https://img.shields.io/badge/Pengu%20Loader-0.5.0%2B-purple?style=for-the-badge)](https://pengu.lol)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

<br>

[🇺🇸 English](README.MD) &nbsp;&bull;&nbsp; [🇧🇷 Português](README-pt-BR.md)

</div>

---

## ✨ Visão Geral

KysoTheme transforma o cliente do League of Legends em uma experiência mais limpa e pessoal. A **linha v3.x** traz um **painel de configurações nativo** completo, além de abas dedicadas **UI Editor** e **Player Assets** — onde você altera papéis de parede, cores, fontes, ícones, layouts, controles granulares de ocultar/mostrar e substitui os rankings, tudo em um só lugar. Todo comportamento tem um botão de ativar/desativar; não há nada travado ou forçado.

> **Sem edições de arquivo. Sem reinicializações. Apenas abra Configurações → KysoTheme.**

---

## 🆕 O que há de novo

### 🏷️ v3.5.1 (Patch/Fixes)
Esta atualização foca em corrigir o funcionamento da função "Self-Only" (que restringe as edições de perfil apenas à sua própria tela).
- **Detecção do próprio perfil (Self-Only)**: Corrigido para usar os atributos mais precisos `summoner-id`/`puuid` na identificação do perfil, ao invés do nome de usuário.
- **Verificação por superfície**: Agora o plugin verifica a posse do perfil de forma separada quando há múltiplos perfis abertos na memória do cliente, prevenindo conflitos e bugs visuais.
- **Guarda de Identidade do Emblema**: Corrigido o `applyCrest` para que a checagem de "Self-Only" seja reexecutada assim que seu ID local for confirmado. Evitando que o seu emblema apareça no perfil de amigos.

<details>
<summary><b>Ver versões anteriores (v3.5, v3.4, v3.1...)</b></summary>

### v3.5 — Ícone na barra superior instantâneo, perfil self-only e novos botões
- O seu **ícone de perfil customizado** agora atualiza o **avatar da barra superior** instantaneamente ao aplicar — sem precisar recarregar.
- Novo botão: **Trocar ícone de maestria (Swap mastery icon)** — substitui também o ícone de maestria do campeão pelo seu ícone de perfil (desativado por padrão).
- Novo botão: **Esquema de cores da Liga (League color scheme)** — mantém os botões estilizados, mas recolore a interface para a paleta dourada nativa do League (desativado por padrão).
- Correção: o emblema ranqueado, a pontuação de maestria e o fundo transparente agora aplicam-se **apenas ao seu próprio perfil**, e nunca aos perfis de outros jogadores.

### v3.4 — Ícone customizado no lobby e no grupo
- Seu **ícone de perfil customizado** agora também aparece no seu **espaço de jogador no lobby** e na **bandeira de grupo** — sincronizado apenas com você (via puuid / marcador local), de modo que os ícones dos colegas de time nunca sejam alterados.

### v3.1 — Kyso UI Editor
- Renomeado para **Kyso UI Editor** com uma **janela de boas-vindas na primeira inicialização**.
- Comportamentos antes permanentes viraram botões independentes: botão de jogar, banner de perfil, botões de configurações, transparência do fundo do perfil, barra deslizante de desfoque social, posicionamento do ícone de perfil e sincronização da barra de navegação.

### v3.2 — Aba UI Editor + expansão do Player Assets
- **Aba UI Editor** com uma **barra de pesquisa em tempo real** que filtra os controles pelo nome.
- **Botões granulares de mostrar/ocultar** (cada elemento que antes desbotava ao passar o mouse agora possui um controle próprio): chat, convites, notificações, anel de XP, status, ações sociais, versão do patch, etc.
- **Botões de efeitos visuais** — remoção do desfoque do cliente, cobertura de tom na loja, animação de partida encontrada e brilho.
- **Fundos independentes por tela** — imagens próprias para as telas de Coleções, Seleção de Campeões, Runas e Alternador de Modos de jogo.

### Substituição de ranque e emblema (Rank crest override)
- Altere a sua exibição de ranque para qualquer tier (**Ferro → Desafiante**) com um seletor de **divisão (I–IV)**.
- **Substituição de dicas de ranking**: rescreve o texto de ranque e também possui uma opção para substituir a pontuação atual (**PDL**).

### v3.3 — Substituição de Hovercard de Regalia (apenas local/self-only)
O "Hovercard" (aquele cartão flutuante exibido no seu perfil) agora segue o rank que você escolher — **apenas no seu próprio cartão**:
- Arte do emblema (asas, placas, divisões), o **mini ícone do ranking**, e o **texto "Tier"** mudam para acompanhar o escolhido.
- A **pontuação de maestria** também espelha o valor escolhido em **PDL**.
- Novo **fundo (backdrop) do hovercard** — escolha e corte uma imagem com a nova ferramenta de recorte (crop).

</details>

---

## 📋 Requisitos

| Requisito                         | Versão            |
| --------------------------------- | ----------------- |
| [Pengu Loader](https://pengu.lol) | 0.5.0 ou superior |
| League of Legends                 | Qualquer patch    |

---

## 📦 Instalação

1. Baixe o release mais recente na página **[Releases](https://github.com/kyso1/KysoTheme/releases)**.
2. Extraia na pasta de plugins do seu Pengu Loader:

```
(Raiz do Pengu)/
└── plugins/
    └── KysoTheme/       ← extrair aqui
        ├── assets/
        ├── main-theme/
        ├── utilsCss/
        ├── utilsImg/
        ├── index.js
        ├── settingsPage.js
        └── ...
```

3. Abra (ou reinicie) o cliente do League — o KysoTheme carregará automaticamente.

> ⚠️ Se o tema não carregar, verifique se o Pengu Loader está ativo e se o nome da pasta extraída é exatamente `KysoTheme`.

---

## 🚀 Funcionalidades

### ⚙️ Página Nativa de Configurações

Um painel completo integrado diretamente na tela de configurações do cliente do League.  
Sem programas externos e sem configurações por arquivo.

**Como abrir:** `Configurações (ícone de engrenagem) → KysoTheme`

---

### 🎨 Recursos do Jogador (Player Assets)

Um painel unificado em uma **aba própria** — mude todas as imagens, ícones e vídeos renderizados pelo cliente em um só lugar. Cada ativo conta com as opções **Local / Web**: onde você pode escolher no modo "Local" entre as imagens contidas no diretório (em grade) ou no modo "Web" colar a URL de uma imagem/GIF qualquer.

| Ativo (Asset)          | O que ele faz                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| **Background**         | Fundo principal do cliente — imagens, GIFs animados ou vídeos (`.mp4` / `.webm`)                     |
| **Banner**             | Substitui o seu banner de regalia na tela de perfil                                                  |
| **Crest (Emblema)**    | Substitui a moldura do ícone de perfil **ou muda a exibição do seu ranking** de (Ferro → Desafiante) |
| **Tela de Loading**    | Imagem de fundo no carregamento **e** no ícone de círculo (quando vai entrar no jogo)                |
| **Ícone de Perfil**    | Substitui o ícone nativo pelo ícone de sua preferência (pode escolher se aplica aos outros)          |
| **Hovercard backdrop** | Imagem de fundo atrás do "cartão de perfil (hovercard)" com ferramenta de recorte dinâmico           |

**Troca Rápida entre Local / Web:**
- **Local** — grade com todos os arquivos declarados no `assets/manifest.json`. Solte um arquivo, adicione na linha e estará pronto.
- **Web** — cole qualquer URL. Útil para imagens no Discord, Imgur, etc.

**Exemplo de Manifest** (`assets/manifest.json`):

```json
{
  "categories": {
    "crests": [
      { "label": "Diamante", "path": "//plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblems/emblem-diamond.png" },
      { "label": "Meu customizado", "path": "Crests/custom.png" }
    ]
  }
}
```

O manifesto aceita rotas da pasta `assets/` **ou** caminhos completos.

**Formatos Suportados:** `.jpg` `.png` `.webp` `.gif` `.mp4` `.webm`

---

### 🎨 Cor de Destaque (Accent Color)

Mude a cor de destaque (bordas, botões, barras) usando um código de cor (Hex), com atualização automática da interface.

- 🎨 **Seletor Hex customizado**
- 🤖 **Auto-extração** — puxa automaticamente a cor predominante do seu wallpaper atual.
- 🎛️ **Predefinições (Presets)** — cores já prontas em 1 clique.
- 🔄 **Redefinir para Branco** — restaura o visual original da cor a qualquer momento.

#### 🌫️ Efeitos Visuais (CSS filters no fundo)

Barras deslizantes dentro do painel para modificar rapidamente o visual geral:

| Efeito (Effect) | Intervalo   |
| --------------- | ----------- |
| **Blur**        | 0 – 20 px   |
| **Brightness**  | 50 – 200 %  |
| **Saturation**  | 0 – 200 %   |
| **Contrast**    | 50 – 200 %  |

Cada ajuste salva na hora; um clique no botão **Redefinir efeitos** restaura tudo.

---

### 🔤 Customização de Fonte (Font)

Substitui a fonte padrão do cliente do League pela que você desejar.

- **Google Fonts** — cole uma URL do [fonts.google.com](https://fonts.google.com)
- **Envio local** — envie arquivos `.ttf`, `.otf`, ou `.woff2` diretamente do seu PC
- **Fontes do Sistema** — digite o nome de fontes instaladas em sua máquina.
- **Remover** — remove e restaura a fonte nativa instantaneamente.

---

### 🪪 Ícone de Perfil (com ferramenta de recorte)

Defina um ícone completamente diferente.

- **URL Remoto** — qualquer imagem via internet.
- **Envio Local** — direto do seu PC.
- **Ferramenta de recorte interna** — um "crop overlay" com dimensão 1:1, deixando seu ícone sempre no enquadramento.
- **Apply to all players (Aplicar para todos)** — quando **OFF**, altera apenas a sua tela; Quando **ON**, altera também os ícones de todos que você vê no cliente (css global).

---

### 🎨 Animações RGB

Vá além da cor estática. Anime seu cliente através de rotações de cores RGB, ótimo para streamers:

| Modo               | O que faz                                                          |
| ------------------ | ------------------------------------------------------------------ |
| **Static**         | Cor fixa                                                           |
| **Rainbow cycle**  | Rotação contínua (estilo arco-íris) no ciclo de cores              |
| **Fade L→R**       | Degradê horizontal animado                                         |
| **Blink**          | Pisca entre a cor original e a atual                               |
| **Spiral fade**    | Transição de espiral colorida                                      |

O ajuste compartilha um controle deslizante de **velocidade** (limitado a ~20 fps para poupar o processador).

---

### 👁️ Controles de Visibilidade

Modifique o que será exibido ou escondido.

| Botão                          | O que faz                                                     |
| ------------------------------ | ------------------------------------------------------------- |
| **Hide RP**                    | Esconde o saldo de RP da loja e barra do topo                 |
| **Always show hover elements** | Mantém sempre visível missões, chat, perfil e status          |
| **Hide TFT (hover mode)**      | Esconde a navegação do TFT e só exibe ao passar o mouse.      |
| **Hide social panel only**     | Minimiza a aba de amigos caso o mouse não esteja lá           |
| **Hide social + right nav**    | Esconde tanto a lista de amigos, quanto a barra de navegação  |

---

### 🚪 Abas Deslizantes (Sliding-Door)

Duas barras invisíveis de forma nativa para dar uma aparência limpa e enxuta:

- **Ocultador da Navbar** — botão estreito vertical que oculta todo o topo.
- **Ocultador do painel social** — botão estreito lateral para guardar o menu social/amigos.

Ambos os status são memorizados pelo próprio Pengu e Client.

---

### 🌍 Suporte Multilíngue (Multi-Language)

A página de configuração e componentes é traduzida e lida a partir das preferências do seu cliente LoL.

<div align="center">

🇺🇸 English &nbsp;|&nbsp; 🇧🇷 Português &nbsp;|&nbsp; 🇪🇸 Español &nbsp;|&nbsp; 🇩🇪 Deutsch &nbsp;|&nbsp; 🇯🇵 日本語 &nbsp;|&nbsp; 🇰🇷 한국어

</div>

---

### 🔧 Nos Bastidores (Under the Hood)

| Recurso                   | Descrição                                                                       |
| ------------------------- | ------------------------------------------------------------------------------- |
| **Profile Skin Unlocker** | Libera todas as splash-arts (skins) no seu painel para escolher a vontade.      |
| **Auto Accept**           | Aceita automaticamente quando encontrarem uma partida.                          |
| **Blur Scrubber**         | Remoção forçada do filtro CSS de desfoque para um visual chapado ou limpo.      |
| **Persistent settings**   | Tudo salvo e memorizado no cache e reiniciado automaticamente ao abrir.         |
| **Home button**           | Um ícone de "Home" nativo no canto superior-esquerdo, ao lado do botão de Play. |

---

## ❓ FAQ (Perguntas Frequentes)

**P: O tema carregou, mas não vejo a guia de configurações.**  
R: Verifique se o Pengu Loader está atualizado (0.5.0+). A guia é carregada junto do cliente — tente reiniciá-lo.

**P: Meu vídeo de fundo não está carregando.**  
R: O formato de vídeo muitas vezes precisa ficar no caminho `assets/Main/` ou usando a URL interna completa `//plugins/KysoTheme/assets/Main/video.mp4` para carregar.

**P: É possível usar esse tema junto com outros plugins do Pengu Loader?**  
R: Sim! O KysoTheme foi projetado para conviver em harmonia com outros scripts e plugins sem conflito.

---

## 🤝 Contribuindo

Pull requests, correções de bugs, traduções adicionais ou novas funcionalidades são sempre bem-vindas na página do [GitHub](https://github.com/kyso1/KysoTheme).

---

<div align="center">

Feito com ❤️ por **kyso1** &nbsp;·&nbsp; Construído para [Pengu Loader](https://pengu.lol)

</div>
