import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { LegalLayout } from "@/components/ui/LegalLayout";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} handles information when you visit this website or contact us.`,
  path: "/privacy-policy",
});

const mail = <a href={`mailto:${site.email}`}>{site.email}</a>;

export default function PrivacyPage() {
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      body: (
        <>
          <p>
            This Privacy Policy explains how {site.name} (“we”, “us”, “our”) — operated by {site.legal.entityName} — handles information in connection with this
            website and our website design and development services.
          </p>
          <p>We aim to collect as little information as possible. This website is intentionally built without user accounts, databases, advertising or analytics tracking.</p>
        </>
      ),
    },
    {
      id: "information-collected",
      title: "Information we collect",
      body: (
        <>
          <p>
            <strong>When you browse this website,</strong> we do not ask for or collect personal information. Like most websites, our hosting provider ([HOSTING
            PROVIDER]) may automatically process standard technical data — such as IP address, browser type, requested pages and timestamps — in server logs, for
            security and to deliver the site.
          </p>
          <p>
            <strong>When you email us,</strong> we receive the information you choose to include, such as your name, email address, phone number, business name,
            website and project details.
          </p>
        </>
      ),
    },
    {
      id: "forms",
      title: "Information submitted through forms",
      body: (
        <>
          <p>
            Our contact form does <strong>not</strong> transmit your details to our servers or to any database. When you complete it, the form formats your
            answers into an email inside your browser and then opens Gmail (or your default mail app) with that email pre-filled. Nothing is sent until you
            review the message and press Send yourself.
          </p>
          <p>
            While you fill in the form, your answers are temporarily saved in your browser’s <em>session storage</em> so you don’t lose progress if you navigate
            away. This data stays on your device, is never sent to us, and is cleared when you close the browser tab or start a new inquiry.
          </p>
        </>
      ),
    },
    {
      id: "use",
      title: "How we use information",
      body: (
        <ul>
          <li>To reply to your enquiry and discuss your project.</li>
          <li>To prepare proposals, quotes and agreements you request.</li>
          <li>To deliver, support and invoice for services you engage us for.</li>
          <li>To keep reasonable records of our communications and work.</li>
          <li>To meet legal, tax or accounting obligations.</li>
        </ul>
      ),
    },
    {
      id: "email",
      title: "Email communication",
      body: (
        <p>
          We use the email address you provide only to communicate about your enquiry or project. We do not send marketing newsletters unless you explicitly
          ask to receive them, and we never sell or rent your email address.
        </p>
      ),
    },
    {
      id: "storage",
      title: "Data storage",
      body: (
        <p>
          Emails you send us are stored in our email provider’s systems ([EMAIL PROVIDER]). Project files and correspondence may be stored with reputable
          cloud tools we use to run projects ([TOOLS — e.g. file storage, design software]). We do not operate a customer database on this website.
        </p>
      ),
    },
    {
      id: "third-parties",
      title: "Third-party services",
      body: (
        <>
          <ul>
            <li>
              <strong>Gmail / your mail provider:</strong> if you choose to open Gmail from our form, the pre-filled message is handled by Google under its own
              privacy policy once Gmail opens.
            </li>
            <li>
              <strong>Hosting:</strong> [HOSTING PROVIDER] serves this website and may process technical logs.
            </li>
            <li>
              <strong>Social links:</strong> links to Instagram, LinkedIn, Dribbble or GitHub take you to those services, which have their own policies.
            </li>
          </ul>
          <p>Fonts are self-hosted with the website, so loading pages does not send requests to third-party font services.</p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies and local storage",
      body: (
        <>
          <p>This website does not set advertising, analytics or tracking cookies.</p>
          <p>
            We use your browser’s <em>session storage</em> for two functional purposes: remembering that you have seen the opening animation during this visit,
            and keeping an unfinished contact form draft. Both are deleted when you close the tab. You can clear them anytime via your browser settings.
          </p>
        </>
      ),
    },
    {
      id: "analytics",
      title: "Analytics",
      body: (
        <p>
          We currently do not use analytics on this website. If we introduce privacy-friendly analytics in the future, we will update this policy before doing
          so and describe what is measured.
        </p>
      ),
    },
    {
      id: "security",
      title: "Website security",
      body: (
        <p>
          This website is served over HTTPS and is built without logins or databases, which keeps the amount of data at risk small. No method of transmission or
          storage is completely secure, but we take reasonable steps to protect information you share with us.
        </p>
      ),
    },
    {
      id: "retention",
      title: "Data retention",
      body: (
        <p>
          We keep enquiry emails and project correspondence for as long as needed to respond, deliver our services and meet legal or accounting obligations —
          typically [RETENTION PERIOD]. You can ask us to delete your enquiry at any time.
        </p>
      ),
    },
    {
      id: "rights",
      title: "Your rights",
      body: (
        <>
          <p>Depending on where you live ({site.legal.jurisdiction}), you may have the right to:</p>
          <ul>
            <li>Ask what personal information we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your information.</li>
            <li>Object to or restrict certain processing.</li>
            <li>Withdraw consent where processing is based on consent.</li>
          </ul>
          <p>To make a request, email us at {mail}. We will respond within a reasonable time.</p>
        </>
      ),
    },
    {
      id: "contact",
      title: "Contact information",
      body: (
        <p>
          Questions about this policy? Email {mail} or use our <Link href="/contact">contact page</Link>.
        </p>
      ),
    },
    {
      id: "updates",
      title: "Policy updates",
      body: <p>We may update this policy from time to time. Changes will be posted on this page with a new effective date.</p>,
    },
  ];

  return (
    <LegalLayout
      title="Privacy Policy"
      intro={<p>Your privacy matters to us. In short: we don’t track you, we don’t store form submissions, and we only use what you email us to help with your project.</p>}
      sections={sections}
    />
  );
}
