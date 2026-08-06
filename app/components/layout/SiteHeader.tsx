"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ElementorIcon from "@/app/components/shared/ElementorIcon";
import { setScrollLocked } from "@/app/lib/scroll-lock";
import type { IconValue, LinkValue, Settings } from "@/app/lib/types";
import styles from "./SiteHeader.module.css";

type MenuLink = { label: string; href: string };

type SocialLink = {
  _id?: string;
  social_icon?: IconValue;
  social_link?: LinkValue;
};

// This header carries no inline nav - every destination lives in the
// full-screen overlay - so the old desktop dropdown menu and the mobile
// offcanvas panel it paired with collapse into one list that serves every
// viewport. Mirrors the six destinations the previous header carried, plus
// Insights, which is a real page now that the blog reads from a live feed.
const MENU_LINKS: MenuLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Services", href: "/our-services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Our Team", href: "/our-team" },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// "fab fa-linkedin-in" -> "linkedin", "fab fa-x-twitter" -> "x twitter": the
// icon class is the only name these entries carry, so the accessible label for
// each social link is derived from it.
function socialName(iconClass?: string): string {
  if (!iconClass) return "social media";
  return iconClass.trim().split(/\s+/).pop()!.replace(/^fa-/, "").replace(/-in$/, "").replace(/-/g, " ");
}

// PASHA header component, ported from the supplied drop-in file
// (Downloads/pasha-header (1).html). That file ships two bar variants over
// one shared full-screen menu, and this renders whichever the current route
// calls for:
//
//   home        -> variant B, the transparent bar absolutely positioned over
//                  the hero photo, scrolling away with it
//   every other -> variant A, the solid bar stuck to the top of the viewport
//
// The overlay's open/close/Escape/focus behaviour is the same as the file's
// own script, expressed as React state rather than classList calls.
export default function SiteHeader({
  settings,
  socialLinks = [],
}: {
  settings: Settings;
  socialLinks?: SocialLink[];
}) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const isHome = usePathname() === "/";

  useEffect(() => {
    setScrollLocked(open);
    if (!open) return;

    // Matches the original: let the fade start, then move focus into the menu
    // - before that it's still `visibility: hidden`, so its links can't take
    // focus.
    const focusTimer = window.setTimeout(() => firstLinkRef.current?.focus(), 80);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Unlock the page if the header unmounts while the menu is still open.
  useEffect(() => () => setScrollLocked(false), []);

  const buttonLink = settings?.button_link?.url;
  const gallery: { id?: number; url?: string }[] = settings?.gallerys || [];

  return (
    <>
      <header
        className={`tx-header ${styles.header} ${isHome ? styles.overlaybar : styles.topbar}`}
      >
        <div className={`container nm-header-1-container ${styles.bar}`}>
          {settings?.logo?.url && (
            // Plain <a>, not next/link: every link on this site navigates with
            // a full page load, and the theme's GSAP/Lenis setup is wired for
            // a fresh document each time - a single client-side route
            // transition from the logo would be the odd one out.
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a href="/" aria-label="Bits Collision - home" className={`tx-logo ${styles.brand}`}>
              <img src={settings.logo.url} alt="Bits Collision" className={styles.brandLogo} />
            </a>
          )}

          <div className={styles.actions}>
            {settings?.button_text && (
              <a
                href={buttonLink || "/contact"}
                target={settings.button_link?.is_external ? "_blank" : "_self"}
                rel={settings.button_link?.nofollow ? "nofollow" : undefined}
                className={styles.cta}
              >
                {settings.button_text}
                <ElementorIcon icon={settings.button_icon} />
              </a>
            )}

            <button
              type="button"
              aria-label="Open section menu"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen(true)}
              className={styles.burger}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        aria-hidden={!open}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <button type="button" aria-label="Close menu" className={styles.close} onClick={() => setOpen(false)}>
          <span>Close</span>
          <span aria-hidden="true" className={styles.closeX}>
            &times;
          </span>
        </button>

        <div className={styles.intro}>
          <div>
            <span className={styles.eyebrow}>Bits Collision</span>
            <h2>Let&rsquo;s build what&rsquo;s next.</h2>
            <p>
              Explore what we design and engineer, how we work, and the people behind it &ndash; or skip
              straight to starting a project with us.
            </p>

            {/* The offcanvas panel this overlay replaced carried the header
                widget's gallery images (header.json `gallerys`); they'd have
                been orphaned otherwise, and they fill what would be dead
                space in the middle of this column. */}
            {gallery.length > 0 && (
              <div className={styles.gallery}>
                {gallery.slice(0, 4).map((image, i) => (
                  <span key={image.id || i} className="wa-fix wa-img-cover">
                    <img src={image.url} alt="" loading="lazy" />
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.introFoot}>
            {socialLinks.length > 0 && (
              <div className={styles.socials}>
                {socialLinks.map((social, i) => (
                  <a
                    key={social._id || i}
                    href={social.social_link?.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Bits Collision on ${socialName(social.social_icon?.value)}`}
                  >
                    <ElementorIcon icon={social.social_icon} />
                  </a>
                ))}
              </div>
            )}
            <div className={styles.small}>
              <span>Software, design and growth.</span>
              <span>Navigation</span>
            </div>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Website sections">
          <div className={styles.list}>
            {MENU_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                ref={i === 0 ? firstLinkRef : undefined}
                className={styles.link}
                onClick={() => setOpen(false)}
              >
                <strong>{link.label}</strong>
              </a>
            ))}
          </div>
          <p className={styles.note}>Select a section, press Esc, or use the Close button.</p>
        </nav>
      </div>
    </>
  );
}
