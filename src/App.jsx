import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Copy,
  Flame,
  Lightbulb,
  MessageSquareQuote,
  Moon,
  Sparkles,
  Sun,
  Target,
  Upload,
  Users,
  X,
  Zap,
} from "lucide-react";
import teamData from "./data/teamData.json";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const contentTemplates = [
  {
    category: "Hot Take",
    template: "Unpopular opinion: [Controversial statement about your industry]",
    example: "Unpopular opinion: If your 'AI strategy' is just 'give everyone Copilot and see what happens,' you don't have a strategy — you have hope disguised as governance.",
  },
  {
    category: "Value Bomb",
    template: "We just helped [client/scenario] [achieve result] in [timeframe]. Here's what [5 things we learned]:\n1. [Lesson + why it mattered]\n2. [Lesson + why it mattered]\n3. [Lesson + why it mattered]\n4. [Lesson + why it mattered]\n5. [Lesson + why it mattered]",
    example: null,
  },
  {
    category: "Question Post",
    template: "Quick question: What's your biggest challenge with [pain point]?",
    example: "Quick question: What's your biggest challenge with proving AI ROI to your board? I'll share what's working for teams I'm advising.",
  },
  {
    category: "Listicle",
    template: "I audited [X] companies' [area] this week. Here are [number] mistakes I saw repeatedly:\n1. [Mistake]\n2. [Mistake]\n3. [Mistake]\n\nThe good news? [Positive spin / solution teaser]",
    example: null,
  },
  {
    category: "Myth Buster",
    template: "Everyone says [common advice]. I disagree. Here's why...\n[Counter-argument backed by experience/data]",
    example: "Everyone says 'start with a pilot.' I disagree. Most pilots fail because they're too small to prove value but too big to fail fast.",
  },
  {
    category: "Story Post",
    template: "I made a big [mistake/decision] last [timeframe]: [What happened]\n\nWhat I'd do differently now: [lessons]",
    example: "I killed a $400K AI project 3 months in last year. The vendor demos were impressive. The integration reality was hell. What I'd do differently: [lessons]",
  },
  {
    category: "Observation",
    template: "I noticed [trend/pattern] happening in [industry]. Anyone else seeing this?",
    example: "I noticed CTOs are now being held personally accountable for AI spend in board meetings. 18 months ago it was 'experiment freely.' Now it's 'show me the money.' Anyone else seeing this shift?",
  },
  {
    category: "Signal Post",
    template: "[Number] signs it's time to [take action]:\n→ [Sign 1]\n→ [Sign 2]\n→ [Sign 3]",
    example: "5 signs your AI pilot will never make it to production:\n→ You can't demo it to a real user\n→ The vendor keeps saying 'next release'\n→ Your engineers are working around it instead of with it",
  },
];

const weeklyEngagementChecklist = [
  { id: "mon-connections", task: "Send 5-10 connection requests to people in your ICP" },
  { id: "daily-likes", task: "Like 20 posts from your target audience (takes ~10 min)" },
  { id: "daily-comments", task: "Leave 5 thoughtful comments on ICP posts (not just 'Great post!')" },
  { id: "respond-comments", task: "Reply to anyone who comments on your posts within 24 hours" },
  { id: "profile-views", task: "Check who viewed your profile and engage with 3-5 of them" },
  { id: "dm-conversations", task: "Send 2-3 helpful DMs to recent connections (no pitching!)" },
  { id: "weekend-review", task: "Review your engagement: What posts got the most interaction?" },
];

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

const getTheme = () => {
  if (typeof window === "undefined") return "dark";
  return window.localStorage.getItem("slt-theme") || "dark";
};

const saveTheme = (theme) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("slt-theme", theme);
  if (theme === "dark") {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
  } else {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
  }
};

const getLogo = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("site-logo");
};

const saveLogo = (dataUrl) => {
  if (typeof window === "undefined") return;
  if (dataUrl) {
    window.localStorage.setItem("site-logo", dataUrl);
  } else {
    window.localStorage.removeItem("site-logo");
  }
};

const getHeroImage = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("hero-illustration");
};

const saveHeroImage = (dataUrl) => {
  if (typeof window === "undefined") return;
  if (dataUrl) {
    window.localStorage.setItem("hero-illustration", dataUrl);
  } else {
    window.localStorage.removeItem("hero-illustration");
  }
};

const getInitialMemberId = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("selectedMemberId");
};

const saveSelectedMember = (id) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("selectedMemberId", id);
};

