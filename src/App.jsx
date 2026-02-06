import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Copy,
  Flame,
  Lightbulb,
  MessageCircle,
  Moon,
  Sparkles,
  Sun,
  TriangleAlert,
  Users,
} from "lucide-react";
import teamData from "./data/teamData.json";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const contentTemplates = [
  {
    category: "Hot Take",
    template:
      "Unpopular opinion: [controversial statement about your industry]",
  },
  {
    category: "Value Bomb",
    template:
      "We just helped [client] achieve [result] in [timeframe]. Here's how:\n\u2022 [Step 1]\n\u2022 [Step 2]\n\u2022 [Step 3]\nThe result: [specific outcome]",
  },
  {
    category: "Question Post",
    template:
      "Quick question: What's your biggest challenge with [pain point]?",
  },
  {
    category: "Listicle",
    template:
      '3 things I learned this week about [topic]:\n1) [Lesson 1]\n2) [Lesson 2]\n3) [Lesson 3]\n\nWhich one surprises you?',
  },
  {
    category: "Mistake Story",
    template:
      "I made a [big mistake] last [timeframe].\n\nWhat happened: [Story]\nWhat I learned: [Lesson]\nWhat I'd do differently: [Better approach]\n\nAnyone else done this?",
  },
  {
    category: "Observation",
    template:
      "I noticed [trend/pattern] happening in [industry]. Anyone else seeing this?",
  },
  {
    category: "Myth Buster",
    template:
      "Everyone says [common advice]. I disagree. Here's why...",
  },
  {
    category: "Signs Post",
    template:
      "[Number] signs it's time to [take action]:\n1. [Sign 1]\n2. [Sign 2]\n3. [Sign 3]\n\nSeeing these? Here's what to do...",
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

const getInitialMemberId = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("selectedMemberId");
};

const saveSelectedMember = (id) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("selectedMemberId", id);
};

const getProgress = (memberId) => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(
      window.localStorage.getItem(`slt-progress-${memberId}`) || "{}"
    );
  } catch {
    return {};
  }
};

const saveProgress = (memberId, taskId, completed) => {
  const progress = getProgress(memberId);
  progress[taskId] = completed;
  window.localStorage.setItem(
    `slt-progress-${memberId}`,
    JSON.stringify(progress)
  );
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

  // Set initial theme on mount
  useEffect(() => {
    saveTheme(getTheme());
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, isDark: theme === "dark", toggleTheme };
}

async function copyToClipboard(text, showToast) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!");
  } catch {
    showToast("Copy failed \u2013 please try again");
  }
}

// ---------------------------------------------------------------------------
// Landing Page
// ---------------------------------------------------------------------------

