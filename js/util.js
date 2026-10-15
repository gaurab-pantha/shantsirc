/* Shared helpers: read a folder of this website's GitHub repository (for gallery, news and projects) */
(() => {
  const S = window.SSIRC;
  const enc = encodeURIComponent;
  const IMG = /\.(jpe?g|png|webp|gif|avif)$/i;

  let { owner, repo, branch } = S.repo;
  if (location.hostname.endsWith(".github.io")) {          // auto-detect on github.io addresses
    owner = location.hostname.split(".")[0];
    const seg = location.pathname.split("/")[1];
    repo = seg && !seg.endsWith(".html") ? seg : location.hostname;
  }

  // Fast path: manifest.json (same site, no GitHub limits). It is rebuilt automatically whenever files are pushed.
  let manifest;
  const loadManifest = () => manifest || (manifest = fetch("manifest.json", { cache: "no-cache" }).then(r => r.ok ? r.json() : {}).catch(() => ({})));

  async function list(path) {
    try {
      const m = await loadManifest(), a = m && m[path];
      if (Array.isArray(a) && a.length) return a.filter(n => !n.startsWith("_"));
    } catch (e) {}
    const key = "ssirc:" + path;
    try { const c = JSON.parse(sessionStorage.getItem(key)); if (c && Date.now() - c.t < 3e5) return c.d; } catch (e) {}
    try {
      const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}` + (branch ? "?ref=" + branch : ""));
      if (!r.ok) return [];
      const d = (await r.json()).filter(f => f.type === "file" && !f.name.startsWith("_")).map(f => f.name);
      try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d })); } catch (e) {}
      return d;
    } catch (e) { return []; }
  }
  const base = n => n.replace(/\.[^.]+$/, "");
  const pretty = n => { const s = base(n).replace(/[-_]+/g, " ").trim(); return s.charAt(0).toUpperCase() + s.slice(1); };
  const el = (tag, cls, text) => { const x = document.createElement(tag); if (cls) x.className = cls; if (text != null) x.textContent = text; return x; };
  const text = async p => { try { const r = await fetch(p); return r.ok ? (await r.text()).trim() : ""; } catch (e) { return ""; } };
  const fmtDate = s => new Date(s + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const $ = (s, r = document) => r.querySelector(s);

  S.u = { enc, IMG, list, base, pretty, el, text, fmtDate, $ };
})();
