// public/js/ads.js

// بياناتك الحقيقية
const CONTACT = {
  email: "zuhoor_Alsharq@gmail.com",
  phoneLocal: "0770 997 9459",
  phoneE164: "+9647709979459",                // مهم للروابط
  whatsappE164: "9647709979459",              // wa.me بدون +
  facebook: "https://www.facebook.com/share/1DnGqM4SEx/?mibextid=wwXIfr",
  instagram: "#",                              // ضع رابط الانستغرام الحقيقي
  mapsLink: "https://maps.app.goo.gl/uKqx1Xi5bubpT8At5?g_st=ic",
  address: "بغداد - الكرادة داخل - تقاطع سبع قصور"
};

// ترجمة عربي + کوردی (سوراني - RTL)
const I18N = {
  ar: {
    companyName: "زهور الشرق",
    companyTagline: "للاستقدام وتشغيل الأيدي العاملة الأجنبية",
    navHome: "الرئيسية",
    navAbout: "عن الشركة",
    navServices: "خدماتنا",
    navAds: "الإعلانات",
    navContact: "تواصل معنا",
    ctaTop: "تواصل",
    heroTitle: "نخلي وصول العامل المناسب أسهل وأسرع",
    heroSubtitle: "عاملات منزليات مدرّبات، جنسيات متعددة، خدمة موثوقة، متابعة مستمرة.",
    ctaContact: "تواصل معنا الآن",
    ctaServices: "استعرض الخدمات",
    stat1: "دعم سريع",
    stat2: "شركة مرخصة",
    stat3: "جودة وخبرة",
    aboutTitle: "عن الشركة",
    aboutText: "نحن شركة مرخصة متخصصة في توفير الأيدي العاملة الأجنبية، مع التركيز على السرعة، الأمان، والشفافية.",
    about1t: "ثقة وموثوقية",
    about1d: "إجراءات واضحة وعقود رسمية ومتابعة بعد التعاقد.",
    about2t: "سرعة بالتجهيز",
    about2d: "نقترح الخيارات الأنسب حسب طلبك وبأقصر وقت.",
    about3t: "دعم مستمر",
    about3d: "تواصل سريع عبر الهاتف والواتساب والإيميل.",
    servicesTitle: "خدماتنا",
    servicesText: "اختر الخدمة المناسبة… والباقي علينا.",
    srv1t: "عاملات منزليات",
    srv1d: "خيارات متعددة وجنسيات مختلفة حسب الطلب.",
    srv2t: "رعاية كبار السن",
    srv2d: "اهتمام ورعاية ومتابعة مع العائلة.",
    srv3t: "تنظيف ومساعدة",
    srv3d: "حلول مرنة يومية/أسبوعية حسب الحاجة.",
    adsTitle: "الإعلانات",
    adsText: "السلايدر بالأعلى يعرض صور وفيديو بتأثير Fade ناعم.",
    bannerText: "تواصل معنا لمعرفة أحدث العروض والأسعار",
    bannerBtn: "تواصل",
    contactTitle: "تواصل معنا",
    contactText: "نرد بسرعة عبر الواتساب أو الاتصال أو الإيميل.",
    emailLabel: "الإيميل",
    phoneLabel: "واتساب / هاتف",
    addrLabel: "العنوان",
    addrText: CONTACT.address,
    waBtn: "واتساب",
    fbBtn: "فيسبوك",
    mapBtn: "فتح الخريطة",
    footerTag: "تصميم فخم (أبيض + ذهبي + أسود) مع حركات جذابة"
  },
  ku: {
    companyName: "زهور الشرق",
    companyTagline: "بۆ هێنانی و کارپێکردنی دەستی کارە بیانییەکان",
    navHome: "سەرەکی",
    navAbout: "دەربارەی کۆمپانیا",
    navServices: "خزمەتگوزارییەکان",
    navAds: "ڕیکلامەکان",
    navContact: "پەیوەندی",
    ctaTop: "پەیوەندی",
    heroTitle: "گەیشتن بە کارمەندی گونجاو ئاسانتر و خێراتر دەکەین",
    heroSubtitle: "کارمەندانی ماڵەوەی فێرکراو، جۆراوجۆر نەتەوە، خزمەتگوزاری متمانەپێکراو، شوێنکەوتنەوەی بەردەوام.",
    ctaContact: "ئێستا پەیوەندیمان پێوە بکە",
    ctaServices: "خزمەتگوزارییەکان ببینە",
    stat1: "یارمەتی خێرا",
    stat2: "کۆمپانیا مۆڵەتپێدراوە",
    stat3: "جۆر و ئەزموون",
    aboutTitle: "دەربارەی کۆمپانیا",
    aboutText: "کۆمپانیایەکی مۆڵەتپێدراوین بۆ دابینکردنی دەستی کارە بیانییەکان، بە سەرەکی: خێرایی، پارێزگاری و ڕوونی.",
    about1t: "متمانە و باوەڕ",
    about1d: "پڕۆسەی ڕوون، ڕێککەوتنی فەرمی و شوێنکەوتنەوە.",
    about2t: "خێراکردنی دابینکردن",
    about2d: "هەڵبژاردنە گونجاوەکان پێشنیار دەکەین.",
    about3t: "یارمەتی بەردەوام",
    about3d: "پەیوەندی خێرا بە تەلەفۆن، واتساپ و ئیمەیڵ.",
    servicesTitle: "خزمەتگوزارییەکان",
    servicesText: "خزمەتگوزاری گونجاو هەڵبژێرە… ئەوەی تر لەسەر ئێمە.",
    srv1t: "کارمەندی ماڵەوە",
    srv1d: "هەڵبژاردنی جۆراوجۆر و نەتەوەکان.",
    srv2t: "چاودێری پێشەنگان",
    srv2d: "چاودێری و سەرنج و ڕەفتاری باش.",
    srv3t: "پاککردنەوە و یارمەتیدان",
    srv3d: "ڕۆژانە/هەفتانە بەپێی پێویستی.",
    adsTitle: "ڕیکلامەکان",
    adsText: "سڵایدەری سەرەوە وێنە و ڤیدیۆ بە (Fade) پیشان دەدات.",
    bannerText: "پەیوەندیمان پێوە بکە بۆ زانیاری نوێترین عەرز و نرخەکان",
    bannerBtn: "پەیوەندی",
    contactTitle: "پەیوەندی",
    contactText: "بە خێرایی وەڵام دەدەین لە ڕێگەی واتساپ/تەلەفۆن/ئیمەیڵ.",
    emailLabel: "ئیمەیڵ",
    phoneLabel: "واتساپ / تەلەفۆن",
    addrLabel: "ناونیشان",
    addrText: CONTACT.address,
    waBtn: "واتساپ",
    fbBtn: "فەیسبووک",
    mapBtn: "کردنەوەی نەخشە",
    footerTag: "دیزاینێکی جوان (سپی + زێڕین + ڕەش) بە هاوکێشەیی و جوڵە"
  }
};

