import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  bg: "#07080F",
  surface: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  mint: "#00FFB2",
  amber: "#FF9F43",
  violet: "#9B72FF",
  red: "#FF5E7D",
  text: "#F0F0F0",
  muted: "rgba(255,255,255,0.45)",
  card: "rgba(255,255,255,0.03)",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const earningsData = [
  { month: "Aug", actual: 0, projected: 200 },
  { month: "Sep", actual: 320, projected: 500 },
  { month: "Oct", actual: 780, projected: 800 },
  { month: "Nov", actual: 1240, projected: 1200 },
  { month: "Dec", actual: 1890, projected: 1800 },
  { month: "Jan", actual: 2450, projected: 2400 },
  { month: "Feb", actual: 3100, projected: 3000 },
];

const radarData = [
  { skill: "Writing", value: 80 },
  { skill: "Marketing", value: 65 },
  { skill: "Design", value: 45 },
  { skill: "Coding", value: 90 },
  { skill: "Sales", value: 55 },
  { skill: "Video", value: 70 },
];

const hustles = [
  { id: 1, title: "Technical Content Writing", category: "Writing", earnMin: 800, earnMax: 2400, difficulty: "Beginner", match: 94, phase: "Scale", progress: 68, weeks: "2–3 weeks", tags: ["Remote", "Async", "Low Risk"], relevantSkills: ["Copywriting", "SEO", "React", "Node.js"] },
  { id: 2, title: "React Component Library SaaS", category: "Development", earnMin: 1200, earnMax: 5000, difficulty: "Advanced", match: 88, phase: "Launch", progress: 34, weeks: "4–6 weeks", tags: ["Scalable", "Passive", "High Ceiling"], relevantSkills: ["React", "UI/UX Design", "Node.js"] },
  { id: 3, title: "YouTube Dev Tutorial Channel", category: "Education", earnMin: 400, earnMax: 3500, difficulty: "Intermediate", match: 82, phase: "Foundation", progress: 15, weeks: "6–8 weeks", tags: ["Brand Building", "Compounding"], relevantSkills: ["Video Editing", "Teaching", "Python", "React"] },
  { id: 4, title: "AI Automation Agency", category: "Consulting", earnMin: 2000, earnMax: 8000, difficulty: "Advanced", match: 75, phase: "Scale", progress: 10, weeks: "3–5 weeks", tags: ["High Ticket", "Hot Niche"], relevantSkills: ["Python", "Node.js", "Sales", "Project Mgmt"] },
  { id: 5, title: "UI/UX Freelancing", category: "Design", earnMin: 1500, earnMax: 6000, difficulty: "Intermediate", match: 91, phase: "Launch", progress: 45, weeks: "1–2 weeks", tags: ["Remote", "Portfolio Heavy"], relevantSkills: ["UI/UX Design", "Illustrating", "Photography"] },
  { id: 6, title: "SEO Strategy Consultant", category: "Marketing", earnMin: 1000, earnMax: 4500, difficulty: "Intermediate", match: 85, phase: "Foundation", progress: 20, weeks: "2–4 weeks", tags: ["High Retention", "Strategy"], relevantSkills: ["SEO", "Marketing", "Data Analysis"] },
  { id: 7, title: "Video Editing for Creators", category: "Video", earnMin: 600, earnMax: 3000, difficulty: "Beginner", match: 96, phase: "Launch", progress: 55, weeks: "1 week", tags: ["Fast Cash", "Remote"], relevantSkills: ["Video Editing", "Marketing"] },
  { id: 8, title: "Python Data Analysis Service", category: "Data", earnMin: 1800, earnMax: 5500, difficulty: "Intermediate", match: 80, phase: "Scale", progress: 12, weeks: "3–4 weeks", tags: ["Specialized", "B2B"], relevantSkills: ["Python", "Data Analysis", "Finance"] },
];

const tasks = [
  { id: 1, title: "Publish first article on Medium", hustle: "Content Writing", xp: 50, done: false, urgent: true },
  { id: 2, title: "Set up Gumroad storefront", hustle: "React SaaS", xp: 75, done: false, urgent: true },
  { id: 3, title: "Record intro YouTube video", hustle: "YouTube Channel", xp: 100, done: false, urgent: false },
  { id: 4, title: "Research top 20 newsletter niches", hustle: "Content Writing", xp: 50, done: true, urgent: false },
  { id: 5, title: "Buy domain & set up landing page", hustle: "React SaaS", xp: 75, done: true, urgent: false },
];

