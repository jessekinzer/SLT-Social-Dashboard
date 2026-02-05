import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  AtSign,
  BarChart3,
  Briefcase,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Check,
  Clipboard,
  Clock,
  Code,
  Compass,
  Cpu,
  ChevronDown,
  DollarSign,
  Edit,
  Eye,
  Flame,
  FileText,
  GitBranch,
  HelpCircle,
  Image,
  Layers,
  Layout,
  Moon,
  MessageCircle,
  MessageSquare,
  MessageSquareText,
  Quote,
  Sun,
  Server,
  Shield,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  TriangleAlert,
  Users,
  Zap,
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
  Embedded: "bg-[rgba(35,55,241,0.12)] text-[var(--color-accent-blue)]",
  Scoped: "bg-[rgba(35,55,241,0.08)] text-[var(--color-accent-blue)]",
  Recruiting: "bg-[rgba(35,55,241,0.16)] text-[var(--color-accent-blue)]",
};

const focusCard = "card-surface p-8 md:p-10";

const iconMap = {
  "alert-circle": AlertCircle,
  "at-sign": AtSign,
  "bar-chart": BarChart3,
  briefcase: Briefcase,
  clock: Clock,
  code: Code,
  compass: Compass,
  cpu: Cpu,
  "dollar-sign": DollarSign,
  edit: Edit,
  eye: Eye,
  "file-text": FileText,
  "git-branch": GitBranch,
  "help-circle": HelpCircle,
  image: Image,
  layers: Layers,
  layout: Layout,
  "message-circle": MessageCircle,
  "message-square": MessageSquare,
  server: Server,
  shield: Shield,
  "trending-up": TrendingUp,
  users: Users,
  zap: Zap,
};

const BoosterIcon = ({ name }) => {
  const Icon = iconMap[name] || Sparkles;
  return <Icon className="h-4 w-4 text-[var(--color-accent-blue)]" />;
};

const ThemeToggle = ({ theme, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent-blue)]"
  >
    {theme === "dark" ? (
      <>
        <Moon className="h-4 w-4 text-[var(--color-accent-blue)]" />
        Dark
      </>
    ) : (
      <>
        <Sun className="h-4 w-4 text-[var(--color-accent-blue)]" />
        Light
      </>
    )}
  </button>
);

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
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[var(--color-accent-blue)] px-4 py-2 text-sm font-medium text-white shadow-lg">
      <Check className="h-4 w-4" />
      {message}
    </div>
  );
};

const Pill = ({ text }) => (
  <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
    {text}
  </span>
);

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-4 flex items-start gap-3">
    <div className="rounded-xl bg-[rgba(35,55,241,0.1)] p-2 text-[var(--color-accent-blue)]">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h2 className="text-[clamp(20px,2vw,24px)] font-semibold text-[var(--color-text-primary)]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
      ) : null}
    </div>
  </div>
);

