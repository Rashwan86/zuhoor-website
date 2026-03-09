"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Lang = "ar" | "en";
type ServiceType = "recruitment" | "housemaid" | "general";

const TEXT: Record<Lang, any> = {
  ar: {
    dir: "rtl",
    appName: "ZUHOOR ALSHARQ",
    welcome: "أهلًا بك في",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    services: "خدماتنا",
    servicesHint: "اضغط على أي خدمة لعرض التفاصيل",
    more: "المزيد",
    about: "من نحن",
    aboutText:
      "شركة متخصصة باستقدام الأيدي العاملة ومتابعة الإجراءات القانونية والإقامة وتوفير حلول السكن/النقل عند الحاجة.",
    ads: "الإعلانات",
    photos: "صور",
    videos: "فيديو",
    requestService: "طلب خدمة",
    requestServiceDesc: "أرسل طلبك وسنتواصل معك بأسرع وقت",
    serviceType: "نوع الطلب",
    recruitment: "طلب استقدام (أيدي عاملة)",
    housemaid: "طلب عاملة منزلية",
    general: "طلب عام",
    fullName: "الاسم الكامل",
    phone: "رقم الهاتف",
    city: "المدينة",
    details: "تفاصيل الطلب",
    submit: "إرسال الطلب",
    sending: "جارٍ الإرسال...",
    sentOk: "تم إرسال الطلب (واجهة) ✅ سنربطه بالباك-إند لاحقًا.",
    close: "إغلاق",
    contact: "تواصل معنا",
    whatsapp: "واتساب",
    facebook: "فيسبوك",
    instagram: "إنستغرام",
    tiktok: "تيك توك",
    email: "إيميل",
    call: "اتصال",
    payment: "الدفع الإلكتروني",
    payHint:
      "هذه واجهة دفع (زر يفتح رابط). نربطها لاحقًا ببوابة دفع كي كارد/زين كاش.",
    kcard: "Ki Card",
    zaincash: "Zain Cash",
    open: "فتح",
    language: "AR",
    home: "الرئيسية",
    navServices: "خدمات",
    profile: "الشخصي",
  },
  en: {
    dir: "ltr",
    appName: "ZUHOOR ALSHARQ",
    welcome: "Welcome to",
    login: "Login",
    register: "Create account",
    services: "Our services",
    servicesHint: "Tap any service to view details",
    more: "More",
    about: "About us",
    aboutText:
      "We specialize in recruitment, legal follow-up & residency, and optional housing/transport solutions when needed.",
    ads: "Ads",
    photos: "Photos",
    videos: "Video",
    requestService: "Request a service",
    requestServiceDesc: "Send your request and we’ll contact you ASAP",
    serviceType: "Request type",
    recruitment: "Recruitment request",
    housemaid: "Housemaid request",
    general: "General request",
    fullName: "Full name",
    phone: "Phone",
    city: "City",
    details: "Request details",
    submit: "Submit request",
    sending: "Sending...",
    sentOk: "Request sent (UI) ✅ we’ll connect it to backend later.",
    close: "Close",
    contact: "Contact us",
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    email: "Email",
    call: "Call",
    payment: "Online payment",
    payHint:
      "This is a UI button that opens a link. We’ll later integrate K-Card / ZainCash gateway.",
    kcard: "Ki Card",
    zaincash: "Zain Cash",
    open: "Open",
    language: "EN",
    home: "Home",
    navServices: "Services",
    profile: "Profile",
  },
};

// ⭐ عدّل الروابط والأرقام هنا مرة واحدة فقط
const CONTACT = {
  whatsappNumber: "9647XXXXXXXXX", // مثال: 9647700000000
  phoneNumber: "9647XXXXXXXXX",
  email: "info@zuhoor-alsharq.com",
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/@",
  // روابط الدفع (ضع روابطك لاحقًا)
  kcardPayLink: "https://example.com/kcard-pay",
  zaincashPayLink: "https://example.com/zaincash-pay",
};

