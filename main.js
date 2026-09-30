/* ===== Dark Green Zone – site scripts ===== */

// ---------------------------------------------------------------
// SETTINGS – edit these
// ---------------------------------------------------------------
// Free access key from https://web3forms.com (enter your email there,
// they send you a key). Until a key is set, forms fall back to opening
// the visitor's email app.
var WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE";
var FALLBACK_EMAIL = "anbu@localhost";

// Estimate calculator rates in Rupees PER SQUARE FOOT: [low, high].
// !!! These are SAMPLE numbers only. Replace them with your real rates
// before the site goes live. Set a service to null to show
// "Price after site visit" instead of a number.
var ESTIMATE_RATES = {
  "Landscape project design and construction": [150, 350],
  "Landscape maintenance services (per month)": [3, 8],
  "Irrigation system installation": [40, 90],
  "Fountain installation": null,
  "Waterbody design": null,
  "Vertical garden design and installation": [600, 1200],
  "Terrace landscaping": [200, 450],
  "Rock garden design and installation": [150, 300],
  "Indoor plants supply and rentals": null,
  "Organic vegetable garden": [100, 250]
};
// Extra cost factor by property type (1 = no change)
var PROPERTY_FACTOR = { home: 1, terrace: 1.15, commercial: 0.9 };
var MIN_CHARGE = 15000; // smallest job you take, in Rupees

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Footer year ----------
document.querySelectorAll(".year").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// ---------- Dark mode ----------
var root = document.documentElement;
function setTheme(dark) {
  if (dark) root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme");
  document.querySelectorAll(".theme-toggle").forEach(function (b) {
    b.innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    b.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  });
  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
}
setTheme(root.getAttribute("data-theme") === "dark");
document.querySelectorAll(".theme-toggle").forEach(function (b) {
  b.addEventListener("click", function () { setTheme(root.getAttribute("data-theme") !== "dark"); });
});

// ---------- Header shadow on scroll ----------
var header = document.querySelector(".site-header");
if (header) {
  var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 10); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ---------- Services dropdown (tap to open on phones) ----------
document.querySelectorAll(".sub-toggle").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var li = btn.closest(".has-sub");
    var open = li.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
});

// ---------- Mobile menu ----------
document.querySelectorAll(".nav-toggle").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var nav = document.getElementById("main-nav");
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
});

// ---------- Back to top button ----------
var topBtn = document.querySelector(".fab-top");
if (topBtn) {
  var toggleTop = function () {
    topBtn.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", toggleTop, { passive: true });
  toggleTop();
  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}

// ---------- Sliders (hero, testimonials, clients) ----------
document.querySelectorAll(".slider").forEach(function (slider) {
  var slides = slider.querySelectorAll(".slide");
  if (!slides.length) return;
  var dotsBox = slider.querySelector(".dots");
  var current = 0;
  var dots = [];

  if (dotsBox) {
    slides.forEach(function (_, i) {
      var d = document.createElement("button");
      d.setAttribute("aria-label", "Go to slide " + (i + 1));
      d.addEventListener("click", function () { show(i); restart(); });
      dotsBox.appendChild(d);
      dots.push(d);
    });
  }

  function show(i) {
    slides[current].classList.remove("active");
    if (dots[current]) dots[current].classList.remove("active");
    current = (i + slides.length) % slides.length;
    slides[current].classList.add("active");
    if (dots[current]) dots[current].classList.add("active");
  }
  show(0);

  var delay = reduceMotion ? 0 : parseInt(slider.dataset.autoplay, 10);
  var timer;
  function restart() {
    clearInterval(timer);
    if (delay) timer = setInterval(function () { show(current + 1); }, delay);
  }
  restart();
  // Pause while the visitor is hovering or using the keyboard inside it
  slider.addEventListener("mouseenter", function () { clearInterval(timer); });
  slider.addEventListener("mouseleave", restart);
  slider.addEventListener("focusin", function () { clearInterval(timer); });
  slider.addEventListener("focusout", restart);

  slider.querySelector(".slider-prev").addEventListener("click", function () { show(current - 1); restart(); });
  slider.querySelector(".slider-next").addEventListener("click", function () { show(current + 1); restart(); });

  // Swipe on touch screens
  var startX = null;
  slider.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { show(current + (dx < 0 ? 1 : -1)); restart(); }
    startX = null;
  });
});