const courses = [
  {
    id: 1, hustle: "Technical Content Writing", title: "The Ultimate Technical Writing Course",
    platform: "Udemy", type: "paid", price: "$14.99", duration: "6.5 hrs", rating: 4.7, students: "18K",
    skill: "Writing", url: "https://www.udemy.com/course/technical-writing-and-editing/",
    thumb: "📝", match: 96, level: "Beginner"
  },
  {
    id: 2, hustle: "Technical Content Writing", title: "Google Technical Writing Fundamentals",
    platform: "YouTube", type: "free", price: "Free", duration: "3.2 hrs", rating: 4.9, students: "220K",
    skill: "Writing", url: "https://www.youtube.com/results?search_query=google+technical+writing+course",
    thumb: "▶", match: 91, level: "Beginner"
  },
  {
    id: 4, hustle: "React Component Library SaaS", title: "Build and Sell React Component Libraries",
    platform: "Udemy", type: "paid", price: "$12.99", duration: "9 hrs", rating: 4.8, students: "12K",
    skill: "React", url: "https://www.udemy.com/course/design-and-implement-component-library-in-react/",
    thumb: "⚛", match: 98, level: "Advanced"
  },
  {
    id: 5, hustle: "React Component Library SaaS", title: "Publish NPM Packages - Full Tutorial",
    platform: "YouTube", type: "free", price: "Free", duration: "1.4 hrs", rating: 4.8, students: "340K",
    skill: "npm", url: "https://www.youtube.com/results?search_query=how+to+publish+npm+package+tutorial",
    thumb: "▶", match: 93, level: "Intermediate"
  },
  {
    id: 6, hustle: "YouTube Dev Tutorial Channel", title: "YouTube for Developers — Zero to 10K",
    platform: "YouTube", type: "free", price: "Free", duration: "4.5 hrs", rating: 4.9, students: "580K",
    skill: "Content", url: "https://www.youtube.com/results?search_query=youtube+channel+for+developers+growth",
    thumb: "▶", match: 95, level: "Beginner"
  },
  {
    id: 8, hustle: "AI Automation Agency", title: "Building AI Agents with OpenAI & LangChain",
    platform: "YouTube", type: "free", price: "Free", duration: "5.2 hrs", rating: 4.9, students: "120K",
    skill: "AI", url: "https://www.youtube.com/results?search_query=building+ai+agents+langchain+tutorial",
    thumb: "🤖", match: 94, level: "Advanced"
  },
  {
    id: 9, hustle: "UI/UX Freelancing", title: "Figma UI UX Design Essentials",
    platform: "Skillshare", type: "paid", price: "$15/mo", duration: "12 hrs", rating: 4.8, students: "85K",
    skill: "Design", url: "https://www.skillshare.com/en/browse/ui-ux-design",
    thumb: "🎨", match: 92, level: "Intermediate"
  },
  {
    id: 10, hustle: "SEO Strategy Consultant", title: "Advanced SEO Strategy 2024",
    platform: "Udemy", type: "paid", price: "$19.99", duration: "8 hrs", rating: 4.7, students: "42K",
    skill: "SEO", url: "https://www.udemy.com/topic/seo/",
    thumb: "📈", match: 89, level: "Intermediate"
  },
  {
    id: 11, hustle: "Video Editing for Creators", title: "Premiere Pro Masterclass",
    platform: "YouTube", type: "free", price: "Free", duration: "4 hrs", rating: 4.8, students: "900K",
    skill: "Video", url: "https://www.youtube.com/results?search_query=premiere+pro+full+course",
    thumb: "✂", match: 97, level: "Beginner"
  },
  {
    id: 12, hustle: "Python Data Analysis Service", title: "Python for Data Science and ML",
    platform: "Udemy", type: "paid", price: "$14.99", duration: "25 hrs", rating: 4.8, students: "1.2M",
    skill: "Python", url: "https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/",
    thumb: "🐍", match: 95, level: "Intermediate"
  },
];

const roadmapPhases = [
  {
    phase: 1, title: "Foundation", duration: "Week 1–2", color: T.mint, status: "complete",
    tasks: ["Set up profiles on target platforms", "Research 10 competitor examples", "Define your niche & positioning", "Create content/product outline"],
  },
  {
    phase: 2, title: "Launch", duration: "Week 3–4", color: T.amber, status: "active",
    tasks: ["Publish first deliverable", "Reach out to 20 potential clients/viewers", "Set up payment processing", "Collect first testimonial"],
  },
  {
    phase: 3, title: "Scale", duration: "Month 2–3", color: T.violet, status: "upcoming",
    tasks: ["Systematize content/delivery process", "Hit $500/mo milestone", "Build email list / audience", "Create second income stream from same skill"],
  },
  {
    phase: 4, title: "Optimize", duration: "Month 4+", color: "#FF5E7D", status: "locked",
    tasks: ["Raise rates / productize service", "Hire VA or collaborator", "Launch info product or course", "Reach $2K+/mo consistently"],
  },
];

const onboardingSteps = [
  { id: 1, title: "Your Goal", subtitle: "What are you working toward?" },
  { id: 2, title: "Your Skills", subtitle: "What do you already know?" },
  { id: 3, title: "Your Time", subtitle: "Hours available per week" },
  { id: 4, title: "Your Context", subtitle: "Current work situation" },
  { id: 5, title: "Building Plan", subtitle: "AI is generating your roadmap" },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const css = (strings, ...vals) => strings.reduce((a, s, i) => a + s + (vals[i] || ""), "");

function useTypewriter(text, speed = 28, active = true) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) { setDisplayed(text); return; }
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)); }
      else clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, active]);
  return displayed;
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const GlowDot = ({ color = T.mint, size = 6 }) => (
  <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0 }} />
);

const Badge = ({ children, color = T.mint }) => (
  <span style={{ background: color + "18", color, border: `1px solid ${color}30`, borderRadius: 4, padding: "2px 8px", fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
    {children}
  </span>
);

const Card = ({ children, style = {}, glow }) => (
  <div style={{
    background: T.card, border: `1px solid ${glow ? glow + "40" : T.border}`,
    borderRadius: 14, padding: "20px 22px", backdropFilter: "blur(10px)",
    boxShadow: glow ? `0 0 24px ${glow}12` : "none",
    transition: "all 0.2s", ...style
  }}>{children}</div>
);

const MicroLabel = ({ children, color = T.muted }) => (
  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>{children}</div>
);

const ProgressRing = ({ pct, size = 52, color = T.mint, label }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.border} strokeWidth={4} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <span style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: T.text, fontWeight: 700, lineHeight: 1 }}>{pct}%</span>
        {label && <span style={{ fontSize: 7, color: T.muted, fontFamily: "'Space Mono',monospace" }}>{label}</span>}
      </div>
    </div>
  );
};

