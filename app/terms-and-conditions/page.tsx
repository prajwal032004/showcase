import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site, pricing } from "@/lib/site";
import { LegalLayout } from "@/components/ui/LegalLayout";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description:
    `How ${site.name} works with clients: scope, pricing, payments, revisions, ownership and timelines, written in plain, readable language.`,
  path: "/terms-and-conditions",
});

const mail = <a href={`mailto:${site.email}`}>{site.email}</a>;

export default function TermsPage() {
  const s = (id: string, title: string, body: React.ReactNode) => ({ id, title, body });
  const sections = [
    s(
      "introduction",
      "Introduction",
      <p>
        These Terms & Conditions govern the use of this website and the services provided by {site.name}, operated by {site.legal.entityName} (“we”, “us”).
        By engaging our services you agree to these terms, together with any written proposal or agreement for your project (“Project Agreement”). If the two
        conflict, the Project Agreement takes priority.
      </p>
    ),
    s(
      "services",
      "Services",
      <p>
        We provide website design, website development, landing pages, business websites, e-commerce websites, website revamps and related services, as
        described on our <Link href="/services">Services page</Link> and confirmed in each Project Agreement.
      </p>
    ),
    s(
      "scope",
      "Project scope",
      <>
        <p>
          Before work begins, we agree in writing on deliverables, the number of pages, features, integrations, timeline and price. Work outside this agreed
          scope — including new pages, features or significant changes in direction — is treated as additional work and quoted separately.
        </p>
      </>
    ),
    s(
      "pricing",
      "Pricing",
      <>
        <p>
          Our websites start at {pricing.startingPriceLabel} ({pricing.currency}). The starting price covers a defined starter scope; the final price for each
          project depends on its requirements and is stated in the Project Agreement.
        </p>
        <p>{pricing.fineprint}</p>
      </>
    ),
    s(
      "payments",
      "Payments",
      <>
        <p>
          Unless otherwise agreed, projects require an advance payment of [ADVANCE %] before work begins, with the balance due [PAYMENT MILESTONES / ON
          COMPLETION, BEFORE LAUNCH OR HANDOVER]. Invoices are payable within [NUMBER] days. Applicable taxes are [TAX TREATMENT].
        </p>
        <p>We may pause work on overdue accounts. Final files and transfer of ownership are released once all invoices are paid in full.</p>
      </>
    ),
    s(
      "client-responsibilities",
      "Client responsibilities",
      <ul>
        <li>Provide accurate information, content and feedback within agreed timeframes.</li>
        <li>Nominate one point of contact for approvals and consolidated feedback.</li>
        <li>Ensure you have the rights to any materials you supply.</li>
        <li>Review deliverables carefully and approve them at each milestone.</li>
      </ul>
    ),
    s(
      "content",
      "Content and assets",
      <p>
        You are responsible for the text, images, logos and other materials you provide, and confirm that you have the right to use them. Where we source
        stock assets, fonts or plugins, any licence fees are charged to you unless stated otherwise, and their licence terms apply.
      </p>
    ),
    s(
      "revisions",
      "Revisions",
      <p>
        The number of revision rounds included is stated in the Project Agreement (typically [NUMBER] rounds per milestone). We do not offer unlimited
        revisions. Further revisions, or changes after approval, may be charged at [RATE].
      </p>
    ),
    s(
      "timeline",
      "Timeline",
      <p>
        Estimated timelines are agreed during planning. They depend on timely receipt of content, feedback and payments, and are estimates rather than
        guarantees unless explicitly stated otherwise.
      </p>
    ),
    s(
      "delays",
      "Delays",
      <p>
        If the project is delayed by missing content, late feedback or changes in scope, the timeline will be adjusted accordingly. If a project is inactive for
        more than [NUMBER] days due to client delays, we may treat it as paused and schedule a restart based on availability, and may invoice for work completed.
      </p>
    ),
    s(
      "ip",
      "Intellectual property",
      <>
        <p>
          On full payment, you own the final website design and content created specifically for your project, except for third-party components (such as
          open-source libraries, fonts, plugins and stock assets) which remain subject to their own licences.
        </p>
        <p>
          We retain ownership of our pre-existing tools, code snippets and know-how, and you receive a licence to use them as part of your website. Unless you ask
          us not to, we may display the completed work in our portfolio.
        </p>
      </>
    ),
    s(
      "third-party",
      "Third-party tools",
      <p>
        Websites may rely on third-party services (hosting, domain registrars, payment gateways, e-commerce platforms, form or email services). These are
        governed by their providers’ terms and pricing. We are not responsible for their outages, changes or fees.
      </p>
    ),
    s(
      "hosting",
      "Hosting and domains",
      <p>
        Hosting and domain registration are not included in our starting price. Unless otherwise agreed, accounts should be registered in your name and paid
        directly by you. We can provide deployment and domain connection assistance as part of the agreed scope.
      </p>
    ),
    s(
      "maintenance",
      "Maintenance",
      <p>
        Ongoing maintenance, updates, backups and support are not included after launch unless agreed in writing. Maintenance can be arranged separately.
        [OPTIONAL: Include a post-launch support window of X days for bug fixes within scope.]
      </p>
    ),
    s(
      "cancellation",
      "Cancellation",
      <p>
        Either party may cancel a project by written notice. You will be invoiced for work completed up to the cancellation date and any non-refundable
        third-party costs incurred on your behalf.
      </p>
    ),
    s(
      "refunds",
      "Refunds",
      <p>
        Advance payments secure our time and are [REFUNDABLE / NON-REFUNDABLE / PARTIALLY REFUNDABLE] as follows: [REFUND POLICY DETAILS]. Payments for
        completed and approved milestones are non-refundable.
      </p>
    ),
    s(
      "liability",
      "Limitation of liability",
      <p>
        To the maximum extent permitted by law, our total liability for any claim relating to a project is limited to the amount you paid for that project. We
        are not liable for indirect or consequential losses, including lost profits, data loss or business interruption, or for issues caused by third-party
        services, client modifications or hosting environments outside our control.
      </p>
    ),
    s(
      "confidentiality",
      "Confidentiality",
      <p>
        We treat non-public information you share with us — such as business plans, credentials and unreleased products — as confidential, and use it only to
        deliver your project. Please share passwords through a secure method agreed with us.
      </p>
    ),
    s(
      "termination",
      "Termination",
      <p>
        We may terminate an engagement if these terms are materially breached, if invoices remain unpaid after reminders, or if requested work would be unlawful
        or harmful. Sections that by nature should survive termination (such as payment, intellectual property and liability) continue to apply.
      </p>
    ),
    s(
      "law",
      "Governing law",
      <p>
        These terms are governed by the laws of {site.legal.jurisdiction}. Any disputes will be subject to the exclusive jurisdiction of the courts of [CITY /
        REGION], after an attempt to resolve them amicably.
      </p>
    ),
    s(
      "contact",
      "Contact",
      <p>
        Questions about these terms? Email {mail} or visit our <Link href="/contact">contact page</Link>.
      </p>
    ),
  ];

  return (
    <LegalLayout
      title="Terms & Conditions"
      intro={<p>Clear terms make for good collaboration. Here is how we work with clients — written to be readable, not intimidating.</p>}
      sections={sections}
    />
  );
}