// ---------- Scroll animations & counters ----------
function runCounter(el) {
  var target = el.dataset.since
    ? new Date().getFullYear() - parseInt(el.dataset.since, 10)
    : parseInt(el.dataset.target, 10);
  if (reduceMotion) { el.textContent = target; return; }
  var start = null;
  var duration = 1500;
  function step(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

var sections = document.querySelectorAll("main > section:not(:first-child)");
var counters = document.querySelectorAll(".count");

if ("IntersectionObserver" in window) {
  if (!reduceMotion) {
    sections.forEach(function (s) { s.classList.add("reveal"); });
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    sections.forEach(function (s) { revealObs.observe(s); });
  }

  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        countObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { countObs.observe(c); });
} else {
  counters.forEach(runCounter);
}

// ---------- Works gallery: filters + lightbox ----------
var gallery = document.querySelector(".works-grid");
if (gallery) {
  var items = Array.prototype.slice.call(gallery.querySelectorAll(".work"));

  document.querySelectorAll(".filters button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filters button").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.dataset.filter;
      items.forEach(function (item) {
        item.hidden = !(f === "all" || item.dataset.category === f);
      });
    });
  });

  var box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Photo viewer");
  box.hidden = true;
  box.innerHTML =
    '<button class="lb-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>' +
    '<button class="lb-prev" aria-label="Previous photo"><i class="fa-solid fa-chevron-left"></i></button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button class="lb-next" aria-label="Next photo"><i class="fa-solid fa-chevron-right"></i></button>';
  document.body.appendChild(box);

  var lbImg = box.querySelector("img");
  var lbCap = box.querySelector("figcaption");
  var visible = [];
  var idx = 0;
  var lastFocus = null;

  function showPhoto(i) {
    idx = (i + visible.length) % visible.length;
    var item = visible[idx];
    lbImg.src = item.getAttribute("href");
    lbImg.alt = item.querySelector("img").alt;
    lbCap.textContent = (idx + 1) + " / " + visible.length;
  }
  function openBox(item) {
    visible = items.filter(function (it) { return !it.hidden; });
    lastFocus = document.activeElement;
    box.hidden = false;
    document.body.style.overflow = "hidden";
    showPhoto(visible.indexOf(item));
    box.querySelector(".lb-close").focus();
  }
  function closeBox() {
    box.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  items.forEach(function (item) {
    item.addEventListener("click", function (e) { e.preventDefault(); openBox(item); });
  });
  box.querySelector(".lb-close").addEventListener("click", closeBox);
  box.querySelector(".lb-prev").addEventListener("click", function () { showPhoto(idx - 1); });
  box.querySelector(".lb-next").addEventListener("click", function () { showPhoto(idx + 1); });
  box.addEventListener("click", function (e) { if (e.target === box) closeBox(); });
  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") closeBox();
    if (e.key === "ArrowLeft") showPhoto(idx - 1);
    if (e.key === "ArrowRight") showPhoto(idx + 1);
    if (e.key === "Tab") { // keep focus inside the viewer
      var f = box.querySelectorAll("button");
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  var sx = null;
  box.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) showPhoto(idx + (dx < 0 ? 1 : -1));
    sx = null;
  });
}

// ---------- Enquiry forms: validation + sending ----------
function fieldError(input, msg) {
  var err = input.closest(".phone-wrap") ? input.closest(".phone-wrap").nextElementSibling : input.nextElementSibling;
  input.classList.toggle("invalid", !!msg);
  input.setAttribute("aria-invalid", msg ? "true" : "false");
  if (err && err.classList.contains("err")) err.textContent = msg || "";
}

function validate(input) {
  var v = input.value.trim();
  var msg = "";
  if (input.required && !v) msg = "This field is required.";
  else if (input.type === "date" && v && input.min && v < input.min) msg = "Please choose today or a later date.";
  else if (input.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "Please enter a valid email address.";
  else if (input.hasAttribute("data-phone") && v) {
    var digits = v.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) msg = "Please enter a valid phone number.";
  }
  fieldError(input, msg);
  return !msg;
}

