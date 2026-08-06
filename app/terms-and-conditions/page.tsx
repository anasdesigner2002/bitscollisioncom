import type { Metadata } from "next";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import styles from "@/app/privacy-policy/PrivacyPolicy.module.css";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

// The demo content has no dedicated "Terms and Conditions" page (unlike
// Privacy Policy, which at least existed as a WordPress default draft) - the
// footer's "404" link was a placeholder pointing nowhere real. Standard
// terms-of-use copy written here, styled the same as the Privacy Policy page.
export default function TermsAndConditionsPage() {
  return (
    <main>
  <PageBreadcrumb
    title="Terms & Conditions"
    current="Terms & Conditions"
  />

  <div className={styles.wrap}>
    <div className="container nm-container-1">
      <div className={styles.content}>

        <h2>Introduction</h2>
        <p>
          Welcome to Bits Collision. These Terms & Conditions govern your
          access to and use of the Bits Collision website and its content.
        </p>
        <p>
          By accessing or using our website, you agree to comply with these
          Terms & Conditions. If you do not agree with any part of these
          terms, please discontinue your use of the website.
        </p>

        <h2>Use of Our Website</h2>
        <p>
          You may access and use this website for lawful purposes and in
          accordance with these Terms & Conditions.
        </p>
        <p>You agree not to use the website:</p>
        <p>
          For any unlawful or fraudulent purpose.
          <br />
          To interfere with the website's operation or security.
          <br />
          To attempt unauthorized access to systems or data.
          <br />
          To distribute harmful software or malicious code.
          <br />
          To copy or reproduce website content without permission.
          <br />
          To misuse contact forms or communication channels.
          <br />
          To engage in activities that may harm Bits Collision or its users.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          Unless otherwise stated, the content available on this website,
          including text, graphics, logos, images, designs, branding, layouts,
          and other materials, is owned by or licensed to Bits Collision.
        </p>
        <p>
          All intellectual property rights are reserved. You may view website
          content for personal or informational purposes, but you may not
          reproduce, modify, distribute, publish, sell, or commercially
          exploit our content without prior written permission.
        </p>

        <h2>Our Services</h2>
        <p>
          Bits Collision provides technology and digital services including
          custom software development, mobile application development, web
          development, WordPress and Shopify development, UI/UX design, cloud
          solutions, quality assurance, software integration, IT consulting,
          digital marketing, SEO, social media marketing, graphic design, and
          other related services.
        </p>
        <p>
          Specific project services, features, timelines, deliverables,
          pricing, and responsibilities will be defined separately in project
          proposals, quotations, statements of work, or service agreements
          where applicable.
        </p>

        <h2>Project Agreements</h2>
        <p>
          When you engage Bits Collision for a project, the scope of work,
          deliverables, timelines, payment terms, responsibilities, and other
          project-specific requirements may be documented in a separate
          agreement or proposal.
        </p>
        <p>
          If there is a conflict between these website Terms & Conditions and
          a signed project agreement, the terms of the specific project
          agreement will generally apply to that project.
        </p>

        <h2>Payments and Pricing</h2>
        <p>
          Service pricing may vary depending on project requirements, scope,
          complexity, technology, integrations, resources, and timeline.
        </p>
        <p>
          Any quotation or estimate provided by Bits Collision is based on
          the requirements known at the time of preparation. Changes to
          project requirements or additional work may result in changes to
          the estimated cost or delivery timeline.
        </p>
        <p>
          Payment schedules and terms will be communicated and agreed upon
          before or during project engagement.
        </p>

        <h2>Client Responsibilities</h2>
        <p>
          Clients are responsible for providing accurate project information,
          required content, credentials, approvals, feedback, and other
          materials necessary for the successful completion of a project.
        </p>
        <p>
          Delays in providing required information, approvals, or feedback may
          affect project timelines and delivery schedules.
        </p>
        <p>
          Clients are also responsible for ensuring that any content, data,
          images, software, or materials they provide do not violate
          applicable laws or third-party rights.
        </p>

        <h2>Third-Party Services and Platforms</h2>
        <p>
          Some projects may involve third-party services, platforms, APIs,
          hosting providers, payment gateways, cloud services, plugins, or
          software.
        </p>
        <p>
          Bits Collision may integrate or work with these services based on
          project requirements. However, third-party services are governed by
          their own terms, policies, pricing, availability, and service
          conditions.
        </p>

        <h2>Website Availability</h2>
        <p>
          We aim to keep our website accessible and operational, but we do not
          guarantee uninterrupted or error-free availability at all times.
        </p>
        <p>
          The website may occasionally be unavailable due to maintenance,
          updates, technical issues, hosting problems, security incidents, or
          circumstances beyond our control.
        </p>

        <h2>No Warranties</h2>
        <p>
          The website and its content are provided on an "as available" basis.
        </p>
        <p>
          While we make reasonable efforts to maintain accurate and useful
          information, we do not guarantee that all website content will
          always be complete, current, accurate, or free from errors.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, Bits Collision
          will not be responsible for indirect, incidental, special,
          consequential, or business losses arising from your use of or
          inability to use the website.
        </p>
        <p>
          This may include loss of data, revenue, business opportunities,
          profits, or anticipated savings.
        </p>
        <p>
          Nothing in these Terms & Conditions is intended to exclude or limit
          liability where such limitation is not permitted under applicable
          law.
        </p>

        <h2>Confidentiality</h2>
        <p>
          Where a client shares confidential business or project information
          with Bits Collision as part of a professional engagement, such
          information will be handled responsibly and used only for legitimate
          project or business purposes.
        </p>
        <p>
          Specific confidentiality obligations may be established through
          separate agreements, including a Non-Disclosure Agreement (NDA),
          where required.
        </p>

        <h2>User-Submitted Information</h2>
        <p>
          If you submit information through our website, including project
          inquiries, feedback, or other communications, you confirm that you
          have the right to provide such information.
        </p>
        <p>
          You agree not to submit unlawful, harmful, misleading, defamatory,
          or infringing content through our website or communication channels.
        </p>

        <h2>External Links</h2>
        <p>
          Our website may contain links to third-party websites, social media
          platforms, or external resources.
        </p>
        <p>
          These links are provided for convenience and informational purposes.
          Bits Collision does not control or guarantee the accuracy, security,
          availability, or privacy practices of third-party websites.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          Bits Collision may update or modify these Terms & Conditions from
          time to time.
        </p>
        <p>
          Changes will become effective when the revised terms are published on
          this website. Your continued use of the website after changes are
          published indicates your acceptance of the updated terms.
        </p>

        <h2>Governing Law</h2>
        <p>
          These Terms & Conditions shall be interpreted and applied in
          accordance with applicable laws and regulations relevant to the
          operation of Bits Collision and its services.
        </p>
        <p>
          Any disputes will be addressed through appropriate communication
          and, where necessary, through the applicable legal process.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions regarding these Terms & Conditions, our
          services, or any other matter related to the website, please contact
          us.
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
