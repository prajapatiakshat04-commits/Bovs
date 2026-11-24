// Career & Workplace Guides - shared interactions
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") navMenu.classList.remove("open");
  });
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href && href.startsWith("#") && href.length > 1) {
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
});

const form = document.querySelector("#contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const status = form.querySelector("[data-form-status]");
    const msg = `Thanks ${data.name || "there"}! Your message about "${data.topic || "our guides"}" has been noted. We usually reply to ${data.email || "your inbox"} within a few working days.`;
    if (status) {
      status.textContent = msg;
      status.hidden = false;
    } else {
      alert(msg);
    }
    form.reset();
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

/* ---------- career offer alert modal ---------- */
const modal = document.querySelector("#scam-alert");
if (modal) {
  const reopen = document.querySelector("[data-modal-open]");
  const KEY = "career-offer-alert-seen";
  let lastFocus = null;

  const open = () => {
    lastFocus = document.activeElement;
    modal.hidden = false;
    modal.classList.add("open");
    document.body.classList.add("modal-open");
    if (reopen) reopen.hidden = true;
    const first = modal.querySelector("[data-modal-accept]") || modal.querySelector(".modal-close");
    if (first) first.focus();
  };

  const close = () => {
    modal.classList.remove("open");
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    try { localStorage.setItem(KEY, "1"); } catch (e) { /* storage blocked */ }
    if (reopen) reopen.hidden = false;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-modal-close]") || e.target.closest("[data-modal-accept]")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
    if (e.key !== "Tab" || !modal.classList.contains("open")) return;
    const f = modal.querySelectorAll("button, [href], input, select, textarea");
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  if (reopen) reopen.addEventListener("click", open);

  let seen = false;
  try { seen = localStorage.getItem(KEY) === "1"; } catch (e) { seen = false; }
  if (seen) { reopen.hidden = false; } else { open(); }
}