function Landing() {
  const navigate = useNavigate();
  const { theme, isDark, toggleTheme } = useTheme();
  const [selectedId] = useState(getInitialMemberId);

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
      {/* Nav */}
      <header
        className={`border-b ${
          isDark ? "border-white/10 bg-brand-dark/95" : "border-brand-dark/10 bg-brand-light/95"
        } backdrop-blur`}
      >
        <div className="mx-auto flex max-w-dashboard items-center justify-between px-6 py-5">
          <div>
            <p
              className={`text-sm font-medium ${
                isDark ? "text-white/60" : "text-brand-dark/60"
              }`}
            >
              Midwestern Interactive
            </p>
            <h1 className="text-2xl font-semibold">LinkedIn Playbook</h1>
          </div>
          <div className="flex items-center gap-4">
            {selectedId && (
              <Link
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isDark
                    ? "border border-white/20 text-white hover:bg-white/5"
                    : "border border-brand-dark/20 text-brand-dark hover:bg-brand-dark/5"
                }`}
                to={`/member/${selectedId}`}
              >
                Resume{" "}
                {
                  teamData.teamMembers.find((m) => m.id === selectedId)
                    ?.name
                }
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className={`p-1 transition-colors ${
                isDark
                  ? "text-white/40 hover:text-white/80"
                  : "text-brand-dark/40 hover:text-brand-dark/80"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-dashboard px-6 py-12 md:py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Select your profile
          </h2>
          <p
            className={`mt-3 text-base ${
              isDark ? "text-white/60" : "text-brand-dark/60"
            }`}
          >
            Choose your dashboard to access your LinkedIn playbook, outreach
            templates, and daily engagement plan.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p
                className={`mt-1 text-sm ${
                  isDark ? "text-white/50" : "text-brand-dark/50"
                }`}
              >
                {member.role}
              </p>
              <p
                className={`mt-2 text-sm ${
                  isDark ? "text-white/40" : "text-brand-dark/40"
                }`}
              >
                {member.icp.title}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {member.icp.servicesFocus.map((service) => (
                  <span
                    key={service}
                    className={`px-2 py-1 text-xs font-medium ${
                      isDark
                        ? "bg-white/[0.06] text-white/70"
                        : "bg-brand-dark/[0.06] text-brand-dark/70"
                    }`}
                  >
                    {service}
                  </span>
                ))}
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
// Dashboard Page
// ---------------------------------------------------------------------------

function Dashboard() {
  const { id } = useParams();
  const { theme, isDark, toggleTheme } = useTheme();
  const { toast: toastState, showToast } = useToast();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [engagementState, setEngagementState] = useState({});
  const [isNewWeek, setIsNewWeek] = useState(false);
  const [newWeekDismissed, setNewWeekDismissed] = useState(false);

  const member = useMemo(
    () => teamData.teamMembers.find((entry) => entry.id === id),
    [id]
  );

  // Load engagement checklist state with weekly reset
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
        >
          <ArrowLeft size={16} />
          Back to team
        </Link>
      </div>
    );
  }

  // ICP quick summary for mobile
  const quickSummary = {
    who: member.icp.targetRoles.join(", "),
    topics: member.icp.theyrePostingAbout.slice(0, 3).join(", "),
    skip:
      member.redFlags.length > 0
        ? member.redFlags.slice(0, 2).join("; ")
        : "N/A",
  };

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
  const textFaint = isDark ? "text-white/30" : "text-brand-dark/30";
  const borderColor = isDark ? "border-white/10" : "border-brand-dark/10";
  const hoverBg = isDark ? "hover:bg-white/[0.04]" : "hover:bg-brand-dark/[0.04]";

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? "bg-brand-dark" : "bg-brand-light"
      }`}
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
          <Link
            to="/"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isDark
                ? "text-white/60 hover:text-white"
                : "text-brand-dark/60 hover:text-brand-dark"
            }`}
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to Team</span>
          </Link>

          <h1 className={`text-base font-semibold sm:text-lg ${textPrimary}`}>
            {member.name}
          </h1>

          <button
            onClick={toggleTheme}
            className={`p-1 transition-colors ${
              isDark
                ? "text-white/40 hover:text-white/80"
                : "text-brand-dark/40 hover:text-brand-dark/80"
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* ---- Mobile Quick Reference ---- */}
      <div
        className={`lg:hidden sticky top-[57px] z-40 border-b backdrop-blur px-4 py-3 ${
          isDark
            ? "border-white/10 bg-brand-blue/10"
            : "border-brand-dark/10 bg-brand-blue/5"
        }`}
      >
        <h3 className={`mb-2 text-xs font-semibold ${textPrimary}`}>
          At a Glance
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
          <div>
            <span className={textMuted}>Target: </span>
            <span className={textSecondary}>{quickSummary.who}</span>
          </div>
          <div>
            <span className={textMuted}>Topics: </span>
            <span className={textSecondary}>{quickSummary.topics}</span>
          </div>
        </div>
      </div>

      {/* ---- Main Content ---- */}
      <main className="mx-auto max-w-dashboard px-4 py-8 sm:px-6 md:py-12">
        {/* ================================================================
            1. WEEKLY ENGAGEMENT CHECKLIST
        ================================================================ */}
        <section className="mb-12 md:mb-20">
          <div className="bg-[rgba(35,55,241,0.15)] border border-[#2337F1]/30 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-2xl">&#10024;</span>
              <h2 className="text-2xl font-semibold text-white">
                Your Weekly Engagement Goals
              </h2>
            </div>

            {isNewWeek && !newWeekDismissed && (
              <div className="mb-4 border border-brand-lime/30 bg-brand-lime/20 p-4">
                <p className="font-medium text-white">
                  &#127919; New week, fresh start! Time to make some meaningful connections.
                </p>
                <button
                  onClick={() => setNewWeekDismissed(true)}
                  className="mt-2 text-sm text-white/70 hover:text-white"
                >
                  Got it &#8594;
                </button>
              </div>
            )}

            <div className="mb-6 flex items-center gap-3">
              <div className="h-2 flex-grow overflow-hidden bg-white/10">
                <div
                  className="h-full bg-brand-lime transition-all duration-500"
                  style={{ width: `${(engagementCompletedCount / weeklyEngagementChecklist.length) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-white/70">
                {engagementCompletedCount}/{weeklyEngagementChecklist.length} complete
              </span>
            </div>

            <div className="space-y-3">
              {weeklyEngagementChecklist.map((item) => (
                <label
                  key={item.id}
                  className="-m-2 flex cursor-pointer items-start gap-3 p-2 transition-colors group hover:bg-white/5"
                >
                  <input
                    type="checkbox"
                    checked={!!engagementState[item.id]}
                    onChange={(e) => handleEngagementToggle(item.id, e.target.checked)}
                    className="mt-1 h-5 w-5 flex-shrink-0 accent-[#C7FA50]"
                  />
                  <span
                    className={`text-sm leading-relaxed transition-colors sm:text-base ${
                      engagementState[item.id]
                        ? "text-white/50 line-through"
                        : "text-white/90 group-hover:text-white"
                    }`}
                  >
                    {item.task}
                  </span>
                </label>
              ))}
            </div>

            {allEngagementComplete && (
              <div className="mt-6 animate-fadeIn border-2 border-brand-lime bg-brand-lime/20 p-6 text-center">
                <p className="mb-2 text-3xl">&#127881;</p>
                <p className="mb-2 text-lg font-semibold text-white">
                  Awesome work this week!
                </p>
                <p className="text-sm text-white/80">
                  You're building real relationships. See you next Monday for a fresh list!
                </p>
              </div>
            )}

            <p className="mt-4 text-sm italic text-white/50">
              Tip: Consistency beats intensity. Do a little every day.
            </p>
          </div>
        </section>

        {/* ================================================================
            2. WHO TO CONNECT WITH
        ================================================================ */}
        <section className="mb-12 md:mb-20">
          <div className="mb-6 flex items-center gap-3">
            <Users size={22} className="text-brand-blue" />
            <h2 className={`text-xl font-semibold sm:text-2xl ${textPrimary}`}>
              Who to Connect With
            </h2>
          </div>

          {/* ICP summary */}
          <div className={`mb-6 p-4 sm:p-6 ${cardBg}`}>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-brand-blue" />
              <h3 className={`text-base font-semibold ${textPrimary}`}>
                Who You're Talking To
              </h3>
            </div>
            <p className={`mb-2 text-lg font-semibold ${textPrimary}`}>
              {member.icp.title}
            </p>
            <p className={`mb-3 text-sm ${textSecondary}`}>
              {member.icp.companyStage}
            </p>
            <div className="flex flex-wrap gap-2">
              {member.icp.targetRoles.map((role) => (
                <span
                  key={role}
                  className={`px-2 py-1 text-xs font-medium ${
                    isDark
                      ? "bg-brand-blue/10 text-brand-blue"
                      : "bg-brand-blue/10 text-brand-blue"
                  }`}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Connect */}
            <div className={`border-l-4 border-brand-blue p-4 sm:p-6 ${cardBg}`}>
              <h3 className={`mb-4 text-base font-semibold sm:text-lg ${textPrimary}`}>
                Connect if they:
              </h3>
              <ul className="space-y-2">
                {member.connectCriteria.map((criterion, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-2 text-sm ${
                      isDark ? "text-white/80" : "text-brand-dark/80"
                    }`}
                  >
                    <span className="mt-0.5 text-brand-blue">&#9656;</span>
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Just engage */}
            <div
              className={`border-l-4 p-4 sm:p-6 ${cardBg} ${
                isDark ? "border-white/20" : "border-brand-dark/20"
              }`}
            >
              <h3 className={`mb-4 text-base font-semibold sm:text-lg ${textPrimary}`}>
                Just engage if they:
              </h3>
              <ul className="space-y-2">
                {member.engageCriteria.map((criterion, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-2 text-sm ${textMuted}`}
                  >
                    <span className={`mt-0.5 ${textFaint}`}>&#9656;</span>
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ================================================================
            3. CONTENT IDEAS
        ================================================================ */}
        <section className="mb-12 md:mb-20">
          <div className="mb-4 flex items-center gap-3">
            <Lightbulb size={22} className="text-brand-blue" />
            <h2 className={`text-xl font-semibold sm:text-2xl ${textPrimary}`}>
              Content Ideas
            </h2>
          </div>
          <p className={`mb-6 text-sm ${textSecondary}`}>
            Need a post idea? Pick a template and customize it:
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {contentTemplates.map((template, idx) => (
              <div
                key={idx}
                className={`group p-4 transition-colors sm:p-5 ${cardBg} ${hoverBg}`}
              >
                <h3
                  className={`mb-2 text-xs font-semibold uppercase tracking-wide ${textMuted}`}
                >
                  {template.category}
                </h3>
                <p className={`mb-3 text-sm leading-relaxed ${textSecondary}`}>
                  {template.template}
                </p>
                <button
                  onClick={() => handleCopy(template.template)}
                  className="flex items-center gap-1 text-sm font-medium text-brand-blue transition-colors hover:underline"
                >
                  Copy template
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            4. OPENING MESSAGES
        ================================================================ */}
        <section className="mb-12 md:mb-20">
          <div className="mb-6 flex items-center gap-3">
            <MessageCircle size={22} className="text-brand-blue" />
            <h2 className={`text-xl font-semibold sm:text-2xl ${textPrimary}`}>
              Opening Messages
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {member.conversationStarters.map((starter, idx) => (
              <div key={idx} className={`flex flex-col ${cardBg}`}>
                {/* Card header */}
                <div
                  className={`flex items-center justify-between border-b px-4 py-3 ${borderColor}`}
                >
                  <span
                    className={`text-xs font-medium uppercase tracking-wide ${textMuted}`}
                  >
                    Template {idx + 1}
                  </span>
                  <button
                    onClick={() => handleCopy(starter.template)}
                    className="flex items-center gap-1.5 bg-brand-blue px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-blue/80"
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                </div>

                {/* Template text */}
                <div className="flex-grow p-4 sm:p-5">
                  <p
                    className={`text-sm leading-relaxed ${
                      isDark ? "text-white/90" : "text-brand-dark/90"
                    }`}
                  >
                    {starter.template}
                  </p>
                </div>

                {/* When to use */}
                <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                  <div className={`p-3 ${cardBgSubtle}`}>
                    <p className={`text-xs italic ${textMuted}`}>
                      <span className="font-medium not-italic">
                        When to use:
                      </span>{" "}
                      {starter.whenToUse}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            5. WHAT TO POST ABOUT
        ================================================================ */}
        <section className="mb-12 md:mb-20">
          <div className="mb-6 flex items-center gap-3">
            <BookOpen size={22} className="text-brand-blue" />
            <h2 className={`text-xl font-semibold sm:text-2xl ${textPrimary}`}>
              What to Post About
            </h2>
          </div>

          <div className="space-y-3">
            {member.contentPillars.map((pillar) => (
              <details
                key={pillar.title}
                className={`group ${cardBg} overflow-hidden`}
              >
                <summary
                  className={`flex cursor-pointer items-center justify-between p-4 text-sm font-semibold sm:p-5 ${textPrimary}`}
                >
                  <span>
                    {pillar.title}{" "}
                    <span className={`font-normal ${textMuted}`}>
                      &middot; {pillar.frequency}
                    </span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform group-open:rotate-180 ${textMuted}`}
                  />
                </summary>
                <ul
                  className={`border-t px-4 py-4 sm:px-5 ${borderColor}`}
                >
                  {pillar.examples.map((example) => (
                    <li
                      key={example}
                      className={`flex items-start gap-2 py-1.5 text-sm ${textSecondary}`}
                    >
                      <Sparkles
                        size={14}
                        className="mt-0.5 flex-shrink-0 text-brand-blue"
                      />
                      {example}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>

        {/* ================================================================
            COLLAPSIBLE ADVANCED SECTION
        ================================================================ */}
        <div className="mb-12 md:mb-20">
          <button
            onClick={() => setShowAdvanced((prev) => !prev)}
            className={`flex w-full items-center justify-center gap-2 border-t py-5 text-sm font-medium transition-colors ${borderColor} ${textMuted} hover:${textSecondary}`}
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Tips & Reference
            <ChevronDown
              size={18}
              className={`transition-transform ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </button>

          {showAdvanced && (
            <div className="mt-8 space-y-12 animate-fadeIn md:mt-12">
              {/* ---- How to Get More Reach ---- */}
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <Sparkles size={20} className="text-brand-blue" />
                  <h2
                    className={`text-lg font-semibold sm:text-xl ${textPrimary}`}
                  >
                    How to Get More Reach
                  </h2>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {member.engagementBoosters.map((booster, index) => (
                    <div
                      key={booster}
                      className={`flex items-start gap-3 p-4 ${cardBg}`}
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-brand-blue/10 text-xs font-semibold text-brand-blue">
                        {index + 1}
                      </div>
                      <p className={`text-sm ${textSecondary}`}>{booster}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ---- People to Avoid ---- */}
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <TriangleAlert size={20} className="text-brand-blue" />
                  <h2
                    className={`text-lg font-semibold sm:text-xl ${textPrimary}`}
                  >
                    People to Avoid
                  </h2>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {member.redFlags.map((flag) => (
                    <div
                      key={flag}
                      className={`flex items-start gap-3 p-4 text-sm ${cardBg} ${textSecondary}`}
                    >
                      <TriangleAlert
                        size={16}
                        className="mt-0.5 flex-shrink-0 text-red-400"
                      />
                      {flag}
                    </div>
                  ))}
                </div>
              </section>

              {/* ---- What They're Actually Saying ---- */}
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <Flame size={20} className="text-brand-blue" />
                  <h2
                    className={`text-lg font-semibold sm:text-xl ${textPrimary}`}
                  >
                    What They're Actually Saying
                  </h2>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {member.realQuotes.map((quote) => (
                    <div
                      key={quote}
                      className={`p-4 ${cardBg}`}
                    >
                      <p className={`text-sm italic leading-relaxed ${textSecondary}`}>
                        &ldquo;{quote}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ---- How to Build Credibility ---- */}
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <BadgeCheck size={20} className="text-brand-blue" />
                  <h2
                    className={`text-lg font-semibold sm:text-xl ${textPrimary}`}
                  >
                    How to Build Credibility
                  </h2>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {member.trustBuilders.map((item) => (
                    <div
                      key={item}
                      className={`flex items-center gap-2 p-3 text-sm ${cardBg} ${textSecondary}`}
                    >
                      <BadgeCheck
                        size={14}
                        className="flex-shrink-0 text-brand-blue"
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              {/* ---- They're Posting About ---- */}
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <Flame size={20} className="text-brand-blue" />
                  <h2
                    className={`text-lg font-semibold sm:text-xl ${textPrimary}`}
                  >
                    Hot Topics in Their Feed
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.icp.theyrePostingAbout.map((topic) => (
                    <span
                      key={topic}
                      className={`px-3 py-1.5 text-sm font-medium ${
                        isDark
                          ? "bg-brand-blue/10 text-white/80"
                          : "bg-brand-blue/10 text-brand-dark/80"
                      }`}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* ---- Footer ---- */}
        <footer
          className={`border-t pt-8 pb-12 text-center text-xs ${borderColor} ${textMuted}`}
        >
          <p>
            Midwestern Interactive &middot; LinkedIn Playbook &middot;{" "}
            {member.name}
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
