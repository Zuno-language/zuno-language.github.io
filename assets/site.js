// Zuno website motion, same settings as christopherbiguet.com: Lenis smooth scroll (duration 0.9,
// expo ease), reveal-on-scroll, blur-up images and the nav wordmark that slides in after the hero.
// Zuno's own pieces: the hero flashcard, the daily loop's sticky phone, the line to try and the
// documents' table of contents. Motion is skipped with "Reduce motion".
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) {
    if (el.dataset.delay) el.style.setProperty("--d", el.dataset.delay + "ms");
    reduce ? el.classList.add("is-visible") : io.observe(el);
  });

  // Blur-up images
  document.querySelectorAll("img.blur-in").forEach(function (img) {
    if (img.complete) img.classList.add("is-loaded");
    else img.addEventListener("load", function () { img.classList.add("is-loaded"); });
  });

  // Wordmark in the pill nav once the hero is passed (always shown on pages without a hero)
  var mark = document.querySelector(".nav-mark");
  var hero = document.querySelector(".hero");
  var pending = Array.prototype.slice.call(document.querySelectorAll(".reveal:not(.is-visible)"));
  function onScroll() {
    // A fast jump (anchor link, scrollbar drag) can skip past a section: show what's above the fold too.
    if (pending.length) {
      pending = pending.filter(function (el) {
        if (el.classList.contains("is-visible")) return false;
        if (el.getBoundingClientRect().top < window.innerHeight) { el.classList.add("is-visible"); io.unobserve(el); return false; }
        return true;
      });
    }
    if (mark) mark.classList.toggle("is-shown", !hero || window.scrollY > hero.offsetHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Language menu (globe): remember the choice, close on a tap outside or Escape
  var lang = document.querySelector(".lang");
  if (lang) {
    lang.querySelectorAll("a[data-lang]").forEach(function (a) {
      a.addEventListener("click", function () { try { localStorage.setItem("zuno-lang", a.dataset.lang); } catch (e) {} });
    });
    document.addEventListener("click", function (e) { if (!lang.contains(e.target)) lang.open = false; });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && lang.open) { lang.open = false; lang.querySelector("summary").focus(); } });
  }

  // Hero flashcard: tap to flip (it also flips on its own)
  var flip = document.querySelector(".flip");
  if (flip) flip.addEventListener("click", function () { flip.classList.toggle("is-flipped"); });

  // Daily loop: the sticky phone shows the screen of the step being read
  var shots = document.querySelectorAll(".loop-stage img");
  var steps = document.querySelectorAll(".loop-step");
  if (steps.length) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        steps.forEach(function (s) { s.classList.toggle("is-current", s === e.target); });
        var i = +e.target.dataset.screen;
        shots.forEach(function (img, k) { img.classList.toggle("is-active", k === i); });
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(function (s) { so.observe(s); });
    steps[0].classList.add("is-current");
  }

  // Try a line: the app's accepted answers for 你家在哪里？ (grammar-drills.json and drills-fr.json, L1.G04.c1)
  var form = document.getElementById("line");
  if (form) {
    var fr = document.documentElement.lang === "fr";
    var t = fr ? {
      accepted: ["Où est ta maison ?", "Où habites-tu ?", "Ta maison est où ?"],
      extra: ["Où habitez-vous ?", "Où est votre maison ?", "Tu habites où ?", "Vous habitez où ?"],
      note: "在 + lieu = « se trouve à ». 哪里 « où » reste à la fin.",
      near: function (a) { return /\bou\b/.test(a) && /(maison|habit|vis|vivez|domicile|chez)/.test(a); },
      ok: "Correct !", almost: "Presque !", would: "Zuno accepterait : ", miss: "Pas tout à fait", retry: "Réessaie, ou affiche la réponse.", also: "Aussi accepté : "
    } : {
      accepted: ["Where is your home?", "Where do you live?", "Where's your house?"],
      extra: [],
      note: "在 + place = “is at”. 哪里 “where” stays at the end.",
      near: function (a) { return /where/.test(a) && /(home|house|live)/.test(a); },
      ok: "Correct!", almost: "Almost!", would: "Zuno would accept: ", miss: "Not quite", retry: "Try again, or reveal the answer.", also: "Also accepted: "
    };
    var input = document.getElementById("line-input");
    var out = document.getElementById("line-verdict");
    var norm = function (s) {
      s = s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, "'").replace(/where's/g, "where is");
      return s.replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();
    };
    var show = function (cls, title, text) { out.className = "line-verdict " + cls; out.innerHTML = "<b>" + title + "</b>" + text; };
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var a = norm(input.value);
      if (!a) { input.focus(); return; }
      var ok = t.accepted.concat(t.extra).some(function (x) { return norm(x) === a; });
      if (ok) show("hit", t.ok, t.note);
      else if (t.near(a)) show("hit", t.almost, t.would + t.accepted[0]);
      else show("miss", t.miss, t.retry);
    });
    document.getElementById("line-reveal").addEventListener("click", function () {
      show("hit", t.accepted[0], t.also + t.accepted.slice(1).join(" · ") + "<br>" + t.note);
    });
  }

  // Documents: a table of contents from the section headings
  var toc = document.querySelector(".toc");
  if (toc) {
    var heads = document.querySelectorAll(".doc h2");
    heads.forEach(function (h, i) {
      h.id = h.id || "s" + (i + 1);
      var a = document.createElement("a");
      a.href = "#" + h.id; a.textContent = h.textContent;
      toc.appendChild(a);
    });
    if (heads.length < 3) { toc.parentElement.classList.add("no-toc"); toc.remove(); }
    else {
      var links = toc.querySelectorAll("a");
      var to = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (l) { l.classList.toggle("is-current", l.getAttribute("href") === "#" + e.target.id); });
        });
      }, { rootMargin: "0px 0px -70% 0px" });
      heads.forEach(function (h) { to.observe(h); });
    }
  }

  // Lenis smooth scroll
  if (!reduce && window.Lenis) {
    var lenis = new window.Lenis({
      duration: 0.9,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      syncTouch: false
    });
    lenis.on("scroll", onScroll);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (ev) {
        var t = document.querySelector(a.getAttribute("href"));
        if (t) { ev.preventDefault(); lenis.scrollTo(t, { offset: -90 }); history.replaceState(null, "", a.getAttribute("href")); }
      });
    });
    (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
  }
})();
