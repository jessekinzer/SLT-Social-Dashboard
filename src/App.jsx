import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clipboard,
  Flame,
  MessageSquareText,
  Quote,
  Sparkles,
  ThumbsUp,
  TriangleAlert,
  Users,
} from "lucide-react";
import teamData from "./data/teamData.json";
import { useEffect, useMemo, useState } from "react";

const sectionLinks = [
  { id: "overview", label: "ICP Overview" },
  { id: "connect-engage", label: "Connect vs Engage" },
  { id: "starters", label: "Conversation Starters" },
  { id: "quotes", label: "Real Quotes" },
  { id: "content", label: "Content Pillars" },
  { id: "boosters", label: "Engagement Boosters" },
  { id: "red-flags", label: "Red Flags" },
  { id: "trust", label: "Trust Builders" },
  { id: "quick-ref", label: "Quick Reference" },
];

const serviceColors = {
  Embedded: "bg-blue-100 text-blue-700",
  Scoped: "bg-indigo-100 text-indigo-700",
  Recruiting: "bg-purple-100 text-purple-700",
};

const focusCard = "rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle";

const getInitialMemberId = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("selectedMemberId");
};

const saveSelectedMember = (id) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("selectedMemberId", id);
};

const Toast = ({ message }) => {
  if (!message) return null;
  return (
    <div className="fixed right-6 top-6 z-50 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
      {message}
    </div>
  );
};

