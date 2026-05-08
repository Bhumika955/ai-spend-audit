import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Simple in-memory rate limiter (per IP, max 3 per hour)
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const hits = (rateLimitMap.get(ip) || []).filter((t) => now - t < windowMs);
  hits.push(now);
  rateLimitMap.set(ip, hits);
  return hits.length > 3;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

    const body = await req.json();

    // Honeypot check — bots fill hidden fields
    if (body.website) {
      return NextResponse.json({ ok: true }); // Silently accept but don't store
    }

    const {
      email,
      company,
      role,
      auditId,
      tools,
      totalMonthlySavings,
      totalAnnualSavings,
      useCase,
      teamSize,
    } = body;

    if (!email || !auditId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const isHighSavings = totalMonthlySavings > 500;

    const { error } = await supabaseAdmin.from("leads").insert({
      audit_id: auditId,
      email,
      company: company || null,
      role: role || null,
      tools,
      total_monthly_savings: totalMonthlySavings,
      total_annual_savings: totalAnnualSavings,
      use_case: useCase,
      team_size: teamSize,
      is_high_savings: isHighSavings,
    });

    if (error) {
      console.error("Lead insert error:", error);
      return NextResponse.json({ error: "Storage failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, isHighSavings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}