document.querySelectorAll("form.enquiry").forEach(function (form) {
  var fields = form.querySelectorAll("input:not(.hp), textarea, select");
  form.querySelectorAll("[data-min-today]").forEach(function (d) {
    var t = new Date();
    d.min = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
  });
  fields.forEach(function (input) {
    input.addEventListener("blur", function () { validate(input); });
    input.addEventListener("input", function () {
      if (input.classList.contains("invalid")) validate(input);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    var firstBad = null;
    fields.forEach(function (input) {
      if (!validate(input)) { ok = false; if (!firstBad) firstBad = input; }
    });
    if (!ok) { firstBad.focus(); return; }

    var status = form.querySelector(".form-status");
    var btn = form.querySelector("button[type=submit]");
    var d = new FormData(form);
    if (d.get("botcheck")) return; // spam bot

    var subject = form.dataset.subject || "New enquiry";

    // No key yet: open the visitor's email app instead
    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.indexOf("YOUR_") === 0) {
      var body =
        "Name: " + d.get("name") + "\n" +
        "Email: " + d.get("email") + "\n" +
        "Phone: " + (d.get("phone") || "") + "\n" +
        "Service required for: " + d.get("service") + "\n" +
        (d.get("visit_date") ? "Site visit date: " + d.get("visit_date") + "\n" : "") +
        (d.get("visit_time") ? "Site visit time: " + d.get("visit_time") + "\n" : "") + "\n" +
        (d.get("message") || "");
      window.location.href = "mailto:" + FALLBACK_EMAIL +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      status.className = "form-status";
      status.textContent = "Opening your email app to send the message...";
      return;
    }

    btn.disabled = true;
    btn.textContent = "Sending...";
    status.className = "form-status";
    status.textContent = "";

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: subject,
        from_name: "Dark Green Zone website",
        name: d.get("name"),
        email: d.get("email"),
        phone: d.get("phone"),
        service: d.get("service"),
        message: d.get("message"),
        visit_date: d.get("visit_date") || "",
        visit_time: d.get("visit_time") || "",
        botcheck: ""
      })
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.success) throw new Error(json.message);
        form.reset();
        status.classList.add("ok");
        status.textContent = "Thank you! We have received your message and will contact you soon.";
      })
      .catch(function () {
        status.classList.add("fail");
        status.textContent = "Sorry, the message could not be sent. Please call us on 6379412122 or message us on WhatsApp.";
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = "Send Message";
      });
  });
});

// ---------- Estimate calculator ----------
var est = document.getElementById("estimator");
if (est) {
  var sel = document.getElementById("est-service");
  var area = document.getElementById("est-area");
  var range = document.getElementById("est-range");
  var priceEl = document.getElementById("est-price");
  var noteEl = document.getElementById("est-note");
  var lastSummary = "";

  Object.keys(ESTIMATE_RATES).forEach(function (name) {
    var o = document.createElement("option");
    o.textContent = name;
    sel.appendChild(o);
  });

  var fmt = function (n) {
    return "\u20b9" + (Math.round(n / 100) * 100).toLocaleString("en-IN");
  };

  function calc() {
    var service = sel.value;
    var sqft = Math.max(0, parseFloat(area.value) || 0);
    var ptype = est.querySelector("input[name=ptype]:checked").value;
    var rate = ESTIMATE_RATES[service];
    var ptypeLabel = est.querySelector("input[name=ptype]:checked").nextElementSibling.textContent.trim();
    if (!rate) {
      priceEl.textContent = "Price after site visit";
      noteEl.textContent = "This service depends a lot on the design you choose, so we quote after seeing the site.";
      lastSummary = service + ", about " + sqft + " sq.ft, " + ptypeLabel + ". Price after site visit.";
      return;
    }
    var f = PROPERTY_FACTOR[ptype] || 1;
    var monthly = /per month/i.test(service);
    var lo = sqft * rate[0] * f;
    var hi = sqft * rate[1] * f;
    if (!monthly) { lo = Math.max(lo, MIN_CHARGE); hi = Math.max(hi, MIN_CHARGE * 1.5); }
    priceEl.textContent = fmt(lo) + " \u2013 " + fmt(hi) + (monthly ? " / month" : "");
    noteEl.textContent = "For about " + sqft.toLocaleString("en-IN") + " sq.ft (" + ptypeLabel + ").";
    lastSummary = service + ", about " + sqft + " sq.ft, " + ptypeLabel + ". Online estimate: " + priceEl.textContent + ".";
  }

  area.addEventListener("input", function () { range.value = area.value; calc(); });
  range.addEventListener("input", function () { area.value = range.value; calc(); });
  est.addEventListener("change", calc);
  est.addEventListener("submit", function (e) { e.preventDefault(); });
  calc();

  // Copy the estimate into the enquiry form below
  document.querySelectorAll('a[href="#est-send"]').forEach(function (a) {
    a.addEventListener("click", function () {
      var f = document.querySelector("#est-send form");
      f.querySelector("[name=service]").value = sel.value;
      f.querySelector("[name=message]").value = lastSummary;
      setTimeout(function () { f.querySelector("[name=name]").focus(); }, 400);
    });
  });
}
