"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AuditResult } from "@/types";
import { TOOL_LABELS } from "@/lib/pricingData";

const severityColors = {
  high: "bg-red-50 border-red-200",
  medium: "bg-yellow-50 border-yellow-200",
  low: "bg-blue-50 border-blue-200",
  optimal: "bg-green-50 border-green-200",
};

const severityBadge = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-blue-100 text-blue-700",
  optimal: "bg-green-100 text-green-700",
};

const severityLabel = {
  high: "⚠️ Overspending",
  medium: "💡 Can optimize",
  low: "ℹ️ Minor tweak",
  optimal: "✅ Optimal",
};

export default function ResultsPage() {
  const { id } = useParams();
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
const [company, setCompany] = useState("");
const [role, setRole] = useState("");

  useEffect(() => {
    // Try API first, then fallback to cookie
    fetch(`/api/audit?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          // Try cookie fallback
          const cookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`audit_${id}=`));
          if (cookie) {
            const val = decodeURIComponent(cookie.split("=")[1]);
            setAudit(JSON.parse(val));
          }
        } else {
          setAudit(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!audit) return;
    setSummaryLoading(true);
    fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(audit),
    })
      .then((r) => r.json())
      .then((data) => {
        setSummary(
          data.summary ||
            `Your team is spending on ${audit.results.length} AI tool(s) with $${audit.totalMonthlySavings}/month in identified savings. ${audit.totalMonthlySavings > 0 ? "Switching plans and right-sizing seats could save you $" + audit.totalAnnualSavings + " annually." : "Your current stack looks well-optimized."}`
        );
        setSummaryLoading(false);
      })
      .catch(() => {
        setSummary(
          `Your AI stack audit is complete. We analyzed ${audit?.results.length} tool(s) and identified $${audit?.totalMonthlySavings}/month in potential savings.`
        );
        setSummaryLoading(false);
      });
  }, [audit]);

  const handleEmailCapture = async (e: React.FormEvent) => {
  e.preventDefault();

  await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      company,
      role,
      auditId: id,
      tools: audit?.formData.tools.map((t) => t.tool),
      totalMonthlySavings: audit?.totalMonthlySavings,
      totalAnnualSavings: audit?.totalAnnualSavings,
      useCase: audit?.formData.useCase,
      teamSize: audit?.formData.teamSize,
      website: "", // honeypot — always empty for real users
    }),
  });

  setEmailSubmitted(true);
};

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Analyzing your AI stack...</p>
        </div>
      </div>
    );

  if (!audit)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <p className="text-gray-700 font-medium">Audit not found</p>
          <a href="/" className="text-blue-600 text-sm underline">
            Run a new audit →
          </a>
        </div>
      </div>
    );

  const isHighSavings = audit.totalMonthlySavings > 500;
  const isOptimal = audit.totalMonthlySavings === 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="text-center">
          <a href="/" className="text-sm text-blue-600 hover:underline">
            ← Run another audit
          </a>
        </div>

        {/* Hero savings card */}
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          {isOptimal ? (
            <>
              <div className="text-4xl mb-2">🎉</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                You're spending well
              </h1>
              <p className="text-gray-500 text-sm">
                Your AI stack looks optimized. We'll notify you when better options appear.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-1 uppercase tracking-wide font-medium">
                Potential monthly savings
              </p>
              <p className="text-6xl font-bold text-blue-600 leading-none">
                ${audit.totalMonthlySavings.toFixed(0)}
              </p>
              <p className="text-gray-400 mt-1 text-sm">
                ${audit.totalAnnualSavings.toFixed(0)} saved annually
              </p>
            </>
          )}
        </div>

        {/* AI Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            AI-Generated Summary
          </h2>
          {summaryLoading ? (
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-4/6" />
            </div>
          ) : (
            <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
          )}
        </div>

        {/* Credex CTA — high savings only */}
        {isHighSavings && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="font-bold text-lg mb-1">
                  Capture this ${audit.totalMonthlySavings.toFixed(0)}/mo in savings
                </h3>
                <p className="text-blue-100 text-sm mb-4">
                  Credex sells discounted AI credits from companies that overforecast —
                  Cursor, Claude, ChatGPT Enterprise. Book a free 20-min call.
                </p>
                <a
                  href="https://credex.rocks"
                  target="_blank"
                  className="inline-block bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-blue-50 transition"
                >
                  Book free consultation →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tool breakdown */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Tool-by-Tool Breakdown
          </h2>
          {audit.results.map((result) => (
            <div
              key={result.tool}
              className={`rounded-xl border p-5 ${severityColors[result.severity]}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {TOOL_LABELS[result.tool]}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityBadge[result.severity]}`}
                  >
                    {severityLabel[result.severity]}
                  </span>
                </div>
                {result.monthlySavings > 0 && (
                  <span className="font-bold text-green-600 text-sm">
                    Save ${result.monthlySavings.toFixed(0)}/mo
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-800 mb-1">
                {result.recommendedAction}
              </p>
              <p className="text-sm text-gray-600 mb-2">{result.reason}</p>
              <div className="flex gap-4 text-xs text-gray-400">
                <span>Current: <strong className="text-gray-600">${result.currentSpend}/mo</strong></span>
                <span>→</span>
                <span>Recommended: <strong className="text-gray-600">${result.estimatedCost.toFixed(0)}/mo</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Email capture */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {emailSubmitted ? (
            <div className="text-center space-y-2">
              <div className="text-3xl">📬</div>
              <p className="font-semibold text-gray-900">Got it!</p>
              <p className="text-sm text-gray-500">
                We'll send your report and notify you when new optimizations apply.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-semibold text-gray-900 mb-1">
                {isOptimal
                  ? "Get notified when new optimizations apply"
                  : "Get the full report in your inbox"}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                No spam. One email with your audit summary.
              </p>
              <form onSubmit={handleEmailCapture} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
  type="text"
  placeholder="Company (optional)"
  value={company}
  onChange={(e) => setCompany(e.target.value)}
  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

                 <input
  type="text"
  placeholder="Your role (optional)"
  value={role}
  onChange={(e) => setRole(e.target.value)}
  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
                </div>
                {/* Honeypot — hidden from real users */}
                <input
                  type="text"
                  name="website"
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition"
                >
                  Send my report →
                </button>
              </form>
            </>
          )}
        </div>

        {/* Share */}
        <div className="flex gap-3 pb-8">
          <button
            onClick={handleCopy}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50 transition"
          >
            {copied ? "✅ Copied!" : "📋 Copy shareable link"}
          </button>
          <a
            href="/"
            className="flex-1 text-center bg-slate-800 text-white font-medium py-2.5 rounded-xl text-sm hover:bg-slate-900 transition"
          >
            ← Audit another stack
          </a>
        </div>
      </div>
    </main>
  );
}