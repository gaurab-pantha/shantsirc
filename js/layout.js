/* Header, footer, light/dark switch and mobile menu (shared by every page) */
(() => {
  const S = window.SSIRC, page = document.body.dataset.page || "";
  const nav = [["home","Home","index.html"],["about","About","about.html"],["team","Team","team.html"],["events","Events","events.html"],["projects","Projects","projects.html"],["gallery","Gallery","gallery.html"],["faqs","FAQs","faqs.html"],["partners","Partners","partners.html"]];
  const link = ([k, t, h]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a>`;

  const hdr = document.getElementById("hdr");
  if (hdr) hdr.outerHTML = `
  <header class="top"><div class="wrap bar">
    <a class="brand" href="index.html"><img src="logo.png" alt="" width="40" height="40"><span>SSIRC</span></a>
    <nav id="links" aria-label="Main">${nav.map(link).join("")}<a class="pill" href="${S.JOIN_URL}" target="_blank" rel="noopener">Join now</a></nav>
    <div class="right">
      <button class="theme" id="theme" aria-label="Switch light or dark mode"></button>
      <button class="menu" aria-expanded="false" aria-controls="links" aria-label="Open menu">Menu</button>
    </div>
  </div></header>`;

  const ftr = document.getElementById("ftr");
  if (ftr) ftr.outerHTML = `
  <footer class="foot"><div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="brand" href="index.html"><img src="logo.png" alt="" width="46" height="46"><span>Shanti Science, ICT &amp; Robotics Club</span></a>
        <p class="small">Innovate. Create. Inspire.<br>${S.school.name}<br>${S.school.address}</p>
      </div>
      <div><h4>Explore</h4><ul class="fl"><li><a href="about.html">About us</a></li><li><a href="team.html">Team</a></li><li><a href="events.html">Events</a></li><li><a href="projects.html">Projects</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="faqs.html">FAQs</a></li><li><a href="partners.html">Partners</a></li></ul></div>
      <div><h4>Connect</h4><ul class="fl">
        <li><a href="${S.JOIN_URL}" target="_blank" rel="noopener">Join the club</a></li>
        <li><a href="${S.FB_URL}" target="_blank" rel="noopener">Facebook</a></li>
        <li><a href="${S.IG_URL}" target="_blank" rel="noopener">Instagram @shanti_sirc</a></li>
        <li><a href="mailto:${S.EMAIL}">${S.EMAIL}</a></li></ul></div>
    </div>
    <p class="small copy">© 2026 Shanti Science, ICT &amp; Robotics Club · Tilottama-5, Manigram, Rupandehi, Nepal</p>
  </div></footer>`;

  /* light / dark */
  const root = document.documentElement, tbtn = document.getElementById("theme");
  const cur = () => root.dataset.theme || "dark";
  const label = () => { tbtn.textContent = cur() === "dark" ? "Light" : "Dark"; };
  label();
  tbtn.addEventListener("click", () => {
    root.dataset.theme = cur() === "dark" ? "light" : "dark";
    try { localStorage.setItem("ssirc-theme", root.dataset.theme); } catch (e) {}
    label();
  });

  /* mobile menu */
  const menu = document.querySelector(".menu"), links = document.getElementById("links");
  menu.addEventListener("click", () => menu.setAttribute("aria-expanded", links.classList.toggle("open")));
  links.addEventListener("click", e => { if (e.target.tagName === "A") { links.classList.remove("open"); menu.setAttribute("aria-expanded", false); } });

  /* any element with data-join opens the Google Form; data-fb opens Facebook */
  const wire = () => {
    document.querySelectorAll("[data-join]").forEach(a => { a.href = S.JOIN_URL; a.target = "_blank"; a.rel = "noopener"; });
    document.querySelectorAll("[data-fb]").forEach(a => { a.href = S.FB_URL; a.target = "_blank"; a.rel = "noopener"; });
  };
  wire(); S.wire = wire;
})();