const XPBar = ({ current, max, level }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: T.mint }}>LVL {level}</span>
      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: T.muted }}>{current}/{max} XP</span>
    </div>
    <div style={{ height: 4, background: T.border, borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(current / max) * 100}%`, background: `linear-gradient(90deg, ${T.mint}, ${T.violet})`, borderRadius: 2, transition: "width 1.5s ease" }} />
    </div>
  </div>
);

// ─── NAV ──────────────────────────────────────────────────────────────────────
const navItems = [
  { id: "landing", icon: "⌂", label: "Home" },
  { id: "onboarding", icon: "◈", label: "Onboarding" },
  { id: "dashboard", icon: "▦", label: "Dashboard" },
  { id: "generator", icon: "⬡", label: "AI Generator" },
  { id: "roadmap", icon: "◉", label: "Roadmap" },
  { id: "learning", icon: "▶", label: "Learning Hub" },
];

function Sidebar({ active, setActive }) {
  return (
    <div style={{
      width: 220, minHeight: "100vh", background: "rgba(7,8,15,0.95)",
      borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column",
      position: "fixed", left: 0, top: 0, zIndex: 100, backdropFilter: "blur(20px)"
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 16px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${T.mint}, ${T.violet})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 15, color: T.text, letterSpacing: "-0.02em" }}>HustleMind</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: T.mint, letterSpacing: "0.1em" }}>AI PLATFORM</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            background: active === item.id ? T.mint + "15" : "transparent",
            color: active === item.id ? T.mint : T.muted,
            fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: active === item.id ? 600 : 400,
            marginBottom: 2, transition: "all 0.15s", textAlign: "left",
            borderLeft: active === item.id ? `2px solid ${T.mint}` : "2px solid transparent",
          }}>
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: "16px 16px 20px", borderTop: `1px solid ${T.border}` }}>
        <XPBar current={3400} max={6000} level={4} />
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${T.violet}, ${T.mint})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>A</div>
          <div>
            <div style={{ fontSize: 12, fontFamily: "'Outfit',sans-serif", color: T.text, fontWeight: 600 }}>Alex Kumar</div>
            <Badge color={T.amber}>PRO</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onStart }) {
  const [hovered, setHovered] = useState(null);
  const headline = useTypewriter("Stop Guessing.\nStart Earning.", 40);

  const features = [
    { icon: "⬡", title: "AI Hustle Generator", desc: "Personalized side hustle ideas based on your skills, time & income goals", color: T.mint },
    { icon: "◉", title: "Execution Roadmaps", desc: "Phase-by-phase plans with tasks, milestones and weekly priorities", color: T.violet },
    { icon: "▦", title: "Earnings Tracker", desc: "Log income, visualize growth and compare projected vs actual revenue", color: T.amber },
    { icon: "▶", title: "Learning Hub", desc: "Curated free & paid courses + YouTube videos matched to your hustle", color: "#FF5E7D" },
  ];

  const stats = ["12,400+ Hustlers Onboarded", "$2.3M in Side Income Tracked", "94% Report Actionable Plans", "4.9★ Average Rating"];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, overflowX: "hidden" }}>
      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, background: T.bg + "ee", backdropFilter: "blur(20px)", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 18, color: T.text }}>HustleMind AI</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Features", "Pricing", "Community", "Blog"].map(l => (
            <span key={l} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: T.muted, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <button onClick={onStart} style={{ background: T.mint, color: "#07080F", border: "none", borderRadius: 8, padding: "10px 24px", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
          Get Started Free →
        </button>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.mint + "12", border: `1px solid ${T.mint}30`, borderRadius: 20, padding: "6px 14px", marginBottom: 28 }}>
            <GlowDot size={6} />
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: T.mint }}>AI-POWERED INCOME PLANNING</span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 58, lineHeight: 1.05, color: T.text, margin: "0 0 24px", letterSpacing: "-0.03em", whiteSpace: "pre-line" }}>
            {headline.includes("Earning") ? (
              <>
                {headline.split("Earning")[0]}
                <span style={{ background: `linear-gradient(90deg, ${T.mint}, ${T.violet})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Earning</span>
                {headline.split("Earning")[1]}
              </>
            ) : (
              headline
            )}
          </h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, color: T.muted, lineHeight: 1.7, marginBottom: 36 }}>
            AI builds your personalized side hustle roadmap in 60 seconds — with real action steps, earning estimates, and curated learning paths.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={onStart} style={{ background: `linear-gradient(135deg, ${T.mint}, #00D4A0)`, color: "#07080F", border: "none", borderRadius: 10, padding: "14px 32px", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: `0 0 30px ${T.mint}40` }}>
              Generate My Hustle Plan →
            </button>
            <button style={{ background: "transparent", color: T.text, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 24px", fontFamily: "'Outfit',sans-serif", fontSize: 15, cursor: "pointer" }}>
              Watch Demo ▶
            </button>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 28 }}>
            {["No credit card", "Free plan forever", "Setup in 60s"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: T.mint, fontSize: 12 }}>✓</span>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: T.muted }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal Preview */}
        <div style={{ background: "rgba(0,0,0,0.6)", border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", boxShadow: `0 0 60px ${T.mint}12` }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#FF5E7D", "#FF9F43", "#00FFB2"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
            </div>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: T.muted }}>hustlemind.ai/generate</span>
          </div>
          <div style={{ padding: "20px", fontFamily: "'Space Mono',monospace", fontSize: 12 }}>
            <div style={{ color: T.muted, marginBottom: 12 }}>{">"} Analyzing profile: React Developer, 10hrs/wk, goal $2K/mo</div>
            <div style={{ color: T.mint, marginBottom: 8 }}>{">"} Scanning 2,400+ income opportunities...</div>
            <div style={{ marginBottom: 16 }}>
              {hustles.map((h, i) => (
                <div key={h.id} style={{ marginBottom: 12, padding: "12px", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, animation: `fadeIn 0.4s ease ${i * 0.3}s both` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: T.text, fontWeight: 700 }}>{h.title}</span>
                    <Badge color={T.mint}>{h.match}% match</Badge>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ color: T.amber }}>${h.earnMin}–${h.earnMax}/mo</span>
                    <span style={{ color: T.muted }}>First $ in {h.weeks}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ color: T.violet }}>{">"} Roadmaps ready. Click "View Plan" to start. ▌</div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "14px 0", overflow: "hidden", background: "rgba(0,255,178,0.03)" }}>
        <div style={{ display: "flex", gap: 48, animation: "marquee 20s linear infinite", whiteSpace: "nowrap" }}>
          {[...stats, ...stats, ...stats].map((s, i) => (
            <span key={i} style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: T.mint }}>◈ {s}</span>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: 1100, margin: "80px auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <MicroLabel color={T.mint}>WHAT YOU GET</MicroLabel>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 40, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>Everything you need to earn more</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {features.map((f, i) => (
            <Card key={i} glow={f.color} style={{ cursor: "pointer", transform: hovered === i ? "translateY(-3px)" : "none", transition: "all 0.2s" }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: T.text, margin: "0 0 8px" }}>{f.title}</h3>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: T.muted, margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ maxWidth: 1100, margin: "0 auto 80px", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 40, color: T.text, margin: 0 }}>Simple, honest pricing</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {[
            { name: "Free", price: "$0", period: "forever", color: T.muted, features: ["3 AI hustle ideas/mo", "1 active roadmap", "Basic earnings tracker", "Community access"], cta: "Start Free" },
            { name: "Pro", price: "$19", period: "/month", color: T.mint, features: ["Unlimited AI generation", "5 active roadmaps", "Full Learning Hub", "AI Coach chatbot", "Advanced analytics", "Priority support"], cta: "Start Pro Trial", highlight: true },
            { name: "Scale", price: "$49", period: "/month", color: T.violet, features: ["Everything in Pro", "Team collaboration", "API access", "Custom AI prompts", "White-label reports", "1:1 onboarding call"], cta: "Contact Sales" },
          ].map((p, i) => (
            <Card key={i} glow={p.highlight ? p.color : undefined} style={{ border: p.highlight ? `2px solid ${p.color}50` : `1px solid ${T.border}`, position: "relative" }}>
              {p.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: T.mint, color: "#07080F", borderRadius: 20, padding: "3px 14px", fontFamily: "'Space Mono',monospace", fontSize: 10, fontWeight: 700 }}>RECOMMENDED</div>}
              <MicroLabel color={p.color}>{p.name}</MicroLabel>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "8px 0 20px" }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 36, color: T.text }}>{p.price}</span>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: T.muted }}>{p.period}</span>
              </div>
              {p.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ color: p.color, fontSize: 12 }}>✓</span>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: T.muted }}>{f}</span>
                </div>
              ))}
              <button onClick={onStart} style={{ width: "100%", marginTop: 20, background: p.highlight ? T.mint : "transparent", color: p.highlight ? "#07080F" : T.text, border: p.highlight ? "none" : `1px solid ${T.border}`, borderRadius: 8, padding: "12px", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                {p.cta}
              </button>
            </Card>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
      `}</style>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState(null);
  const [skills, setSkills] = useState([]);
  const [hours, setHours] = useState(10);
  const [context, setContext] = useState(null);
  const [loadText, setLoadText] = useState(0);

  const goals = [
    { id: "extra", label: "Extra $500/mo", icon: "💰", desc: "Supplement my income" },
    { id: "replace", label: "Replace Income", icon: "🚀", desc: "Go full-time side hustle" },
    { id: "business", label: "Build a Business", icon: "🏗", desc: "Long-term company" },
    { id: "explore", label: "Just Exploring", icon: "🔍", desc: "See what's possible" },
  ];

  const allSkills = ["React", "Node.js", "Python", "UI/UX Design", "Copywriting", "Video Editing", "SEO", "Marketing", "Data Analysis", "Teaching", "Photography", "Illustrating", "Sales", "Finance", "Project Mgmt"];

  const contexts = ["Student", "Employed Full-Time", "Part-Time Worker", "Freelancer", "Unemployed"];

  const loadLines = [
    "Analyzing skill matrix...",
    "Scanning 2,400+ income opportunities...",
    "Calculating earning potential...",
    "Mapping skill-to-income paths...",
    "Building your personalized roadmap...",
    "✓ Your HustleMind plan is ready!",
  ];

  useEffect(() => {
    if (step === 5) {
      let i = 0;
      const t = setInterval(() => {
        setLoadText(prev => prev + 1);
        if (++i >= loadLines.length) { 
          clearInterval(t); 
          setTimeout(() => onComplete({ goal, skills, hours, context }), 600); 
        }
      }, 700);
      return () => clearInterval(t);
    }
  }, [step, goal, skills, hours, context, onComplete]);

  const hourLabel = hours <= 5 ? "Side project mode" : hours <= 15 ? "Serious side hustle" : "Full transition ready";

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        {/* Progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 40 }}>
          {onboardingSteps.map(s => (
            <div key={s.id} style={{ flex: 1, height: 3, borderRadius: 2, background: s.id <= step ? T.mint : T.border, transition: "background 0.4s" }} />
          ))}
        </div>

        <Card glow={T.mint} style={{ padding: "36px 40px" }}>
          <MicroLabel color={T.mint}>STEP {step} OF 5</MicroLabel>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 28, color: T.text, margin: "8px 0 6px" }}>{onboardingSteps[step - 1].title}</h2>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: T.muted, margin: "0 0 28px" }}>{onboardingSteps[step - 1].subtitle}</p>

          {step === 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {goals.map(g => (
                <button key={g.id} onClick={() => setGoal(g.id)} style={{
                  background: goal === g.id ? T.mint + "18" : T.surface, border: `1px solid ${goal === g.id ? T.mint : T.border}`,
                  borderRadius: 10, padding: "16px", cursor: "pointer", textAlign: "left", transition: "all 0.15s"
                }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{g.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 4 }}>{g.label}</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: T.muted }}>{g.desc}</div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {allSkills.map(s => (
                <button key={s} onClick={() => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} style={{
                  background: skills.includes(s) ? T.violet + "20" : T.surface,
                  border: `1px solid ${skills.includes(s) ? T.violet : T.border}`,
                  borderRadius: 20, padding: "8px 16px", cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif", fontSize: 13, color: skills.includes(s) ? T.violet : T.muted,
                  transition: "all 0.15s"
                }}>{s}</button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 32, color: T.mint, fontWeight: 700 }}>{hours}h</span>
                <Badge color={T.amber}>{hourLabel}</Badge>
              </div>
              <input type="range" min={2} max={40} value={hours} onChange={e => setHours(+e.target.value)}
                style={{ width: "100%", accentColor: T.mint, cursor: "pointer", marginBottom: 8 }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted }}>2h/wk</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted }}>40h/wk</span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {contexts.map(c => (
                <button key={c} onClick={() => setContext(c)} style={{
                  background: context === c ? T.mint + "15" : T.surface,
                  border: `1px solid ${context === c ? T.mint : T.border}`,
                  borderRadius: 8, padding: "14px 18px", cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif", fontSize: 14, color: context === c ? T.mint : T.muted,
                  textAlign: "left", transition: "all 0.15s"
                }}>{c}</button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13 }}>
              {loadLines.slice(0, loadText).map((line, i) => (
                <div key={i} style={{ padding: "6px 0", color: i === loadText - 1 ? T.mint : T.muted, animation: "fadeIn 0.3s ease both" }}>{"> "}{line}</div>
              ))}
              {loadText < loadLines.length && <span style={{ color: T.mint }}>▌</span>}
            </div>
          )}

          {step < 5 && (
            <button onClick={() => setStep(s => s + 1)} disabled={
              (step === 1 && !goal) || (step === 2 && skills.length === 0) || (step === 4 && !context)
            } style={{
              width: "100%", marginTop: 28, background: T.mint, color: "#07080F",
              border: "none", borderRadius: 10, padding: "14px",
              fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer",
              opacity: ((step === 1 && !goal) || (step === 2 && skills.length === 0) || (step === 4 && !context)) ? 0.4 : 1,
              transition: "opacity 0.2s"
            }}>
              {step === 4 ? "Generate My Plan →" : "Continue →"}
            </button>
          )}
        </Card>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@800;900&family=Outfit:wght@400;500;600&family=Space+Mono&display=swap'); @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ setPage, setSelectedHustle, filteredHustles }) {
  const [tasksDone, setTasksDone] = useState(tasks.map(t => t.done));

  const kpis = [
    { label: "Earned This Month", value: "$3,100", delta: "+26%", color: T.mint, icon: "◈" },
    { label: "Active Hustles", value: filteredHustles.length.toString(), delta: "Matched", color: T.violet, icon: "⬡" },
    { label: "Tasks Due Today", value: "3", delta: "2 urgent", color: T.amber, icon: "◉" },
    { label: "Skill XP Level", value: "Lvl 4", delta: "+340 XP", color: "#FF5E7D", icon: "★" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <MicroLabel color={T.mint}>COMMAND CENTER</MicroLabel>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 28, color: T.text, margin: "4px 0 0" }}>Your Hustle Command Center 👋</h1>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {kpis.map((k, i) => (
          <Card key={i} glow={k.color}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <MicroLabel>{k.label}</MicroLabel>
              <span style={{ fontSize: 16, color: k.color }}>{k.icon}</span>
            </div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 26, color: T.text, fontWeight: 700, marginBottom: 4 }}>{k.value}</div>
            <Badge color={k.color}>{k.delta}</Badge>
          </Card>
        ))}
      </div>

      {/* Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 14, marginBottom: 20 }}>
        {/* Earnings Chart */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <MicroLabel>EARNINGS GROWTH</MicroLabel>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: T.text }}>Revenue Over Time</div>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 11, fontFamily: "'Space Mono',monospace" }}>
              <span style={{ color: T.mint }}>● Actual</span>
              <span style={{ color: T.violet }}>● Projected</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.mint} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.mint} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gProj" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.violet} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={T.violet} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: T.muted, fontSize: 11, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.muted, fontSize: 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={{ background: "#0f1019", border: `1px solid ${T.border}`, borderRadius: 8, fontFamily: "Space Mono", fontSize: 11 }} />
              <Area type="monotone" dataKey="projected" stroke={T.violet} strokeWidth={1.5} strokeDasharray="4 4" fill="url(#gProj)" />
              <Area type="monotone" dataKey="actual" stroke={T.mint} strokeWidth={2} fill="url(#gActual)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* AI Insight */}
        <Card glow={T.violet} style={{ borderLeft: `3px solid ${T.violet}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <GlowDot color={T.violet} />
            <MicroLabel color={T.violet}>AI INSIGHT — TODAY</MicroLabel>
          </div>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: T.text, lineHeight: 1.7, margin: "0 0 16px" }}>
            You have a <strong style={{ color: T.mint }}>4-hour gap</strong> this week compared to your plan. Your Technical Writing hustle is closest to the $1K milestone — one new article could push you over.
          </p>
          <div style={{ padding: "12px", background: T.surface, borderRadius: 8, marginBottom: 12 }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: T.amber, marginBottom: 4 }}>RECOMMENDED ACTION</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: T.text }}>Publish "Top 10 React Hooks" article to Dev.to today</div>
          </div>
          <Badge color={T.violet}>+50 XP on completion</Badge>
        </Card>
      </div>

      {/* Hustles + Tasks */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Active Hustles */}
        <Card>
          <MicroLabel>ACTIVE HUSTLES</MicroLabel>
          <div style={{ marginTop: 14 }}>
            {filteredHustles.slice(0, 3).map(h => (
              <div key={h.id} onClick={() => { setSelectedHustle(h); setPage("roadmap"); }}
                style={{ padding: "12px", background: T.surface, borderRadius: 8, marginBottom: 10, cursor: "pointer", border: `1px solid ${T.border}`, transition: "all 0.15s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 14, color: T.text }}>{h.title}</span>
                  <Badge color={T.mint}>{h.match}% Match</Badge>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, height: 4, background: T.border, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${h.progress}%`, background: `linear-gradient(90deg, ${T.mint}, ${T.violet})`, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted, flexShrink: 0 }}>{h.progress}%</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.amber, flexShrink: 0 }}>${h.earnMin}–{h.earnMax}/mo</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tasks */}
        <Card>
          <MicroLabel>TODAY'S TASKS</MicroLabel>
          <div style={{ marginTop: 14 }}>
            {tasks.map((t, i) => (
              <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${T.border}`, opacity: tasksDone[i] ? 0.5 : 1, transition: "opacity 0.2s" }}>
                <button onClick={() => setTasksDone(prev => prev.map((d, j) => j === i ? !d : d))}
                  style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${tasksDone[i] ? T.mint : T.border}`, background: tasksDone[i] ? T.mint : "transparent", cursor: "pointer", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {tasksDone[i] && <span style={{ color: "#07080F", fontSize: 11, fontWeight: 900 }}>✓</span>}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: tasksDone[i] ? T.muted : T.text, textDecoration: tasksDone[i] ? "line-through" : "none" }}>{t.title}</span>
                    {t.urgent && !tasksDone[i] && <Badge color={T.red}>URGENT</Badge>}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted }}>{t.hustle}</span>
                    <Badge color={T.violet}>+{t.xp} XP</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── AI GENERATOR ─────────────────────────────────────────────────────────────
function AIGenerator({ setPage, setSelectedHustle, userProfile, setUserProfile, filteredHustles }) {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const allSkillOpts = ["React", "Node.js", "Python", "UI/UX Design", "Copywriting", "Video Editing", "SEO", "Marketing", "Data Analysis", "Teaching", "Photography", "Illustrating", "Sales", "Finance", "Project Mgmt"];

  const generate = () => {
    setGenerating(true);
    setDone(false);
    setTimeout(() => { setGenerating(false); setDone(true); }, 2200);
  };

  return (
    <div>
      <MicroLabel color={T.mint}>AI-POWERED</MicroLabel>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 28, color: T.text, margin: "4px 0 28px" }}>Hustle Generator</h1>

      <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 20 }}>
        {/* Input Panel */}
        <Card>
          <MicroLabel>YOUR PROFILE</MicroLabel>
          <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: T.muted, marginBottom: 8 }}>Your Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {allSkillOpts.map(s => (
                  <button key={s} onClick={() => setUserProfile(p => ({ ...p, skills: p.skills.includes(s) ? p.skills.filter(x => x !== s) : [...p.skills, s] }))}
                    style={{ background: userProfile.skills.includes(s) ? T.mint + "18" : T.surface, border: `1px solid ${userProfile.skills.includes(s) ? T.mint : T.border}`, borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 12, color: userProfile.skills.includes(s) ? T.mint : T.muted, transition: "all 0.15s" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: T.muted, marginBottom: 8 }}>Monthly Income Target ($)</div>
              <input value={userProfile.incomeTarget} onChange={e => setUserProfile(p => ({ ...p, incomeTarget: e.target.value }))}
                style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", fontFamily: "'Space Mono',monospace", fontSize: 15, color: T.mint, outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: T.muted }}>Hours per week</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: T.mint }}>{userProfile.hours}h</span>
              </div>
              <input type="range" min={2} max={40} value={userProfile.hours} onChange={e => setUserProfile(p => ({ ...p, hours: +e.target.value }))} style={{ width: "100%", accentColor: T.mint }} />
            </div>

            <button onClick={generate} disabled={generating} style={{ width: "100%", background: generating ? T.border : `linear-gradient(135deg, ${T.mint}, #00D4A0)`, color: "#07080F", border: "none", borderRadius: 10, padding: "14px", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, cursor: generating ? "wait" : "pointer", transition: "all 0.2s" }}>
              {generating ? "Generating..." : "Generate My Hustle Ideas →"}
            </button>
          </div>
        </Card>

        {/* Output Panel */}
        <div>
          {!done && !generating && (
            <Card style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>⬡</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: T.muted }}>Configure your profile and generate</div>
            </Card>
          )}
          {generating && (
            <Card style={{ minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13 }}>
                {["Analyzing skill matrix...", "Scanning 2,400+ opportunities...", "Calculating earning potential...", "Building your hustle matches..."].map((line, i) => (
                  <div key={i} style={{ color: T.mint, padding: "6px 0", animation: `fadeIn 0.3s ease ${i * 0.5}s both` }}>{"> "}{line}</div>
                ))}
                <span style={{ color: T.mint, animation: "blink 1s infinite" }}>▌</span>
              </div>
            </Card>
          )}
          {done && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filteredHustles.map((h, i) => (
                <Card key={h.id} style={{ animation: `fadeIn 0.4s ease ${i * 0.15}s both`, cursor: "pointer" }}
                  onClick={() => { setSelectedHustle(h); setPage("roadmap"); }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, color: T.text, marginBottom: 4 }}>{h.title}</div>
                      <Badge color={T.violet}>{h.category}</Badge>
                    </div>
                    <ProgressRing pct={h.match} size={52} color={T.mint} />
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                    <div><MicroLabel>EARNING RANGE</MicroLabel><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, color: T.amber }}>${h.earnMin}–${h.earnMax}/mo</span></div>
                    <div><MicroLabel>FIRST INCOME</MicroLabel><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, color: T.text }}>{h.weeks}</span></div>
                    <div><MicroLabel>DIFFICULTY</MicroLabel><Badge color={h.difficulty === "Beginner" ? T.mint : h.difficulty === "Intermediate" ? T.amber : T.violet}>{h.difficulty}</Badge></div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {h.tags.map(tag => <Badge key={tag} color={T.muted}>{tag}</Badge>)}
                  </div>
                  <button style={{ marginTop: 14, background: T.mint + "18", color: T.mint, border: `1px solid ${T.mint}30`, borderRadius: 8, padding: "8px 18px", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", width: "100%" }}>
                    Build Full Roadmap →
                  </button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

// ─── ROADMAP PAGE ─────────────────────────────────────────────────────────────
function RoadmapPage({ hustle, setPage }) {
  if (!hustle) return null;
  const [activeTab, setActiveTab] = useState("overview");
  const [completedTasks, setCompletedTasks] = useState([]);
  const tabs = ["overview", "tasks", "resources", "earnings"];

  const hustleTasks = {
    todo: [
      { id: "t1", title: "Publish 3 sample articles on Medium", xp: 100, est: "3h", phase: 2 },
      { id: "t2", title: "Create LinkedIn content portfolio", xp: 75, est: "2h", phase: 2 },
    ],
    inprogress: [
      { id: "t3", title: "Research competitor content rates", xp: 50, est: "1h", phase: 2 },
      { id: "t4", title: "Set up personal brand website", xp: 150, est: "4h", phase: 2 },
    ],
    done: [
      { id: "t5", title: "Define niche: React/JS technical content", xp: 50, est: "1h", phase: 1 },
      { id: "t6", title: "Create writer profiles on platforms", xp: 75, est: "1.5h", phase: 1 },
    ]
  };

  const incomeLog = [
    { date: "Feb 20", amount: 250, source: "Dev.to article bonus", notes: "" },
    { date: "Feb 14", amount: 400, source: "Freelance client — React tutorial", notes: "Repeat client" },
    { date: "Feb 05", amount: 180, source: "Medium Partner Program", notes: "" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => setPage("dashboard")} style={{ background: "none", border: "none", color: T.muted, fontFamily: "'Space Mono',monospace", fontSize: 12, cursor: "pointer", marginBottom: 12, padding: 0 }}>← Back to Dashboard</button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <Badge color={T.violet}>{hustle.category}</Badge>
              <Badge color={hustle.difficulty === "Beginner" ? T.mint : T.amber}>{hustle.difficulty}</Badge>
            </div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 32, color: T.text, margin: 0 }}>{hustle.title}</h1>
          </div>
          <Card style={{ padding: "14px 20px", textAlign: "right" }}>
            <MicroLabel>EST. MONTHLY</MicroLabel>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 22, color: T.amber, fontWeight: 700 }}>${hustle.earnMin}–${hustle.earnMax}</div>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: `1px solid ${T.border}`, paddingBottom: 0 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: "none", border: "none", borderBottom: activeTab === tab ? `2px solid ${T.mint}` : "2px solid transparent",
            padding: "10px 18px", fontFamily: "'Outfit',sans-serif", fontWeight: activeTab === tab ? 600 : 400,
            fontSize: 14, color: activeTab === tab ? T.mint : T.muted, cursor: "pointer", textTransform: "capitalize", marginBottom: -1
          }}>{tab}</button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
            <div>
              <MicroLabel>EXECUTION ROADMAP</MicroLabel>
              <div style={{ marginTop: 16, position: "relative" }}>
                <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 2, background: T.border }} />
                {roadmapPhases.map((phase, i) => (
                  <div key={phase.phase} style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: phase.status === "locked" ? T.border : phase.color + "20", border: `2px solid ${phase.status === "locked" ? T.border : phase.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: phase.status === "locked" ? T.muted : phase.color, fontWeight: 700 }}>{phase.phase}</span>
                    </div>
                    <Card style={{ flex: 1, borderLeft: `3px solid ${phase.status === "locked" ? T.border : phase.color}`, opacity: phase.status === "locked" ? 0.5 : 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div>
                          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: T.text }}>{phase.title}</span>
                          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: T.muted, marginLeft: 10 }}>{phase.duration}</span>
                        </div>
                        <Badge color={phase.status === "complete" ? T.mint : phase.status === "active" ? T.amber : T.muted}>
                          {phase.status === "complete" ? "✓ Complete" : phase.status === "active" ? "● Active" : "🔒 Locked"}
                        </Badge>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {phase.tasks.map((t, j) => (
                          <div key={j} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: phase.status === "complete" ? T.mint : T.border, fontSize: 10 }}>✓</span>
                            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: T.muted }}>{t}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Coach */}
            <Card glow={T.violet} style={{ alignSelf: "start", borderLeft: `3px solid ${T.violet}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <GlowDot color={T.violet} />
                <MicroLabel color={T.violet}>AI COACH</MicroLabel>
              </div>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: T.text, lineHeight: 1.7, margin: "0 0 14px" }}>
                You're in <strong style={{ color: T.amber }}>Phase 2 (Launch)</strong>. Your next leverage move: reach out to 3 SaaS companies that need React documentation. They typically pay $150–300/article. You have the skill match — now it's a numbers game.
              </p>
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
                <MicroLabel color={T.violet}>NEXT BEST ACTION</MicroLabel>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: T.mint, marginTop: 4 }}>Send cold pitches to 3 developer tools companies today</div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[["todo", "To Do", T.muted], ["inprogress", "In Progress", T.amber], ["done", "Done", T.mint]].map(([key, label, color]) => (
            <div key={key}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <GlowDot color={color} size={7} />
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted }}>({hustleTasks[key].length})</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {hustleTasks[key].map(t => (
                  <Card key={t.id} style={{ padding: "14px 16px", cursor: "pointer" }}>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: T.text, marginBottom: 8, fontWeight: 500 }}>{t.title}</div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <Badge color={T.violet}>+{t.xp} XP</Badge>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted }}>~{t.est}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <ResourcesTab singleHustle={hustle} />
      )}

      {/* Earnings Tab */}
      {activeTab === "earnings" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
            <Card>
              <MicroLabel>EARNINGS HISTORY</MicroLabel>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={earningsData.slice(-5)}>
                  <defs>
                    <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={T.amber} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={T.amber} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: T.muted, fontSize: 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: T.muted, fontSize: 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip contentStyle={{ background: "#0f1019", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 11, fontFamily: "Space Mono" }} />
                  <Area type="monotone" dataKey="actual" stroke={T.amber} strokeWidth={2} fill="url(#eg)" />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 16 }}>
                {incomeLog.map((log, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                    <div>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: T.text }}>{log.source}</div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted }}>{log.date}</div>
                    </div>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 15, color: T.amber, fontWeight: 700 }}>+${log.amount}</span>
                  </div>
                ))}
              </div>
            </Card>
            <div>
              <Card glow={T.amber} style={{ marginBottom: 14 }}>
                <MicroLabel>TOTAL EARNED</MicroLabel>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 32, color: T.amber, fontWeight: 700, margin: "6px 0 4px" }}>$830</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: T.muted }}>This month · Goal: $1,000</div>
                <div style={{ marginTop: 10, height: 4, background: T.border, borderRadius: 2 }}>
                  <div style={{ height: "100%", width: "83%", background: T.amber, borderRadius: 2 }} />
                </div>
              </Card>
              <Card>
                <MicroLabel>LOG INCOME</MicroLabel>
                <div style={{ marginTop: 12 }}>
                  <input placeholder="Amount ($)" style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontFamily: "'Space Mono',monospace", fontSize: 13, marginBottom: 8, outline: "none", boxSizing: "border-box" }} />
                  <input placeholder="Source / client" style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontFamily: "'Outfit',sans-serif", fontSize: 13, marginBottom: 12, outline: "none", boxSizing: "border-box" }} />
                  <button style={{ width: "100%", background: T.amber + "18", color: T.amber, border: `1px solid ${T.amber}30`, borderRadius: 8, padding: "10px", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Log Income</button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LEARNING HUB ─────────────────────────────────────────────────────────────
function ResourcesTab({ generatedHustles, singleHustle }) {
  const [filter, setFilter] = useState("all");
  const [selectedHustleFilter, setSelectedHustleFilter] = useState("all");

  const hustleTitles = singleHustle 
    ? [singleHustle.title] 
    : ["all", ...generatedHustles.map(h => h.title)];

  const filtered = courses.filter(c => {
    const typeMatch = filter === "all" || c.type === filter;
    
    let hustleMatch = false;
    if (singleHustle) {
      hustleMatch = c.hustle === singleHustle.title;
    } else {
      if (selectedHustleFilter === "all") {
        // Only show resources for hustles that were generated for the user
        hustleMatch = generatedHustles.some(h => h.title === c.hustle);
      } else {
        hustleMatch = c.hustle === selectedHustleFilter;
      }
    }
    
    return typeMatch && hustleMatch;
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {/* Type filter */}
        <div style={{ display: "flex", gap: 6 }}>
          {[["all", "All"], ["free", "Free ▶"], ["paid", "Paid 💳"]].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{ background: filter === v ? T.mint + "18" : T.surface, border: `1px solid ${filter === v ? T.mint : T.border}`, borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 12, color: filter === v ? T.mint : T.muted, transition: "all 0.15s" }}>{l}</button>
          ))}
        </div>
        <div style={{ width: 1, background: T.border }} />
        {/* Hustle filter */}
        {!singleHustle && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {hustleTitles.map(h => (
              <button key={h} onClick={() => setSelectedHustleFilter(h)} style={{ background: selectedHustleFilter === h ? T.violet + "18" : T.surface, border: `1px solid ${selectedHustleFilter === h ? T.violet : T.border}`, borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 12, color: selectedHustleFilter === h ? T.violet : T.muted, transition: "all 0.15s" }}>{h === "all" ? "All Matched Hustles" : h}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {filtered.map(course => (
          <a key={course.id} href={course.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <Card style={{ cursor: "pointer", transition: "all 0.2s", height: "100%" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}>
              {/* Top */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: course.type === "free" ? T.mint + "18" : T.amber + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{course.thumb}</div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <Badge color={course.type === "free" ? T.mint : T.amber}>{course.type === "free" ? "FREE" : course.price}</Badge>
                  <Badge color={T.muted}>{course.platform}</Badge>
                </div>
              </div>

              {/* Title */}
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 6, lineHeight: 1.3 }}>{course.title}</div>

              {/* Meta */}
              <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted }}>⏱ {course.duration}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.amber }}>★ {course.rating}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted }}>{course.students} students</span>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                <Badge color={T.violet}>{course.skill}</Badge>
                <Badge color={course.level === "Beginner" ? T.mint : course.level === "Intermediate" ? T.amber : T.violet}>{course.level}</Badge>
              </div>

              {/* Match + CTA */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 30, height: 4, background: T.border, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${course.match}%`, background: T.mint, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.mint }}>{course.match}% match</span>
                </div>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: course.type === "free" ? T.mint : T.amber }}>
                  {course.platform === "YouTube" ? "Watch ▶" : "View Course →"}
                </span>
              </div>

              {/* Hustle tag */}
              <div style={{ marginTop: 8 }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: T.muted }}>FOR: {course.hustle}</span>
              </div>
            </Card>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: T.muted, fontFamily: "'Outfit',sans-serif" }}>
          No resources match your current filters.
        </div>
      )}
    </div>
  );
}

function LearningHubPage({ filteredHustles }) {
  return (
    <div>
      <MicroLabel color={T.mint}>SKILL DEVELOPMENT</MicroLabel>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 28, color: T.text, margin: "4px 0 8px" }}>Learning Hub</h1>
      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: T.muted, margin: "0 0 28px" }}>Free & paid courses and YouTube videos — curated for your matched hustles. Click any card to open the resource.</p>
      <ResourcesTab generatedHustles={filteredHustles.slice(0, 4)} />
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [userProfile, setUserProfile] = useState({
    goal: null,
    skills: ["React", "Copywriting", "SEO"],
    hours: 10,
    context: null,
    incomeTarget: "2000"
  });

  // Derived filtered hustles based on profile
  const filteredHustles = hustles.map(h => {
    const skillOverlap = h.relevantSkills.filter(s => userProfile.skills.includes(s)).length;
    // Calculate match score: 40% base + weight based on skill overlap
    let matchScore = 40 + Math.round((skillOverlap / h.relevantSkills.length) * 60);
    
    // Slight boost for hours match (simulated)
    if (userProfile.hours >= 20 && h.difficulty === "Advanced") matchScore += 5;
    if (userProfile.hours <= 10 && h.difficulty === "Beginner") matchScore += 5;
    
    return { ...h, match: Math.min(matchScore, 99) };
  }).sort((a, b) => b.match - a.match);

  const [selectedHustle, setSelectedHustle] = useState(filteredHustles[0]);

  useEffect(() => {
    // Keep selected hustle in sync if it's not in the new filtered list (though it always should be)
    if (!filteredHustles.find(h => h.id === selectedHustle.id)) {
      setSelectedHustle(filteredHustles[0]);
    }
  }, [userProfile]);

  const showSidebar = !["landing", "onboarding"].includes(page);

  return (
    <div style={{ fontFamily: "'Outfit',sans-serif", background: T.bg, minHeight: "100vh", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        button:focus-visible { outline: 2px solid ${T.mint}; outline-offset: 2px; }
        a { color: inherit; }
      `}</style>

      {page === "landing" && <LandingPage onStart={() => setPage("onboarding")} />}
      {page === "onboarding" && <OnboardingFlow onComplete={(data) => {
        setUserProfile(prev => ({ ...prev, ...data }));
        setPage("dashboard");
      }} />}

      {showSidebar && (
        <div style={{ display: "flex" }}>
          <Sidebar active={page} setActive={setPage} />
          <main style={{ marginLeft: 220, flex: 1, padding: "36px 40px", minHeight: "100vh", animation: "fadeIn 0.3s ease" }}>
            {page === "dashboard" && <Dashboard setPage={setPage} setSelectedHustle={setSelectedHustle} filteredHustles={filteredHustles} />}
            {page === "generator" && <AIGenerator setPage={setPage} setSelectedHustle={setSelectedHustle} userProfile={userProfile} setUserProfile={setUserProfile} filteredHustles={filteredHustles} />}
            {page === "roadmap" && <RoadmapPage hustle={selectedHustle} setPage={setPage} />}
            {page === "learning" && <LearningHubPage filteredHustles={filteredHustles} />}
          </main>
        </div>
      )}
    </div>
  );
}
