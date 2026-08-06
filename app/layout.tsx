import type { Metadata } from "next";
import { Space_Grotesk, Inter, Poppins } from "next/font/google";
import "./styles/vendor/bootstrap.min.css";
import "./styles/vendor/fontawesome-min.css";
import "./styles/vendor/flaticon-nimo.css";
import "./styles/vendor/animate-min.css";
import "./styles/vendor/swiper.min.css";
import "./styles/vendor/nice-select.css";
import "./styles/vendor/nimo-core.css";
import "./styles/vendor/nimo-extra.css";
import "./styles/vendor/nimo-companion.css";
import "./globals.css";
import SiteHeader from "@/app/components/layout/SiteHeader";
import SiteFooter from "@/app/components/layout/SiteFooter";
import ScrollReveal from "@/app/components/shared/ScrollReveal";
import SmoothScroll from "@/app/components/shared/SmoothScroll";
import CursorEffects from "@/app/components/shared/CursorEffects";
import BackToTop from "@/app/components/shared/BackToTop";
import headerData from "@/content/pages/header.json";
import footerData from "@/content/pages/footer.json";
import { findFirstWidgetSettings } from "@/app/lib/render-elementor";
import type { ElementorNode } from "@/app/lib/types";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// The PASHA header component ships its own typeface (see the drop-in port in
// SiteHeader.module.css); loading it here keeps that component reading the
// way it was designed instead of silently re-setting it in the site's own
// two families.
// Only the three weights the header actually sets (body 400, pills/labels
// 700, eyebrow and menu labels 800) - each extra weight is another font file
// on the critical path.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  // One place decides how every tab reads: pages set just their own name
  // ("Our Services") and the template appends the brand. `default` covers the
  // home page and anything that doesn't set a title of its own.
  title: {
    default: "Bits Collision - Software Development & Digital Solutions",
    template: "%s | Bits Collision",
  },
  description:
    "We build innovative software & digital solutions that help businesses simplify operations, improve customer experiences, & accelerate growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerSettings = findFirstWidgetSettings(headerData as ElementorNode[]);
  const footerSettings = findFirstWidgetSettings(footerData as ElementorNode[]);

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${poppins.variable}`}>
      <body>
        <div className="page-wrapper main-wrapper">
          <SiteHeader settings={headerSettings} socialLinks={footerSettings?.social_links} />
          {children}
          <SiteFooter settings={footerSettings} />
        </div>
        <SmoothScroll />
        <ScrollReveal />
        <CursorEffects />
        <BackToTop />
      </body>
    </html>
  );
}