const getEngagementWeekStart = (memberId) => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(`engagement_week_start_${memberId}`);
  if (!stored) return null;
  return new Date(stored);
};

const checkIsNewWeek = (memberId) => {
  const weekStart = getEngagementWeekStart(memberId);
  if (!weekStart) return true;
  const now = new Date();
  const daysSince = (now - weekStart) / (1000 * 60 * 60 * 24);
  return daysSince >= 7;
};

const resetEngagementWeek = (memberId) => {
  window.localStorage.setItem(`engagement_week_start_${memberId}`, new Date().toISOString());
  window.localStorage.removeItem(`engagement_checklist_${memberId}`);
};

const getEngagementChecklist = (memberId) => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(`engagement_checklist_${memberId}`) || "{}");
  } catch {
    return {};
  }
};

const saveEngagementChecklist = (memberId, checklist) => {
  window.localStorage.setItem(`engagement_checklist_${memberId}`, JSON.stringify(checklist));
};

// ---------------------------------------------------------------------------
// Shared Components
// ---------------------------------------------------------------------------

function Toast({ message, visible }) {
  if (!message) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-brand-blue px-5 py-3 text-sm font-medium text-white shadow-lg ${
        visible ? "animate-toastIn" : "animate-toastOut"
      }`}
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 size={16} />
      {message}
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState({ message: "", visible: false });
  const timerRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message: msg, visible: true });
    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
      timerRef.current = setTimeout(() => {
        setToast({ message: "", visible: false });
      }, 300);
    }, 2000);
  }, []);

  return { toast, showToast };
}

function useTheme() {
  const [theme, setThemeState] = useState(getTheme);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveTheme(getTheme());
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, isDark: theme === "dark", toggleTheme };
}

function HeroIllustration({ isDark }) {
  const nodeColor = "#2337F1";
  const lineColor = isDark ? "rgba(35,55,241,0.3)" : "rgba(35,55,241,0.2)";
  const accentColor = "#C7FA50";

  return (
    <div className="mb-10 w-full max-w-md">
      <svg viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="80" y1="90" x2="200" y2="50" stroke={lineColor} strokeWidth="2" />
        <line x1="200" y1="50" x2="320" y2="90" stroke={lineColor} strokeWidth="2" />
        <line x1="80" y1="90" x2="200" y2="130" stroke={lineColor} strokeWidth="2" />
        <line x1="200" y1="130" x2="320" y2="90" stroke={lineColor} strokeWidth="2" />
        <line x1="200" y1="50" x2="200" y2="130" stroke={lineColor} strokeWidth="1.5" />
        <line x1="40" y1="60" x2="80" y2="90" stroke={lineColor} strokeWidth="1.5" />
        <line x1="40" y1="130" x2="80" y2="90" stroke={lineColor} strokeWidth="1.5" />
        <line x1="360" y1="55" x2="320" y2="90" stroke={lineColor} strokeWidth="1.5" />
        <line x1="360" y1="130" x2="320" y2="90" stroke={lineColor} strokeWidth="1.5" />
        <line x1="140" y1="30" x2="200" y2="50" stroke={lineColor} strokeWidth="1" />
        <line x1="260" y1="30" x2="200" y2="50" stroke={lineColor} strokeWidth="1" />
        <line x1="140" y1="155" x2="200" y2="130" stroke={lineColor} strokeWidth="1" />
        <line x1="260" y1="155" x2="200" y2="130" stroke={lineColor} strokeWidth="1" />

        <circle cx="80" cy="90" r="16" fill={nodeColor} />
        <circle cx="200" cy="50" r="18" fill={nodeColor} />
        <circle cx="320" cy="90" r="16" fill={nodeColor} />
        <circle cx="200" cy="130" r="18" fill={accentColor} />
        <circle cx="40" cy="60" r="8" fill={nodeColor} opacity="0.4" />
        <circle cx="40" cy="130" r="8" fill={accentColor} opacity="0.35" />
        <circle cx="360" cy="55" r="8" fill={nodeColor} opacity="0.4" />
        <circle cx="360" cy="130" r="8" fill={accentColor} opacity="0.35" />
        <circle cx="140" cy="30" r="6" fill={nodeColor} opacity="0.25" />
        <circle cx="260" cy="30" r="6" fill={nodeColor} opacity="0.25" />
        <circle cx="140" cy="155" r="6" fill={accentColor} opacity="0.25" />
        <circle cx="260" cy="155" r="6" fill={accentColor} opacity="0.25" />

        <circle cx="80" cy="84" r="5" fill="white" />
        <rect x="74" y="91" width="12" height="7" rx="3.5" fill="white" />
        <circle cx="200" cy="44" r="5.5" fill="white" />
        <rect x="193" y="51" width="14" height="8" rx="4" fill="white" />
        <circle cx="320" cy="84" r="5" fill="white" />
        <rect x="314" y="91" width="12" height="7" rx="3.5" fill="white" />
        <circle cx="200" cy="124" r="5.5" fill={nodeColor} />
        <rect x="193" y="131" width="14" height="8" rx="4" fill={nodeColor} />
      </svg>
    </div>
  );
}

async function copyToClipboard(text, showToast) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!");
  } catch {
    showToast("Copy failed – please try again");
  }
}

// ---------------------------------------------------------------------------
// Landing Page
// ---------------------------------------------------------------------------

function Landing() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleSelect = (id) => {
    saveSelectedMember(id);
    navigate(`/member/${id}`);
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? "bg-brand-dark text-white" : "bg-brand-light text-brand-dark"
      }`}
    >
      <header
        className={`border-b ${
          isDark ? "border-white/10 bg-brand-dark/95" : "border-brand-dark/10 bg-brand-light/95"
        } backdrop-blur`}
      >
        <div className="mx-auto flex max-w-dashboard items-center justify-between px-6 py-4">
          {/* Logo - small, color inverts based on theme */}
          <img
            src="/mw-logo.svg"
            alt="Midwestern Logo"
            className={`h-6 w-auto transition-all ${
              isDark ? "invert brightness-0 invert" : ""
            }`}
            style={{ filter: isDark ? "invert(1) brightness(2)" : "none" }}
            data-testid="site-logo"
          />

          <button
            onClick={toggleTheme}
            className={`flex h-8 w-8 items-center justify-center transition-colors ${
              isDark
                ? "text-white/40 hover:text-white/80"
                : "text-brand-dark/40 hover:text-brand-dark/80"
            }`}
            aria-label="Toggle theme"
            data-testid="theme-toggle"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-dashboard px-6 py-12 md:py-16">
        <div className="mb-12">
          {/* Hero Illustration - color inverts based on theme */}
          <div className="mb-8">
            <img
              src="/illustration.svg"
              alt="Illustration"
              className="max-h-32 w-auto object-contain transition-all"
              style={{ filter: isDark ? "none" : "invert(0.9)" }}
              data-testid="hero-illustration"
            />
          </div>

          {/* Left-aligned headings */}
          <h2 className="text-4xl font-semibold md:text-5xl text-left">
            LinkedIn Playbook
          </h2>
          <p
            className={`mt-4 max-w-xl text-base text-left ${
              isDark ? "text-white/60" : "text-brand-dark/60"
            }`}
          >
            Choose your dashboard to access your LinkedIn playbook, pain point research,
            and daily engagement plan.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="team-grid">
          {teamData.teamMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => handleSelect(member.id)}
              className={`group relative flex flex-col p-6 text-left transition-all ${
                isDark
                  ? "border border-white/10 bg-white/[0.02] hover:border-brand-blue/50 hover:bg-white/[0.04]"
                  : "border border-brand-dark/10 bg-white hover:border-brand-blue/50 hover:shadow-lg"
              }`}
              type="button"
              data-testid={`team-member-${member.id}`}
            >
              <div className="mb-4 h-20 w-20 flex-shrink-0 overflow-hidden">
                {member.profileImage ? (
                  <img
                    src={member.profileImage}
                    alt={member.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="h-full w-full items-center justify-center bg-gradient-to-br from-[#2337F1] to-[#1a2ac7]"
                  style={{ display: member.profileImage ? "none" : "flex" }}
                >
                  <span className="text-2xl font-semibold text-white">
                    {member.avatar || member.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
              </div>
              <h3 className="mb-1 text-lg font-semibold group-hover:text-brand-blue transition-colors">
                {member.name}
              </h3>
              <p className={`mb-3 text-sm ${isDark ? "text-white/50" : "text-brand-dark/50"}`}>
                {member.title}
              </p>
              <div className="mb-3">
                <div className="flex flex-wrap gap-1.5">
                  {member.icp.targetRoles.slice(0, 3).map((role) => (
                    <span
                      key={role}
                      className="border border-brand-blue/20 bg-brand-blue/10 px-2 py-0.5 text-xs font-medium text-brand-blue"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <span
                className={`absolute right-4 top-4 text-xs font-medium transition-colors ${
                  isDark
                    ? "text-white/30 group-hover:text-brand-blue"
                    : "text-brand-dark/30 group-hover:text-brand-blue"
                }`}
              >
                <ArrowRight size={16} />
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pain Point Card Component
// ---------------------------------------------------------------------------

function PainPointCard({ painPoint, isDark, onCopy }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const cardBg = isDark
    ? "bg-white/[0.02] border border-white/10"
    : "bg-white border border-brand-dark/10";
  const textPrimary = isDark ? "text-white" : "text-brand-dark";
  const textSecondary = isDark ? "text-white/70" : "text-brand-dark/70";
  const textMuted = isDark ? "text-white/50" : "text-brand-dark/50";

  return (
    <div className={`${cardBg} overflow-hidden`} data-testid={`pain-point-${painPoint.id}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex w-full items-start justify-between p-5 text-left transition-colors ${
          isDark ? "hover:bg-white/[0.02]" : "hover:bg-brand-dark/[0.02]"
        }`}
      >
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center bg-brand-blue text-xs font-bold text-white">
              {painPoint.id}
            </span>
            <h4 className={`text-base font-semibold ${textPrimary}`}>
              {painPoint.title}
            </h4>
          </div>
          <p className={`text-sm ${textMuted}`}>
            {painPoint.whyItMatters}
          </p>
        </div>
        <ChevronDown
          size={20}
          className={`mt-1 flex-shrink-0 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          } ${textMuted}`}
        />
      </button>

      {isExpanded && (
        <div className={`animate-fadeIn border-t px-5 pb-5 ${isDark ? "border-white/10" : "border-brand-dark/10"}`}>
          {/* Quotes Section */}
          <div className="mt-4">
            <h5 className={`mb-3 text-xs font-semibold uppercase tracking-wide ${textMuted}`}>
              What they're saying:
            </h5>
            <div className="space-y-3">
              {painPoint.quotes.map((quote, idx) => (
                <div
                  key={idx}
                  className={`border-l-2 border-brand-blue pl-4 py-2 ${
                    isDark ? "bg-white/[0.02]" : "bg-brand-dark/[0.02]"
                  }`}
                >
                  <p className={`text-sm italic ${textSecondary}`}>
                    "{quote.text}"
                  </p>
                  <p className={`mt-2 text-xs font-medium ${textMuted}`}>
                    — {quote.attribution}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Post Angles Section */}
          <div className="mt-5">
            <h5 className={`mb-3 text-xs font-semibold uppercase tracking-wide ${textMuted}`}>
              Post angles when addressing this:
            </h5>
            <ul className="space-y-2">
              {painPoint.postAngles.map((angle, idx) => (
                <li
                  key={idx}
                  className={`flex items-start gap-2 text-sm ${textSecondary}`}
                >
                  <Sparkles size={14} className="mt-0.5 flex-shrink-0 text-brand-lime" />
                  {angle}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard Page
// ---------------------------------------------------------------------------

function Dashboard() {
  const { id } = useParams();
  const { isDark, toggleTheme } = useTheme();
  const { toast: toastState, showToast } = useToast();
  const [engagementState, setEngagementState] = useState({});
  const [isNewWeek, setIsNewWeek] = useState(false);
  const [newWeekDismissed, setNewWeekDismissed] = useState(false);
  const [checklistExpanded, setChecklistExpanded] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("checklist_collapsed");
    return saved ? saved === "false" : true;
  });

  const member = useMemo(
    () => teamData.teamMembers.find((entry) => entry.id === id),
    [id]
  );

  useEffect(() => {
    if (member) {
      saveSelectedMember(member.id);
      if (checkIsNewWeek(member.id)) {
        setIsNewWeek(true);
        resetEngagementWeek(member.id);
        setEngagementState({});
      } else {
        setEngagementState(getEngagementChecklist(member.id));
      }
    }
  }, [member]);

  const handleEngagementToggle = useCallback(
    (taskId, checked) => {
      if (!member) return;
      setEngagementState((prev) => {
        const next = { ...prev, [taskId]: checked };
        saveEngagementChecklist(member.id, next);
        return next;
      });
    },
    [member]
  );

  const engagementCompletedCount = weeklyEngagementChecklist.filter(
    (t) => engagementState[t.id]
  ).length;
  const allEngagementComplete = engagementCompletedCount === weeklyEngagementChecklist.length;

  const handleCopy = useCallback(
    (text) => copyToClipboard(text, showToast),
    [showToast]
  );

  if (!member) {
    return (
      <div
        className={`flex min-h-screen flex-col items-center justify-center px-6 ${
          isDark ? "bg-brand-dark text-white" : "bg-brand-light text-brand-dark"
        }`}
      >
        <p className="text-lg">Team member not found.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-sm font-medium"
          data-testid="back-link"
        >
          <ArrowLeft size={16} />
          Back to team
        </Link>
      </div>
    );
  }

  // CSS helpers
  const cardBg = isDark
    ? "bg-white/[0.02] border border-white/10"
    : "bg-white border border-brand-dark/10";
  const cardBgSubtle = isDark
    ? "bg-white/[0.03]"
    : "bg-brand-dark/[0.03]";
  const textPrimary = isDark ? "text-white" : "text-brand-dark";
  const textSecondary = isDark ? "text-white/70" : "text-brand-dark/70";
  const textMuted = isDark ? "text-white/50" : "text-brand-dark/50";
  const borderColor = isDark ? "border-white/10" : "border-brand-dark/10";
  const hoverBg = isDark ? "hover:bg-white/[0.04]" : "hover:bg-brand-dark/[0.04]";

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? "bg-brand-dark" : "bg-brand-light"
      }`}
      data-testid="dashboard"
    >
      <Toast message={toastState.message} visible={toastState.visible} />

      {/* ---- Sticky Nav ---- */}
      <nav
        className={`sticky top-0 z-50 border-b backdrop-blur ${
          isDark
            ? "border-white/10 bg-brand-dark/95"
            : "border-brand-dark/10 bg-brand-light/95"
        }`}
      >
        <div className="mx-auto flex max-w-dashboard items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isDark
                  ? "text-white/60 hover:text-white"
                  : "text-brand-dark/60 hover:text-brand-dark"
              }`}
              data-testid="back-to-team"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </div>

          <button
            onClick={toggleTheme}
            className={`flex h-8 w-8 items-center justify-center transition-colors ${
              isDark
                ? "text-white/40 hover:text-white/80"
                : "text-brand-dark/40 hover:text-brand-dark/80"
            }`}
            aria-label="Toggle theme"
            data-testid="theme-toggle"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* ---- Main Content ---- */}
      <main className="mx-auto max-w-dashboard px-4 py-8 sm:px-6 md:py-12">
        
        {/* ================================================================
            1. HERO SECTION
        ================================================================ */}
        <section className="mb-12 md:mb-16" data-testid="hero-section">
          <div className="mb-6">
            <h1 className={`text-3xl font-bold sm:text-4xl ${textPrimary}`}>
              {member.name}
            </h1>
            <p className={`mt-1 text-lg ${textMuted}`}>
              {member.title}
            </p>
          </div>
          
          {/* Niche Statement */}
          <div className={`p-5 mb-6 ${cardBg}`}>
            <h3 className={`mb-2 text-xs font-semibold uppercase tracking-wide ${textMuted}`}>
              Your Niche in One Sentence
            </h3>
            <p className={`text-base leading-relaxed ${textSecondary}`}>
              {member.nicheStatement}
            </p>
          </div>

          {/* Target Roles Pills */}
          <div>
            <h3 className={`mb-3 text-xs font-semibold uppercase tracking-wide ${textMuted}`}>
              Target Roles
            </h3>
            <div className="flex flex-wrap gap-2">
              {member.icp.targetRoles.map((role) => (
                <span
                  key={role}
                  className="border border-brand-blue/30 bg-brand-blue/10 px-3 py-1.5 text-sm font-medium text-brand-blue"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            2. WEEKLY ENGAGEMENT CHECKLIST
        ================================================================ */}
        <section className="mb-12 md:mb-16" data-testid="engagement-checklist">
          <div
            className={`border ${
              isDark
                ? "bg-white/[0.03] border-white/10"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <button
              onClick={() => {
                setChecklistExpanded((prev) => {
                  window.localStorage.setItem("checklist_collapsed", String(prev));
                  return !prev;
                });
              }}
              className={`flex w-full items-center justify-between p-6 transition-colors sm:p-8 ${
                isDark ? "hover:bg-white/5" : "hover:bg-gray-200"
              }`}
              data-testid="checklist-toggle"
            >
              <h2
                className={`text-xl font-semibold sm:text-2xl ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Your Weekly Engagement Goals
              </h2>

              <div className="flex items-center gap-4">
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-white/70" : "text-gray-600"
                  }`}
                >
                  {engagementCompletedCount}/{weeklyEngagementChecklist.length} complete
                </span>
                <ChevronDown
                  size={24}
                  className={`transition-transform duration-300 ${
                    checklistExpanded ? "rotate-180" : ""
                  } ${isDark ? "text-white/70" : "text-gray-600"}`}
                />
              </div>
            </button>

            {checklistExpanded && (
              <div className="animate-fadeIn px-6 pb-6 sm:px-8 sm:pb-8">
                <p className={`mb-4 text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>
                  Consistency beats intensity. Do a little every day.
                </p>

                {isNewWeek && !newWeekDismissed && (
                  <div
                    className={`mb-4 border p-4 ${
                      isDark
                        ? "border-brand-lime/30 bg-brand-lime/20"
                        : "border-brand-lime/50 bg-brand-lime/10"
                    }`}
                  >
                    <p
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      New week, fresh start! Time to make some meaningful connections.
                    </p>
                    <button
                      onClick={() => setNewWeekDismissed(true)}
                      className={`mt-2 text-sm ${
                        isDark
                          ? "text-white/70 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Got it &rarr;
                    </button>
                  </div>
                )}

                <div className="mb-6 flex items-center gap-3">
                  <div
                    className={`h-2 flex-grow overflow-hidden ${
                      isDark ? "bg-white/10" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className="h-full bg-brand-lime transition-all duration-500"
                      style={{
                        width: `${(engagementCompletedCount / weeklyEngagementChecklist.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {weeklyEngagementChecklist.map((item) => (
                    <label
                      key={item.id}
                      className={`-m-2 flex cursor-pointer items-start gap-3 p-2 transition-colors group ${
                        isDark ? "hover:bg-white/5" : "hover:bg-gray-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!engagementState[item.id]}
                        onChange={(e) =>
                          handleEngagementToggle(item.id, e.target.checked)
                        }
                        className="mt-1 h-5 w-5 flex-shrink-0 accent-[#C7FA50]"
                        data-testid={`checklist-item-${item.id}`}
                      />
                      <span
                        className={`text-sm leading-relaxed transition-colors sm:text-base ${
                          engagementState[item.id]
                            ? isDark
                              ? "text-white/40 line-through"
                              : "text-gray-400 line-through"
                            : isDark
                              ? "text-white/90 group-hover:text-white"
                              : "text-gray-800 group-hover:text-gray-900"
                        }`}
                      >
                        {item.task}
                      </span>
                    </label>
                  ))}
                </div>

                {allEngagementComplete && (
                  <div
                    className={`mt-6 animate-fadeIn border-2 border-brand-lime p-6 text-center ${
                      isDark ? "bg-brand-lime/20" : "bg-brand-lime/30"
                    }`}
                  >
                    <p
                      className={`mb-2 text-lg font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Awesome work this week!
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-white/80" : "text-gray-700"
                      }`}
                    >
                      You're building real relationships. See you next Monday for a fresh list!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ================================================================
            3. WHO YOU'RE TALKING TO (ICP)
        ================================================================ */}
        <section className="mb-12 md:mb-16" data-testid="icp-section">
          <div className="mb-6 flex items-center gap-3">
            <Target size={22} className="text-brand-blue" />
            <h2 className={`text-xl font-semibold sm:text-2xl ${textPrimary}`}>
              Who You're Talking To
            </h2>
          </div>

          {/* ICP Summary */}
          <div className={`mb-6 p-5 ${cardBg}`}>
            <h3 className={`mb-3 text-base font-semibold ${textPrimary}`}>
              Your Ideal Audience
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${textMuted}`}>Roles</p>
                <p className={`text-sm ${textSecondary}`}>{member.icp.targetRoles.join(", ")}</p>
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${textMuted}`}>Company Size</p>
                <p className={`text-sm ${textSecondary}`}>{member.icp.companyStage}</p>
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${textMuted}`}>Industry</p>
                <p className={`text-sm ${textSecondary}`}>{member.icp.industry}</p>
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${textMuted}`}>Their Situation</p>
                <p className={`text-sm ${textSecondary}`}>{member.icp.situation}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Connect Criteria */}
            <div className={`border-l-4 border-brand-blue p-5 ${cardBg}`}>
              <h3 className={`mb-4 text-base font-semibold ${textPrimary}`}>
                Connect if they:
              </h3>
              <ul className="space-y-2">
                {member.connectCriteria.map((criterion, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-2 text-sm ${textSecondary}`}
                  >
                    <span className="mt-0.5 text-brand-blue">▸</span>
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Engage Criteria */}
            <div
              className={`border-l-4 p-5 ${cardBg} ${
                isDark ? "border-white/20" : "border-brand-dark/20"
              }`}
            >
              <h3 className={`mb-4 text-base font-semibold ${textPrimary}`}>
                Just engage if they:
              </h3>
              <ul className="space-y-2">
                {member.engageCriteria.map((criterion, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-2 text-sm ${textMuted}`}
                  >
                    <span className={`mt-0.5 ${isDark ? "text-white/30" : "text-brand-dark/30"}`}>▸</span>
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ================================================================
            4. PAIN POINTS
        ================================================================ */}
        <section className="mb-12 md:mb-16" data-testid="pain-points-section">
          <div className="mb-6 flex items-center gap-3">
            <Flame size={22} className="text-brand-blue" />
            <div>
              <h2 className={`text-xl font-semibold sm:text-2xl ${textPrimary}`}>
                What Your Audience Is Struggling With
              </h2>
              <p className={`mt-1 text-sm ${textMuted}`}>
                Click to expand each pain point for quotes and post ideas
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {member.painPoints.map((painPoint) => (
              <PainPointCard
                key={painPoint.id}
                painPoint={painPoint}
                isDark={isDark}
                onCopy={handleCopy}
              />
            ))}
          </div>
        </section>

        {/* ================================================================
            5. CONTENT TEMPLATES
        ================================================================ */}
        <section className="mb-12 md:mb-16" data-testid="templates-section">
          <div className="mb-4 flex items-center gap-3">
            <Lightbulb size={22} className="text-brand-blue" />
            <h2 className={`text-xl font-semibold sm:text-2xl ${textPrimary}`}>
              Content Templates by Type
            </h2>
          </div>
          <p className={`mb-6 text-sm ${textSecondary}`}>
            Use these proven formats to create engaging posts:
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {contentTemplates.map((template, idx) => (
              <div
                key={idx}
                className={`group p-5 transition-colors ${cardBg} ${hoverBg}`}
              >
                <h3
                  className={`mb-2 text-xs font-semibold uppercase tracking-wide ${textMuted}`}
                >
                  {template.category}
                </h3>
                <p className={`mb-3 text-sm leading-relaxed whitespace-pre-line ${textSecondary}`}>
                  {template.template}
                </p>
                {template.example && (
                  <div className={`mb-3 p-3 text-xs italic ${cardBgSubtle} ${textMuted}`}>
                    Example: {template.example}
                  </div>
                )}
                <button
                  onClick={() => handleCopy(template.template)}
                  className="flex items-center gap-1.5 text-sm font-medium text-brand-blue transition-colors hover:underline"
                  data-testid={`copy-template-${idx}`}
                >
                  <Copy size={14} />
                  Copy template
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            6. WHAT THEY'RE ACTUALLY SAYING
        ================================================================ */}
        {member.realQuotes && member.realQuotes.length > 0 && (
          <section className="mb-12 md:mb-16" data-testid="real-quotes-section">
            <div className="mb-6 flex items-center gap-3">
              <MessageSquareQuote size={22} className="text-brand-blue" />
              <div>
                <h2 className={`text-xl font-semibold sm:text-2xl ${textPrimary}`}>
                  What {member.icp.targetRoles[0]} Are Actually Saying Right Now
                </h2>
                <p className={`mt-1 text-sm ${textMuted}`}>
                  Current topics from Reddit, Hacker News, LinkedIn, and industry forums
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {member.realQuotes.map((quote, idx) => (
                <div
                  key={idx}
                  className={`border-l-4 border-brand-blue p-5 ${cardBg}`}
                >
                  <p className={`mb-2 text-base font-semibold ${textPrimary}`}>
                    "{quote.topic}"
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-1.5 w-1.5 bg-brand-blue" />
                    <span className={`text-xs font-medium ${textMuted}`}>{quote.source}</span>
                  </div>
                  <p className={`text-sm italic ${textSecondary}`}>
                    {quote.context}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================================================================
            7. TOPIC CALENDAR
        ================================================================ */}
        {member.topicCalendar && member.topicCalendar.length > 0 && (
          <section className="mb-12 md:mb-16" data-testid="topic-calendar-section">
            <div className="mb-6 flex items-center gap-3">
              <Calendar size={22} className="text-brand-blue" />
              <h2 className={`text-xl font-semibold sm:text-2xl ${textPrimary}`}>
                What to Post About
              </h2>
            </div>

            <div className="space-y-4">
              {member.topicCalendar.map((topic, idx) => (
                <details
                  key={idx}
                  className={`group ${cardBg} overflow-hidden`}
                  data-testid={`topic-${idx}`}
                >
                  <summary
                    className={`flex cursor-pointer items-center justify-between p-5 text-sm font-semibold ${textPrimary}`}
                  >
                    <span>
                      {topic.category}{" "}
                      <span className={`font-normal ${textMuted}`}>
                        · {topic.frequency}
                      </span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform group-open:rotate-180 ${textMuted}`}
                    />
                  </summary>
                  <div className={`border-t px-5 py-4 ${borderColor}`}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${textMuted}`}>
                          When to post
                        </p>
                        <p className={`text-sm ${textSecondary}`}>{topic.whenToPost}</p>
                      </div>
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${textMuted}`}>
                          Pain points to address
                        </p>
                        <p className={`text-sm ${textSecondary}`}>
                          #{topic.painPointsAddressed.join(", #")}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${textMuted}`}>
                          Template suggestions
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {topic.templateSuggestions.map((t) => (
                            <span key={t} className="bg-brand-blue/10 text-brand-blue px-2 py-0.5 text-xs font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${textMuted}`}>
                          Example topics
                        </p>
                        <ul className="space-y-1">
                          {topic.exampleTopics.map((ex, i) => (
                            <li key={i} className={`flex items-start gap-2 text-sm ${textSecondary}`}>
                              <Sparkles size={12} className="mt-1 flex-shrink-0 text-brand-lime" />
                              {ex}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ================================================================
            8. PRO TIPS
        ================================================================ */}
        {member.proTips && (
          <section className="mb-12 md:mb-16" data-testid="pro-tips-section">
            <div className="mb-6 flex items-center gap-3">
              <Zap size={22} className="text-brand-lime" />
              <h2 className={`text-xl font-semibold sm:text-2xl ${textPrimary}`}>
                Pro Tips for {member.name.split(" ")[0]}'s Content
              </h2>
            </div>

            <div className={`p-6 ${cardBg}`}>
              {/* Superpower */}
              <div className="mb-6">
                <h3 className={`mb-2 text-sm font-semibold ${textPrimary}`}>
                  Your superpower:
                </h3>
                <p className={`text-sm ${textSecondary}`}>{member.proTips.superpower}</p>
              </div>

              {/* Unique Voice */}
              <div className="mb-6">
                <h3 className={`mb-2 text-sm font-semibold ${textPrimary}`}>
                  What makes your voice unique:
                </h3>
                <ul className="space-y-1">
                  {member.proTips.uniqueVoice.map((item, idx) => (
                    <li key={idx} className={`flex items-start gap-2 text-sm ${textSecondary}`}>
                      <span className="text-brand-blue">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Avoid */}
                <div>
                  <h3 className={`mb-2 text-sm font-semibold text-red-400`}>
                    Avoid:
                  </h3>
                  <ul className="space-y-1">
                    {member.proTips.avoid.map((item, idx) => (
                      <li key={idx} className={`flex items-start gap-2 text-sm ${textSecondary}`}>
                        <span className="text-red-400">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lean Into */}
                <div>
                  <h3 className={`mb-2 text-sm font-semibold text-brand-lime`}>
                    Lean into:
                  </h3>
                  <ul className="space-y-1">
                    {member.proTips.leanInto.map((item, idx) => (
                      <li key={idx} className={`flex items-start gap-2 text-sm ${textSecondary}`}>
                        <span className="text-brand-lime">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best Times & Engagement Hack */}
              <div className={`mt-6 pt-6 border-t ${borderColor}`}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className={`mb-1 text-sm font-semibold ${textPrimary}`}>
                      Best days/times to post:
                    </h3>
                    <p className={`text-sm ${textSecondary}`}>{member.proTips.bestTimes}</p>
                  </div>
                  <div>
                    <h3 className={`mb-1 text-sm font-semibold ${textPrimary}`}>
                      Engagement hack:
                    </h3>
                    <p className={`text-sm ${textSecondary}`}>{member.proTips.engagementHack}</p>
                  </div>
                </div>
              </div>

              {/* Closing Motivation */}
              {member.closingMotivation && (
                <div className={`mt-6 p-4 border-l-4 border-brand-lime ${cardBgSubtle}`}>
                  <p className={`text-sm italic ${textSecondary}`}>
                    {member.closingMotivation}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ---- Footer ---- */}
        <footer
          className={`border-t pt-8 pb-12 text-center text-xs ${borderColor} ${textMuted}`}
        >
          <p>
            Midwestern Interactive · LinkedIn Playbook · {member.name}
          </p>
        </footer>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// App Router
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/member/:id" element={<Dashboard />} />
    </Routes>
  );
}