const Landing = ({ theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(getInitialMemberId());

  const handleSelect = (id) => {
    saveSelectedMember(id);
    setSelectedId(id);
    navigate(`/member/${id}`);
  };

  return (
    <div className="app-shell">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)] backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 md:px-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
              Midwestern Interactive
            </p>
            <h1 className="text-[clamp(32px,4vw,48px)] font-semibold leading-tight text-[var(--color-text-primary)]">
              LinkedIn ICP Playbooks
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {selectedId ? (
              <Link
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-accent-blue)] transition hover:opacity-80"
                to={`/member/${selectedId}`}
              >
                Resume {teamData.teamMembers.find((member) => member.id === selectedId)?.name}
              </Link>
            ) : null}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-24">
        <div className="geo-grid" />
        <div className="geo-orbit" />
        <div className="mb-16 max-w-2xl">
          <p className="text-lg font-medium text-[var(--color-text-secondary)]">
            Select your profile to access your personalized dashboard.
          </p>
          <div className="mt-4 h-px w-20 bg-[var(--color-accent-blue)]" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teamData.teamMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => handleSelect(member.id)}
              className="card-surface group relative flex flex-col items-center gap-4 p-8 text-center hover:border-[var(--color-accent-blue)]"
              type="button"
            >
              <div className="avatar-gradient flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--color-border)] text-2xl font-semibold text-white">
                {member.avatar}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">{member.name}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{member.role}</p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                {member.icp.primaryService}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {member.icp.servicesFocus.map((service) => (
                  <span
                    key={service}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      serviceColors[service] || "bg-[rgba(35,55,241,0.08)] text-[var(--color-accent-blue)]"
                    }`}
                  >
                    {service}
                  </span>
                ))}
              </div>
              <span className="absolute right-6 top-6 rounded-full border border-transparent bg-[rgba(35,55,241,0.08)] px-3 py-1 text-xs font-medium text-[var(--color-accent-blue)] opacity-0 transition group-hover:opacity-100">
                View →
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

const Dashboard = ({ theme, onToggleTheme }) => {
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
      <div className="min-h-screen px-6 py-16 text-center text-[var(--color-text-primary)]">
        <p className="text-lg text-[var(--color-text-secondary)]">Team member not found.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-accent-blue)]"
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
      setToast("Copied!");
      setTimeout(() => setToast(""), 2000);
    } catch (error) {
      setToast("Copy failed - please try again");
      setTimeout(() => setToast(""), 2000);
    }
  };

  const quickReference = member.quickReference;

  return (
    <div className="app-shell">
      <Toast message={toast} />
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent-blue)] transition hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to team selection
          </Link>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <nav className="border-t border-[var(--color-border)]">
          <div className="mx-auto flex max-w-[1400px] flex-wrap gap-2 px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] md:px-12">
            {sectionLinks.map((link) => (
              <a
                key={link.id}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-1 text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue)]"
                href={`#${link.id}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className="relative mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-24">
        <div className="geo-grid" />
        <div className="geo-orbit" />
        <section className="relative mb-20 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="avatar-gradient flex h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-[var(--color-border)] text-3xl font-semibold text-white">
                {member.avatar}
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
                  {member.role}
                </p>
                <h1 className="mt-3 text-[clamp(32px,4vw,40px)] font-semibold leading-tight text-[var(--color-text-primary)]">
                  {member.name}
                </h1>
                <p className="mt-2 text-base font-medium text-[var(--color-text-secondary)]">
                  {member.icp.title}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {member.icp.targetRoles.map((role) => (
                <span
                  key={role}
                  className="rounded-full bg-[rgba(35,55,241,0.1)] px-3 py-1 text-[13px] font-medium text-[var(--color-accent-blue)]"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {member.icp.servicesFocus.map((service) => (
              <span
                key={service}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                  serviceColors[service] || "bg-[rgba(35,55,241,0.08)] text-[var(--color-accent-blue)]"
                }`}
              >
                {service}
              </span>
            ))}
          </div>
        </section>
        <div className="mb-20 flex items-center gap-3 text-sm font-medium text-[var(--color-accent-blue)]">
          <ArrowDown className="h-4 w-4" />
          <a href="#overview" className="transition hover:opacity-80">
            Jump to ICP overview
          </a>
        </div>
        <section id="overview" className={focusCard}>
          <SectionTitle icon={Sparkles} title="Your ICP Overview" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                Who you're targeting
              </p>
              <p className="mt-3 text-lg font-semibold text-[var(--color-text-primary)]">
                {member.icp.title}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {member.icp.targetRoles.map((role) => (
                  <Pill key={role} text={role} />
                ))}
              </div>
            </div>
            <div className="rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                Company profile
              </p>
              <p className="mt-3 text-sm text-[var(--color-text-primary)]">{member.icp.companyProfile}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {member.icp.industries.map((industry) => (
                  <Pill key={industry} text={industry} />
                ))}
              </div>
            </div>
            <div className="rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                They're posting about
              </p>
              <ul className="mt-3 space-y-3 text-sm text-[var(--color-text-primary)]">
                {member.icp.hotTopics.map((topic) => (
                  <li key={topic} className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-[var(--color-accent-blue)]" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="connect-engage" className={`mt-20 ${focusCard}`}>
          <SectionTitle
            icon={CheckCircle2}
            title="Connect vs Engage"
            subtitle="Use this decision tree when scanning LinkedIn feeds."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[16px] border border-[var(--color-border)] bg-[rgba(35,55,241,0.03)] p-6">
              <div className="border-l-4 border-[var(--color-accent-blue)] pl-4">
                <h3 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
                  ✅ CONNECT if they...
                </h3>
                <ul className="space-y-4 text-sm text-[var(--color-text-secondary)]">
                  {member.connectCriteria.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent-blue)]" />
                      <span className="text-[15px] leading-relaxed text-[var(--color-text-primary)]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
              <div className="border-l-4 border-[var(--color-border)] pl-4">
                <h3 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
                  👍 ENGAGE if they...
                </h3>
                <ul className="space-y-4 text-sm text-[var(--color-text-secondary)]">
                  {member.engageCriteria.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-text-secondary)]" />
                      <span className="text-[15px] leading-relaxed text-[var(--color-text-primary)]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowWhy((value) => !value)}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent-blue)]"
          >
            <BadgeCheck className="h-4 w-4" />
            {showWhy ? "Hide" : "Why this matters"}
          </button>
          {showWhy ? (
            <div className="mt-4 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 text-sm text-[var(--color-text-secondary)]">
              Connecting is reserved for ICPs showing active buying signals. Engage when the intent is
              weaker—your goal is to nurture until they match the connect criteria.
            </div>
          ) : null}
        </section>

        <section id="starters" className={`mt-20 ${focusCard}`}>
          <SectionTitle icon={MessageSquareText} title="Conversation Starters" />
          <div className="grid gap-6 lg:grid-cols-3">
            {member.conversationStarters.map((starter) => (
              <div key={starter.id} className="card-surface relative p-8">
                <button
                  type="button"
                  onClick={() => handleCopy(starter.template)}
                  className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent-blue)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1a2ac7]"
                >
                  <Clipboard className="h-3.5 w-3.5" />
                  Copy
                </button>
                <p className="text-base leading-relaxed text-[var(--color-text-primary)]">{starter.template}</p>
                <p className="mt-6 text-sm font-medium italic text-[var(--color-text-secondary)]">
                  When to use
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-primary)]">{starter.whenToUse}</p>
                <div className="mt-4 inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                  {starter.tone}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="quotes" className={`mt-20 ${focusCard}`}>
          <SectionTitle icon={Quote} title="What They're Actually Saying" />
          <div className="grid gap-6 md:grid-cols-2">
            {member.realQuotes.map((quote) => (
              <div
                key={quote}
                className="relative rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6"
              >
                <span className="absolute left-6 top-4 text-4xl font-semibold text-[var(--color-accent-blue)] opacity-30">
                  “
                </span>
                <div className="border-l-4 border-[var(--color-accent-blue)] pl-4">
                  <p className="text-lg font-medium italic leading-relaxed text-[var(--color-text-primary)]">
                    {quote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="content" className={`mt-20 ${focusCard}`}>
          <SectionTitle icon={BookOpen} title="Content You Should Post" />
          <div className="space-y-4">
            {member.contentPillars.map((pillar) => (
              <details
                key={pillar.title}
                className="group rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-6 py-4"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-[20px] font-semibold text-[var(--color-text-primary)]">
                  <span>{pillar.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[rgba(199,250,80,0.15)] px-3 py-1 text-[12px] font-medium text-[var(--color-accent-lime)]">
                      {pillar.frequency}
                    </span>
                    <ChevronDown className="h-5 w-5 text-[var(--color-text-secondary)] transition group-open:rotate-180" />
                  </div>
                </summary>
                <div className="mt-4 space-y-4 text-sm text-[var(--color-text-secondary)]">
                  <p>{pillar.description}</p>
                  <ul className="space-y-3 text-[15px] text-[var(--color-text-primary)]">
                    {pillar.examples.map((example) => (
                      <li key={example} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent-blue)]" />
                        {example}
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                    Posting tip{" "}
                    <span className="normal-case font-medium text-[var(--color-text-primary)]">
                      {pillar.postingTips}
                    </span>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section id="boosters" className={`mt-20 ${focusCard}`}>
          <SectionTitle icon={Sparkles} title="5 Engagement Boosters" />
          <div className="space-y-8">
            {member.engagementBoosters.map((booster) => (
              <div key={booster.step} className="flex items-start gap-6">
                <div className="text-4xl font-semibold text-[var(--color-accent-blue)]">
                  {booster.step}
                </div>
                <div className="card-surface flex-1 p-6">
                  <div className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
                    <BoosterIcon name={booster.icon} />
                    {booster.action}
                  </div>
                  <p className="mt-2 text-base text-[var(--color-text-secondary)]">{booster.why}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="red-flags" className={`mt-20 ${focusCard}`}>
          <SectionTitle icon={TriangleAlert} title="Red Flags" />
          <div className="grid gap-4 md:grid-cols-2">
            {member.redFlags.map((flag) => (
              <div
                key={flag}
                className="flex items-start gap-3 rounded-[16px] border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.15)] p-4 text-sm text-[var(--color-text-primary)]"
              >
                <TriangleAlert className="mt-1 h-4 w-4 text-[rgba(239,68,68,0.7)]" />
                <span className="leading-relaxed">{flag}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="trust" className={`mt-20 ${focusCard}`}>
          <SectionTitle icon={BadgeCheck} title="What They Need to See" />
          <div className="grid gap-3 md:grid-cols-2">
            {member.trustBuilders.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 text-sm text-[var(--color-text-primary)]"
              >
                <BadgeCheck className="h-4 w-4 text-[var(--color-accent-blue)]" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="quick-ref" className={`mt-20 ${focusCard}`}>
          <SectionTitle icon={Clipboard} title="Quick Reference" />
          <div className="overflow-hidden rounded-[16px] border border-[var(--color-border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-bg-secondary)]">
                <tr>
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                    Focus
                  </th>
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-4 font-semibold text-[var(--color-text-primary)]">
                    Decision speed
                  </td>
                  <td className="px-4 py-4 text-[var(--color-text-secondary)]">
                    {quickReference.decisionSpeed}
                  </td>
                </tr>
                <tr className="table-row-alt border-t border-[var(--color-border)]">
                  <td className="px-4 py-4 font-semibold text-[var(--color-text-primary)]">
                    Buying committee
                  </td>
                  <td className="px-4 py-4 text-[var(--color-text-secondary)]">
                    {quickReference.buyingCommittee}
                  </td>
                </tr>
                <tr className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-4 font-semibold text-[var(--color-text-primary)]">
                    When they're warm
                  </td>
                  <td className="px-4 py-4">
                    <ul className="space-y-2 text-[var(--color-text-secondary)]">
                      {quickReference.whenWarm.map((signal) => (
                        <li key={signal} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--color-accent-blue)]" />
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return window.localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <Routes>
      <Route path="/" element={<Landing theme={theme} onToggleTheme={handleToggleTheme} />} />
      <Route
        path="/member/:id"
        element={<Dashboard theme={theme} onToggleTheme={handleToggleTheme} />}
      />
    </Routes>
  );
}
