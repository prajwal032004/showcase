"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, CircleAlert, Copy, ExternalLink, Mail, Pencil, RefreshCw, Sparkles } from "lucide-react";
import {
  allFields,
  budgets,
  buildEmail,
  emptyInquiry,
  formatText,
  gmailUrl,
  mailtoUrl,
  projectTypes,
  timelines,
  typeFromService,
  validate,
  validateAll,
  type Inquiry,
} from "@/lib/inquiry";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { useSmoothScroll, useToast } from "@/components/layout/Providers";
import { copyText, cn } from "@/lib/utils";

type Step = "form" | "review" | "opened";
const STORE = "forma-inquiry-draft";
const EASE = [0.16, 1, 0.3, 1] as const;

export function ContactForm() {
  const params = useSearchParams();
  const toast = useToast();
  const { scrollTo } = useSmoothScroll();
  const [data, setData] = useState<Inquiry>(emptyInquiry);
  const [errors, setErrors] = useState<Partial<Record<keyof Inquiry, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Inquiry, boolean>>>({});
  const [step, setStep] = useState<Step>("form");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Restore an unfinished draft (kept only in this browser tab) + prefill from ?type=
  useEffect(() => {
    let draft: Inquiry = emptyInquiry;
    try {
      const raw = sessionStorage.getItem(STORE);
      if (raw) draft = { ...emptyInquiry, ...JSON.parse(raw) };
    } catch {}
    const t = typeFromService(params.get("type"));
    if (t && !draft.type) draft = { ...draft, type: t };
    setData(draft);
    setLoaded(true);
  }, [params]);

  // Assistant / planner can pre-fill the draft while this page is open
  useEffect(() => {
    const reload = () => {
      try {
        const raw = sessionStorage.getItem(STORE);
        if (raw) setData({ ...emptyInquiry, ...JSON.parse(raw) });
        setErrors({});
        setStep("form");
      } catch {}
    };
    window.addEventListener("forma:draft-updated", reload);
    return () => window.removeEventListener("forma:draft-updated", reload);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      sessionStorage.setItem(STORE, JSON.stringify(data));
    } catch {}
  }, [data, loaded]);

  const set = (f: keyof Inquiry) => (v: string) => {
    setData((d) => ({ ...d, [f]: v }));
    if (touched[f] || errors[f]) setErrors((e) => ({ ...e, [f]: validate(f, v) ?? undefined }));
  };
  const blur = (f: keyof Inquiry) => () => {
    setTouched((t) => ({ ...t, [f]: true }));
    setErrors((e) => ({ ...e, [f]: validate(f, data[f]) ?? undefined }));
  };

  const goTop = () => top.current && scrollTo(top.current, { offset: -110 });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateAll(data);
    setErrors(errs);
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));
    const first = allFields.find((f) => errs[f]);
    if (first) {
      document.getElementById(`f-${first}`)?.focus({ preventScroll: true });
      const el = document.getElementById(`f-${first}`);
      if (el) scrollTo(el, { offset: -160 });
      toast("Please check the highlighted fields", "error");
      return;
    }
    const mail = buildEmail(data);
    setSubject(mail.subject);
    setBody(mail.body);
    setStep("review");
    setBlocked(false);
    setTimeout(goTop, 50);
  };

  const openGmail = () => {
    setBusy(true);
    const url = gmailUrl({ to: site.email, subject, body });
    const win = window.open(url, "_blank");
    setTimeout(() => setBusy(false), 600);
    if (!win) {
      setBlocked(true);
      toast("Your browser blocked the new tab", "error");
      return;
    }
    try {
      win.opener = null;
    } catch {}
    setStep("opened");
    setTimeout(goTop, 50);
  };

  const copyAll = async () => {
    const ok = await copyText(`To: ${site.email}\nSubject: ${subject}\n\n${body}`);
    toast(ok ? "Email copied — paste it into any mail app" : "Couldn't copy automatically — select the text below", ok ? "ok" : "error");
  };

  const reset = () => {
    setData(emptyInquiry);
    setErrors({});
    setTouched({});
    setStep("form");
    try {
      sessionStorage.removeItem(STORE);
    } catch {}
    setTimeout(goTop, 50);
  };

  const completion = useMemo(() => {
    const req = ["name", "email", "type", "budget", "timeline", "description"] as const;
    return req.filter((f) => !validate(f, data[f])).length / req.length;
  }, [data]);

  return (
    <div ref={top} className="relative">
      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: EASE }}
            aria-label="Project inquiry form"
            className="space-y-12"
          >
            <div className="flex items-center gap-4">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10" aria-hidden>
                <motion.div className="h-full bg-deep" animate={{ width: `${completion * 100}%` }} transition={{ duration: 0.6, ease: EASE }} />
              </div>
              <span className="font-mono text-xs text-ink/50">{Math.round(completion * 100)}% complete</span>
            </div>

            <Fieldset legend="About you" index="01">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field name="name" label="Full name" required value={data.name} error={errors.name} onChange={set("name")} onBlur={blur("name")} autoComplete="name" placeholder="Your name" />
                <Field name="company" label="Business or company" optional value={data.company} onChange={set("company")} onBlur={blur("company")} autoComplete="organization" placeholder="Company name" />
                <Field name="email" type="email" label="Email address" required value={data.email} error={errors.email} onChange={set("email")} onBlur={blur("email")} autoComplete="email" placeholder="name@company.com" inputMode="email" />
                <Field name="phone" type="tel" label="Phone number" optional value={data.phone} error={errors.phone} onChange={set("phone")} onBlur={blur("phone")} autoComplete="tel" placeholder="+91 …" inputMode="tel" />
                <Field
                  name="website"
                  type="url"
                  label="Current website"
                  optional
                  value={data.website}
                  error={errors.website}
                  onChange={set("website")}
                  onBlur={blur("website")}
                  autoComplete="url"
                  placeholder="example.com"
                  inputMode="url"
                  className="sm:col-span-2"
                />
              </div>
            </Fieldset>

            <Fieldset legend="Your project" index="02">
              <ChoiceGroup name="type" label="Project type" options={projectTypes} value={data.type} error={errors.type} onChange={(v) => { set("type")(v); setErrors((e) => ({ ...e, type: undefined })); }} />
              <ChoiceGroup name="budget" label="Budget" options={budgets} value={data.budget} error={errors.budget} onChange={(v) => { set("budget")(v); setErrors((e) => ({ ...e, budget: undefined })); }} />
              <ChoiceGroup name="timeline" label="Desired timeline" options={timelines} value={data.timeline} error={errors.timeline} onChange={(v) => { set("timeline")(v); setErrors((e) => ({ ...e, timeline: undefined })); }} />
            </Fieldset>

            <Fieldset legend="The details" index="03">
              <Field
                name="description"
                label="Project description"
                required
                multiline
                rows={6}
                value={data.description}
                error={errors.description}
                onChange={set("description")}
                onBlur={blur("description")}
                placeholder={"What are you building? Who is it for? What should the website achieve?\nTip: list features on separate lines starting with “-”."}
                hint={`${data.description.trim().length} characters · we'll tidy formatting automatically`}
              />
              {data.description.trim().length > 30 && formatText(data.description) !== data.description.trim() && (
                <button type="button" onClick={() => set("description")(formatText(data.description))} className="-mt-2 inline-flex items-center gap-2 text-sm text-deep hover:underline">
                  <Sparkles className="size-4" aria-hidden /> Tidy up formatting now
                </button>
              )}
              <Field name="additional" label="Additional information" optional multiline rows={3} value={data.additional} onChange={set("additional")} onBlur={blur("additional")} placeholder="Links to sites you like, deadlines, content status, anything else…" />
            </Fieldset>

            <div className="flex flex-col gap-5 border-t hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-sm leading-relaxed text-ink/55">
                Next, you&apos;ll review a ready-to-send email. Nothing is sent until <strong className="font-medium text-ink/80">you</strong> press Send in your email app.
              </p>
              <Button type="submit" size="lg" icon>
                Review my inquiry
              </Button>
            </div>
          </motion.form>
        )}

        {step === "review" && (
          <motion.section
            key="review"
            aria-labelledby="review-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="eyebrow text-deep">Step 2 of 2 · Review</p>
            <h2 id="review-title" className="mt-3 font-display text-3xl font-light tracking-[-0.035em] sm:text-4xl">
              Your email is ready.
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-ink/65">
              Check the details and edit anything you like. We&apos;ll open Gmail with this message pre-filled — you stay in control and press Send yourself.
            </p>

            <dl className="mt-8 grid gap-px overflow-hidden rounded-3xl bg-ink/[0.08] text-sm sm:grid-cols-3">
              {(
                [
                  ["Name", data.name],
                  ["Email", data.email],
                  ["Project", data.type],
                  ["Budget", data.budget],
                  ["Timeline", data.timeline],
                  ["Business", data.company || "—"],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="bg-paper p-4">
                  <dt className="eyebrow text-[0.62rem] text-ink/45">{k}</dt>
                  <dd className="mt-1 truncate text-ink/85">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 overflow-hidden rounded-3xl bg-paper ring-1 ring-ink/[0.08]">
              <div className="flex items-center gap-3 border-b hairline px-5 py-3 text-sm">
                <span className="w-16 text-ink/45">To</span>
                <span className="font-medium text-ink/85">{site.email}</span>
              </div>
              <label className="flex items-center gap-3 border-b hairline px-5 py-3 text-sm">
                <span className="w-16 shrink-0 text-ink/45">Subject</span>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-transparent font-medium text-ink/85 outline-none" aria-label="Email subject" />
              </label>
              <label className="block">
                <span className="sr-only">Email body</span>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={16}
                  data-lenis-prevent
                  className="block w-full resize-y bg-transparent px-5 py-4 font-mono text-[0.82rem] leading-relaxed text-ink/80 outline-none"
                />
              </label>
              <p className="flex items-center gap-2 border-t hairline px-5 py-2.5 text-xs text-ink/45">
                <Pencil className="size-3" aria-hidden /> Fully editable — changes carry over to Gmail.
              </p>
            </div>

            <AnimatePresence>
              {blocked && <FallbackNotice onCopy={copyAll} onRetry={openGmail} subject={subject} body={body} />}
            </AnimatePresence>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="ghost" onClick={() => { setStep("form"); setTimeout(goTop, 50); }} iconNode={null}>
                <ArrowLeft className="size-4" aria-hidden /> Edit details
              </Button>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="secondary" onClick={copyAll} iconNode={<Copy className="size-4" aria-hidden />}>
                  Copy email
                </Button>
                <Button onClick={openGmail} loading={busy} size="lg" iconNode={<ExternalLink className="size-4" aria-hidden />}>
                  Open in Gmail
                </Button>
              </div>
            </div>
            <p className="mt-4 text-right text-sm text-ink/50">
              Prefer another app?{" "}
              <a href={mailtoUrl({ to: site.email, subject, body })} className="text-deep underline underline-offset-4">
                Open your default mail app
              </a>
            </p>
          </motion.section>
        )}

        {step === "opened" && (
          <motion.section
            key="opened"
            aria-labelledby="opened-title"
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="rounded-[2rem] bg-paper p-8 ring-1 ring-ink/[0.08] sm:p-12"
          >
            <span className="grid size-14 place-items-center rounded-full bg-deep text-lav">
              <Mail className="size-6" aria-hidden />
            </span>
            <h2 id="opened-title" className="mt-8 font-display text-3xl font-light tracking-[-0.035em] sm:text-4xl">
              Gmail is open in a new tab.
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-ink/70">
              Your message is pre-filled and ready. <strong className="font-semibold text-ink">It hasn&apos;t been sent yet</strong> — switch to the Gmail tab, review it and press <em>Send</em>. We usually reply within a couple of working days.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-ink/65">
              <li className="flex gap-3"><Check className="size-4 shrink-0 text-deep" aria-hidden /> Not signed in to Gmail? Sign in and the draft will still be there.</li>
              <li className="flex gap-3"><Check className="size-4 shrink-0 text-deep" aria-hidden /> Don&apos;t use Gmail? Copy the email and send it from any app to {site.email}.</li>
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button onClick={openGmail} variant="secondary" iconNode={<RefreshCw className="size-4" aria-hidden />}>
                Open Gmail again
              </Button>
              <Button onClick={copyAll} variant="secondary" iconNode={<Copy className="size-4" aria-hidden />}>
                Copy email
              </Button>
              <a href={mailtoUrl({ to: site.email, subject, body })} className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-ink/70 hover:text-deep">
                <Mail className="size-4" aria-hidden /> Default mail app
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 border-t hairline pt-6 text-sm">
              <button type="button" onClick={() => setStep("review")} className="text-ink/60 hover:text-deep">
                ← Back to the email
              </button>
              <button type="button" onClick={reset} className="text-ink/60 hover:text-deep">
                Start a new inquiry
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────── pieces ───────── */

function Fieldset({ legend, index, children }: { legend: string; index: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-6">
      <legend className="mb-6 flex items-center gap-3">
        <span className="font-mono text-xs text-deep">{index}</span>
        <span className="font-display text-2xl font-normal tracking-[-0.03em]">{legend}</span>
      </legend>
      {children}
    </fieldset>
  );
}

type FieldProps = {
  name: keyof Inquiry;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  required?: boolean;
  optional?: boolean;
  multiline?: boolean;
  rows?: number;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  hint?: string;
  className?: string;
};

function Field({ name, label, value, onChange, onBlur, error, required, optional, multiline, rows, type = "text", placeholder, autoComplete, inputMode, hint, className }: FieldProps) {
  const id = `f-${name}`;
  const errId = `${id}-err`;
  const hintId = `${id}-hint`;
  const valid = !error && value.trim().length > 0;
  const cls = cn(
    "peer w-full rounded-2xl border bg-paper px-4 text-[0.98rem] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-ink/35",
    "focus:border-deep focus:shadow-[0_0_0_4px_rgba(61,82,160,.12)]",
    error ? "border-[#b4405a]/70" : "border-ink/12 hover:border-ink/25",
    multiline ? "py-3.5 leading-relaxed" : "h-13"
  );
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm">
        <span className="font-medium text-ink/85">
          {label}
          {required && <span className="ml-0.5 text-deep" aria-hidden>*</span>}
        </span>
        {optional && <span className="text-xs text-ink/40">Optional</span>}
      </label>
      <div className="relative">
        {multiline ? (
          <textarea
            id={id}
            name={name}
            rows={rows}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            required={required}
            aria-invalid={!!error}
            aria-describedby={cn(error && errId, hint && hintId) || undefined}
            data-lenis-prevent
            className={cls}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputMode={inputMode}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? errId : undefined}
            className={cn(cls, "pr-10")}
          />
        )}
        {!multiline && valid && (
          <Check className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-deep" aria-hidden />
        )}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={errId}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-center gap-1.5 text-sm text-[#a3364f]"
          >
            <CircleAlert className="size-3.5 shrink-0" aria-hidden />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <p id={hintId} className="mt-2 text-xs text-ink/45">
          {hint}
        </p>
      )}
    </div>
  );
}

function ChoiceGroup({
  name,
  label,
  options,
  value,
  onChange,
  error,
}: {
  name: keyof Inquiry;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const gid = useId();
  return (
    <div role="radiogroup" aria-labelledby={`${gid}-l`} aria-describedby={error ? `${gid}-e` : undefined} id={`f-${name}`} tabIndex={-1} className="outline-none">
      <p id={`${gid}-l`} className="mb-3 text-sm font-medium text-ink/85">
        {label}
        <span className="ml-0.5 text-deep" aria-hidden>*</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = value === o;
          return (
            <label
              key={o}
              className={cn(
                "relative cursor-pointer select-none rounded-full border px-4 py-2.5 text-sm transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-peri",
                checked ? "border-deep bg-deep text-lav shadow-[0_8px_20px_-10px_rgba(61,82,160,.8)]" : "border-ink/12 bg-paper text-ink/75 hover:border-deep/40 hover:text-ink",
                error && !checked && "border-[#b4405a]/40"
              )}
            >
              <input type="radio" name={name} value={o} checked={checked} onChange={() => onChange(o)} className="sr-only" />
              {checked && <Check className="-ml-1 mr-1.5 inline size-3.5" aria-hidden />}
              {o}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${gid}-e`} role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-[#a3364f]">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

function FallbackNotice({ onCopy, onRetry, subject, body }: { onCopy: () => void; onRetry: () => void; subject: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-6 overflow-hidden"
      role="alert"
    >
      <div className="rounded-3xl border border-[#b4405a]/30 bg-[#b4405a]/[0.05] p-5 text-sm leading-relaxed text-ink/80">
        <p className="font-medium text-ink">Gmail couldn&apos;t be opened — your browser may have blocked the new tab.</p>
        <p className="mt-1 text-ink/65">Allow pop-ups for this site and try again, copy the email, or use your default mail app. Your message hasn&apos;t been sent.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={onRetry} className="inline-flex items-center gap-2 rounded-full bg-deep px-4 py-2 text-lav">
            <RefreshCw className="size-3.5" aria-hidden /> Try again
          </button>
          <button type="button" onClick={onCopy} className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2">
            <Copy className="size-3.5" aria-hidden /> Copy email
          </button>
          <a href={mailtoUrl({ to: site.email, subject, body })} className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2">
            <Mail className="size-3.5" aria-hidden /> Mail app
          </a>
        </div>
      </div>
    </motion.div>
  );
}
