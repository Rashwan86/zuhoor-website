/* public/js/page.js */

const LINKS = {
  whatsapp: "https://wa.me/9647709979459",
  facebook: "https://www.facebook.com/share/1DnGqM4SEx/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/",
  tiktok: "https://tiktok.com/@USERNAME",
  email: "mailto:info@zuhoor.com",
  call: "tel:+9647709979459",
};

const qs = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => [...r.querySelectorAll(s)];
const isMobile = () => window.matchMedia("(max-width: 980px)").matches;

/* ===== Social Links ===== */
function setSocialLinks() {
  const ig = qs("#igBtn");
  const wa = qs("#waBtn");
  const fb = qs("#fbBtn");
  const tt = qs("#ttBtn");
  const mail = qs("#mailBtn");
  const call = qs("#callBtn");

  if (wa) wa.href = LINKS.whatsapp;
  if (fb) fb.href = LINKS.facebook;
  if (ig) ig.href = LINKS.instagram;
  if (tt) tt.href = LINKS.tiktok;
  if (mail) mail.href = LINKS.email;
  if (call) call.href = LINKS.call;
}

/* =========================================================
   ===== Ads loader that works with Live Server paths =======
   - tries: ads/...  public/ads/...  with/without leading /
   - uses ads-manifest.json if exists, otherwise uses main.*
   ========================================================= */

const ADS_BASE_CANDIDATES = [
  "ads",
  "/ads",
  "public/ads",
  "/public/ads",
];

function normalizeBase(base) {
  // remove trailing slash
  return String(base || "").replace(/\/+$/, "");
}

async function headOk(url) {
  try {
    // Live Server أحياناً لا يدعم HEAD، لذلك نستخدم Range GET
    const r = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: { Range: "bytes=0-0" },
    });
    return r.ok || r.status === 206;
  } catch (e) {
    return false;
  }
}

async function firstOk(urls) {
  for (const u of urls) {
    if (await headOk(u)) return u;
  }
  return null;
}

function joinUrl(base, path) {
  base = normalizeBase(base);
  path = String(path || "").replace(/^\/+/, "");
  return `${base}/${path}`;
}

async function detectAdsBase() {
  // نحاول نثبت أي base شغّال فعلاً
  for (const base0 of ADS_BASE_CANDIDATES) {
    const base = normalizeBase(base0);

    // جرّب ملف manifest أو logo
    const ok =
      (await headOk(joinUrl(base, "ads-manifest.json"))) ||
      (await headOk(joinUrl(base, "logo/logo.png"))) ||
      (await headOk(joinUrl(base, "logo/logo.jpg"))) ||
      (await headOk(joinUrl(base, "logo/main.png"))) ||
      (await headOk(joinUrl(base, "media1/main.jpg"))) ||
      (await headOk(joinUrl(base, "media1/main.jpeg"))) ||
      (await headOk(joinUrl(base, "media10/main.mp4")));

    if (ok) return base;
  }

  // إذا ما قدرنا نكتشف، نخليه "ads" كافتراضي
  return "ads";
}

function absIfNeeded(src) {
  // اترك الروابط الخارجية كما هي
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) return src;
  return src; // هنا نرجعها كما هي (نحن أصلاً نركّبها مع base)
}

async function pickMain(base, slot) {
  const basePath = joinUrl(base, `${slot}/main`);

  // جرّب فيديو أولاً
  if (await headOk(basePath + ".mp4")) return { type: "video", src: basePath + ".mp4" };

  // ثم صور
  const exts = ["jpg", "jpeg", "png", "webp"];
  for (const ext of exts) {
    const url = basePath + "." + ext;
    if (await headOk(url)) return { type: "image", src: url };
  }

  return null;
}

