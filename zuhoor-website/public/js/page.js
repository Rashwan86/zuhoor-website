/* public/js/page.js */

const LINKS = {
  whatsapp: "https://wa.me/9647709979459",
  facebook: "https://www.facebook.com/share/1DnGqM4SEx/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/"
};

const qs = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => [...r.querySelectorAll(s)];

function setSocialLinks(){
  qs("#waBtn").href = LINKS.whatsapp;
  qs("#fbBtn").href = LINKS.facebook;
  qs("#igBtn").href = LINKS.instagram;
}

/* ===== Manifest Loader ===== */
async function loadManifest(){
  const res = await fetch("ads/ads-manifest.json", { cache: "no-store" });
  if(!res.ok) throw new Error("ads-manifest.json not found");
  return await res.json();
}

/* ===== Title Animations ===== */
function typewrite(el, text, speed=18){
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
  const img = qs("img", boxEl);
  const images = (items || [])
    .map(x => typeof x === "string" ? x : x?.src)
    .filter(Boolean)
    .filter(src => !/\.(mp4|webm|ogg)$/i.test(src));

  if(images.length === 0){
    // fallback
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
  const first = (items || [])
    .map(x => typeof x === "string" ? x : x?.src)
    .filter(Boolean)
    .find(src => /\.(mp4|webm|ogg)$/i.test(src));

  if(!first) return;

  videoEl.src = first;
  videoEl.muted = true;     // مهم: لا صوت تلقائي
  videoEl.loop = true;
  videoEl.playsInline = true;
  videoEl.autoplay = true;

  // حاول تشغيله (بما إنه muted غالباً يشتغل)
  videoEl.play().catch(()=>{});
}

/* ===== Bottom Strip Slider (media3..media9) ===== */
function buildStrip(viewportEl, items){
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
  viewportEl.addEventListener("mouseenter", ()=> { clearInterval(auto); auto=null; });
  viewportEl.addEventListener("mouseleave", ()=> { if(!auto) auto = setInterval(() => scrollStrip(viewportEl, +1), 4000); });

  // touch pause not required
}

function scrollStrip(viewportEl, dir){
  const card = viewportEl.querySelector(".strip-item");
  if(!card) return;
  const step = card.getBoundingClientRect().width + 14;
  viewportEl.scrollBy({ left: dir * step, behavior: "smooth" });
}

/* ===== Modal ===== */
const MODAL_CONTENT = {
  services: {
    title: "الخدمات",
    sub: "صفحة منبثقة — سيتم تعبئتها لاحقاً."
  },
  offers: {
    title: "العروض",
    sub: "صفحة منبثقة — سيتم تعبئتها لاحقاً."
  },
  about: {
    title: "من نحن",
    sub: "صفحة منبثقة — سيتم تعبئتها لاحقاً."
  },
  contact: {
    title: "اتصل بنا",
    sub: "صفحة منبثقة — سيتم تعبئتها لاحقاً."
  }
};

function openModal(key){
  const modal = qs("#modal");
  const data = MODAL_CONTENT[key] || { title: "نافذة", sub: "..." };
  qs("#modalTitle").textContent = data.title;
  qs("#modalSub").textContent = data.sub;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(){
  const modal = qs("#modal");
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

  qs("#modalClose").addEventListener("click", closeModal);

  qs("#modal").addEventListener("click", (e)=>{
    if(e.target.id === "modal") closeModal();
  });

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") closeModal();
  });
}

/* ===== Init ===== */
async function init(){
  setSocialLinks();
  bindModal();

  // Title animation (exact as requested)
  const brandTag = qs("#brandTagline");
  const t = brandTag.getAttribute("data-text") || brandTag.textContent || "";
  typewrite(brandTag, t, 16);

  // Video mute button
  const v = qs("#heroVideo");
  const muteBtn = qs("#muteBtn");
  muteBtn.addEventListener("click", ()=>{
    v.muted = !v.muted;
    muteBtn.textContent = v.muted ? "🔇" : "🔊";
    if(!v.muted){
      v.play().catch(()=>{});
    }
  });

  // Bottom strip arrows
  const viewport = qs("#stripViewport");
  qs("#stripPrev").addEventListener("click", ()=> scrollStrip(viewport, -1));
  qs("#stripNext").addEventListener("click", ()=> scrollStrip(viewport, +1));

  // Load manifest and wire media
  try{
    const mf = await loadManifest();

    // Logo (first file in logo folder generated by script)
    if(mf.logo){
      qs("#logoImg").src = mf.logo;
    }

    // Left boxes
    const box1 = qs('[data-box="media1"]');
    const box2 = qs('[data-box="media2"]');
    startImageBox(box1, mf.media1, 4000);
    startImageBox(box2, mf.media2, 4000);

    // Center video
    initVideo(v, mf.media10);

    // Bottom strip: combine media3..media9
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
window.addEventListener("load", () => {
  document.body.classList.add("is-ready");
});