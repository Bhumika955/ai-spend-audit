import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/auditEngine";
import { FormData } from "@/types";

// In-memory store for now (we add Supabase on Day 5)
const auditStore = new Map<string, object>();

export async function POST(req: NextRequest) {
  try {
    const formData: FormData = await req.json();

    if (!formData.tools || formData.tools.length === 0) {
      return NextResponse.json({ error: "No tools provided" }, { status: 400 });
    }

    const audit = runAudit(formData);
    auditStore.set(audit.id, audit);

    return NextResponse.json({ id: audit.id, audit });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });

  const audit = auditStore.get(id);
  if (!audit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(audit);
}