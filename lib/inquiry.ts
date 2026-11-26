import { site } from "./site";

export const projectTypes = ["Business website", "Landing page", "E-commerce", "Portfolio", "Website redesign", "Web application", "Other"] as const;
export const budgets = ["₹15,000–₹25,000", "₹25,000–₹50,000", "₹50,000–₹1,00,000", "₹1,00,000+", "Need guidance"] as const;
export const timelines = ["ASAP", "Within 2 weeks", "Within a month", "1–3 months", "Flexible"] as const;

export type Inquiry = {
  name: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  type: string;
  budget: string;
  timeline: string;
  description: string;
  additional: string;
};

export const emptyInquiry: Inquiry = {
  name: "",
  company: "",
  email: "",
  phone: "",
  website: "",
  type: "",
  budget: "",
  timeline: "",
  description: "",
  additional: "",
};

/** Map service names (from /services links) to a project type */
export function typeFromService(service: string | null): string {
  if (!service) return "";
  const s = service.toLowerCase();
  if (s.includes("landing")) return "Landing page";
  if (s.includes("commerce")) return "E-commerce";
  if (s.includes("revamp") || s.includes("redesign")) return "Website redesign";
  if (s.includes("portfolio")) return "Portfolio";
  if (s.includes("business") || s.includes("design") || s.includes("development")) return "Business website";
  return projectTypes.includes(service as (typeof projectTypes)[number]) ? service : "";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(field: keyof Inquiry, value: string): string | null {
  const v = value.trim();
  switch (field) {
    case "name":
      if (!v) return "Please tell us your name.";
      if (v.length < 2) return "That looks a little short.";
      return null;
    case "email":
      if (!v) return "We need an email address to reply.";
      if (!EMAIL_RE.test(v)) return "Please enter a valid email, like name@company.com.";
      return null;
    case "phone": {
      if (!v) return null;
      const digits = v.replace(/\D/g, "");
      if (!/^[+\d\s()-]+$/.test(v) || digits.length < 7 || digits.length > 15) return "Please enter a valid phone number (7–15 digits).";
      return null;
    }
    case "website":
      if (!v) return null;
      try {
        const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
        if (!u.hostname.includes(".")) throw new Error();
        return null;
      } catch {
        return "Please enter a valid URL, like example.com.";
      }
    case "type":
      return v ? null : "Choose the option closest to your project.";
    case "budget":
      return v ? null : "Pick a range — or choose “Need guidance”.";
    case "timeline":
      return v ? null : "Let us know when you'd like to launch.";
    case "description":
      if (!v) return "Tell us a little about the project.";
      if (v.length < 30) return `A few more details help us respond well (${30 - v.length} more characters).`;
      return null;
    default:
      return null;
  }
}

export const requiredFields: (keyof Inquiry)[] = ["name", "email", "type", "budget", "timeline", "description"];
export const allFields: (keyof Inquiry)[] = ["name", "company", "email", "phone", "website", "type", "budget", "timeline", "description", "additional"];

export function validateAll(data: Inquiry) {
  const errors: Partial<Record<keyof Inquiry, string>> = {};
  allFields.forEach((f) => {
    const e = validate(f, data[f]);
    if (e) errors[f] = e;
  });
  return errors;
}

export function normalizeUrl(v: string) {
  const t = v.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

/**
 * Tidy free-form text: trim, collapse whitespace, turn "-", "*" or "1)" style
 * lines into bullets, capitalise sentences and finish with punctuation.
 */
export function formatText(raw: string) {
  const lines = raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim());
  const out: string[] = [];
  let blank = false;
  for (const l of lines) {
    if (!l) {
      if (!blank && out.length) out.push("");
      blank = true;
      continue;
    }
    blank = false;
    const bullet = l.match(/^([-*•]|\d+[.)])\s+(.*)$/);
    if (bullet) {
      const body = bullet[2].charAt(0).toUpperCase() + bullet[2].slice(1);
      out.push(`• ${body}`);
    } else {
      let s = l.charAt(0).toUpperCase() + l.slice(1);
      s = s.replace(/([.!?]\s+)([a-z])/g, (_, p, c) => p + c.toUpperCase());
      s = s.replace(/\bi\b/g, "I");
      if (!/[.!?:)]$/.test(s)) s += ".";
      out.push(s);
    }
  }
  while (out[out.length - 1] === "") out.pop();
  return out.join("\n");
}

export function buildEmail(d: Inquiry) {
  const name = d.name.trim();
  const subject = `New Website Project Inquiry — ${name}`;
  const line = (label: string, value: string) => `${label}: ${value.trim() || "—"}`;
  const body = [
    "Hello,",
    "",
    "I would like to discuss a website project.",
    "",
    line("Name", name),
    line("Business", d.company),
    line("Email", d.email),
    line("Phone", d.phone),
    line("Website", normalizeUrl(d.website)),
    line("Project Type", d.type),
    line("Budget", d.budget),
    line("Timeline", d.timeline),
    "",
    "Project Details:",
    formatText(d.description),
    "",
    "Additional Information:",
    d.additional.trim() ? formatText(d.additional) : "—",
    "",
    "I look forward to discussing this project.",
    "",
    "Regards,",
    name,
  ].join("\n");
  return { to: site.email, subject, body };
}

export function gmailUrl({ to, subject, body }: { to: string; subject: string; body: string }) {
  const p = new URLSearchParams({ view: "cm", fs: "1", to, su: subject, body });
  // URLSearchParams encodes spaces as "+", which Gmail renders literally in some cases — use %20.
  return `https://mail.google.com/mail/?${p.toString().replace(/\+/g, "%20")}`;
}

export function mailtoUrl({ to, subject, body }: { to: string; subject: string; body: string }) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
