"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// استيرادFramers Motion للحركات المعقدة
import { motion, AnimatePresence } from "framer-motion";

type Lang = "ar" | "en";
type ServiceType = "recruitment" | "housemaid" | "general";

// تم استبدال any بـ Record<string, string> لحل مشكلة Typescript
const TEXT: Record<Lang, Record<string, string>> = {
  ar: {
    dir: "rtl",
    appName: "ZUHOOR ALSHARQ",
    welcome: "أهلًا بك في",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    services: "خدماتنا",
    servicesHint: "نقدم أفضل الخدمات لتسهيل أعمالكم",
    workers: "الأيدي العاملة المتوفرة",
    workersHint: "نخبة من الكفاءات من مختلف الجنسيات",
    more: "المزيد",
    about: "من نحن",
    aboutText:
      "شركة زهور الشرق هي شركة متخصصة باستقدام الأيدي العاملة ومتابعة الإجراءات القانونية والإقامة، وتوفير حلول السكن والنقل عند الحاجة. نسعى دائماً لتقديم أفضل الكفاءات لتلبية احتياجاتكم.",
    ads: "أحدث الإعلانات",
    photos: "الصور",
    videos: "الفيديو",
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
    maps: "موقعنا على الخريطة",
    payment: "الدفع الإلكتروني",
    payHint: "بوابة الدفع الإلكتروني الموثوقة",
    kcard: "Ki Card",
    zaincash: "Zain Cash",
    open: "فتح",
    language: "AR",
    home: "الرئيسية",
    navServices: "خدمات",
    profile: "الشخصي",
    nationality: "الجنسية : ",
    menu: "القائمة",
  },
  en: {
    dir: "ltr",
    appName: "ZUHOOR ALSHARQ",
    welcome: "Welcome to",
    login: "Login",
    register: "Create account",
    services: "Our services",
    servicesHint: "Providing the best services to ease your work",
    workers: "Available Manpower",
    workersHint: "Top talents from various nationalities",
    more: "More",
    about: "About us",
    aboutText:
      "Zuhoor Alsharq specializes in recruitment, legal follow-up & residency, and optional housing/transport solutions. We strive to provide the best talents for your needs.",
    ads: "Latest Ads",
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
    maps: "Our Location",
    payment: "Online payment",
    payHint: "Secure online payment gateway",
    kcard: "Ki Card",
    zaincash: "Zain Cash",
    open: "Open",
    language: "EN",
    home: "Home",
    navServices: "Services",
    profile: "Profile",
    nationality: "Nationality : ",
    menu: "Menu",
  },
};

const CONTACT = {
  whatsappNumber: "9647XXXXXXXXX",
  phoneNumber: "9647XXXXXXXXX",
  email: "info@zuhoor-alsharq.com",
  facebook: "https://facebook.com/",
  instagram: "https://www.instagram.com/zuhur_alsharq?igsh=bHQxcHI3ejY1YXZz",
  tiktok: "https://tiktok.com/@",
  maps: "https://maps.app.goo.gl/TPaxk3uHqUKroLp57",
  kcardPayLink: "https://example.com/kcard-pay",
  zaincashPayLink: "https://example.com/zaincash-pay",
};

const WORKERS = [
  {
    id: 1,
    jobAr: "مدبرة منزل",
    jobEn: "Housemaid",
    natAr: "أوغندا",
    natEn: "Uganda",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    jobAr: "مصففة شعر",
    jobEn: "Hairdresser",
    natAr: "لبنان",
    natEn: "Lebanon",
    img: "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    jobAr: "رعاية مسنين",
    jobEn: "Elderly Care",
    natAr: "نيجيريا",
    natEn: "Nigeria",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    jobAr: "موظفة استقبال",
    jobEn: "Receptionist",
    natAr: "سوريا",
    natEn: "Syria",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
  },
];

