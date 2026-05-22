function Et(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default")
    ? f.default
    : f;
}
function At(f, C, d) {
  return (
    (d = {
      path: C,
      exports: {},
      require: function (N, S) {
        return Tt(N, S == null ? d.path : S);
      },
    }),
    f(d, d.exports),
    d.exports
  );
}
function Tt() {
  throw new Error(
    "Dynamic requires are not currently supported by @rollup/plugin-commonjs"
  );
}
var Pt = At(function (f) {
    var C = Object.create,
      d = Object.defineProperty,
      N = Object.getOwnPropertyDescriptor,
      S = Object.getOwnPropertyNames,
      lt = Object.getPrototypeOf,
      ht = Object.prototype.hasOwnProperty,
      ct = (e, t, i) =>
        t in e
          ? d(e, t, {
              enumerable: !0,
              configurable: !0,
              writable: !0,
              value: i,
            })
          : (e[t] = i),
      a = (e, t) => d(e, "name", { value: t, configurable: !0 }),
      ut = (e, t) => () => (
        t || e((t = { exports: {} }).exports, t), t.exports
      ),
      pt = (e, t, i, s) => {
        if ((t && typeof t == "object") || typeof t == "function")
          for (let o of S(t))
            !ht.call(e, o) &&
              o !== i &&
              d(e, o, {
                get: () => t[o],
                enumerable: !(s = N(t, o)) || s.enumerable,
              });
        return e;
      },
      dt = (e, t, i) => (
        (i = e != null ? C(lt(e)) : {}),
        pt(
          t || !e || !e.__esModule
            ? d(i, "default", { value: e, enumerable: !0 })
            : i,
          e
        )
      ),
      n = (e, t, i) => (ct(e, typeof t != "symbol" ? t + "" : t, i), i),
      z = (e, t, i) => {
        if (!t.has(e)) throw TypeError("Cannot " + i);
      },
      h = (e, t, i) => (
        z(e, t, "read from private field"), i ? i.call(e) : t.get(e)
      ),
      p = (e, t, i) => {
        if (t.has(e))
          throw TypeError("Cannot add the same private member more than once");
        t instanceof WeakSet ? t.add(e) : t.set(e, i);
      },
      g = (e, t, i) => (z(e, t, "access private method"), i),
      mt = ut((e, t) => {
        t.exports = {
          displayName: "AutoAccept",
          name: "autoaccept",
          version: "1.0.15",
          author: "Sakurasou",
        };
      }),
      y = new Map(),
      w,
      $,
      W,
      L,
      gt =
        ((L = class {
          constructor(e, t, i) {
            p(this, $),
              n(this, "endpoint"),
              n(this, "ws"),
              p(this, w, new Map()),
              (this.endpoint = e),
              this.set(t, i);
            let s = document.querySelector(
              'link[rel="riot:plugins:websocket"]'
            ).href;
            return (
              (this.ws = new WebSocket(s, "wamp")),
              (this.ws.onopen = () =>
                this.ws.send(
                  JSON.stringify([5, "OnJsonApiEvent" + e.replace(/\//g, "_")])
                )),
              (this.ws.onmessage = g(this, $, W).bind(this)),
              this
            );
          }
          has(e) {
            return h(this, w).has(e);
          }
          set(e, t) {
            return h(this, w).set(e, t), e;
          }
          delete(e) {
            h(this, w).delete(e),
              h(this, w).size === 0 &&
                (this.ws.close(), y.delete(this.endpoint));
          }
        }),
        (w = new WeakMap()),
        ($ = new WeakSet()),
        (W = a(function (e) {
          for (let t of h(this, w).values()) t(e);
        }, "#onmessage")),
        a(L, "Subscription"),
        L);
    function I(e, t, i) {
      return y.has(e)
        ? y.get(e).has(t)
          ? !0
          : y.get(e).set(t, i)
        : (y.set(e, new gt(e, t, i)), !1);
    }
    a(I, "subscribe");
    function G(e, t) {
      y.has(e) && y.get(e).has(t) && y.get(e).delete(t);
    }
    a(G, "unsubscribe");
    var ft = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    async function F(e, t = ft) {
      var i;
      try {
        let s = await fetch(e, t);
        return (
          (i = s.headers.get("content-type")) == null
            ? void 0
            : i.includes("application/json")
        )
          ? await s.json()
          : Promise.resolve(null);
      } catch {
        return Promise.resolve(null);
      }
    }
    a(F, "FetchJSON");
    function M(e) {
      return new Promise((t) => setTimeout(t, e));
    }
    a(M, "sleep");
    function v(e) {
      return document.querySelector(e);
    }
    a(v, "select"),
      (Promise.prototype.cancelled = !1),
      (Promise.prototype.cancel = function () {
        this.cancelled = !0;
      });
    function k(e, t = 1 / 0, i = null) {
      let s = new Promise((o, r) => {
        let l = performance.now(),
          c = a(() => {
            if (s.cancelled) {
              r("Cancelled");
              return;
            }
            if (e()) {
              o(i ? i(e()) : e());
              return;
            }
            if (performance.now() - l >= t) {
              r("Timeout");
              return;
            }
            requestAnimationFrame(c);
          }, "checkCondition");
        requestAnimationFrame(c);
      });
      return s;
    }
    a(k, "waitUntil");
    function K(e, t = !0) {
      k(() => document.body).then(() => {
        if (t) {
          let i = document.createElement("link");
          i.setAttribute("rel", "stylesheet"),
            i.setAttribute("href", e),
            document.body.appendChild(i);
        } else {
          let i = document.createElement("style");
          i.setAttribute("type", "text/css"),
            (i.innerHTML = e),
            document.body.appendChild(i);
        }
      });
    }
    a(K, "addCSS");
    var B = class {
      constructor(t, i) {
        n(this, "prefix"),
          n(this, "style"),
          n(this, "enabled"),
          (this.prefix = t),
          (this.style = i),
          (this.enabled = !1);
      }
      log(...t) {
        switch (typeof t[0]) {
          case "object":
            console.log(
              `${this.prefix}%c ${t[0][0]}`,
              this.style,
              "",
              t[0][1],
              ...t.slice(1)
            );
            break;
          case "string":
            console.log(this.prefix, this.style, ...t);
            break;
        }
      }
      info(...t) {
        if (this.enabled)
          switch (typeof t[0]) {
            case "object":
              console.info(
                `${this.prefix}%c ${t[0][0]}`,
                this.style,
                "",
                t[0][1],
                ...t.slice(1)
              );
              break;
            case "string":
              console.info(this.prefix, this.style, ...t);
              break;
          }
      }
      warn(...t) {
        if (this.enabled)
          switch (typeof t[0]) {
            case "object":
              console.warn(
                `${this.prefix}%c ${t[0][0]}`,
                this.style,
                "",
                t[0][1],
                ...t.slice(1)
              );
              break;
            case "string":
              console.warn(this.prefix, this.style, ...t);
              break;
          }
      }
      error(...t) {
        if (this.enabled)
          switch (typeof t[0]) {
            case "object":
              console.error(
                `${this.prefix}%c ${t[0][0]}`,
                this.style,
                "",
                t[0][1],
                ...t.slice(1)
              );
              break;
            case "string":
              console.error(this.prefix, this.style, ...t);
              break;
          }
      }
    };
    a(B, "Logger");
    var J = B,
      U = class {
        constructor() {
          n(this, "open", !1),
            n(this, "type"),
            n(this, "target"),
            n(this, "menu"),
            n(this, "optionsHolder");
        }
        addOptions(t) {
          if (!(!this.open || !this.optionsHolder))
            for (let i of t) {
              if (i.type !== this.type) continue;
              let s = document.createElement("div");
              (s.className = "menu-item"),
                (s.textContent = i.text),
                this.optionsHolder.insertBefore(
                  s,
                  this.optionsHolder.children[i.index]
                ),
                s.addEventListener("click", () => {
                  x.playSound(
                    "fe/lol-uikit/sfx-uikit-click-generic.ogg",
                    "sfx"
                  ),
                    i.callback(this.target),
                    this.menu.blur();
                });
            }
        }
      };
    a(U, "ContextMenu");
    var yt = U,
      X = class {
        constructor(t, i) {
          n(this, "name"),
            n(this, "group"),
            n(this, "titleKey"),
            n(this, "routeName"),
            n(this, "loginStatus"),
            n(this, "requireLogin"),
            n(this, "forceDisabled"),
            n(this, "computeds"),
            n(this, "isEnabled"),
            (this.name = t),
            (this.group = i),
            (this.loginStatus = !0),
            (this.requireLogin = !1),
            (this.forceDisabled = !1),
            (this.computeds = { disabled: !1 }),
            (this.isEnabled = () => !0),
            (this.titleKey = `MTZ_${t}`),
            (this.routeName = `MTZ-${t}`);
        }
        addSetting(t) {
          return this;
        }
      };
    a(X, "Category");
    var bt = X,
      Y = class {
        constructor(t, i, s, o) {
          n(this, "Settings"),
            n(this, "name"),
            n(this, "titleKey"),
            n(this, "capitalTitleKey"),
            n(this, "categories"),
            (this.Settings = t),
            (this.name = i),
            (this.titleKey = s),
            (this.capitalTitleKey = o),
            (this.categories = []);
        }
        addCategory(t) {
          let i = new bt(t, this);
          return (
            this.categories.push(i),
            this.Settings.routes.unshift(i.routeName),
            this.Settings.translations.set(i.titleKey, t),
            i
          );
        }
      };
    a(Y, "Group");
    var wt = Y,
      Q,
      O,
      V,
      tt = class {
        constructor() {
          p(this, Q),
            p(this, O),
            n(this, "routes", []),
            n(this, "groups", []),
            n(
              this,
              "translations",
              new Map([
                ["MTZ_Title", "MTZ"],
                ["MTZ_Title_Capital", "MTZ"],
                ["MTZ_General", "General"],
              ])
            );
        }
        addCategory(t) {
          return g(this, O, V).call(this, "MTZ").addCategory(t);
        }
        init(t) {}
        build(t, i) {
          t.addTemplate(
            "MTZ-General",
            i.HTMLBars.template({
              id: "MTZ-General",
              block: JSON.stringify({
                statements: [],
                locals: [],
                named: [],
                yields: [],
                blocks: [],
                hasPartials: !1,
              }),
              meta: {},
            })
          );
        }
        translate(t) {
          let { translations: i } = this,
            s = t.tra(),
            o = s.__proto__.get;
          s.__proto__.get = function (r) {
            var l;
            return (l = i.get(r)) != null ? l : o.apply(this, arguments);
          };
        }
      };
    (Q = new WeakSet()),
      a(function (e, t, i) {
        let s = new wt(this, e, t, i);
        return this.groups.unshift(s), s;
      }, "#addGroup"),
      (O = new WeakSet()),
      (V = a(function (e) {
        return this.groups.find((t) => t.name === e);
      }, "#getGroup")),
      a(tt, "Settings");
    var vt = tt,
      et = class {
        constructor({
          parent: t,
          name: i,
          className: s,
          disabled: o = a(() => !1, "disabled"),
          tooltip: r = "",
          onEnable: l = a(() => {}, "onEnable"),
          onDisable: c = a(() => {}, "onDisable"),
          onToggle: u = a(() => {}, "onToggle"),
        }) {
          if (
            (n(this, "parent"),
            n(this, "name"),
            n(this, "className"),
            n(this, "disabled"),
            n(this, "tooltip"),
            n(this, "onEnable"),
            n(this, "onDisable"),
            n(this, "onToggle"),
            n(
              this,
              "toggleSFX",
              "/fe/lol-parties/sfx-parties-button-toggle.ogg"
            ),
            !t)
          )
            throw new Error("Toggle: No parent specified");
          if (!i) throw new Error("Toggle: No name specified");
          if (!s) throw new Error("Toggle: No className specified");
          return (
            (this.parent = t),
            (this.name = i),
            (this.className = s),
            (this.disabled = o),
            (this.tooltip = r),
            (this.onEnable = l.bind(this)),
            (this.onDisable = c.bind(this)),
            (this.onToggle = u.bind(this)),
            this.init(),
            DataStore.get(`MTZ.${this.name}`) || !1
              ? this.onEnable()
              : this.onDisable(),
            this
          );
        }
        async init() {
          if (v(`#${this.name}`)) return;
          let t = DataStore.get(`MTZ.${this.name}`) || !1,
            i = this.createButton(t),
            s = i.querySelector(`.${i.className}-wrapper`),
            o = i.querySelector(".toggle-container");
          v(this.parent).insertAdjacentElement("beforebegin", i),
            this.tooltip && new xt("system", o, i, this.tooltip, !0, 200, 300),
            o.addEventListener("click", async () => {
              s.classList.contains("disabled") ||
                s.classList.contains("is-animating") ||
                (DataStore.set(`MTZ.${this.name}`, (t = !t)),
                o.setAttribute(
                  "class",
                  "toggle-container animated is-animating"
                ),
                x.playSound(this.toggleSFX, "sfx"),
                s.setAttribute(
                  "class",
                  `${i.className}-wrapper ${t ? "closed right" : "open"}`
                ),
                await M(100),
                this.onToggle(t),
                t ? this.onEnable() : this.onDisable(),
                s.setAttribute(
                  "class",
                  `${i.className}-wrapper ${t ? "open right" : "closed"}`
                ),
                await M(300),
                o.setAttribute("class", "toggle-container animated"));
            });
        }
        createButton(t) {
          let i = document.createElement("div");
          (i.id = this.name), (i.className = this.className + "-toggle");
          let s = document.createElement("div");
          s.className = `${i.className}-wrapper ${
            t ? "open right" : "closed"
          } ${this.disabled() ? "disabled" : ""}`;
          let o = document.createElement("div");
          o.className = "toggle-container animated";
          let r = document.createElement("div");
          r.className = "open";
          let l = document.createElement("div");
          return (
            (l.className = "toggle-button animated"),
            o.appendChild(r),
            o.appendChild(l),
            s.appendChild(o),
            i.appendChild(s),
            i
          );
        }
      };
    a(et, "Toggle");
    var St = et,
      it = class {
        constructor(t, i, s, o, r = !1, l = 200, c = 200) {
          n(this, "type"),
            n(this, "element"),
            n(this, "tooltipHolder"),
            n(this, "text"),
            n(this, "fading"),
            n(this, "ms"),
            n(this, "delay"),
            n(this, "timeout"),
            n(this, "tooltip"),
            n(this, "tooltipInner"),
            (this.type = t),
            (this.element = i),
            (this.tooltipHolder = s),
            (this.text = o),
            (this.fading = r),
            (this.ms = l),
            (this.delay = c);
          let u = document.createElement("div");
          u.setAttribute("class", "tooltip"),
            u.setAttribute("id", "lol-uikit-tooltip-root"),
            u.setAttribute("mtz", "");
          let T = document.createElement("div");
          T.setAttribute("type", this.type), u.appendChild(T);
          let P = document.createElement("lol-uikit-tooltip");
          P.setAttribute("type", this.type),
            P.setAttribute("data-tooltip-position", "bottom"),
            T.appendChild(P);
          let H = document.createElement("lol-uikit-content-block");
          H.setAttribute(
            "type",
            this.type === "system" ? "tooltip-small" : "tooltip-system"
          ),
            P.appendChild(H);
          let rt = document.createElement("p");
          (rt.innerHTML = this.text),
            H.appendChild(rt),
            (this.tooltip = u),
            (this.tooltipInner = T),
            this.element.addEventListener("mouseenter", () => {
              this.timeout = setTimeout(() => this.update(), this.delay);
            }),
            this.element.addEventListener("mouseleave", () => {
              clearTimeout(this.timeout), this.fade(!1, !0);
            });
        }
        exists() {
          return document.querySelector(".tooltip[mtz]");
        }
        fade(t = !0, i = !1) {
          return new Promise((s) => {
            let o = t ? 0 : 1,
              r = (1e3 / 120) * 0.02,
              l = t ? r : -r;
            this.tooltipInner.style.opacity = `${o}`;
            let c = setInterval(() => {
              var u;
              (o += l),
                (this.tooltipInner.style.opacity = `${o}`),
                (o <= 0 || o >= 1) &&
                  (clearInterval(c),
                  i && ((u = this.tooltip) == null || u.remove()),
                  s());
            }, this.ms * r);
          });
        }
        update() {
          let t = this.tooltipHolder.getBoundingClientRect(),
            [i, s] =
              this.type == "top"
                ? [t.x - t.width - 7, t.y + t.height]
                : [t.x - t.width / 2, t.y + t.height];
          this.tooltipInner.setAttribute(
            "style",
            `top: ${s}px; left: ${i}px; opacity: ${this.fading ? 0 : 1};`
          ),
            (this.tooltipInner.querySelector("p").innerHTML = this.text),
            this.exists() ||
              document
                .querySelector("#lol-uikit-layer-manager-wrapper")
                .appendChild(this.tooltip),
            this.fading && this.fade(!0);
        }
      };
    a(it, "Tooltip");
    var xt = it,
      m,
      b,
      j,
      st,
      E,
      q,
      R,
      nt,
      _,
      ot,
      A,
      D,
      Z,
      Mt =
        ((Z = class {
          constructor() {
            p(this, j),
              p(this, E),
              p(this, R),
              p(this, _),
              p(this, A),
              n(
                this,
                "Logger",
                new J(
                  "%c MTZ ",
                  "background: #171717; color: #ff4800; font-weight: bold"
                )
              ),
              n(this, "Settings", new vt()),
              n(this, "API", {
                "rcp-fe-audio": null,
                "rcp-fe-ember-libs": (e) => g(this, j, st).call(this, e),
                "rcp-fe-lol-l10n": (e) => this.Settings.translate(e),
                "rcp-fe-lol-settings": (e) => this.Settings.init(e),
              }),
              n(this, "plugins", []),
              n(this, "phase", null),
              n(this, "contextMenu", new yt()),
              p(this, m, {}),
              p(this, b, { lastScreen: null, lastPhase: null }),
              (window.MTZ = this);
            for (let e in this.API)
              rcp.postInit(e, (t) => {
                let i = e;
                typeof this.API[i] == "function"
                  ? this.API[i](t)
                  : (this.API[i] = t);
              });
            k(() => this.isReady()).then(() => {
              this.Logger.log("Initialized"),
                document.addEventListener(
                  "contextmenu",
                  (e) => (this.contextMenu.target = e.target),
                  !0
                ),
                I("/lol-gameflow/v1/gameflow-phase", "phase", (e) => {
                  var t, i;
                  return (this.phase =
                    ((i =
                      (t = JSON.parse(e.data)[2]) == null ? void 0 : t.data) ==
                    null
                      ? void 0
                      : i.toUpperCase()) || null);
                }),
                this.getPlugins().forEach(
                  (e) => !e.initialized && this.initPlugin(e)
                ),
                this.on("screen", g(this, R, nt).bind(this)),
                this.on("phase", g(this, _, ot).bind(this)),
                g(this, E, q).call(this);
            });
          }
          isReady() {
            return !!(
              document.readyState === "complete" &&
              document.querySelector('link[rel="riot:plugins:websocket"]')
            );
          }
          initPlugin(e) {
            (e.initialized = !0), e.onInit(), e.Logger.log("Initialized");
          }
          addPlugin(e) {
            this.plugins.push(e),
              !e.initialized && this.isReady() && this.initPlugin(e);
          }
          getPlugin(e) {
            return this.plugins.find((t) => t.name === e);
          }
          getPlugins() {
            return this.plugins.sort((e, t) =>
              e.priority === t.priority
                ? e.name.localeCompare(t.name)
                : t.priority - e.priority
            );
          }
          get screen() {
            var i, s, o, r, l, c, u;
            if (
              !document.body ||
              document.querySelector(".lol-loading-screen-container")
            )
              return "LOADING";
            let e = document.querySelector(
                ".main-navigation-menu-item[active]"
              ),
              t = e
                ? e.offsetParent
                  ? (s =
                      (i = e.classList[1]) == null
                        ? void 0
                        : i.split("_")[3]) == null
                    ? void 0
                    : s.toUpperCase()
                  : null
                : (c =
                    (l =
                      (r =
                        (o = document.querySelector(
                          "section.rcp-fe-viewport-main > div.screen-root"
                        )) == null
                          ? void 0
                          : o.getAttribute("data-screen-name")) == null
                        ? void 0
                        : r.split("rcp-fe-lol-")[1]) == null
                      ? void 0
                      : l.toUpperCase()) != null
                ? c
                : null;
            switch (t) {
              case "PARTIES":
                ((u = document.querySelector(".parties-background")) == null
                  ? void 0
                  : u.classList.contains("is-showing-game-select")) &&
                  (t = "GAME_SELECTION");
                break;
            }
            return t != null ? t : "UNKNOWN";
          }
          playSound(e, t) {
            var i, s;
            this.API["rcp-fe-audio"] &&
              ((s =
                (i = this.API["rcp-fe-audio"]) == null ? void 0 : i.channels) ==
                null ||
                s.get(t).playSound(e));
          }
          on(e, t, i = 0) {
            h(this, m)[e] || (h(this, m)[e] = []);
            let s = { event: e, callback: t, priority: i };
            return (
              h(this, m)[e].push(s),
              () => h(this, m)[e].splice(h(this, m)[e].indexOf(s), 1)
            );
          }
          once(e, t, i = 0) {
            let s = this.on(
              e,
              (...o) => {
                t(...o), s();
              },
              i
            );
          }
          emit(e, ...t) {
            return h(this, m)[e]
              ? (h(this, m)[e].sort((i, s) => s.priority - i.priority),
                h(this, m)[e].forEach((i) => {
                  let s = i.callback(...t);
                  s && (t = s);
                }),
                t)
              : !1;
          }
        }),
        (m = new WeakMap()),
        (b = new WeakMap()),
        (j = new WeakSet()),
        (st = a(async function (e) {
          let t = await e.getEmber(),
            { Settings: i } = this,
            s = t.Router.extend;
          t.Router.extend = function () {
            let l = s.apply(this, arguments);
            return (
              l.map(function () {
                for (let c of i.routes) this.route(c);
              }),
              l
            );
          };
          let o = await e.getEmberApplicationFactory(),
            r = o.factoryDefinitionBuilder;
          o.factoryDefinitionBuilder = function () {
            let l = r.apply(this, arguments),
              c = l.build;
            return (
              (l.build = function () {
                return (
                  this.getName() == "rcp-fe-lol-settings" && i.build(this, t),
                  c.apply(this, arguments)
                );
              }),
              l
            );
          };
        }, "#hookEmber")),
        (E = new WeakSet()),
        (q = a(function () {
          h(this, b).lastScreen !== this.screen &&
            (this.emit("screen", this.screen, h(this, b).lastScreen),
            (h(this, b).lastScreen = this.screen)),
            h(this, b).lastPhase !== this.phase &&
              (this.emit("phase", this.phase, h(this, b).lastPhase),
              (h(this, b).lastPhase = this.phase));
          let e = v("lol-uikit-context-menu");
          !e && this.contextMenu.open
            ? ((this.contextMenu.open = !1), g(this, A, D).call(this, null))
            : e &&
              !this.contextMenu.open &&
              ((this.contextMenu.open = !0), g(this, A, D).call(this, e)),
            this.plugins.forEach((t) => t.update && t.update()),
            requestAnimationFrame(() => g(this, E, q).call(this));
        }, "#update")),
        (R = new WeakSet()),
        (nt = a(function (e, t) {
          this.Logger.info([`%cScreen: ${e}`, "color: #ac4"]),
            this.plugins.forEach(
              (i) => i.initialized && i.onScreen && i.onScreen(e, t)
            );
        }, "#onScreen")),
        (_ = new WeakSet()),
        (ot = a(function (e, t) {
          this.Logger.info([`%cPhase: ${e}`, "color: #ca4"]),
            this.plugins.forEach(
              (i) => i.initialized && i.onPhase && i.onPhase(e, t)
            );
        }, "#onPhase")),
        (A = new WeakSet()),
        (D = a(function (e) {
          var i, s, o;
          (this.contextMenu.menu = e != null ? e : null),
            (this.contextMenu.optionsHolder =
              (s =
                (i = e == null ? void 0 : e.shadowRoot) == null
                  ? void 0
                  : i.querySelector("div.context-menu.context-menu-root")) !=
              null
                ? s
                : null);
          let t = this.contextMenu.optionsHolder
            ? [
                ...((o = this.contextMenu.optionsHolder) == null
                  ? void 0
                  : o.children),
              ]
            : [];
          this.contextMenu.target.closest("lol-social-roster-group") &&
            (this.contextMenu.type = "Folder"),
            this.contextMenu.target.closest("lol-social-roster-member") &&
              (this.contextMenu.type = "Friend"),
            this.Logger.info([
              `%cContextMenu: ${this.contextMenu.open ? "Opened" : "Closed"} (${
                this.contextMenu.type
              })`,
              "color: #4ac",
            ]),
            this.plugins.forEach(
              (r) =>
                r.initialized &&
                r.onContextMenu &&
                r.onContextMenu(this.contextMenu)
            ),
            t.length ||
              ((this.contextMenu.type = null),
              (this.contextMenu.target = null));
        }, "#onContextMenu")),
        a(Z, "MTZ"),
        Z),
      x = window.MTZ || new Mt(),
      at = class {
        constructor(t) {
          n(this, "Logger"),
            n(this, "name"),
            n(this, "version"),
            n(this, "author"),
            n(this, "priority", 0),
            n(this, "initialized", !1),
            t.then(
              ({
                displayName: i,
                name: s,
                priority: o,
                version: r,
                author: l,
              }) => {
                (this.name = i != null ? i : s),
                  (this.version = r),
                  (this.author = l),
                  (this.priority = o != null ? o : 0),
                  (this.Logger = new J(
                    `%c MTZ - ${this.name} `,
                    "background: #171717; color: #ff4800; font-weight: bold"
                  )),
                  x.addPlugin(this);
              }
            );
        }
        addCSS(t) {
          return K(t);
        }
        on(t, i, s) {
          return x.on(t, i, s);
        }
        once(t, i, s) {
          x.once(t, i, s);
        }
        onInit() {}
        onScreen(t, i) {}
        onPhase(t, i) {}
        onContextMenu(t) {}
        update() {}
      };
    a(at, "MTZPlugin");
    var kt = at;
    new (class extends kt {
      constructor() {
        super(Promise.resolve().then(() => dt(mt())));
        n(this, "AutoAccepting", !1),
          n(this, "playerResponse", null),
          n(this, "options");
      }
      onInit() {
        (this.options = {
          parent: ".open-party-toggle",
          name: this.name,
          className: "auto-accept",
          tooltip: "Automatically accept Queue Popups",
          onEnable: () => {
            I(
              "/lol-matchmaking/v1/ready-check",
              "ReadyCheck",
              this.onPlayerReponse.bind(this)
            );
          },
          onDisable: () => {
            G("/lol-matchmaking/v1/ready-check", "ReadyCheck");
          },
        }),
          this.addCSS("https://cdn.mashtoolz.xyz/lolclient/css/AutoAccept.css");
      }
      onScreen(e) {
        switch (e) {
          case "PARTIES": {
            k(() => v(this.options.parent))
              .then(() => {
                v(`#${this.options.name}`) || new St(this.options);
              })
              .catch((t) => this.Logger.error(t));
            break;
          }
        }
      }
      onPhase(e) {
        switch (e) {
          case "LOBBY":
          case "MATCHMAKING": {
            (this.playerResponse = null), (this.AutoAccepting = !1);
            break;
          }
          case "READYCHECK": {
            DataStore.get(`MTZ.${this.name}`) &&
              !this.AutoAccepting &&
              ((this.AutoAccepting = !0),
              M(3e3).then(() => {
                (this.playerResponse === "None" ||
                  this.playerResponse === null) &&
                  F("/lol-matchmaking/v1/ready-check/accept", {
                    method: "POST",
                  }),
                  (this.AutoAccepting = !1);
              }));
            break;
          }
        }
      }
      onPlayerReponse(e) {
        var t, i;
        try {
          let s =
            ((i = (t = JSON.parse(e.data)[2]) == null ? void 0 : t.data) == null
              ? void 0
              : i.playerResponse) || null;
          this.playerResponse = s;
        } catch {}
      }
    })();
  }),
  Ct = Et(Pt);
export default Ct;
