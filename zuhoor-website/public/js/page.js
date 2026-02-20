/* public/js/page.js */

const LINKS = {
  whatsapp: "https://wa.me/9647709979459",
  facebook: "https://www.facebook.com/share/1DnGqM4SEx/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/",
  tiktok: "https://tiktok.com/@USERNAME",
  email: "mailto:info@zuhoor.com",
  call: "tel:+9647709979459",
};

const qs = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => [...r.querySelectorAll(s)];

/* ===== Social Links (NEW icons) ===== */
function setSocialLinks(){
  // IDs الجديدة (إذا خليتها بالـ HTML) — هذا الأفضل
  const ig = qs("#igBtn");
  const wa = qs("#waBtn");
  const fb = qs("#fbBtn");
  const tt = qs("#ttBtn");
  const mail = qs("#mailBtn");
  const call = qs("#callBtn");

  // إذا ما عندك IDs (يعني أنت استخدمت class فقط)، نربط بالـ classes
  // (لكن الأفضل تضيف IDs للروابط بالـ HTML)
  const ig2 = ig || qs(".social-apps .app-btn.ig");
  const wa2 = wa || qs(".social-apps .app-btn.wa");
  const fb2 = fb || qs(".social-apps .app-btn.fb");
  const tt2 = tt || qs(".social-apps .app-btn.tt");
  const mail2 = mail || qs(".social-apps .app-btn.mail");
  const call2 = call || qs(".social-apps .app-btn.call");

  if(wa2) wa2.href = LINKS.whatsapp;
  if(fb2) fb2.href = LINKS.facebook;
  if(ig2) ig2.href = LINKS.instagram;
  if(tt2) tt2.href = LINKS.tiktok;
  if(mail2) mail2.href = LINKS.email;
  if(call2) call2.href = LINKS.call;
}

/* ===== Manifest Loader ===== */
async function loadManifest(){
  const res = await fetch("ads/ads-manifest.json", { cache: "no-store" });
  if(!res.ok) throw new Error("ads-manifest.json not found");
  return await res.json();
}

/* ===== Title Animations ===== */
function typewrite(el, text, speed=18){
  if(!el) return;
  el.textContent = "";
  let i = 0;
  const tick = () => {
    i++;
    el.textContent = text.slice(0, i);
    if(i < text.length) setTimeout(tick, speed);
  };
  setTimeout(tick, 250);
}

/* ===== Simple Slideshow for image boxes ===== */
function startImageBox(boxEl, items, everyMs=4000){
  if(!boxEl) return;
  const img = qs("img", boxEl);
  if(!img) return;

  const images = (items || [])
    .map(x => typeof x === "string" ? x : x?.src)
    .filter(Boolean)
    .filter(src => !/\.(mp4|webm|ogg)$/i.test(src));

  if(images.length === 0){
    img.removeAttribute("src");
    img.alt = "no media";
    return;
  }

  let idx = 0;
  img.src = images[0];

  if(images.length === 1) return;

  setInterval(() => {
    idx = (idx + 1) % images.length;
    img.src = images[idx];
  }, everyMs);
}

/* ===== Video Box (media10) ===== */
function initVideo(videoEl, items){
  if(!videoEl) return;

  const first = (items || [])
    .map(x => typeof x === "string" ? x : x?.src)
    .filter(Boolean)
    .find(src => /\.(mp4|webm|ogg)$/i.test(src));

  if(!first) return;

  videoEl.src = first;
  videoEl.muted = true;
  videoEl.loop = true;
  videoEl.playsInline = true;
  videoEl.autoplay = true;

  videoEl.play().catch(()=>{});
}