let currentLang = "ar";
let ads = [];
let mainIndex = 0;
let stripIndex = 0;

const $ = (id) => document.getElementById(id);

async function loadAds() {
  const res = await fetch("ads.json", { cache: "no-store" });
  if (!res.ok) throw new Error("ads.json missing");

  const data = await res.json();
  const arr = Array.isArray(data) ? data : (data.items || []);

  return arr
    .map((x) => {
      const src = x.src || x.url || x.path;
      const type = x.type || (String(src).toLowerCase().endsWith(".mp4") ? "video" : "image");
      return { type, src, caption: x.caption || "" };
    })
    .filter((x) => x.src);
}

/* ========= i18n ========= */
function setLang(lang) {
  currentLang = lang;
  // سوراني RTL مثل العربي
  document.documentElement.setAttribute("dir", "rtl");
  document.documentElement.setAttribute("lang", lang === "ar" ? "ar" : "ku");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    const val = I18N[currentLang]?.[key];
    if (val) node.textContent = val;
  });
}

/* ========= main fade slider ========= */
function renderMain() {
  const host = $("heroMain");
  if (!host) return;
  host.innerHTML = "";

  ads.forEach((item, idx) => {
    const s = document.createElement("div");
    s.className = "main-slide" + (idx === 0 ? " is-active" : "");

    if (item.type === "video") {
      const v = document.createElement("video");
      v.src = item.src;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.autoplay = true;
      v.preload = "metadata";
      s.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.caption || "إعلان";
      img.loading = "eager";
      s.appendChild(img);
    }

    host.appendChild(s);
  });
}

function setMain(i) {
  const host = $("heroMain");
  if (!host) return;

  const slides = [...host.querySelectorAll(".main-slide")];
  if (!slides.length) return;

  slides[mainIndex]?.classList.remove("is-active");
  mainIndex = (i + slides.length) % slides.length;
  slides[mainIndex]?.classList.add("is-active");

  // تشغيل الفيديو الحالي فقط
  slides.forEach((s, idx) => {
    const v = s.querySelector("video");
    if (v) {
      if (idx === mainIndex) v.play().catch(() => {});
      else v.pause();
    }
  });
}

