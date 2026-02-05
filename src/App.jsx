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
  { id: "overview", label: "Who You're Talking To" },
  { id: "connect-engage", label: "When to Connect on LinkedIn" },
  { id: "starters", label: "Opening Messages" },
  { id: "quotes", label: "What They're Actually Saying" },
  { id: "content", label: "What to Post" },
  { id: "boosters", label: "How to Get More Engagement" },
  { id: "red-flags", label: "People to Avoid" },
  { id: "trust", label: "How to Build Credibility" },
  { id: "quick-ref", label: "At a Glance" },
];

const serviceColors = {
  Embedded: "bg-[var(--color-accent-blue)] text-white",
  Scoped: "bg-[var(--color-accent-blue)] text-white",
  Recruiting: "bg-[var(--color-accent-blue)] text-white",
};

const focusCard = "card-surface p-6 sm:p-8 md:p-10";
const toId = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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
  return <Icon className="h-4 w-4 text-[var(--color-accent-blue)]" aria-hidden="true" />;
};

const ThemeToggle = ({ theme, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    className="flex min-h-[44px] items-center gap-2 border-2 border-[var(--color-border)] bg-[rgba(255,255,255,0.1)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition hover:border-[var(--color-accent-blue)]"
  >
    {theme === "dark" ? (
      <>
        <Sun className="h-5 w-5 text-white" />
        Light Mode
      </>
    ) : (
      <>
        <Moon className="h-5 w-5 text-[var(--color-text-primary)]" />
        Dark Mode
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
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[var(--color-accent-blue)] px-4 py-2 text-sm font-medium text-white shadow-lg"
      role="status"
      aria-live="polite"
    >
      <Check className="h-4 w-4" />
      {message}
    </div>
  );
};

const Pill = ({ text }) => (
  <span className="border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
    {text}
  </span>
);

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-4 flex items-start gap-3">
    <div className="bg-[var(--color-accent-blue)] p-2 text-white">
      <Icon className="h-5 w-5" aria-hidden="true" />
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
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)] backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
              Midwestern Interactive
            </p>
            <h1 className="text-[clamp(28px,8vw,48px)] font-semibold leading-tight text-[var(--color-text-primary)]">
              LinkedIn ICP Playbooks
            </h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {selectedId ? (
              <Link
                className="flex min-h-[44px] items-center border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition hover:border-[var(--color-accent-blue)]"
                to={`/member/${selectedId}`}
              >
                Resume {teamData.teamMembers.find((member) => member.id === selectedId)?.name}
              </Link>
            ) : null}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="relative mx-auto max-w-[1400px] px-6 py-12 md:px-12 md:py-24"
      >
        <div className="geo-grid" />
        <div className="geo-orbit" />
        <div className="mb-12 max-w-2xl">
          <p className="text-base font-medium text-[var(--color-text-secondary)] sm:text-lg">
            Select your profile to access your personalized dashboard.
          </p>
          <div className="mt-4 h-px w-20 bg-[var(--color-accent-blue)]" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teamData.teamMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => handleSelect(member.id)}
              className="card-surface group relative flex min-h-[240px] flex-col items-center gap-4 p-6 text-center hover:border-[var(--color-accent-blue)] md:min-h-[260px] md:p-8"
              type="button"
            >
              {member.profileImage ? (
                <img
                  src={member.profileImage}
                  alt={`${member.name}, ${member.role}`}
                  className="h-16 w-16 border-2 border-[var(--color-border)] object-cover md:h-20 md:w-20"
                />
              ) : (
                <div className="avatar-gradient flex h-16 w-16 items-center justify-center border-2 border-[var(--color-border)] text-xl font-semibold text-white md:h-20 md:w-20 md:text-2xl">
                  {member.avatar}
                </div>
              )}
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
                    className={`px-3 py-1 text-xs font-semibold ${
                      serviceColors[service] || "bg-[var(--color-accent-blue)] text-white"
                    }`}
                  >
                    {service}
                  </span>
                ))}
              </div>
              <span className="absolute right-6 top-6 border border-[var(--color-border)] bg-[rgba(35,55,241,0.08)] px-3 py-1 text-xs font-medium text-[var(--color-text-primary)] opacity-0 transition group-hover:opacity-100">
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
  const [openPillars, setOpenPillars] = useState({});

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
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)]"
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

  const togglePillar = (title) => {
    setOpenPillars((current) => ({ ...current, [title]: !current[title] }));
  };

  const quickReference = member.quickReference;

  return (
    <div className="app-shell">
      <Toast message={toast} />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-12">
          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] transition hover:border-b-2 hover:border-[var(--color-accent-blue)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to team selection
          </Link>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <nav className="border-t border-[var(--color-border)]" aria-label="Section navigation">
          <div className="mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] md:px-12">
            {sectionLinks.map((link) => (
              <a
                key={link.id}
                className="flex min-h-[44px] shrink-0 items-center border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-1 text-[var(--color-text-primary)] transition hover:border-[var(--color-accent-blue)]"
                href={`#${link.id}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main
        id="main-content"
        className="relative mx-auto max-w-[1400px] px-6 py-12 md:px-12 md:py-24"
      >
        <div className="geo-grid" />
        <div className="geo-orbit" />
        <section className="relative mb-12 flex flex-col gap-8 lg:mb-20 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              {member.profileImage ? (
                <img
                  src={member.profileImage}
                  alt={`${member.name}, ${member.role}`}
                  className="h-[88px] w-[88px] border-2 border-[var(--color-border)] object-cover sm:h-[120px] sm:w-[120px]"
                />
              ) : (
                <div className="avatar-gradient flex h-[88px] w-[88px] items-center justify-center border-2 border-[var(--color-border)] text-2xl font-semibold text-white sm:h-[120px] sm:w-[120px] sm:text-3xl">
                  {member.avatar}
                </div>
              )}
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
                  {member.role}
                </p>
                <h1 className="mt-3 text-[clamp(28px,7vw,40px)] font-semibold leading-tight text-[var(--color-text-primary)]">
                  {member.name}
                </h1>
                <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)] sm:text-base">
                  {member.icp.title}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {member.icp.targetRoles.map((role) => (
                <span
                  key={role}
                  className="bg-[rgba(35,55,241,0.2)] px-3 py-1 text-[12px] font-medium text-white sm:text-[13px]"
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
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] sm:px-4 ${
                  serviceColors[service] || "bg-[var(--color-accent-blue)] text-white"
                }`}
              >
                {service}
              </span>
            ))}
          </div>
        </section>
        <div className="mb-12 flex items-center gap-3 text-sm font-medium text-[var(--color-text-primary)] sm:mb-20">
          <ArrowDown className="h-4 w-4 text-[var(--color-accent-blue)]" aria-hidden="true" />
          <a href="#overview" className="border-b border-[var(--color-accent-blue)]">
            Jump to Who You're Talking To
          </a>
        </div>
        <section id="overview" className={focusCard}>
          <SectionTitle icon={Sparkles} title="Who You're Talking To" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                Who you're targeting
              </p>
              <p className="mt-3 text-base font-semibold text-[var(--color-text-primary)] sm:text-lg">
                {member.icp.title}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {member.icp.targetRoles.map((role) => (
                  <Pill key={role} text={role} />
                ))}
              </div>
            </div>
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 sm:p-6">
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
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                They're posting about
              </p>
              <ul className="mt-3 space-y-3 text-sm text-[var(--color-text-primary)]">
                {member.icp.hotTopics.map((topic) => (
                  <li key={topic} className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-[var(--color-accent-blue)]" aria-hidden="true" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="connect-engage" className={`mt-12 sm:mt-20 ${focusCard}`}>
          <SectionTitle
            icon={CheckCircle2}
            title="When to Connect on LinkedIn"
            subtitle="Use this decision tree when scanning LinkedIn feeds."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border border-[var(--color-border)] bg-[rgba(35,55,241,0.03)] p-6">
              <div className="border-l-4 border-[var(--color-accent-blue)] pl-4">
                <h3 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
                  ✅ CONNECT if they...
                </h3>
                <ul className="space-y-4 text-sm text-[var(--color-text-secondary)]">
                  {member.connectCriteria.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 bg-[var(--color-accent-blue)]" />
                      <span className="text-[15px] leading-relaxed text-[var(--color-text-primary)]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
              <div className="border-l-4 border-[var(--color-border)] pl-4">
                <h3 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
                  👍 ENGAGE if they...
                </h3>
                <ul className="space-y-4 text-sm text-[var(--color-text-secondary)]">
                  {member.engageCriteria.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 bg-[var(--color-text-secondary)]" />
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
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)]"
          >
            <BadgeCheck className="h-4 w-4 text-[var(--color-accent-blue)]" aria-hidden="true" />
            {showWhy ? "Hide" : "Why this matters"}
          </button>
          {showWhy ? (
            <div className="mt-4 border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 text-sm text-[var(--color-text-secondary)]">
              Connecting is reserved for ICPs showing active buying signals. Engage when the intent is
              weaker—your goal is to nurture until they match the connect criteria.
            </div>
          ) : null}
        </section>

        <section id="starters" className={`mt-12 sm:mt-20 ${focusCard}`}>
          <SectionTitle icon={MessageSquareText} title="Opening Messages" />
          <div className="grid gap-6 lg:grid-cols-3">
            {member.conversationStarters.map((starter) => (
              <div key={starter.id} className="card-surface p-6 sm:p-8">
                <p className="text-base leading-relaxed text-[var(--color-text-primary)]">{starter.template}</p>
                <p className="mt-6 text-sm font-medium italic text-[var(--color-text-secondary)]">
                  When to use
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-primary)]">{starter.whenToUse}</p>
                <div className="mt-4 inline-flex border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                  {starter.tone}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(starter.template)}
                  aria-label="Copy opening message to clipboard"
                  className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-[var(--color-accent-blue)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1a2ac7]"
                >
                  <Clipboard className="h-3.5 w-3.5" aria-hidden="true" />
                  Copy to clipboard
                </button>
              </div>
            ))}
          </div>
        </section>

        <section id="quotes" className={`mt-12 sm:mt-20 ${focusCard}`}>
          <SectionTitle icon={Quote} title="What They're Actually Saying" />
          <div className="grid gap-6 md:grid-cols-2">
            {member.realQuotes.map((quote) => (
              <div
                key={quote}
                className="relative border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6"
              >
                <span className="absolute left-6 top-4 text-3xl font-semibold text-[var(--color-accent-blue)] opacity-30 sm:text-4xl">
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

        <section id="content" className={`mt-12 sm:mt-20 ${focusCard}`}>
          <SectionTitle icon={BookOpen} title="What to Post" />
          <div className="space-y-4">
            {member.contentPillars.map((pillar) => {
              const isOpen = Boolean(openPillars[pillar.title]);
              const contentId = `${toId(pillar.title)}-content`;
              return (
                <details
                  key={pillar.title}
                  open={isOpen}
                  className="group border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-6 py-4"
                  onToggle={() => togglePillar(pillar.title)}
                >
                  <summary
                    className="flex cursor-pointer items-center justify-between gap-4 text-[20px] font-semibold text-[var(--color-text-primary)]"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                  >
                    <span>{pillar.title}</span>
                    <div className="flex items-center gap-3">
                      <span className="bg-[rgba(199,250,80,0.15)] px-3 py-1 text-[12px] font-medium text-[var(--color-accent-lime)]">
                        {pillar.frequency}
                      </span>
                      <ChevronDown className="h-5 w-5 text-[var(--color-text-secondary)] transition group-open:rotate-180" />
                    </div>
                  </summary>
                  <div id={contentId} className="mt-4 space-y-4 text-sm text-[var(--color-text-secondary)]">
                    <p>{pillar.description}</p>
                    <ul className="space-y-3 text-[15px] text-[var(--color-text-primary)]">
                      {pillar.examples.map((example) => (
                        <li key={example} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 bg-[var(--color-accent-blue)]" />
                          {example}
                        </li>
                      ))}
                    </ul>
                    <div className="border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                      Posting tip{" "}
                      <span className="normal-case font-medium text-[var(--color-text-primary)]">
                        {pillar.postingTips}
                      </span>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        <section id="boosters" className={`mt-12 sm:mt-20 ${focusCard}`}>
          <SectionTitle icon={Sparkles} title="How to Get More Engagement" />
          <div className="space-y-8">
            {member.engagementBoosters.map((booster) => (
              <div key={booster.step} className="flex items-start gap-4 sm:gap-6">
                <div className="text-3xl font-semibold text-[var(--color-accent-blue)] sm:text-4xl">
                  {booster.step}
                </div>
                <div className="card-surface flex-1 p-5 sm:p-6">
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

        <section id="red-flags" className={`mt-12 sm:mt-20 ${focusCard}`}>
          <SectionTitle icon={TriangleAlert} title="People to Avoid" />
          <div className="grid gap-4 md:grid-cols-2">
            {member.redFlags.map((flag) => (
              <div
                key={flag}
                className="flex items-start gap-3 border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.15)] p-4 text-sm text-[var(--color-text-primary)]"
              >
                <TriangleAlert className="mt-1 h-4 w-4 text-[rgba(239,68,68,0.7)]" aria-hidden="true" />
                <span className="leading-relaxed">{flag}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="trust" className={`mt-12 sm:mt-20 ${focusCard}`}>
          <SectionTitle icon={BadgeCheck} title="How to Build Credibility" />
          <div className="grid gap-3 md:grid-cols-2">
            {member.trustBuilders.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 text-sm text-[var(--color-text-primary)]"
              >
                <BadgeCheck className="h-4 w-4 text-[var(--color-accent-blue)]" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="quick-ref" className={`mt-12 sm:mt-20 ${focusCard}`}>
          <SectionTitle icon={Clipboard} title="At a Glance" />
          <div className="overflow-x-auto border border-[var(--color-border)]">
            <table className="min-w-[520px] w-full text-left text-sm">
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
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 text-[var(--color-accent-blue)]"
                            aria-hidden="true"
                          />
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
