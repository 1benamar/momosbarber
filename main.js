/* MOMO'S BARBERSHOP · comportamiento de la página
   Script clásico (IIFE), sin dependencias. El contenido ya está en el HTML;
   esto solo lo enriquece: estado abierto/cerrado, vídeo, menú y animaciones. */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn("[" + name + "]", e); }
  }

  /* ---------- Idioma (ES por defecto; EN, FR y CA desde i18n.js) ---------- */
  var I18N = window.__I18N__ || { text: {}, dyn: {} };
  var LANGS = ["es", "en", "fr", "ca"];
  var lang = "es";
  var original = new Map();               // textos en español tal y como vienen en el HTML
  var onLang = [];                        // funciones que repintan textos generados por JS
  function D(k) { var d = I18N.dyn[lang] || I18N.dyn.es || {}; return d[k] != null ? d[k] : (I18N.dyn.es || {})[k]; }
  function fmt(s, o) { return String(s).replace(/\{(\w)\}/g, function (_, k) { return o[k]; }); }

  function pickLang() {
    try { var q = new URLSearchParams(location.search).get("lang"); if (LANGS.indexOf(q) > -1) return q; } catch (e) {}
    try { var s = localStorage.getItem("momos-lang"); if (LANGS.indexOf(s) > -1) return s; } catch (e) {}
    var nav = navigator.languages || [navigator.language || "es"];
    for (var i = 0; i < nav.length; i++) { var c = String(nav[i]).slice(0, 2).toLowerCase(); if (LANGS.indexOf(c) > -1) return c; }
    return "es";
  }

  function setLang(l, save) {
    if (LANGS.indexOf(l) < 0) l = "es";
    lang = l;
    var dict = (I18N.text || {})[l] || {};
    $$("[data-i18n]").forEach(function (el) {
      if (!original.has(el)) original.set(el, el.innerHTML);
      var k = el.getAttribute("data-i18n");
      el.innerHTML = l === "es" ? original.get(el) : (dict[k] != null ? dict[k] : original.get(el));
    });
    document.documentElement.lang = l;
    document.title = D("title");
    var md = $('meta[name="description"]'); if (md) md.setAttribute("content", D("desc"));
    // el mensaje de WhatsApp sale en el idioma del cliente
    $$('a[href^="https://wa.me/34603978374"]').forEach(function (a) {
      if (a.dataset.waKind == null) a.dataset.waKind = /duda/.test(decodeURIComponent(a.href)) ? "waAsk" : (/text=/.test(a.href) ? "waBook" : "");
      if (a.dataset.waKind) a.href = "https://wa.me/34603978374?text=" + encodeURIComponent(D(a.dataset.waKind));
    });
    var cur = $("[data-lang-current]"); if (cur) cur.textContent = l.toUpperCase();
    var lb = $(".lang__btn"); if (lb) lb.setAttribute("aria-label", D("lang"));
    $$("[data-set-lang]").forEach(function (btn) { btn.setAttribute("aria-current", String(btn.getAttribute("data-set-lang") === l)); });
    if (save) { try { localStorage.setItem("momos-lang", l); } catch (e) {} }
    onLang.forEach(function (fn) { safe(fn, "lang-hook"); });
  }

  function initI18n() {
    $$("[data-i18n]").forEach(function (el) { original.set(el, el.innerHTML); });
    var box = $("[data-lang]"), btn = box && $(".lang__btn", box), menu = box && $(".lang__menu", box);
    if (btn && menu) {
      var open = function (v) { menu.hidden = !v; btn.setAttribute("aria-expanded", String(v)); box.classList.toggle("is-open", v); };
      btn.addEventListener("click", function (e) { e.stopPropagation(); open(menu.hidden); });
      $$("[data-set-lang]", menu).forEach(function (b) {
        b.addEventListener("click", function () { setLang(b.getAttribute("data-set-lang"), true); open(false); btn.focus(); });
      });
      document.addEventListener("click", function (e) { if (!box.contains(e.target)) open(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { open(false); btn.focus(); } });
    }
    setLang(pickLang(), false);
  }

  /* ---------- Horario y estado en vivo (hora de Madrid) ---------- */
  // minutos desde medianoche; domingo cerrado
  var SCHEDULE = { 0: null, 1: [570, 1260], 2: [570, 1260], 3: [570, 1260], 4: [570, 1260], 5: [570, 1260], 6: [540, 1260] };
  var WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function madridNow() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    return { day: WD[o.weekday], min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
  }
  function hhmm(m) { var h = Math.floor(m / 60), mm = m % 60; return h + ":" + (mm < 10 ? "0" : "") + mm; }

  function computeStatus() {
    var now = madridNow(), today = SCHEDULE[now.day], days = D("days");
    if (today && now.min >= today[0] && now.min < today[1]) {
      var t = hhmm(today[1]), last = today[1] - now.min <= 45;
      return { open: true, head: D(last ? "lastSlots" : "openNow"), sub: fmt(D("until"), { t: t }), ticket: fmt(D(last ? "tLast" : "tOpen"), { t: t }), day: now.day };
    }
    if (today && now.min < today[0]) {
      var t0 = hhmm(today[0]);
      return { open: false, head: fmt(D("opensAt"), { t: t0 }), sub: fmt(D("todayDay"), { d: days[now.day] }), ticket: fmt(D("tBefore"), { t: t0 }), day: now.day };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7, s = SCHEDULE[d];
      if (s) {
        var w = i === 1 ? D("tomorrow") : fmt(D("onDay"), { d: days[d] }), t1 = hhmm(s[0]);
        return { open: false, head: D("closedNow"), sub: fmt(D("opensWhen"), { w: w, t: t1 }), ticket: fmt(D("tClosed"), { w: w, t: t1 }), day: now.day };
      }
    }
    return null;
  }

  function initStatus() {
    var box = $("[data-status]");
    var head = $("[data-status-head]"), sub = $("[data-status-sub]"), ticket = $("[data-ticket-status]"), live = $("[data-live]");
    function render() {
      var st = computeStatus();
      if (!st) return;
      if (head) head.textContent = st.head;
      if (sub) sub.textContent = st.sub;
      if (ticket) ticket.textContent = st.ticket;
      if (live) { live.textContent = st.ticket; live.classList.toggle("is-open", st.open); }
      if (box) box.classList.toggle("is-open", st.open);
      $$("[data-hours] li").forEach(function (li) {
        var isToday = Number(li.getAttribute("data-day")) === st.day;
        li.classList.toggle("is-today", isToday);
        var tag = $(".today", li);
        if (isToday && !tag) {
          tag = document.createElement("span");
          tag.className = "today";
          li.firstElementChild.appendChild(tag);
        } else if (!isToday && tag) { tag.remove(); tag = null; }
        if (tag) tag.textContent = D("today");
      });
    }
    render();
    onLang.push(render);
    setInterval(render, 60000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) render(); });
  }

  /* ---------- Vídeo del hero: dos clips que se funden en bucle ---------- */
  function initVideo() {
    var hero = $("[data-hero]");
    var vids = $$(".hero__video");
    var btn = $("[data-video-toggle]"), label = $("[data-video-label]");
    if (!hero || vids.length < 1) return;

    var cur = 0, switching = false, userPaused = false, inView = true;
    var saveData = navigator.connection && navigator.connection.saveData;

    // iOS/Android: el vídeo solo arranca solo si está silenciado también por JS
    vids.forEach(function (v) { v.muted = true; v.defaultMuted = true; v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", ""); });
    function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); return p; }
    function active() { return vids[cur]; }

    function crossTo(n) {
      var from = vids[cur], to = vids[n];
      if (!to) return;
      switching = true;
      if (to.preload === "none") { to.preload = "auto"; }
      try { to.currentTime = 0; } catch (e) {}
      var p = to.play();
      var done = function () {
        cur = n;
        vids.forEach(function (x, k) { x.classList.toggle("is-active", k === n); });
        setTimeout(function () { from.pause(); switching = false; }, 1200);
      };
      if (p && p.then) {
        p.then(done).catch(function () { switching = false; }); // si falla, el primer clip sigue en bucle
      } else { done(); }
    }

    vids.forEach(function (v, i) {
      v.addEventListener("timeupdate", function () {
        if (i !== cur || switching || vids.length < 2 || userPaused) return;
        if (v.duration && v.duration - v.currentTime < 1.1) crossTo((i + 1) % vids.length);
      });
    });

    // el segundo clip empieza a descargarse cuando el primero ya está en marcha
    vids[0].addEventListener("playing", function () {
      if (vids[1] && vids[1].preload === "none") { vids[1].preload = "auto"; vids[1].load(); }
    }, { once: true });

    function setPaused(p) {
      userPaused = p;
      if (btn) btn.setAttribute("aria-pressed", String(p));
      if (label) label.textContent = D(p ? "play" : "pause");
      if (p) { vids.forEach(function (v) { v.pause(); }); }
      else if (inView) { play(active()); }
    }
    if (btn) btn.addEventListener("click", function () { setPaused(!userPaused); });
    onLang.push(function () { if (label) label.textContent = D(userPaused ? "play" : "pause"); });

    // si el móvil bloquea el autoplay (ahorro de batería), arranca al primer toque o scroll
    var kick = function () { if (!userPaused && active().paused) play(active()); };
    ["touchstart", "pointerdown", "scroll"].forEach(function (ev) { window.addEventListener(ev, kick, { passive: true, once: true }); });
    if (false && saveData) { setPaused(true); }
    else { play(vids[0]); }

    // si el navegador aplazó el autoplay (pestaña en segundo plano), lo retomamos
    function resume() { if (!userPaused && inView && !document.hidden && active().paused) play(active()); }
    vids[0].addEventListener("canplay", resume, { once: true });
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);

    // fuera de pantalla no gasta batería
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (!inView) active().pause();
        else if (!userPaused) play(active());
      }, { threshold: 0 }).observe(hero);
    }
  }

  /* ---------- Menú ---------- */
  function initNav() {
    var nav = $("[data-nav]"), toggle = $("[data-menu-toggle]");
    if (!nav || !toggle) return;
    function set(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }
    toggle.addEventListener("click", function () { set(!nav.classList.contains("is-open")); });
    $$("#menu a").forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { set(false); toggle.focus(); }
    });
  }

  /* ---------- Apariciones al entrar en pantalla ---------- */
  function initReveal() {
    var items = $$(".reveal, .shot, [data-stamp]");
    // escalonado entre hermanos del mismo grupo
    $$(".menu-card__cols, .quotes, .work-grid, .about__text").forEach(function (group) {
      $$(".reveal, .shot", group).forEach(function (el, i) { el.style.setProperty("--i", i % 6); });
    });
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      items.forEach(function (el) {
        if (!el.classList.contains("is-in") && el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
      });
    }, 6000);
  }

  /* ---------- Bucle de animación ligado al scroll (solo mientras se ve) ---------- */
  function whileVisible(el, frame) {
    if (!el || !("IntersectionObserver" in window)) return;
    var raf = 0, on = false;
    function tick() { frame(); if (on) raf = requestAnimationFrame(tick); }
    new IntersectionObserver(function (entries) {
      on = entries[0].isIntersecting;
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(tick);
    }, { threshold: 0 }).observe(el);
  }

  // las tijeras recorren la línea discontinua y la van cortando
  function initScissors() {
    if (reduced) return;
    var ticket = $("[data-ticket]"), cut = $(".ticket__cut"), sc = $("[data-scissors]"), line = $(".ticket__line");
    if (!ticket || !cut || !sc || !line) return;
    var last = -1;
    whileVisible(ticket, function () {
      var r = ticket.getBoundingClientRect(), vh = window.innerHeight;
      var p = (vh - r.top) / (vh + r.height);
      p = Math.min(1, Math.max(0, (p - 0.12) / 0.62));
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      var w = cut.clientWidth - 34, x = p * w;
      var snip = Math.sin(p * 46) * 11;
      sc.style.transform = "translate3d(" + x.toFixed(1) + "px,0,0) rotate(" + snip.toFixed(2) + "deg)";
      line.style.clipPath = "inset(0 0 0 " + Math.max(0, x + 12).toFixed(1) + "px)";
    });
  }

  // el sello de "Nosotros" gira despacio con el scroll
  function initSeal() {
    if (reduced) return;
    var seal = $("[data-seal]"), spin = seal && $(".seal__spin", seal);
    if (!spin) return;
    whileVisible(seal, function () {
      var r = seal.getBoundingClientRect();
      spin.style.transform = "rotate(" + ((window.innerHeight - r.top) * 0.18).toFixed(2) + "deg)";
    });
  }

  /* ---------- Guía del degradado ---------- */
  function initFade() {
    var guide = $("[data-fade]");
    if (!guide) return;
    var opts = $$("[data-fade-opt]", guide);
    function select(btn, focus) {
      guide.setAttribute("data-fade", btn.getAttribute("data-fade-opt"));
      opts.forEach(function (b) {
        var on = b === btn;
        b.setAttribute("aria-checked", String(on));
        b.tabIndex = on ? 0 : -1;
      });
      if (focus) btn.focus();
    }
    opts.forEach(function (b, i) {
      b.tabIndex = b.getAttribute("aria-checked") === "true" ? 0 : -1;
      b.addEventListener("click", function () { select(b); });
      b.addEventListener("keydown", function (e) {
        var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        select(opts[(i + d + opts.length) % opts.length], true);
      });
    });
  }

  /* ---------- Mapa: se carga solo si lo pides (sin cookies de Google antes) ---------- */
  function initMap() {
    var map = $("[data-map]"), btn = $("[data-map-load]");
    if (!map || !btn) return;
    btn.addEventListener("click", function () {
      if ($("iframe", map)) return;
      var f = document.createElement("iframe");
      f.title = "Mapa de Momo's Barbershop en Lloret de Mar";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      f.src = "https://www.google.com/maps?q=MOMO%27S%20BARBERSHOP%2C%20Carrer%20de%20Josep%20Anselm%20Clav%C3%A9%2016%2C%2017310%20Lloret%20de%20Mar&z=17&output=embed";
      f.addEventListener("load", function () { map.classList.add("is-live"); });
      map.appendChild(f);
    });
  }

  /* ---------- Barra de reserva en móvil ---------- */
  function initDock() {
    var dock = $("[data-dock]"), hero = $("[data-hero]"), closing = $("[data-closing]");
    if (!dock || !hero || !("IntersectionObserver" in window)) return;
    var heroIn = true, closingIn = false;
    function update() { dock.classList.toggle("is-shown", !heroIn && !closingIn); }
    new IntersectionObserver(function (e) { heroIn = e[0].isIntersecting; update(); }, { rootMargin: "0px 0px -35% 0px" }).observe(hero);
    if (closing) new IntersectionObserver(function (e) { closingIn = e[0].isIntersecting; update(); }).observe(closing);
  }


  /* ---------- Cursor de tijeras ----------
     La punta es el punto de clic: se coloca sin retardo para no perder precisión.
     Solo se suaviza la inclinación, que sigue a la velocidad del ratón. */
  function initCursor() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var el = $("[data-cursor]"), tilt = el && $(".cursor__tilt", el);
    if (!el || !tilt) return;
    var HX = 4.6, HY = 5.8;                     // punta de las tijeras dentro de la caja de 38px
    var x = -100, y = -100, lastX = 0, vx = 0, angle = 0, raf = 0, moving = false;
    var INTERACTIVE = "a, button, [role=\"radio\"], label, summary, [data-map-load]";

    function frame() {
      el.style.transform = "translate3d(" + (x - HX) + "px," + (y - HY) + "px,0)";
      vx += ((x - lastX) - vx) * 0.25;
      lastX = x;
      var target = reduced ? 0 : Math.max(-16, Math.min(16, vx * 0.9));
      angle += (target - angle) * 0.16;
      tilt.style.transform = "rotate(" + angle.toFixed(2) + "deg)";
      if (Math.abs(target - angle) > 0.05 || moving) { moving = false; raf = requestAnimationFrame(frame); }
      else raf = 0;
    }
    function kick() { moving = true; if (!raf) raf = requestAnimationFrame(frame); }

    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      if (!el.classList.contains("is-on")) {
        document.documentElement.classList.add("has-cursor");
        el.classList.add("is-on");
        lastX = e.clientX;
      }
      x = e.clientX; y = e.clientY;
      kick();
    }, { passive: true });

    document.addEventListener("pointerover", function (e) {
      if (e.pointerType !== "mouse") return;
      el.classList.toggle("is-hover", !!(e.target.closest && e.target.closest(INTERACTIVE)));
    });
    // al salir de la ventana o entrar en el mapa (iframe) se esconde
    document.addEventListener("mouseout", function (e) { if (!e.relatedTarget) el.classList.remove("is-on"); });
    window.addEventListener("blur", function () { el.classList.remove("is-on"); });

    document.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      el.classList.add("is-down");
      if (!reduced) snip(e.clientX, e.clientY);
    });
    document.addEventListener("pointerup", function () { el.classList.remove("is-down"); });

    // dos pelillos que caen al cortar
    function snip(px, py) {
      if (!document.body.animate) return;
      for (var i = 0; i < 3; i++) {
        var s = document.createElement("span");
        s.className = "snip";
        s.style.background = i % 2 ? "#0f0f11" : "#d8b67e";
        document.body.appendChild(s);
        var dx = (Math.random() - 0.5) * 22, dy = 16 + Math.random() * 18, r0 = Math.random() * 180, r1 = r0 + (Math.random() - 0.5) * 160;
        var a = s.animate([
          { transform: "translate(" + px + "px," + py + "px) rotate(" + r0 + "deg)", opacity: 1 },
          { transform: "translate(" + (px + dx) + "px," + (py + dy) + "px) rotate(" + r1 + "deg)", opacity: 0 }
        ], { duration: 560 + i * 60, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" });
        a.onfinish = (function (node) { return function () { node.remove(); }; })(s);
      }
    }
  }

  /* ---------- Reels: se cargan y reproducen (sin sonido) solo cuando se ven ---------- */
  function initReels() {
    var vids = $$(".reel__video");
    if (!vids.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target, card = v.closest(".reel");
        if (e.intersectionRatio >= 0.5) {
          if (!v.getAttribute("src")) { v.src = v.getAttribute("data-src"); v.preload = "auto"; }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
          card.classList.add("is-playing");
        } else {
          v.pause();
          card.classList.remove("is-playing");
        }
      });
    }, { threshold: [0, 0.5, 1] });
    vids.forEach(function (v) { io.observe(v); });
  }

  /* ---------- Aviso de vacaciones o festivos (se configura en aviso.js) ---------- */
  function initAviso() {
    var cfg = window.MOMOS_AVISO, bar = $("[data-aviso]"), txt = $("[data-aviso-text]");
    if (!cfg || !cfg.activo || !bar || !txt) return;
    var today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date()); // AAAA-MM-DD
    if ((cfg.mostrarDesde && today < cfg.mostrarDesde) || (cfg.hasta && today > cfg.hasta)) return;
    function paint() { var t = cfg.texto || {}; txt.textContent = t[lang] || t.es || ""; }
    paint();
    onLang.push(paint);
    bar.hidden = false;
    document.documentElement.classList.add("has-aviso");
  }

  function initYear() {
    var y = $("[data-year]");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function boot() {
    safe(initI18n, "i18n");
    safe(initAviso, "aviso");
    safe(initStatus, "status");
    safe(initVideo, "video");
    safe(initNav, "nav");
    safe(initReveal, "reveal");
    safe(initScissors, "scissors");
    // el sello gira solo con CSS (animación en bucle)
    safe(initFade, "fade");
    safe(initMap, "map");
    safe(initDock, "dock");
    safe(initCursor, "cursor");
    safe(initReels, "reels");
    safe(initYear, "year");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
