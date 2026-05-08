"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TOOL_LABELS, PLANS_BY_TOOL } from "@/lib/pricingData";
import { FormData, ToolEntry, ToolName, UseCase } from "@/types";

const ALL_TOOLS = Object.keys(TOOL_LABELS) as ToolName[];

const DEFAULT_ENTRY = (tool: ToolName): ToolEntry => ({
  tool,
  plan: Object.keys(PLANS_BY_TOOL[tool]?.[0] ?? {})[0] ?? PLANS_BY_TOOL[tool][0],
  monthlySpend: 0,
  seats: 1,
});

export default function SpendForm() {
  const router = useRouter();
  const [selectedTools, setSelectedTools] = useState<ToolName[]>([]);
  const [toolEntries, setToolEntries] = useState<Record<ToolName, ToolEntry>>(
    {} as Record<ToolName, ToolEntry>
  );
  const [teamSize, setTeamSize] = useState(1);
  const [useCase, setUseCase] = useState<UseCase>("coding");
  const [loading, setLoading] = useState(false);

  // Persist form state across reloads
  useEffect(() => {
    const saved = localStorage.getItem("ai-audit-form");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedTools(parsed.selectedTools || []);
      setToolEntries(parsed.toolEntries || {});
      setTeamSize(parsed.teamSize || 1);
      setUseCase(parsed.useCase || "coding");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ai-audit-form",
      JSON.stringify({ selectedTools, toolEntries, teamSize, useCase })
    );
  }, [selectedTools, toolEntries, teamSize, useCase]);

  const toggleTool = (tool: ToolName) => {
    setSelectedTools((prev) =>
      prev.includes(tool)
        ? prev.filter((t) => t !== tool)
        : [...prev, tool]
    );
    if (!toolEntries[tool]) {
      setToolEntries((prev) => ({ ...prev, [tool]: DEFAULT_ENTRY(tool) }));
    }
  };

  const updateEntry = (tool: ToolName, field: keyof ToolEntry, value: string | number) => {
    setToolEntries((prev) => ({
      ...prev,
      [tool]: { ...prev[tool], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    if (selectedTools.length === 0) return;
    setLoading(true);
    const formData: FormData = {
      tools: selectedTools.map((t) => toolEntries[t]),
      teamSize,
      useCase,
    };
    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    router.push(`/results/${data.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Team info */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Team</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Size
            </label>
            <input
              type="number"
              min={1}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Use Case
            </label>
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value as UseCase)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {["coding", "writing", "data", "research", "mixed"].map((uc) => (
                <option key={uc} value={uc}>
                  {uc.charAt(0).toUpperCase() + uc.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tool selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Select AI Tools You Pay For
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ALL_TOOLS.map((tool) => (
            <button
              key={tool}
              onClick={() => toggleTool(tool)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                selectedTools.includes(tool)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
              }`}
            >
              {TOOL_LABELS[tool]}
            </button>
          ))}
        </div>
      </div>

      {/* Per-tool details */}
      {selectedTools.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Tool Details</h2>
          {selectedTools.map((tool) => (
            <div
              key={tool}
              className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50"
            >
              <h3 className="font-medium text-gray-900">{TOOL_LABELS[tool]}</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Plan</label>
                  <select
                    value={toolEntries[tool]?.plan}
                    onChange={(e) => updateEntry(tool, "plan", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PLANS_BY_TOOL[tool].map((plan) => (
                      <option key={plan} value={plan}>
                        {plan.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Monthly Spend ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={toolEntries[tool]?.monthlySpend}
                    onChange={(e) =>
                      updateEntry(tool, "monthlySpend", Number(e.target.value))
                    }
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Seats</label>
                  <input
                    type="number"
                    min={1}
                    value={toolEntries[tool]?.seats}
                    onChange={(e) =>
                      updateEntry(tool, "seats", Number(e.target.value))
                    }
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={selectedTools.length === 0 || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-all text-base"
      >
        {loading ? "Analyzing your stack..." : "Get My Free Audit →"}
      </button>
    </div>
  );
}