function cx(...arr: Array<string | false | undefined | null>) {
  return arr.filter(Boolean).join(" ");
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = TEXT[lang];

  // ====== Media from API ======
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ====== Modals ======
  const [openRequest, setOpenRequest] = useState(false);
  const [openPay, setOpenPay] = useState(false);

  // ====== Request form ======
  const [serviceType, setServiceType] = useState<ServiceType>("recruitment");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState<string | null>(null);

  useEffect(() => {
    // ضبط اتجاه الصفحة
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((data) => {
        setPhotos(data.photos || []);
        setVideos(data.videos || []);
      })
      .catch(() => {
        setPhotos([]);
        setVideos([]);
      });
  }, []);

  // photo carousel
  useEffect(() => {
    if (!photos.length) return;
    const timer = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % photos.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [photos]);

  function handleVideoEnd() {
    if (!videos.length) return;
    if (videos.length === 1) {
      videoRef.current?.play();
    } else {
      setVideoIndex((i) => (i + 1) % videos.length);
    }
  }

  const servicesList = useMemo(
    () => [
      {
        titleAr: "استقدام الأيدي العاملة عند الطلب",
        titleEn: "Recruitment on-demand",
        descAr: "توفير عمالة مناسبة بسرعة حسب احتياج شركتك.",
        descEn: "Fast hiring of suitable workers based on your needs.",
      },
      {
        titleAr: "متابعة قانونية وإقامة",
        titleEn: "Legal follow-up & residency",
        descAr: "متابعة إجراءات الفيزا والإقامة والتجديد.",
        descEn: "Visa/residency procedures and renewals.",
      },
      {
        titleAr: "سكن/نقل عند الحاجة",
        titleEn: "Housing/transport if needed",
        descAr: "حلول سكن ونقل مريحة حسب الاتفاق.",
        descEn: "Optional housing and transport solutions.",
      },
      {
        titleAr: "استبدال/ضمان حسب الشروط",
        titleEn: "Replacement options (terms apply)",
        descAr: "خيارات استبدال ضمن شروط محددة.",
        descEn: "Replacement options under specific terms.",
      },
    ],
    []
  );

  async function submitRequest() {
    setSentMsg(null);
    setSending(true);
    try {
      // حاليا: واجهة فقط (نربطه بباك-إند لاحقًا)
      // لاحقًا سنعمل POST إلى /api/request
      await new Promise((r) => setTimeout(r, 500));
      setSentMsg(t.sentOk);
      setFullName("");
      setPhone("");
      setCity("");
      setDetails("");
      setServiceType("recruitment");
    } finally {
      setSending(false);
    }
  }

  const goldBorder = "border border-yellow-600/40";
  const goldText = "text-yellow-400";
  const goldGlow = "shadow-[0_0_60px_rgba(234,179,8,0.12)]";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* خلفية خطوط مائلة بسيطة */}
      <div className="pointer-events-none fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,transparent_48%,rgba(234,179,8,0.35)_49%,transparent_50%,transparent_100%)] [background-size:22px_22px]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 px-4 py-4">
        <div className={cx("mx-auto max-w-6xl rounded-2xl bg-white/5 backdrop-blur", goldBorder, goldGlow)}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <span className={cx("font-bold", goldText)}>ZA</span>
              </div>
              <div className="leading-tight">
                <div className={cx("font-semibold tracking-wide", goldText)}>{t.appName}</div>
                <div className="text-xs text-white/60">{t.welcome}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang((p) => (p === "ar" ? "en" : "ar"))}
                className={cx(
                  "rounded-xl px-3 py-2 text-sm",
                  goldBorder,
                  "bg-black/40 hover:bg-black/60"
                )}
              >
                {t.language}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 px-4 pb-10">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Media column */}
          <section className="lg:col-span-5 space-y-6">
            {/* Ads photos */}
            <div className={cx("rounded-2xl overflow-hidden bg-white/5 backdrop-blur", goldBorder, goldGlow)}>
              <div className="flex items-center justify-between px-4 py-3">
                <div className={cx("font-semibold", goldText)}>{t.ads} — {t.photos}</div>
                <div className="text-xs text-white/60">
                  {photos.length ? `${photoIndex + 1}/${photos.length}` : "—"}
                </div>
              </div>
              <div className="h-[320px] w-full bg-black/40">
                {photos.length ? (
                  <img
                    src={photos[photoIndex]}
                    className="w-full h-full object-cover"
                    alt="ad"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-white/40 text-sm">
                    No photos found in /public/ads/photo
                  </div>
                )}
              </div>
            </div>

            {/* Ads video */}
            <div className={cx("rounded-2xl overflow-hidden bg-white/5 backdrop-blur", goldBorder, goldGlow)}>
              <div className="flex items-center justify-between px-4 py-3">
                <div className={cx("font-semibold", goldText)}>{t.ads} — {t.videos}</div>
                <div className="text-xs text-white/60">
                  {videos.length ? `${videoIndex + 1}/${videos.length}` : "—"}
                </div>
              </div>
              <div className="h-[320px] w-full bg-black/40">
                {videos.length ? (
                  <video
                    ref={videoRef}
                    src={videos[videoIndex]}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                    onEnded={handleVideoEnd}
                    controls
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-white/40 text-sm">
                    No videos found in /public/ads/video
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right / Content column */}
          <section className="lg:col-span-7 space-y-6">
            {/* Hero */}
            <div className={cx("rounded-2xl p-6 bg-white/5 backdrop-blur", goldBorder, goldGlow)}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-white/70">{t.welcome}</div>
                  <h1 className={cx("mt-1 text-3xl md:text-4xl font-bold", goldText)}>
                    {t.appName}
                  </h1>
                  <p className="mt-3 text-white/70 leading-relaxed">
                    {t.aboutText}
                  </p>
                </div>

                <button
                  onClick={() => setLang((p) => (p === "ar" ? "en" : "ar"))}
                  className={cx("rounded-xl px-3 py-2 text-xs", goldBorder, "bg-black/40 hover:bg-black/60")}
                >
                  {lang === "ar" ? "EN" : "AR"}
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                  href="/login"
                  className={cx(
                    "rounded-xl px-4 py-4 font-semibold text-black text-center",
                    "bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 hover:brightness-110 transition"
                  )}
                >
                  {t.login}
                </a>

                <a
                  href="/login"
                  className={cx(
                    "rounded-xl px-4 py-4 font-semibold text-center",
                    goldBorder,
                    goldText,
                    "bg-black/40 hover:bg-black/60 transition"
                  )}
                >
                  {t.register}
                </a>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => setOpenRequest(true)}
                  className={cx(
                    "rounded-xl px-4 py-4 font-semibold text-center",
                    "bg-white/10 hover:bg-white/15 transition",
                    goldBorder
                  )}
                >
                  {t.requestService}
                </button>

                <button
                  onClick={() => setOpenPay(true)}
                  className={cx(
                    "rounded-xl px-4 py-4 font-semibold text-center",
                    "bg-white/10 hover:bg-white/15 transition",
                    goldBorder
                  )}
                >
                  {t.payment}
                </button>
              </div>
            </div>

            {/* Services */}
            <div className={cx("rounded-2xl p-6 bg-white/5 backdrop-blur", goldBorder, goldGlow)}>
              <div className="flex items-center justify-between">
                <h2 className={cx("text-xl font-bold", goldText)}>{t.services}</h2>
                <span className="text-xs text-white/60">{t.servicesHint}</span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {servicesList.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setOpenRequest(true)}
                    className={cx(
                      "rounded-xl p-4 text-left bg-black/35 hover:bg-black/50 transition",
                      goldBorder
                    )}
                  >
                    <div className={cx("font-semibold", goldText)}>
                      {lang === "ar" ? s.titleAr : s.titleEn}
                    </div>
                    <div className="mt-1 text-sm text-white/70">
                      {lang === "ar" ? s.descAr : s.descEn}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className={cx("rounded-2xl p-6 bg-white/5 backdrop-blur", goldBorder, goldGlow)}>
              <h2 className={cx("text-xl font-bold", goldText)}>{t.contact}</h2>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                <a
                  className={cx("rounded-xl p-3 text-center bg-black/35 hover:bg-black/50 transition", goldBorder)}
                  href={`https://wa.me/${CONTACT.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.whatsapp}
                </a>

                <a
                  className={cx("rounded-xl p-3 text-center bg-black/35 hover:bg-black/50 transition", goldBorder)}
                  href={CONTACT.facebook}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.facebook}
                </a>

                <a
                  className={cx("rounded-xl p-3 text-center bg-black/35 hover:bg-black/50 transition", goldBorder)}
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.instagram}
                </a>

                <a
                  className={cx("rounded-xl p-3 text-center bg-black/35 hover:bg-black/50 transition", goldBorder)}
                  href={CONTACT.tiktok}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.tiktok}
                </a>

                <a
                  className={cx("rounded-xl p-3 text-center bg-black/35 hover:bg-black/50 transition", goldBorder)}
                  href={`mailto:${CONTACT.email}`}
                >
                  {t.email}
                </a>

                <a
                  className={cx("rounded-xl p-3 text-center bg-black/35 hover:bg-black/50 transition", goldBorder)}
                  href={`tel:${CONTACT.phoneNumber}`}
                >
                  {t.call}
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom mobile nav (اختياري - يعطي شكل تطبيق) */}
      <nav className={cx("fixed bottom-0 left-0 right-0 z-20 lg:hidden", "px-4 pb-4")}>
        <div className={cx("mx-auto max-w-6xl rounded-2xl bg-black/60 backdrop-blur", goldBorder)}>
          <div className="grid grid-cols-4 py-3 text-xs">
            <a href="/" className="text-center text-white/80 hover:text-white">{t.home}</a>
            <button onClick={() => setOpenRequest(true)} className="text-center text-white/80 hover:text-white">
              {t.navServices}
            </button>
            <a href="/login" className="text-center text-white/80 hover:text-white">{t.profile}</a>
            <a href={`tel:${CONTACT.phoneNumber}`} className="text-center text-white/80 hover:text-white">{t.call}</a>
          </div>
        </div>
      </nav>

      {/* ===== Request Modal ===== */}
      {openRequest && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpenRequest(false)} />
          <div className={cx("relative w-full max-w-xl rounded-2xl p-6 bg-[#0b0b0b]", goldBorder, goldGlow)}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className={cx("text-lg font-bold", goldText)}>{t.requestService}</div>
                <div className="text-sm text-white/60">{t.requestServiceDesc}</div>
              </div>
              <button
                className={cx("rounded-xl px-3 py-2 text-sm", goldBorder, "bg-black/40 hover:bg-black/60")}
                onClick={() => setOpenRequest(false)}
              >
                {t.close}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/70 mb-1">{t.serviceType}</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as ServiceType)}
                  className={cx("w-full rounded-xl px-3 py-3 bg-black/40 text-white outline-none", goldBorder)}
                >
                  <option value="recruitment">{t.recruitment}</option>
                  <option value="housemaid">{t.housemaid}</option>
                  <option value="general">{t.general}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">{t.city}</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={cx("w-full rounded-xl px-3 py-3 bg-black/40 text-white outline-none", goldBorder)}
                  placeholder={lang === "ar" ? "بغداد / أربيل ..." : "Baghdad / Erbil ..."}
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">{t.fullName}</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={cx("w-full rounded-xl px-3 py-3 bg-black/40 text-white outline-none", goldBorder)}
                  placeholder={lang === "ar" ? "اكتب اسمك" : "Your name"}
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">{t.phone}</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={cx("w-full rounded-xl px-3 py-3 bg-black/40 text-white outline-none", goldBorder)}
                  placeholder={lang === "ar" ? "07xx..." : "+964..."}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-white/70 mb-1">{t.details}</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  className={cx("w-full rounded-xl px-3 py-3 bg-black/40 text-white outline-none", goldBorder)}
                  placeholder={
                    lang === "ar"
                      ? "مثال: جنسية العامل، العدد، نوع العمل، مدة العقد..."
                      : "Example: nationality, count, role, contract duration..."
                  }
                />
              </div>
            </div>

            {sentMsg && (
              <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                {sentMsg}
              </div>
            )}

            <div className="mt-5 flex flex-col md:flex-row gap-3">
              <button
                disabled={sending}
                onClick={submitRequest}
                className={cx(
                  "w-full rounded-xl px-4 py-3 font-semibold text-black",
                  "bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 hover:brightness-110 transition",
                  sending && "opacity-60 cursor-not-allowed"
                )}
              >
                {sending ? t.sending : t.submit}
              </button>

              <a
                className={cx("w-full rounded-xl px-4 py-3 font-semibold text-center", goldBorder, "bg-black/40 hover:bg-black/60")}
                href={`https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
                  lang === "ar"
                    ? "مرحباً، أريد تقديم طلب خدمة."
                    : "Hello, I want to request a service."
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                {t.whatsapp}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ===== Payment Modal ===== */}
      {openPay && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpenPay(false)} />
          <div className={cx("relative w-full max-w-lg rounded-2xl p-6 bg-[#0b0b0b]", goldBorder, goldGlow)}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className={cx("text-lg font-bold", goldText)}>{t.payment}</div>
                <div className="text-sm text-white/60">{t.payHint}</div>
              </div>
              <button
                className={cx("rounded-xl px-3 py-2 text-sm", goldBorder, "bg-black/40 hover:bg-black/60")}
                onClick={() => setOpenPay(false)}
              >
                {t.close}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href={CONTACT.kcardPayLink}
                target="_blank"
                rel="noreferrer"
                className={cx(
                  "rounded-xl p-4 text-center font-semibold text-black",
                  "bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 hover:brightness-110 transition"
                )}
              >
                {t.kcard} — {t.open}
              </a>

              <a
                href={CONTACT.zaincashPayLink}
                target="_blank"
                rel="noreferrer"
                className={cx(
                  "rounded-xl p-4 text-center font-semibold",
                  goldBorder,
                  goldText,
                  "bg-black/40 hover:bg-black/60 transition"
                )}
              >
                {t.zaincash} — {t.open}
              </a>
            </div>

            <div className="mt-4 text-xs text-white/50">
              * لاحقًا نضيف صفحة دفع حقيقية + توليد فاتورة + تأكيد عملية الدفع.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}