const Pill = ({ text }) => (
  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
    {text}
  </span>
);

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-4 flex items-start gap-3">
    <div className="rounded-xl bg-blue-50 p-2 text-primary">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(getInitialMemberId());

  const handleSelect = (id) => {
    saveSelectedMember(id);
    setSelectedId(id);
    navigate(`/member/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm font-semibold text-primary">Midwestern Interactive</p>
            <h1 className="text-2xl font-semibold text-slate-900">LinkedIn ICP Dashboard</h1>
          </div>
          {selectedId ? (
            <Link
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              to={`/member/${selectedId}`}
            >
              Resume {teamData.teamMembers.find((member) => member.id === selectedId)?.name}
            </Link>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-slate-900">Select your profile</h2>
          <p className="mt-2 text-slate-600">
            Choose your team member dashboard to access ICP insights, outreach templates, and
            daily engagement guidance.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamData.teamMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => handleSelect(member.id)}
              className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-subtle transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              type="button"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{member.role}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {member.icp.servicesFocus.map((service) => (
                  <span
                    key={service}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      serviceColors[service] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {service}
                  </span>
                ))}
              </div>
              <span className="absolute right-6 top-6 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500 group-hover:bg-blue-50 group-hover:text-primary">
                View
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => {
  const { id } = useParams();
  const [toast, setToast] = useState("");
  const [showWhy, setShowWhy] = useState(false);

  const member = useMemo(
    () => teamData.teamMembers.find((entry) => entry.id === id),
    [id]
  );

  useEffect(() => {
    if (member) {
      saveSelectedMember(member.id);
    }
  }, [member]);

  if (!member) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-16 text-center">
        <p className="text-lg text-slate-600">Team member not found.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to team selection
        </Link>
      </div>
    );
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast("Copied to clipboard");
      setTimeout(() => setToast(""), 2000);
    } catch (error) {
      setToast("Copy failed - please try again");
      setTimeout(() => setToast(""), 2000);
    }
  };

  const quickReference = {
    metrics: ["Connections sent", "Replies", "Booked calls", "Engaged posts"],
    routine: [
      "5 min: respond to notifications",
      "4 min: comment on 2 ICP posts",
      "3 min: send 3 targeted connection requests",
      "2 min: draft one value-forward post",
      "1 min: log outcomes",
    ],
    warmSignals: [
      "Engaged with 2+ posts",
      "Accepted connection request",
      "Asked a follow-up question",
      "Viewed your profile",
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast message={toast} />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">{member.role}</p>
            <h1 className="text-2xl font-semibold text-slate-900">{member.name}'s ICP Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Daily LinkedIn playbook for high-intent outreach.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to team selection
            </Link>
            <div className="flex flex-wrap gap-2">
              {member.icp.servicesFocus.map((service) => (
                <span
                  key={service}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    serviceColors[service] || "bg-slate-100 text-slate-700"
                  }`}
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
        <nav className="border-t border-slate-100 bg-slate-50">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-6 py-3 text-xs font-medium text-slate-500">
            {sectionLinks.map((link) => (
              <a
                key={link.id}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition hover:border-blue-200 hover:text-primary"
                href={`#${link.id}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section id="overview" className={focusCard}>
          <SectionTitle icon={Sparkles} title="Your ICP Overview" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Who you're targeting</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{member.icp.title}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {member.icp.targetRoles.map((role) => (
                  <Pill key={role} text={role} />
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Company profile</p>
              <p className="mt-2 text-sm text-slate-700">{member.icp.companyStage}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">They're posting about</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {member.icp.theyrePostingAbout.map((topic) => (
                  <li key={topic} className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-primary" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="connect-engage" className={`mt-8 ${focusCard}`}>
          <SectionTitle
            icon={CheckCircle2}
            title="Connect vs Engage"
            subtitle="Use this decision tree when scanning LinkedIn feeds."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-green-100 bg-green-50 p-5">
              <h3 className="mb-4 text-lg font-semibold text-green-800">✅ CONNECT if they...</h3>
              <ul className="space-y-3 text-sm text-green-900">
                {member.connectCriteria.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
              <h3 className="mb-4 text-lg font-semibold text-amber-800">👍 ENGAGE if they...</h3>
              <ul className="space-y-3 text-sm text-amber-900">
                {member.engageCriteria.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ThumbsUp className="mt-0.5 h-4 w-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowWhy((value) => !value)}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <BadgeCheck className="h-4 w-4" />
            {showWhy ? "Hide" : "Why this matters"}
          </button>
          {showWhy ? (
            <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              Connecting is reserved for ICPs showing active buying signals. Engage when the intent is
              weaker—your goal is to nurture until they match the connect criteria.
            </div>
          ) : null}
        </section>

        <section id="starters" className={`mt-8 ${focusCard}`}>
          <SectionTitle icon={MessageSquareText} title="Conversation Starters" />
          <div className="grid gap-4 lg:grid-cols-3">
            {member.conversationStarters.map((starter) => (
              <div key={starter.template} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
                <p className="text-sm text-slate-700">{starter.template}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">When to use</p>
                <p className="mt-1 text-sm text-slate-600">{starter.whenToUse}</p>
                <button
                  type="button"
                  onClick={() => handleCopy(starter.template)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-primary"
                >
                  <Clipboard className="h-3.5 w-3.5" />
                  Copy
                </button>
              </div>
            ))}
          </div>
        </section>

        <section id="quotes" className={`mt-8 ${focusCard}`}>
          <SectionTitle icon={Quote} title="What They're Actually Saying" />
          <div className="grid gap-4 md:grid-cols-2">
            {member.realQuotes.map((quote) => (
              <div key={quote} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-700">“{quote}”</p>
                <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
                  Pain point
                </span>
              </div>
            ))}
          </div>
        </section>

        <section id="content" className={`mt-8 ${focusCard}`}>
          <SectionTitle icon={BookOpen} title="Content You Should Post" />
          <div className="space-y-4">
            {member.contentPillars.map((pillar) => (
              <details key={pillar.title} className="rounded-xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                  {pillar.title} · <span className="text-slate-500">{pillar.frequency}</span>
                </summary>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {pillar.examples.map((example) => (
                    <li key={example} className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                      {example}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>

        <section id="boosters" className={`mt-8 ${focusCard}`}>
          <SectionTitle icon={Sparkles} title="5 Engagement Boosters" />
          <div className="grid gap-4 md:grid-cols-2">
            {member.engagementBoosters.map((booster, index) => (
              <div key={booster} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-700">{booster}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="red-flags" className={`mt-8 ${focusCard}`}>
          <SectionTitle icon={TriangleAlert} title="Red Flags" />
          <div className="grid gap-4 md:grid-cols-2">
            {member.redFlags.map((flag) => (
              <div key={flag} className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-900">
                <TriangleAlert className="mt-0.5 h-4 w-4" />
                {flag}
              </div>
            ))}
          </div>
        </section>

        <section id="trust" className={`mt-8 ${focusCard}`}>
          <SectionTitle icon={BadgeCheck} title="What They Need to See" />
          <div className="grid gap-3 md:grid-cols-2">
            {member.trustBuilders.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <BadgeCheck className="h-4 w-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="quick-ref" className={`mt-8 ${focusCard}`}>
          <SectionTitle icon={Clipboard} title="Quick Reference" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Key metrics to track</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {quickReference.metrics.map((metric) => (
                  <li key={metric} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {metric}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Daily 15-min routine</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {quickReference.routine.map((step) => (
                  <li key={step} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Warm indicators</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {quickReference.warmSignals.map((signal) => (
                  <li key={signal} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/member/:id" element={<Dashboard />} />
    </Routes>
  );
}
