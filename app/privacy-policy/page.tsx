import type { Metadata } from "next";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import styles from "./PrivacyPolicy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy - Nimo",
};

// Ports the demo data's "Privacy Policy" page (post_id 3, content.xml) -
// WordPress's own default auto-generated privacy policy template text, the
// only content that page ever had (it's plain Gutenberg blocks, never built
// out with Elementor). The footer's "Privacy Policy" link pointed at
// /our-team as a placeholder since this page didn't exist yet.
export default function PrivacyPolicyPage() {
  return (
    <main>
  <PageBreadcrumb title="Privacy Policy" current="Privacy Policy" />

  <div className={styles.wrap}>
    <div className="container nm-container-1">
      <div className={styles.content}>

        <h2>Privacy Policy</h2>
        <p>
          At Bits Collision, we respect your privacy and are committed to
          protecting the personal information you share with us. This Privacy
          Policy explains how we collect, use, store, and protect your
          information when you visit our website, contact us, or use our
          services.
        </p>

        <h2>Who We Are</h2>
        <p>
          Bits Collision is a software and digital solutions company providing
          technology and creative services to businesses and organizations.
          Our services include custom software development, mobile application
          development, web development, UI/UX design, cloud solutions, IT
          consulting, digital marketing, and other technology solutions.
        </p>
        <p>
          Website: https://www.bitscollision.com/
          <br />
          Email: info@bitscollision.com
          <br />
          Phone: +92 331 2664702
          <br />
          Location: Karachi, Pakistan
        </p>

        <h2>Information We Collect</h2>
        <p>
          When you interact with our website or contact us, we may collect
          information you voluntarily provide, including your name, email
          address, phone number, company name, project details, and other
          information submitted through our contact or inquiry forms.
        </p>
        <p>
          We may also collect limited technical information such as your IP
          address, browser type, device information, operating system, and
          general website usage data. This information helps us maintain
          website security, improve performance, and understand how visitors
          use our website.
        </p>

        <h2>How We Use Your Information</h2>
        <p>We may use the information we collect to:</p>
        <p>
          Respond to your inquiries and requests.
          <br />
          Understand your project requirements.
          <br />
          Provide quotations and service information.
          <br />
          Communicate with you about our services.
          <br />
          Deliver and improve our products and services.
          <br />
          Provide customer and technical support.
          <br />
          Improve website functionality and user experience.
          <br />
          Protect our website from spam, fraud, and security threats.
          <br />
          Comply with applicable legal and regulatory requirements.
        </p>

        <h2>Information Submitted Through Contact Forms</h2>
        <p>
          When you submit an inquiry through our website, we may collect the
          information provided in the form, including your name, email, phone
          number, and message.
        </p>
        <p>
          This information is used to understand your requirements and respond
          to your request. We do not intentionally sell or rent your personal
          information to third parties for their independent marketing
          purposes.
        </p>

        <h2>Cookies and Similar Technologies</h2>
        <p>
          Our website may use cookies and similar technologies to improve
          functionality, understand website usage, remember preferences, and
          support security.
        </p>
        <p>
          Cookies may help us understand which pages are useful to visitors
          and improve the overall website experience. You can control or
          disable cookies through your browser settings.
        </p>

        <h2>Analytics and Website Performance</h2>
        <p>
          We may use analytics and performance tools to understand how visitors
          interact with our website. These tools may collect information such
          as pages visited, approximate location, device type, browser
          information, and general usage patterns.
        </p>
        <p>
          This information is primarily used to improve website performance,
          user experience, and our digital services.
        </p>

        <h2>Embedded Content and Third-Party Services</h2>
        <p>
          Our website may contain links, integrations, or embedded content
          from third-party platforms, such as social media networks, videos,
          maps, analytics services, or other external websites.
        </p>
        <p>
          When you interact with third-party content, those services may
          collect information according to their own privacy policies. Bits
          Collision does not control the privacy practices of external
          websites.
        </p>

        <h2>How We Share Your Information</h2>
        <p>
          Bits Collision does not sell or rent your personal information.
        </p>
        <p>
          We may share information with trusted service providers, technology
          partners, hosting providers, communication platforms, or other
          third parties when necessary to operate our business, provide
          requested services, maintain our systems, or fulfill a project.
        </p>
        <p>
          We may also disclose information when required by law, legal
          proceedings, regulatory authorities, or when necessary to protect
          our rights, security, users, or business.
        </p>

        <h2>Data Security</h2>
        <p>
          We take reasonable technical and organizational measures to protect
          personal information against unauthorized access, loss, misuse,
          alteration, or disclosure.
        </p>
        <p>
          However, no method of electronic transmission or storage is
          completely secure. While we work to protect your information, we
          cannot guarantee absolute security.
        </p>

        <h2>How Long We Keep Your Information</h2>
        <p>
          We retain personal information only for as long as reasonably
          necessary to fulfill the purposes described in this Privacy Policy,
          provide services, maintain business records, resolve disputes, meet
          contractual obligations, or comply with legal requirements.
        </p>

        <h2>Your Privacy Rights</h2>
        <p>
          Depending on applicable laws, you may have the right to request
          access to the personal information we hold about you, ask us to
          correct inaccurate information, request deletion of certain
          information, or withdraw consent where applicable.
        </p>
        <p>
          To make a privacy-related request, please contact us using the
          details provided below. We may need to verify your identity before
          processing certain requests.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          Our website and services are not intentionally directed toward
          children. We do not knowingly collect personal information from
          children without appropriate consent where required by law.
        </p>

        <h2>External Links</h2>
        <p>
          Our website may contain links to external websites and third-party
          platforms. These websites operate independently and have their own
          privacy policies and terms.
        </p>

        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect
          changes in our services, technology, business practices, or
          applicable requirements.
        </p>
        <p>
          Any updated version will be published on this page with a revised
          effective date. We encourage you to review this page periodically.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or have any privacy
          concerns, please contact us.
        </p>
        <p>
          <strong>Bits Collision</strong>
          <br />
          Office: Shamsi Society, Malir, Wireless Gate, Karachi
          <br />
          Email: info@bitscollision.com
          <br />
          Phone: +92 331 2664702
        </p>

      </div>
    </div>
  </div>
</main>
  );
}