function startMainAuto() {
  setInterval(() => setMain(mainIndex + 1), 4500);
}

/* ========= strip carousel ========= */
function itemsPerView() {
  const w = window.innerWidth;
  if (w <= 560) return 2;
  if (w <= 980) return 3;
  return 5;
}

function getStripImages() {
  return ads.filter((a) => a.type !== "video");
}

function renderStrip() {
  const track = $("stripTrack");
  if (!track) return;

  const imgs = getStripImages();
  track.innerHTML = "";

  imgs.forEach((item) => {
    const cell = document.createElement("div");
    cell.className = "strip-item";

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.caption || "صورة إعلان";
    img.loading = "lazy";

    cell.addEventListener("click", () => {
      const idxInAds = ads.findIndex((a) => a.src === item.src);
      if (idxInAds >= 0) setMain(idxInAds);
    });

    cell.appendChild(img);
    track.appendChild(cell);
  });

  stripIndex = 0;
  updateStrip();
}

function updateStrip() {
  const track = $("stripTrack");
  if (!track) return;

  const imgs = getStripImages();
  const per = itemsPerView();
  const maxStart = Math.max(0, imgs.length - per);

  stripIndex = Math.max(0, Math.min(stripIndex, maxStart));

  const firstItem = track.querySelector(".strip-item");
  if (!firstItem) return;

  const style = getComputedStyle(track);
  const gap = parseFloat(style.gap || "10") || 10;

  const itemW = firstItem.getBoundingClientRect().width;
  const offset = stripIndex * (itemW + gap);

  // RTL: التحريك باتجاه موجب
  track.style.transform = `translateX(${offset}px)`;
}

function stripNext() {
  const imgs = getStripImages();
  const per = itemsPerView();
  const maxStart = Math.max(0, imgs.length - per);
  stripIndex = Math.min(maxStart, stripIndex + 1);
  updateStrip();
}
function stripPrev() {
  stripIndex = Math.max(0, stripIndex - 1);
  updateStrip();
}

/* ========= animations ========= */
function showSocialWithBounce() {
  const sf = $("socialFloat");
  if (!sf) return;
  setTimeout(() => sf.classList.add("is-show"), 350);
}

function setupRevealOnScroll() {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("is-in");
    });
  }, { threshold: 0.12 });

  els.forEach((el) => io.observe(el));
}

/* ========= contact wiring ========= */
function wireContacts() {
  // Floating buttons
  $("waBtn").href = `https://wa.me/${CONTACT.whatsappE164}`;
  $("fbBtn").href = CONTACT.facebook;
  $("igBtn").href = CONTACT.instagram;
  $("mailBtn").href = `mailto:${CONTACT.email}`;
  $("callBtn").href = `tel:${CONTACT.phoneE164}`;

  // Contact section buttons
  $("waCta").href = `https://wa.me/${CONTACT.whatsappE164}`;
  $("fbCta").href = CONTACT.facebook;
  $("mapCta").href = CONTACT.mapsLink;

  // Text links
  $("emailText").href = `mailto:${CONTACT.email}`;
  $("phoneText").href = `tel:${CONTACT.phoneE164}`;

  // Year
  const y = $("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

/* ========= init ========= */
async function init() {
  // language toggle
  const langBtn = $("langToggle");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      setLang(currentLang === "ar" ? "ku" : "ar");
    });
  }

  // basic wiring
  wireContacts();
  setLang("ar");
  showSocialWithBounce();
  setupRevealOnScroll();

  // strip buttons
  $("stripNext")?.addEventListener("click", stripNext);
  $("stripPrev")?.addEventListener("click", stripPrev);

  window.addEventListener("resize", () => updateStrip());

  // load ads
  try {
    ads = await loadAds();
  } catch (e) {
    ads = [
      { type: "image", src: "ads/ad1.jpeg", caption: "إعلان 1" },
      { type: "image", src: "ads/ad2.jpeg", caption: "إعلان 2" },
      { type: "image", src: "ads/ad3.jpeg", caption: "إعلان 3" },
      { type: "image", src: "ads/ad4.jpeg", caption: "إعلان 4" },
      { type: "image", src: "ads/ad5.jpeg", caption: "إعلان 5" },
      { type: "video", src: "ads/0206 (8).mp4", caption: "فيديو" }
    ];
  }

  renderMain();
  renderStrip();
  startMainAuto();
}

document.addEventListener("DOMContentLoaded", init);