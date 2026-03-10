import "./globals.css";
import { Cairo } from "next/font/google"; // سأستخدم خط Cairo كبداية. يمكنك استبداله بخطك.

// تكوين الخط العربي
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo", // لربطه بـ Tailwind لاحقًا
});

export const metadata = {
  title: "زهور الشرق - استقدام الأيدي العاملة",
  description:
    "شركة زهور الشرق لاستقدام الأيدي العاملة ومتابعة الإجراءات القانونية والإقامة.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // هنا قمنا بتطبيق الخط كمتغير Tailwind
    <html lang="ar" className={`${cairo.variable}`}>
      {/* ستقوم الفئة `font-sans` الآن باستخدام خط Cairo */}
      <body className="font-sans antialiased text-white bg-black">
        {children}
      </body>
    </html>
  );
}