/* ===== Bottom Strip Slider (media3..media9) ===== */
function buildStrip(viewportEl, items){
  if(!viewportEl) return;
  viewportEl.innerHTML = "";

  const imgs = (items || [])
    .map(x => typeof x === "string" ? x : x?.src)
    .filter(Boolean)
    .filter(src => !/\.(mp4|webm|ogg)$/i.test(src));

  if(imgs.length === 0){
    const empty = document.createElement("div");
    empty.style.color = "rgba(255,255,255,.75)";
    empty.style.fontWeight = "900";
    empty.textContent = "لا يوجد محتوى في الشريط السفلي";
    viewportEl.appendChild(empty);
    return;
  }

  imgs.forEach(src => {
    const item = document.createElement("div");
    item.className = "strip-item";
    const im = document.createElement("img");
    im.src = src;
    im.alt = "ad";
    im.loading = "lazy";
    item.appendChild(im);
    viewportEl.appendChild(item);
  });

  // auto scroll
  let auto = setInterval(() => scrollStrip(viewportEl, +1), 4000);

  viewportEl.addEventListener("mouseenter", ()=> {
    clearInterval(auto);
    auto = null;
  });
  viewportEl.addEventListener("mouseleave", ()=> {
    if(!auto) auto = setInterval(() => scrollStrip(viewportEl, +1), 4000);
  });
}

function scrollStrip(viewportEl, dir){
  const card = viewportEl?.querySelector?.(".strip-item");
  if(!card) return;
  const step = card.getBoundingClientRect().width + 14;
  viewportEl.scrollBy({ left: dir * step, behavior: "smooth" });
}

/* ===== Modal ===== */
const MODAL_CONTENT = {
  services: { title: "الخدمات", sub: "صفحة منبثقة — سيتم تعبئتها لاحقاً." },
  offers:   { title: "العروض",  sub: "صفحة منبثقة — سيتم تعبئتها لاحقاً." },
  about:    { title: "من نحن",  sub: "صفحة منبثقة — سيتم تعبئتها لاحقاً." },
  contact:  { title: "اتصل بنا", sub: "صفحة منبثقة — سيتم تعبئتها لاحقاً." }
};

function openModal(key){
  const modal = qs("#modal");
  if(!modal) return;

  const data = MODAL_CONTENT[key] || { title: "نافذة", sub: "..." };
  const t = qs("#modalTitle");
  const s = qs("#modalSub");
  if(t) t.textContent = data.title;
  if(s) s.textContent = data.sub;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(){
  const modal = qs("#modal");
  if(!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function bindModal(){
  qsa("[data-open]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const key = el.getAttribute("data-open");
      openModal(key);
    });
  });

  const closeBtn = qs("#modalClose");
  if(closeBtn) closeBtn.addEventListener("click", closeModal);

  const modal = qs("#modal");
  if(modal){
    modal.addEventListener("click", (e)=>{
      if(e.target && e.target.id === "modal") closeModal();
    });
  }

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") closeModal();
  });
}

/* ===== Init ===== */
async function init(){
  setSocialLinks();
  bindModal();

  // Title animation
  const brandTag = qs("#brandTagline");
  const t = brandTag?.getAttribute("data-text") || brandTag?.textContent || "";
  typewrite(brandTag, t, 16);

  // Video mute button
  const v = qs("#heroVideo");
  const muteBtn = qs("#muteBtn");
  if(muteBtn && v){
    muteBtn.addEventListener("click", ()=>{
      v.muted = !v.muted;
      muteBtn.textContent = v.muted ? "🔇" : "🔊";
      if(!v.muted) v.play().catch(()=>{});
    });
  }

  // Bottom strip arrows (حتى لو مخفية بالـ CSS)
  const viewport = qs("#stripViewport");
  const prev = qs("#stripPrev");
  const next = qs("#stripNext");

  if(prev && viewport) prev.addEventListener("click", ()=> scrollStrip(viewport, -1));
  if(next && viewport) next.addEventListener("click", ()=> scrollStrip(viewport, +1));

  // Load manifest and wire media
  try{
    const mf = await loadManifest();

    if(mf.logo){
      const logo = qs("#logoImg");
      if(logo) logo.src = mf.logo;
    }

    startImageBox(qs('[data-box="media1"]'), mf.media1, 4000);
    startImageBox(qs('[data-box="media2"]'), mf.media2, 4000);

    initVideo(v, mf.media10);

    const stripItems = []
      .concat(mf.media3 || [])
      .concat(mf.media4 || [])
      .concat(mf.media5 || [])
      .concat(mf.media6 || [])
      .concat(mf.media7 || [])
      .concat(mf.media8 || [])
      .concat(mf.media9 || []);

    buildStrip(viewport, stripItems);

  }catch(err){
    console.warn(err);
  }
}

document.addEventListener("DOMContentLoaded", init);
