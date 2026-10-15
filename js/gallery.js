/* Gallery: photos come from the gallery/ folder of the GitHub repository */
(() => {
  const S = window.SSIRC, { el, enc, IMG, list, pretty, $ } = S.u;
  let cache;
  S.loadPhotos = () => cache || (cache = list("gallery").then(f => f.filter(n => IMG.test(n)).sort().reverse().map(n => ({ src: `gallery/${enc(n)}`, cap: pretty(n) }))));

  const g = $("#gal"); if (!g) return;
  const lb = $("#lb"); let shots = [], at = 0;
  const show = i => { at = (i + shots.length) % shots.length; $("#lbImg").src = shots[at].src; $("#lbImg").alt = shots[at].cap; $("#lbCap").textContent = shots[at].cap; };
  S.loadPhotos().then(p => {
    shots = p; if (!p.length) return;
    $("#galEmpty").hidden = true;
    p.forEach((s, i) => {
      const b = el("button", "shot rv"), im = el("img"); b.type = "button"; im.src = s.src; im.alt = s.cap; im.loading = "lazy";
      b.append(im, el("span", null, s.cap)); b.addEventListener("click", () => { show(i); lb.showModal(); }); g.append(b);
    });
    S.reveal(g);
  });
  $("#lbClose").onclick = () => lb.close(); $("#lbPrev").onclick = () => show(at - 1); $("#lbNext").onclick = () => show(at + 1);
  lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", e => { if (e.key === "ArrowLeft") show(at - 1); if (e.key === "ArrowRight") show(at + 1); });
})();