async function loadManifestFromJson(base) {
  const manifestUrl = joinUrl(base, "ads-manifest.json");
  const res = await fetch(manifestUrl, { cache: "no-store" });
  if (!res.ok) throw new Error("ads-manifest.json not found");
  const data = await res.json();

  // ✅ إصلاح المسارات: يمنع تكرار ads/ads أو public/ads/ads
  const fixSrc = (src) => {
    if (!src) return "";

    // external/data urls as-is
    if (/^(https?:)?\/\//i.test(src) || /^data:/i.test(src)) return src;

    // clean accidental duplicates (logo.png.png)
    src = String(src).replace(/\.png\.png$/i, ".png")
                     .replace(/\.jpg\.jpg$/i, ".jpg")
                     .replace(/\.jpeg\.jpeg$/i, ".jpeg")
                     .replace(/\.webp\.webp$/i, ".webp");

    // remove leading slash
    src = src.replace(/^\/+/, "");

    // 🔥 أهم سطرين: إذا المانيفست كاتب ads/... أو public/ads/... نشيلهم
    src = src.replace(/^public\/ads\//i, "");
    src = src.replace(/^ads\//i, "");

    // الآن نجمعه مع base الصحيح
    return joinUrl(base, src);
  };

  const out = {};

  // logo
  out.logo = fixSrc(data.logo || "logo/logo.png");

  // media1..media10
  for (let i = 1; i <= 10; i++) {
    const key = `media${i}`;
    const arr = Array.isArray(data[key]) ? data[key] : [];
    out[key] = arr
      .map((x) => {
        if (!x) return null;
        const raw = typeof x === "string" ? x : (x.src || "");
        const src = fixSrc(raw);
        if (!src) return null;

        const type =
          (typeof x === "object" && x.type) ||
          (/\.(mp4|webm|ogg)$/i.test(src) ? "video" : "image");

        return {
          type,
          src,
          caption: (typeof x === "object" && x.caption) ? x.caption : ""
        };
      })
      .filter(Boolean);
  }

  return out;
}

async function loadManifestNoJson(base) {
  const mf = {};
  // logo
  // نجرب عدة أسماء للوغو
// logo (auto-detect any common extension)
// Logo (CASE-SENSITIVE: folder name is "logo" not "Logo")
const logoCandidates = [
  joinUrl(base, "logo/logo.png"),
  joinUrl(base, "logo/logo.webp"),
  joinUrl(base, "logo/logo.svg"),
  joinUrl(base, "logo/logo.jpg"),
  joinUrl(base, "logo/logo.jpeg"),

  joinUrl(base, "logo/main.png"),
  joinUrl(base, "logo/main.webp"),
  joinUrl(base, "logo/main.svg"),
  joinUrl(base, "logo/main.jpg"),
  joinUrl(base, "logo/main.jpeg"),

  // sometimes people use favicon as logo
  joinUrl(base, "logo/favicon.png"),
  joinUrl(base, "logo/favicon.ico"),
];

// لو ما لقاه بالتحقق، نحط مسار افتراضي مباشر (حتى ما يختفي)
mf.logo = (await firstOk(logoCandidates)) || joinUrl(base, "logo/logo.png");

  // media1..media9
  for (let i = 1; i <= 9; i++) {
    const item = await pickMain(base, `media${i}`);
    mf[`media${i}`] = item ? [item] : [];
  }

  // media10: فيديو فقط (main.mp4)
  const v = await pickMain(base, "media10");
  mf.media10 = v && v.type === "video" ? [v] : [];

  return mf;
}

async function initSlots() {
  const base = await detectAdsBase();

  // 1) حاول JSON
  try {
    return await loadManifestFromJson(base);
  } catch (e) {
    // 2) fallback: main.*
    return await loadManifestNoJson(base);
  }
}

/* ===== Typewriter ===== */
function typewrite(el, text, speed = 18) {
  if (!el) return;
  el.textContent = "";
  let i = 0;
  const tick = () => {
    i++;
    el.textContent = text.slice(0, i);
    if (i < text.length) setTimeout(tick, speed);
  };
  setTimeout(tick, 250);
}

/* ===== Simple Slideshow for image boxes ===== */
function startImageBox(boxEl, items, everyMs = 4000) {
  if (!boxEl) return;
  const img = qs("img", boxEl);
  if (!img) return;

  const images = (items || [])
    .map((x) => (typeof x === "string" ? x : x?.src))
    .filter(Boolean)
    .filter((src) => !/\.(mp4|webm|ogg)$/i.test(src));

  if (images.length === 0) {
    img.removeAttribute("src");
    img.alt = "no media";
    return;
  }

  let idx = 0;
  img.src = images[0];

  if (images.length === 1) return;

  setInterval(() => {
    idx = (idx + 1) % images.length;
    img.src = images[idx];
  }, everyMs);
}

/* ===== Video Box (media10) ===== */
function initVideo(videoEl, items) {
  if (!videoEl) return;

  const first = (items || [])
    .map((x) => (typeof x === "string" ? x : x?.src))
    .filter(Boolean)
    .find((src) => /\.(mp4|webm|ogg)$/i.test(src));

  if (!first) return;

  videoEl.src = first;
  videoEl.muted = true;
  videoEl.loop = true;
  videoEl.playsInline = true;
  videoEl.autoplay = true;

  videoEl.play().catch(() => {});
}

/* ===== Strip Slider Builder ===== */
function buildStrip(viewportEl, items) {
  if (!viewportEl) return;
  viewportEl.innerHTML = "";

  const imgs = (items || [])
    .map((x) => (typeof x === "string" ? x : x?.src))
    .filter(Boolean)
    .filter((src) => !/\.(mp4|webm|ogg)$/i.test(src));

  if (imgs.length === 0) {
    const empty = document.createElement("div");
    empty.style.color = "rgba(255,255,255,.75)";
    empty.style.fontWeight = "900";
    empty.textContent = "لا يوجد محتوى في الشريط";
    viewportEl.appendChild(empty);
    return;
  }

  imgs.forEach((src) => {
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
  let auto = setInterval(() => scrollStrip(viewportEl, +1), 4200);

  viewportEl.addEventListener("mouseenter", () => {
    clearInterval(auto);
    auto = null;
  });
  viewportEl.addEventListener("mouseleave", () => {
    if (!auto) auto = setInterval(() => scrollStrip(viewportEl, +1), 4200);
  });
}

function scrollStrip(viewportEl, dir) {
  const card = viewportEl?.querySelector?.(".strip-item");
  if (!card) return;
  const step = card.getBoundingClientRect().width + 14;
  viewportEl.scrollBy({ left: dir * step, behavior: "smooth" });
}

/* ===== Modal ===== */

// ✅ محتوى خاص لنافذة "الخدمات" (HTML كامل داخل المودال)
const SERVICES_HTML = `
  <div class="modal-article">
    <h2>✨ خدمات العمالة المنزلية في العراق</h2>

    <p>
      في شركة <strong>زهور الشرق</strong> لخدمات استقدام الأيادي العاملة الأجنبية والعربية نقدّم مجموعة شاملة من خدمات
      الخادمات والمربيات والعمالة المنزلية في العراق.<br>
      وبصفتنا شركة استقدام مرخصة من وزارة العمل والشؤون الاجتماعية، نضمن أن يتم كل جزء من عملية التوظيف والتدريب
      وإدارة العمالة المنزلية بأسلوب قانوني، شفاف، ومتوافق بالكامل مع لوائح العمالة المنزلية في العراق — لنوفر لك تجربة
      مريحة وخالية من التعقيدات.
    </p>

    <p>
      سواء كنت تبحث عن خادمة مقيمة بدوام كامل، أو مربية مدرّبة، أو طاقم دعم منزلي، فإن فريقنا يقدّم لك خدمة متكاملة
      تشمل الاستقدام، الفحص، التدريب، إصدار التأشيرة، والتوظيف — كل ذلك تحت اسم واحد موثوق يقدم لك ولأسرتك الراحة
      والسهولة والدعم المهني.
    </p>

    <p>
      تم تصميم خدماتنا لتلبية الاحتياجات المتنوعة للعائلات في العراق، مع توفير حلول شفافة ومرنة تتناسب مع طبيعة كل منزل
      وتوقعاته.<br>
      تعرّف أدناه على أبرز الخدمات التي تقدمها شركة زهور الشرق لدعمك في كل خطوة من خطوات استقدام العمالة المنزلية.
    </p>

    <hr>

    <h3>📦 ما نقدّمه لك</h3>

    <h4>🛂 خدمات تأشيرة العمالة المنزلية</h4>
    <p>
      نتولى تنفيذ جميع خطوات إصدار تأشيرة العاملة المنزلية — من تقديم الطلب، والفحص الطبي، وبطاقة الهوية العراقية، إلى
      ختم الإقامة وإجراءات تدبير.<br>
      نضمن لك عملية قانونية، سريعة، وواضحة بالكامل، مع متابعة دقيقة لجميع المتطلبات.
    </p>

    <h4>🏠 خادمات مقيمات بدوام كامل</h4>
    <p>
      للعائلات التي تحتاج إلى دعم منزلي ثابت وطويل المدى، نقدّم خادمات مقيمات مدرّبات على التنظيم، التنظيف، رعاية الأطفال،
      دعم كبار السن، والمهام اليومية.<br>
      هذه الخدمة توفر الاستقرار والراحة، وتضمن وجود مساعدة منزلية محترفة داخل منزلك طوال الوقت.
    </p>

    <h4>🔍 الاستقدام والتوظيف</h4>
    <p>
      نساعدك في العثور على العاملة المناسبة من خلال عملية استقدام دقيقة تشمل فحص الخلفية، تقييم المهارات، المقابلات،
      والتوظيف النهائي.<br>
      سواء كنت تحتاج إلى خادمة، مربية، أو طباخة، فنحن نضمن لك مرشحين يناسبون احتياجاتك اليومية ومعايير أسرتك.
    </p>

    <h4>📚 تدريب الخادمات</h4>
    <p>
      نقدّم برامج تدريبية متخصصة تشمل مهارات التنظيف، معايير النظافة، رعاية الأطفال، أساسيات الطبخ، وإدارة شؤون المنزل.<br>
      نُعدّ العاملات للعمل داخل البيوت العراقية من خلال تدريب مهني يضمن أداءً عالي الجودة وثقة في تنفيذ جميع المهام.
    </p>

    <hr>

    <h3>🌟 لماذا تختار شركة زهور الشرق؟</h3>
    <p>
      في شركة زهور الشرق، لا نكتفي بتقديم خدمات للعمالة المنزلية — بل نقدّم ثقة، راحة، ودعمًا مهنيًا لكل أسرة نتعامل معها.
      ولهذا السبب تُفضّل العائلات في العراق خدماتنا:
    </p>

    <ul>
      <li>✅ مرخّص ومتوافق بالكامل مع قوانين دولة العراق</li>
      <li>💰 أسعار واضحة بدون أي رسوم خفية</li>
      <li>👩‍🔧 عاملات مدرّبات وموثوقات بخبرات مثبتة</li>
      <li>🌐 دعم باللغتين — العربية والإنجليزية</li>
      <li>📑 إجراءات قانونية متكاملة من الاستقدام حتى ختم الإقامة</li>
    </ul>

    <p>نلتزم بتقديم خدمة آمنة، قانونية، وسهلة لجميع العملاء.</p>

    <hr>

    <h3>📍 نخدم جميع محافظات العراق</h3>
    <p>
      نفخر بخدمة العملاء في العراق. مهما كان موقعك، تبقى شركة زهور الشرق شريكك الموثوق لتوفير العمالة المنزلية باحتراف وأمان.
    </p>

    <p>
      📞 إذا كنت بحاجة إلى مساعدة أو ترغب في مناقشة متطلباتك، لا تتردد في التواصل معنا — فريقنا جاهز لإرشادك خطوة بخطوة.
    </p>
  </div>
`;

// ✅ نموذج "اتصل بنا" (يرسل عبر mailto — بدون باك اند)
const CONTACT_HTML = `
  <div class="modal-article">
    <h2>📩 تواصل معنا</h2>
    <p>املأ النموذج أدناه وسنعاود التواصل معك بأقرب وقت.</p>

    <form id="contactForm" class="contact-form" autocomplete="on">
      <label>
        <span>الاسم الكامل</span>
        <input type="text" name="fullName" required placeholder="اكتب اسمك الكامل" />
      </label>

      <label>
        <span>رقم الهاتف أو البريد الإلكتروني</span>
        <input type="text" name="contact" required placeholder="مثال: 0770xxxxxxx أو example@email.com" />
      </label>

      <label>
        <span>نوع الطلب</span>
        <select name="requestType" required>
          <option value="" selected disabled>اختر نوع الطلب</option>
          <option>استقدام خادمة مقيمة</option>
          <option>مربية أطفال</option>
          <option>تأشيرة وإقامة</option>
          <option>تبديل / استبدال عاملة</option>
          <option>استفسار عام</option>
        </select>
      </label>

      <label>
        <span>ملاحظات إضافية (اختياري)</span>
        <textarea name="message" rows="4" placeholder="اكتب تفاصيل مختصرة..."></textarea>
      </label>

      <div class="contact-actions">
        <button type="submit" class="pill is-active">إرسال</button>
        <a class="pill pill-ghost" href="tel:+9647709979459">اتصال مباشر</a>
        <a class="pill pill-ghost" target="_blank" rel="noopener" href="https://wa.me/9647709979459">واتساب</a>
      </div>

      <p class="contact-hint">
        عند الضغط على "إرسال" سيتم فتح تطبيق البريد لديك لتأكيد الإرسال.
      </p>
    </form>
  </div>
`;

// ✅ من نحن (HTML داخل المودال)
const ABOUT_HTML = `
  <div class="modal-article">
    <h2>من نحن</h2>

    <p><strong>شريكك الموثوق لتوظيف العمالة المنزلية بشكل قانوني وأخلاقي في العراق</strong></p>

    <p>
      مرحبًا بكم في شركة زهور الشرق لخدمات توظيف العمالة المساعدة — أحد مراكز تدبير المعتمدة من وزارة العمل والشؤون الاجتماعية،
      ووكالة موثوقة في مجال استقدام الخادمات والعمالة المنزلية في دولة العراق.
      بفضل التزامنا بالجودة والشفافية، أصبحنا من أبرز مكاتب استقدام الخادمات في العراق المعروفة بالاحترافية والموثوقية.
      نحن في زهور الشرق نربط العائلات مع خادمات، مربيات، وطباخات ماهرات من مختلف الجنسيات، بما في ذلك خادمات إثيوبيات،بنغاليات،آسيويات.
      كل عاملة يتم اختيارها بعناية وتدريبها لضمان أعلى معايير الخدمة والرعاية المنزلية.
    </p>

    <hr>

    <h3>رسالتنا</h3>
    <p>
      تهدف رسالتنا في شركة زهور الشرق إلى تمكين العاملات المنزليات من خلال توفير فرص التدريب والتأهيل واكتساب المهارات،
      بما يرفع جودة الخدمات المقدمة داخل المنازل في العراق.
      هذا النهج لا يخدم العاملات فقط، بل يعزز الخبرة التي تحصل عليها الأسر، ويضمن أداءً احترافيًا قائمًا على المعرفة والكفاءة.
      نؤمن بأن كل عاملة تستحق فرصة للتعلم والتطور وتحقيق أهداف مهنية، وبذلك نساهم في رفع مستوى الخدمات المنزلية داخل المجتمع العراقي.
    </p>

    <hr>

    <h3>هدفنا</h3>
    <p>
      هدفنا في زهور الشرق هو خلق تجربة إيجابية ومجزية لكل من العائلات والعاملات، من خلال بيئة يسودها الاحترام والشفافية.
      وبصفتنا مركز خدمات عمالة مساعدة متميز في العراق، نحن نعزز بيئة داعمة ومحترمة، ونهدف إلى بناء مجتمع أقوى وأكثر ازدهاراً.
      ندرك أن استقدام الخادمة أو المربية المناسبة يمكن أن يعزز بشكل كبير حياتكم المنزلية، ونحن هنا لتسهيل هذا التوافق المثالي.
      نعمل باستمرار لتسهيل إجراءات استقدام الخادمات والتعيين المنزلي عبر عملية سريعة وواضحة، مع توفير عقود مرنة تناسب مختلف الاحتياجات
      سواء للتوظيف الشهري أو السنوي أو وفق باقاتنا الخاصة.
      يمكنكم الاطلاع على عروض استقدام خادمات للاختيار من بين خيارات متعددة تناسب ميزانيتكم واحتياجاتكم.
    </p>

    <hr>

    <h3>💛 قيمنا الأساسية</h3>
    <p>
      نستند في عملنا إلى قيم واضحة تشكل كل خطوة في خدمات توظيف واستقدام العمالة المنزلية، لضمان معاملة عادلة ومهنية لكلٍ من الأسر والعاملات:
    </p>

    <ul>
      <li><strong>الشفافية</strong> — تواصل واضح، أسعار صادقة، والتزام قانوني كامل تحت نظام تدبير.</li>
      <li><strong>الجودة</strong> — عاملات مؤهلات ومُدرّبات بمعايير عالية وخبرة معتمدة.</li>
      <li><strong>المسؤولية</strong> — ممارسات توظيف أخلاقية تدعم العاملات وتوفر للأسر خدمة موثوقة ومستمرة.</li>
    </ul>

    <p>
      تشكل هذه القيم أساس عملنا وتعكس التزامنا بتقديم خدمات عمالة منزلية موثوقة وأخلاقية في العراق.
    </p>

    <hr>

    <h3>🧭 منهجية عملنا</h3>
    <p>
      تعتمد خدماتنا على مزيج من الالتزام القانوني والتدريب المهني والإجراءات المنظمة لتقديم تجربة توظيف سهلة وفعّالة دون تعقيدات.
      نقوم بتقييم مهارات العاملات، وتوفير برامج توجيه وتدريب، وإدارة الوثائق، وإتمام إجراءات التأشيرة والإقامة،
      مع دعم مستمر للعائلة والعاملة في جميع مراحل التوظيف — وكل ذلك تحت إشراف رسمي من وزارة العمل والشؤون الاجتماعية ونظام تدبير.
      من خلال مواءمة مهارات العاملات مع احتياجات المنازل عبر منظومة عمل واضحة وشفافة، نضمن تجربة سلسة وناجحة من الاستقدام وحتى بدء العمل.
    </p>
  </div>
`;

/* ===== Modal Content ===== */
const MODAL_CONTENT = {
  services: {
    title: "الخدمات",
    sub: "تفاصيل خدماتنا الكاملة",
    body: SERVICES_HTML,
  },
  offers: {
    title: "العروض",
    sub: "صفحة منبثقة — سيتم تعبئتها لاحقاً.",
  },
  about: {
    title: "من نحن",
    sub: "تعرف على زهور الشرق وقيمنا ومنهجية عملنا",
    body: ABOUT_HTML,
  },
  contact: {
    title: "اتصل بنا",
    sub: "أرسل طلبك وسنتواصل معك",
    body: CONTACT_HTML,
  },
};

function openModal(key) {
  const modal = qs("#modal");
  if (!modal) return;

  const data = MODAL_CONTENT[key] || { title: "نافذة", sub: "...", body: "" };

  const t = qs("#modalTitle");
  const s = qs("#modalSub");
  const body = qs("#modalBody");

  if (t) t.textContent = data.title || "";
  if (s) s.textContent = data.sub || "";

  if (body) {
    if (data.body) {
      body.innerHTML = data.body;
    } else {
      body.innerHTML = `
        <div class="placeholder">
          <div class="ph-title">قريباً</div>
          <div class="ph-text">هذه صفحة منبثقة — سيتم إضافة التفاصيل لاحقاً.</div>
        </div>
      `;
    }
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  if (key === "contact") {
    const form = qs("#contactForm");
    if (form) {
      form.addEventListener(
        "submit",
        (e) => {
          e.preventDefault();

          const fullName = form.fullName?.value?.trim() || "";
          const contact = form.contact?.value?.trim() || "";
          const requestType = form.requestType?.value?.trim() || "";
          const message = form.message?.value?.trim() || "";

          const subject = `طلب تواصل — ${requestType || "غير محدد"} — ${fullName || "بدون اسم"}`;
          const lines = [
            `الاسم الكامل: ${fullName}`,
            `هاتف/إيميل: ${contact}`,
            `نوع الطلب: ${requestType}`,
            "",
            "تفاصيل إضافية:",
            message || "(لا يوجد)",
          ];

          const mailTo = `mailto:info@zuhoor.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            lines.join("\n")
          )}`;
          window.location.href = mailTo;
        },
        { once: true }
      );
    }
  }
}

function closeModal() {
  const modal = qs("#modal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function bindModal() {
  qsa("[data-open]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const key = el.getAttribute("data-open");
      openModal(key);
    });
  });

  const closeBtn = qs("#modalClose");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  const modal = qs("#modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target && e.target.id === "modal") closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* ===== Mobile Menu ===== */
function bindMobileMenu() {
  const btn = qs("#mMenuBtn");
  const drawer = qs("#mDrawer");
  const closeBtn = qs("#mDrawerClose");

  if (!btn || !drawer) return;

  const open = () => {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
  };
  const close = () => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
  };

  btn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);

  drawer.addEventListener("click", (e) => {
    if (e.target && e.target.id === "mDrawer") close();
  });

  qsa(".m-drawer-links a").forEach((a) => {
    a.addEventListener("click", () => close());
  });
}

/* ===== Mobile social throw animation (slower) ===== */
function initMobileAnimations() {
  if (!isMobile()) return;

  const icons = qsa(".m-social .app-btn");
  icons.forEach((el, idx) => {
    const dx = -(80 + Math.random() * 140);
    const dy = -18 + Math.random() * 36;
    const rot = -18 + Math.random() * 36;
    const delay = 0.35 + idx * 0.12;
    el.style.setProperty("--dx", `${dx}px`);
    el.style.setProperty("--dy", `${dy}px`);
    el.style.setProperty("--rot", `${rot}deg`);
    el.style.setProperty("--delay", `${delay}s`);
  });

  setTimeout(() => {
    document.documentElement.classList.add("m-ready");
  }, 260);
}

/* ===== Init ===== */
async function init() {
  setSocialLinks();
  bindModal();
  bindMobileMenu();

  const brandTag = qs("#brandTagline");
  const t1 = brandTag?.getAttribute("data-text") || brandTag?.textContent || "";
  typewrite(brandTag, t1, 16);

  const mTag = qs("#mBrandTag");
  const t2 = mTag?.getAttribute("data-text") || mTag?.textContent || "";
  typewrite(mTag, t2, isMobile() ? 32 : 18);

  const v = qs("#heroVideo");
  const muteBtn = qs("#muteBtn");
  if (muteBtn && v) {
    muteBtn.addEventListener("click", () => {
      v.muted = !v.muted;
      muteBtn.textContent = v.muted ? "🔇" : "🔊";
      if (!v.muted) v.play().catch(() => {});
    });
  }

  const viewport = qs("#stripViewport");
  const prev = qs("#stripPrev");
  const next = qs("#stripNext");
  if (prev && viewport) prev.addEventListener("click", () => scrollStrip(viewport, -1));
  if (next && viewport) next.addEventListener("click", () => scrollStrip(viewport, +1));

  try {
    const mf = await initSlots();

    // Desktop logo
    if (mf.logo) {
      const logo = qs("#logoImg");
      if (logo) logo.src = mf.logo;

      // Mobile logo
      const mLogo = qs("#mLogoImg");
      if (mLogo) mLogo.src = mf.logo;
    }

    // Desktop left boxes
    startImageBox(qs('[data-box="media1"]'), mf.media1, 4000);
    startImageBox(qs('[data-box="media2"]'), mf.media2, 4000);

    // Video
    initVideo(v, mf.media10);

    // Strip:
    const desktopStrip = []
      .concat(mf.media3 || [])
      .concat(mf.media4 || [])
      .concat(mf.media5 || [])
      .concat(mf.media6 || [])
      .concat(mf.media7 || [])
      .concat(mf.media8 || [])
      .concat(mf.media9 || []);

    const mobileStrip = []
      .concat(mf.media1 || [])
      .concat(mf.media2 || [])
      .concat(mf.media3 || [])
      .concat(mf.media4 || [])
      .concat(mf.media5 || [])
      .concat(mf.media6 || [])
      .concat(mf.media7 || [])
      .concat(mf.media8 || [])
      .concat(mf.media9 || []);

    buildStrip(viewport, isMobile() ? mobileStrip : desktopStrip);
  } catch (err) {
    console.warn("initSlots failed:", err);
  }

  initMobileAnimations();

  let lastMobile = isMobile();
  window.addEventListener("resize", () => {
    const nowMobile = isMobile();
    if (nowMobile !== lastMobile) {
      lastMobile = nowMobile;
      location.reload();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);