/* ID cards: builds a flip card for a board member, and the pop-up viewer on the board page */
(() => {
  const S = window.SSIRC, { el } = S.u;

  function faces(m) {
    const front = el("section", "idc-face idc-front");
    front.innerHTML = `
      <div class="idc-head">
        <img class="idc-logo" src="logo.png" alt="">
        <div><b>Shanti Science, ICT &amp; Robotics Club</b><small>Shree Shanti Namuna Secondary School</small><small>Tilottama-5, Manigram, Rupandehi</small></div>
      </div>
      <img class="idc-photo" alt="">
      <h3 class="idc-name"></h3>
      <p class="idc-role"></p>
      <p class="idc-dept">Board of Directors</p>
      <dl class="idc-meta">
        <div><dt>ID No.</dt><dd class="idc-id"></dd></div>
        <div><dt>Department</dt><dd class="idc-dd"></dd></div>
      </dl>
      <div class="idc-foot">${S.EMAIL} · ${S.SITE}</div>`;
    front.querySelector(".idc-photo").src = m.photo;
    front.querySelector(".idc-photo").alt = m.name;
    front.querySelector(".idc-name").textContent = m.name;
    front.querySelector(".idc-role").textContent = m.role;
    front.querySelector(".idc-id").textContent = m.id;
    front.querySelector(".idc-dd").textContent = m.dept;

    const back = el("section", "idc-face idc-back");
    back.innerHTML = `
      <img class="idc-mark" src="logo.png" alt="">
      <p class="idc-lead">This card identifies the holder as a member of the Board of Directors of Shanti Science, ICT &amp; Robotics Club (SSIRC).</p>
      <ul class="idc-contact">
        <li><span>Email</span>${S.EMAIL}</li>
        <li><span>Instagram</span>@shanti_sirc</li>
        <li><span>Facebook</span>Shanti Science ICT and Robotics Club</li>
        <li><span>Website</span>${S.SITE}</li>
      </ul>
      <p class="idc-found">If found, please return it to Shree Shanti Namuna Secondary School, Tilottama-5, Manigram, Rupandehi.</p>`;
    return { front, back };
  }

  function buildCard(m) {
    const card = el("div", "idc"), inner = el("div", "idc-in"), f = faces(m);
    inner.append(f.front, f.back); card.append(inner);
    card.tabIndex = 0; card.setAttribute("role", "button");
    card.setAttribute("aria-label", "ID card of " + m.name + ". Press to flip.");
    const flip = () => card.classList.toggle("flipped");
    card.addEventListener("click", flip);
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
    return card;
  }
  S.idcard = { faces, buildCard };

  /* printable sheet with every card (id-cards.html) */
  const pb = document.getElementById("printBtn"); if (pb) pb.onclick = () => window.print();
  const sheet = document.getElementById("sheet");
  if (sheet) {
    if (location.search.includes("render")) document.documentElement.classList.add("render");
    S.board.forEach(m => {
      const pair = el("div", "pair"), f = faces(m);
      pair.dataset.slug = m.slug; pair.append(f.front, f.back); sheet.append(pair);
    });
  }

  /* pop-up viewer (only on pages that have the dialog) */
  const dlg = document.getElementById("idm");
  if (!dlg) return;
  const stage = dlg.querySelector(".idm-stage"), dl = dlg.querySelector("#idmDownload"), title = dlg.querySelector("#idmTitle");
  let at = 0;
  function show(i) {
    at = (i + S.board.length) % S.board.length;
    const m = S.board[at], card = buildCard(m);
    stage.replaceChildren(card);
    title.textContent = `${m.name} · ${m.role}`;
    dl.href = `id-cards/${m.slug}.png`; dl.download = `${m.slug}-id-card.png`;
    history.replaceState(null, "", "?card=" + m.slug);
  }
  S.openCard = i => { show(i); if (!dlg.open) dlg.showModal(); };
  dlg.querySelector("#idmPrev").onclick = () => show(at - 1);
  dlg.querySelector("#idmNext").onclick = () => show(at + 1);
  dlg.querySelector("#idmFlip").onclick = () => stage.firstChild.classList.toggle("flipped");
  dlg.querySelector("#idmClose").onclick = () => dlg.close();
  dlg.addEventListener("close", () => history.replaceState(null, "", location.pathname));
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") show(at - 1);
    if (e.key === "ArrowRight") show(at + 1);
    if (e.key.toLowerCase() === "f") stage.firstChild.classList.toggle("flipped");
  });
})();