function cx(...arr: Array<string | false | undefined | null>) {
  return arr.filter(Boolean).join(" ");
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = TEXT[lang];

  // ===== Modals & Menus State =====
  const [openMenu, setOpenMenu] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);
  const [openServicesModal, setOpenServicesModal] = useState(false);
  const [openRequest, setOpenRequest] = useState(false);
  const [openPay, setOpenPay] = useState(false);

  // ===== Form State =====
  const [serviceType, setServiceType] = useState<ServiceType>("recruitment");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState<string | null>(null);

  // ===== Dynamic Media State (Photos & Videos from public folder) =====
  // تمت إعادة كود جلب الصور التلقائي هنا
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  // Fetch Media
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

  // Photo Carousel Timer
  useEffect(() => {
    if (!photos.length) return;
    const timer = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % photos.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [photos]);

  // Video End Handler
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
        icon: "✨",
        titleAr: "استقدام الأيدي العاملة",
        titleEn: "Recruitment Services",
        descAr: "توفير عمالة مناسبة بسرعة حسب احتياج شركتك.",
        descEn: "Fast hiring of suitable workers based on your needs.",
      },
      {
        icon: "⚖️",
        titleAr: "متابعة قانونية وإقامة",
        titleEn: "Legal & Residency",
        descAr: "متابعة إجراءات الفيزا والإقامة والتجديد.",
        descEn: "Visa/residency procedures and renewals.",
      },
      {
        icon: "🏢",
        titleAr: "سكن ونقل",
        titleEn: "Housing & Transport",
        descAr: "حلول سكن ونقل مريحة وآمنة حسب الاتفاق.",
        descEn: "Optional housing and transport solutions.",
      },
      {
        icon: "🤝",
        titleAr: "استبدال وضمان",
        titleEn: "Warranty & Replacement",
        descAr: "خيارات استبدال مرنة ضمن شروط محددة.",
        descEn: "Flexible replacement options under specific terms.",
      },
    ],
    [],
  );

  async function submitRequest() {
    setSentMsg(null);
    setSending(true);
    try {
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

  const goldBorder = "border border-[#D4AF37]/40";
  const goldText = "text-[#FFD700]";
  const goldGlow = "shadow-[0_0_25px_rgba(255,215,0,0.1)]";
  const cardHoverMotion =
    "transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,215,0,0.15)] hover:border-[#FFD700]/70";

  // Framer Motion Animation Settings
  const titleAnim = {
    hidden: { opacity: 0, x: t.dir === "rtl" ? 100 : -100 }, // دخول من اليمين في العربي
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: [0.6, 0.05, -0.01, 0.9] },
    },
  };

  const logoAnim = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, delay: 1, ease: [0.6, 0.05, -0.01, 0.9] }, // تأخير بعد العنوان
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden relative">
      <div className="pointer-events-none fixed inset-0 opacity-40 z-0">
        <div className="absolute -top-44 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-[#FFD700]/10 blur-3xl" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[#FFF4B0]/5 blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 px-4 py-4">
        <div
          className={cx(
            "mx-auto max-w-7xl rounded-2xl bg-black/60 backdrop-blur-xl",
            goldBorder,
            goldGlow,
          )}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#8B7500] to-[#FFD700] flex items-center justify-center shadow-lg">
                <span className="font-bold text-black text-xl">ZA</span>
              </div>
              <div className="leading-tight">
                <div
                  className={cx(
                    "font-bold text-lg tracking-wide bg-gradient-to-r from-[#8B7500] via-[#FFD700] to-[#FFF4B0] bg-clip-text text-transparent",
                  )}
                >
                  {t.appName}
                </div>
                <div className="text-xs text-white/60 mt-1">{t.welcome}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Desktop Menu Links */}
              <div className="hidden md:flex items-center gap-6 mx-4">
                <button
                  onClick={() => setOpenAbout(true)}
                  className="text-sm font-medium hover:text-[#FFD700] transition"
                >
                  {t.about}
                </button>
                <button
                  onClick={() => setOpenServicesModal(true)}
                  className="text-sm font-medium hover:text-[#FFD700] transition"
                >
                  {t.services}
                </button>
              </div>

              <button
                onClick={() => setLang((p) => (p === "ar" ? "en" : "ar"))}
                className={cx(
                  "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                  goldBorder,
                  "bg-black/50 hover:bg-[#FFD700]/10 text-[#FFD700]",
                )}
              >
                {t.language}
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className={cx(
                  "md:hidden rounded-xl px-3 py-2 text-lg font-medium transition-colors",
                  goldBorder,
                  "bg-black/50 hover:bg-[#FFD700]/10 text-[#FFD700]",
                )}
              >
                ☰
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {openMenu && (
            <div className="md:hidden border-t border-[#D4AF37]/20 bg-black/80 rounded-b-2xl p-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  setOpenAbout(true);
                  setOpenMenu(false);
                }}
                className={cx(
                  "text-right font-bold py-2 border-b border-white/5",
                  goldText,
                )}
              >
                {t.about}
              </button>
              <button
                onClick={() => {
                  setOpenServicesModal(true);
                  setOpenMenu(false);
                }}
                className={cx("text-right font-bold py-2", goldText)}
              >
                {t.services}
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 px-4 pb-24">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* Hero Section with Animation */}
          <section
            className={cx(
              "relative overflow-hidden rounded-3xl p-8 md:p-12 bg-black/40 backdrop-blur-md text-center md:text-start flex flex-col md:flex-row items-center justify-between gap-8",
              goldBorder,
              goldGlow,
            )}
          >
            <div className="flex-1 space-y-6">
              {/* العنوان مع حركة الدخول واللمعان */}
              <motion.h1
                variants={titleAnim}
                initial="hidden"
                animate="visible"
                className={cx(
                  "relative text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight inline-block",
                )}
              >
                <span className="bg-gradient-to-r from-[#8B7500] via-[#FFD700] to-[#FFF4B0] bg-clip-text text-transparent">
                  {t.appName}
                </span>
                {/* تأثير لمعان ضوء CSS */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 [mask-image:linear-gradient(110deg,#000_10%,transparent_10%,transparent_90%,#000_90%)] transition-transform duration-1000 -translate-x-full hover:translate-x-full" />
              </motion.h1>

              <p className="text-lg text-white/70 max-w-xl leading-relaxed">
                {t.aboutText}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                <button
                  onClick={() => setOpenRequest(true)}
                  className="rounded-xl px-8 py-4 font-bold text-black bg-gradient-to-r from-[#8B7500] via-[#FFD700] to-[#FFF4B0] hover:brightness-110 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all hover:scale-105"
                >
                  {t.requestService}
                </button>
                <Link
                  href="/login"
                  className={cx(
                    "rounded-xl px-8 py-4 font-bold transition-all hover:scale-105",
                    goldBorder,
                    goldText,
                    "bg-black/40 hover:bg-[#FFD700]/10",
                  )}
                >
                  {t.login}
                </Link>
              </div>
            </div>

            {/* مربع الشعار مع حركة الدخول المتتابعة */}
            <motion.div
              variants={logoAnim}
              initial="hidden"
              animate="visible"
              className="hidden md:block w-1/3 h-64 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-transparent border border-[#FFD700]/30 relative overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center text-[#FFD700]/50 font-bold text-2xl">
                ZUHOOR ALSHARQ
              </div>
            </motion.div>
          </section>

          {/* Dynamic Media Section (الإعلانات - Photos & Videos) */}
          {(photos.length > 0 || videos.length > 0) && (
            <section>
              <div className="flex items-end justify-between mb-8 border-b border-[#D4AF37]/20 pb-4">
                <div>
                  <h2
                    className={cx(
                      "text-3xl font-bold bg-gradient-to-r from-[#8B7500] via-[#FFD700] to-[#FFF4B0] bg-clip-text text-transparent mb-2",
                    )}
                  >
                    {t.ads}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Photos Card */}
                {photos.length > 0 && (
                  <div
                    className={cx(
                      "rounded-2xl overflow-hidden bg-black/60 backdrop-blur-md flex flex-col group",
                      goldBorder,
                      cardHoverMotion,
                    )}
                  >
                    <div className="flex justify-between items-center p-4 bg-black/80 border-b border-[#D4AF37]/20">
                      <h3 className={cx("font-bold text-lg", goldText)}>
                        📸 {t.photos}
                      </h3>
                      <span className="text-xs text-white/50">
                        {photoIndex + 1} / {photos.length}
                      </span>
                    </div>
                    <div className="h-[300px] relative w-full">
                      <Image
                        src={photos[photoIndex]}
                        alt="Ad"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                )}

                {/* Videos Card */}
                {videos.length > 0 && (
                  <div
                    className={cx(
                      "rounded-2xl overflow-hidden bg-black/60 backdrop-blur-md flex flex-col group",
                      goldBorder,
                      cardHoverMotion,
                    )}
                  >
                    <div className="flex justify-between items-center p-4 bg-black/80 border-b border-[#D4AF37]/20">
                      <h3 className={cx("font-bold text-lg", goldText)}>
                        🎥 {t.videos}
                      </h3>
                      <span className="text-xs text-white/50">
                        {videoIndex + 1} / {videos.length}
                      </span>
                    </div>
                    <div className="h-[300px] relative w-full bg-black/90">
                      <video
                        ref={videoRef}
                        src={videos[videoIndex]}
                        className="w-full h-full object-contain"
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleVideoEnd}
                        controls
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Services Cards */}
          <section>
            <div className="text-center mb-10">
              <h2
                className={cx(
                  "text-3xl font-bold bg-gradient-to-r from-[#8B7500] via-[#FFD700] to-[#FFF4B0] bg-clip-text text-transparent inline-block mb-3",
                )}
              >
                {t.services}
              </h2>
              <p className="text-white/60">{t.servicesHint}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicesList.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setOpenServicesModal(true)}
                  className={cx(
                    "group cursor-pointer rounded-2xl p-6 bg-black/50 backdrop-blur-sm relative overflow-hidden",
                    goldBorder,
                    cardHoverMotion,
                  )}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FFD700]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <h3 className={cx("text-xl font-bold mb-2", goldText)}>
                    {lang === "ar" ? s.titleAr : s.titleEn}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {lang === "ar" ? s.descAr : s.descEn}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Workers Section */}
          <section>
            <div className="flex items-end justify-between mb-8 border-b border-[#D4AF37]/20 pb-4">
              <div>
                <h2
                  className={cx(
                    "text-3xl font-bold bg-gradient-to-r from-[#8B7500] via-[#FFD700] to-[#FFF4B0] bg-clip-text text-transparent mb-2",
                  )}
                >
                  {t.workers}
                </h2>
                <p className="text-white/60">{t.workersHint}</p>
              </div>
              <button
                onClick={() => setOpenRequest(true)}
                className={cx(
                  "hidden sm:block text-sm font-semibold hover:underline",
                  goldText,
                )}
              >
                {t.more} ←
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {WORKERS.map((worker) => (
                <div
                  key={worker.id}
                  className={cx(
                    "rounded-2xl overflow-hidden bg-black/60 backdrop-blur-md flex flex-col group",
                    goldBorder,
                    cardHoverMotion,
                  )}
                >
                  <div className="h-56 overflow-hidden relative">
                    <Image
                      src={worker.img}
                      alt={worker.jobEn}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-center items-center text-center relative -mt-8 bg-black/80 rounded-t-2xl mx-2 mb-2 border border-[#D4AF37]/20 shadow-lg">
                    <h3 className={cx("text-lg font-bold mb-1", goldText)}>
                      {lang === "ar" ? worker.jobAr : worker.jobEn}
                    </h3>
                    <p className="text-sm text-white/70">
                      <span className="text-[#FFD700]/60">{t.nationality}</span>
                      {lang === "ar" ? worker.natAr : worker.natEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setOpenRequest(true)}
              className={cx(
                "w-full mt-6 py-4 rounded-xl block sm:hidden text-center text-sm font-semibold border border-[#D4AF37]/30 bg-[#FFD700]/5",
                goldText,
              )}
            >
              {t.more}
            </button>
          </section>

          {/* Contact Section */}
          <section
            className={cx(
              "rounded-3xl p-8 bg-black/40 backdrop-blur-md border border-[#D4AF37]/30",
              goldGlow,
            )}
          >
            <div className="text-center mb-8">
              <h2 className={cx("text-3xl font-bold mb-2", goldText)}>
                {t.contact}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                className={cx(
                  "flex flex-col items-center justify-center p-4 rounded-2xl bg-black/50 hover:bg-[#FFD700]/10 transition-colors",
                  goldBorder,
                )}
                href={`https://wa.me/${CONTACT.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="text-2xl mb-2">💬</span>
                <span className={goldText}>{t.whatsapp}</span>
              </a>
              <a
                className={cx(
                  "flex flex-col items-center justify-center p-4 rounded-2xl bg-black/50 hover:bg-[#FFD700]/10 transition-colors",
                  goldBorder,
                )}
                href={CONTACT.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <span className="text-2xl mb-2">📸</span>
                <span className={goldText}>{t.instagram}</span>
              </a>
              <a
                className={cx(
                  "flex flex-col items-center justify-center p-4 rounded-2xl bg-black/50 hover:bg-[#FFD700]/10 transition-colors",
                  goldBorder,
                )}
                href={CONTACT.maps}
                target="_blank"
                rel="noreferrer"
              >
                <span className="text-2xl mb-2">📍</span>
                <span className={goldText}>{t.maps}</span>
              </a>
              <a
                className={cx(
                  "flex flex-col items-center justify-center p-4 rounded-2xl bg-black/50 hover:bg-[#FFD700]/10 transition-colors",
                  goldBorder,
                )}
                href={`tel:${CONTACT.phoneNumber}`}
              >
                <span className="text-2xl mb-2">📞</span>
                <span className={goldText}>{t.call}</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      <nav
        className={cx("fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 pb-4")}
      >
        <div
          className={cx(
            "mx-auto rounded-2xl bg-black/90 backdrop-blur-xl border border-[#D4AF37]/50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]",
          )}
        >
          <div className="grid grid-cols-4 py-3 text-xs font-medium">
            <Link
              href="/"
              className="flex flex-col items-center text-[#FFD700]"
            >
              <span className="text-lg">🏠</span>
              {t.home}
            </Link>
            <button
              onClick={() => setOpenServicesModal(true)}
              className="flex flex-col items-center text-white/60 hover:text-[#FFD700] transition"
            >
              <span className="text-lg">📋</span>
              {t.navServices}
            </button>
            <Link
              href="/login"
              className="flex flex-col items-center text-white/60 hover:text-[#FFD700] transition"
            >
              <span className="text-lg">👤</span>
              {t.profile}
            </Link>
            <button
              onClick={() => setOpenPay(true)}
              className="flex flex-col items-center text-white/60 hover:text-[#FFD700] transition"
            >
              <span className="text-lg">💳</span>دفع
            </button>
          </div>
        </div>
      </nav>

      {/* ===== About Us Modal ===== */}
      {openAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpenAbout(false)}
          />
          <div
            className={cx(
              "relative w-full max-w-lg rounded-2xl p-6 bg-[#0a0a0a]",
              goldBorder,
              goldGlow,
              "animate-in fade-in zoom-in duration-300",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={cx("text-2xl font-bold", goldText)}>{t.about}</h3>
              <button
                className={cx(
                  "rounded-lg px-3 py-1 text-sm bg-[#FFD700]/10 hover:bg-[#FFD700]/20 transition",
                  goldText,
                )}
                onClick={() => setOpenAbout(false)}
              >
                ✕
              </button>
            </div>
            <div className="text-white/80 leading-relaxed text-lg border-t border-[#D4AF37]/20 pt-4">
              {t.aboutText}
            </div>
            <button
              onClick={() => setOpenAbout(false)}
              className={cx(
                "w-full mt-8 rounded-xl px-4 py-3 font-bold text-black bg-gradient-to-r from-[#8B7500] via-[#FFD700] to-[#FFF4B0] hover:brightness-110 transition-all",
              )}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* ===== Services Modal (الصفحة المنبثقة للخدمات) ===== */}
      {openServicesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpenServicesModal(false)}
          />
          <div
            className={cx(
              "relative w-full max-w-2xl rounded-2xl p-6 bg-[#0a0a0a] max-h-[85vh] overflow-y-auto",
              goldBorder,
              goldGlow,
              "animate-in fade-in zoom-in duration-300",
            )}
          >
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#0a0a0a] z-10 pb-2 border-b border-[#D4AF37]/20">
              <h3 className={cx("text-2xl font-bold", goldText)}>
                {t.services}
              </h3>
              <button
                className={cx(
                  "rounded-lg px-3 py-1 text-sm bg-[#FFD700]/10 hover:bg-[#FFD700]/20 transition",
                  goldText,
                )}
                onClick={() => setOpenServicesModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {servicesList.map((s, idx) => (
                <div
                  key={idx}
                  className={cx(
                    "p-5 rounded-xl bg-black/50 border border-[#D4AF37]/20",
                    cardHoverMotion,
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{s.icon}</span>
                    <h4 className={cx("font-bold text-lg", goldText)}>
                      {lang === "ar" ? s.titleAr : s.titleEn}
                    </h4>
                  </div>
                  <p className="text-white/70 leading-relaxed text-sm md:text-base mr-9">
                    {lang === "ar" ? s.descAr : s.descEn}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setOpenServicesModal(false);
                setOpenRequest(true);
              }}
              className={cx(
                "w-full mt-8 rounded-xl px-4 py-4 font-bold text-black bg-gradient-to-r from-[#8B7500] via-[#FFD700] to-[#FFF4B0] hover:brightness-110 transition-all",
              )}
            >
              {t.requestService}
            </button>
          </div>
        </div>
      )}

      {/* ===== Request Modal ===== */}
      {openRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpenRequest(false)}
          />
          <div
            className={cx(
              "relative w-full max-w-xl rounded-2xl p-6 bg-[#0a0a0a]",
              goldBorder,
              goldGlow,
              "animate-in fade-in zoom-in duration-300",
            )}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className={cx("text-xl font-bold", goldText)}>
                  {t.requestService}
                </div>
                <div className="text-sm text-white/60 mt-1">
                  {t.requestServiceDesc}
                </div>
              </div>
              <button
                className={cx(
                  "rounded-lg px-3 py-1 text-sm bg-[#FFD700]/10 hover:bg-[#FFD700]/20 transition",
                  goldText,
                )}
                onClick={() => setOpenRequest(false)}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#FFD700]/80 mb-1 ml-1">
                  {t.serviceType}
                </label>
                <select
                  value={serviceType}
                  onChange={(e) =>
                    setServiceType(e.target.value as ServiceType)
                  }
                  className={cx(
                    "w-full rounded-xl px-4 py-3 bg-black/50 text-white outline-none focus:ring-2 focus:ring-[#FFD700]/30 transition",
                    goldBorder,
                  )}
                >
                  <option value="recruitment">{t.recruitment}</option>
                  <option value="housemaid">{t.housemaid}</option>
                  <option value="general">{t.general}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#FFD700]/80 mb-1 ml-1">
                  {t.city}
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={cx(
                    "w-full rounded-xl px-4 py-3 bg-black/50 text-white outline-none focus:ring-2 focus:ring-[#FFD700]/30 transition",
                    goldBorder,
                  )}
                  placeholder={
                    lang === "ar" ? "بغداد / أربيل ..." : "Baghdad / Erbil ..."
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-[#FFD700]/80 mb-1 ml-1">
                  {t.fullName}
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={cx(
                    "w-full rounded-xl px-4 py-3 bg-black/50 text-white outline-none focus:ring-2 focus:ring-[#FFD700]/30 transition",
                    goldBorder,
                  )}
                  placeholder={lang === "ar" ? "الاسم الثلاثي" : "Full Name"}
                />
              </div>
              <div>
                <label className="block text-xs text-[#FFD700]/80 mb-1 ml-1">
                  {t.phone}
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={cx(
                    "w-full rounded-xl px-4 py-3 bg-black/50 text-white outline-none focus:ring-2 focus:ring-[#FFD700]/30 transition",
                    goldBorder,
                  )}
                  placeholder="07XX XXX XXXX"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-[#FFD700]/80 mb-1 ml-1">
                  {t.details}
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  className={cx(
                    "w-full rounded-xl px-4 py-3 bg-black/50 text-white outline-none focus:ring-2 focus:ring-[#FFD700]/30 transition resize-none",
                    goldBorder,
                  )}
                  placeholder={
                    lang === "ar"
                      ? "اكتب تفاصيل طلبك هنا..."
                      : "Write your request details here..."
                  }
                />
              </div>
            </div>

            {sentMsg && (
              <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200 text-center">
                {sentMsg}
              </div>
            )}

            <button
              disabled={sending}
              onClick={submitRequest}
              className={cx(
                "w-full mt-6 rounded-xl px-4 py-4 font-bold text-black bg-gradient-to-r from-[#8B7500] via-[#FFD700] to-[#FFF4B0] hover:brightness-110 transition-all",
                sending && "opacity-60 cursor-not-allowed",
              )}
            >
              {sending ? t.sending : t.submit}
            </button>
          </div>
        </div>
      )}

      {/* ===== Payment Modal ===== */}
      {openPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpenPay(false)}
          />
          <div
            className={cx(
              "relative w-full max-w-sm rounded-2xl p-6 bg-[#0a0a0a] text-center",
              goldBorder,
              goldGlow,
              "animate-in fade-in zoom-in duration-300",
            )}
          >
            <h3 className={cx("text-xl font-bold mb-2", goldText)}>
              {t.payment}
            </h3>
            <p className="text-sm text-white/60 mb-6">{t.payHint}</p>

            <div className="space-y-3">
              <a
                href={CONTACT.zaincashPayLink}
                target="_blank"
                rel="noreferrer"
                className="block w-full rounded-xl py-3 font-bold bg-[#FFD700]/10 border border-[#FFD700]/40 text-[#FFD700] hover:bg-[#FFD700]/20 transition"
              >
                {t.zaincash}
              </a>
              <a
                href={CONTACT.kcardPayLink}
                target="_blank"
                rel="noreferrer"
                className="block w-full rounded-xl py-3 font-bold text-black bg-gradient-to-r from-[#8B7500] via-[#FFD700] to-[#FFF4B0] hover:brightness-110 transition"
              >
                {t.kcard}
              </a>
            </div>
            <button
              className="mt-6 text-sm text-white/50 hover:text-white"
              onClick={() => setOpenPay(false)}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
