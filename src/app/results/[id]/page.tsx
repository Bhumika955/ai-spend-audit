"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AuditResult } from "@/types";
import { TOOL_LABELS } from "@/lib/pricingData";

const severityColors = {
  high: "bg-red-50 border-red-200 text-red-700",
  medium: "bg-yellow-50 border-yellow-200 text-yellow-700",
  low: "bg-blue-50 border-blue-200 text-blue-700",
  optimal: "bg-green-50 border-green-200 text-green-700",
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

  useEffect(() => {
    fetch(`/api/audit?id=${id}`)
      .then((r) => r.json())
      .then((data) => { setAudit(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading your audit...</p>
    </div>
  );

  if (!audit) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Audit not found. It may have expired.</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Hero savings */}
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Your estimated savings</p>
          <p className="text-5xl font-bold text-blue-600">
            ${audit.totalMonthlySavings.toFixed(0)}
            <span className="text-2xl text-gray-400">/mo</span>
          </p>
          <p className="text-gray-500 mt-1">
            ${audit.totalAnnualSavings.toFixed(0)} annually
          </p>
          {audit.totalMonthlySavings === 0 && (
            <p className="mt-3 text-green-600 font-medium">
              🎉 You're spending well. Your AI stack looks optimized.
            </p>
          )}
        </div>

        {/* Credex CTA for high savings */}
        {audit.totalMonthlySavings > 500 && (
          <div className="bg-blue-600 text-white rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-1">
              You could save ${audit.totalMonthlySavings.toFixed(0)}/mo
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              Credex sells discounted AI credits from companies that overforecast.
              Book a free 20-min consultation to capture these savings.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              className="inline-block bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-blue-50 transition"
            >
              Book free consultation →
            </a>
          </div>
        )}

        {/* Per-tool results */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Tool-by-Tool Breakdown</h2>
          {audit.results.map((result) => (
            <div
              key={result.tool}
              className={`rounded-xl border p-5 ${severityColors[result.severity]}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-semibold text-gray-900">
                    {TOOL_LABELS[result.tool]}
                  </span>
                  <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-white/60">
                    {severityLabel[result.severity]}
                  </span>
                </div>
                {result.monthlySavings > 0 && (
                  <span className="font-bold text-green-600 text-sm">
                    Save ${result.monthlySavings.toFixed(0)}/mo
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Action:</strong> {result.recommendedAction}
              </p>
              <p className="text-sm text-gray-600">{result.reason}</p>
              <div className="mt-2 text-xs text-gray-500">
                Current: ${result.currentSpend}/mo →
                Recommended: ${result.estimatedCost.toFixed(0)}/mo
              </div>
            </div>
          ))}
        </div>

        {/* Share + start over */}
        <div className="flex gap-3">
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50 transition"
          >
            📋 Copy shareable link
          </button>
          <a
            href="/"
            className="flex-1 text-center bg-blue-600 text-white font-medium py-2.5 rounded-xl text-sm hover:bg-blue-700 transition"
          >
            ← Audit another stack
          </a>
        </div>
      </div>
    </main>
  );
}