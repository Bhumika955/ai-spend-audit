import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/auditEngine";
import { FormData } from "@/types";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData: FormData = await req.json();

    if (!formData.tools || formData.tools.length === 0) {
      return NextResponse.json({ error: "No tools provided" }, { status: 400 });
    }

    const audit = runAudit(formData);

    // Persist to Supabase
    const { error } = await supabaseAdmin
      .from("audits")
      .insert({ id: audit.id, data: audit });

    if (error) console.error("Supabase insert error:", error);

    const response = NextResponse.json({ id: audit.id, audit });
    response.cookies.set(`audit_${audit.id}`, JSON.stringify(audit), {
      maxAge: 60 * 60 * 24,
      httpOnly: false,
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });

  // Fetch from Supabase
  const { data, error } = await supabaseAdmin
    .from("audits")
    .select("data")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data.data);
}