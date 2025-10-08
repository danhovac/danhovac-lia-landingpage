import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type WaitlistPayload = {
  email?: string;
  name?: string;
  consent?: boolean;
  locale?: string;
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL environment variable");
}

if (!supabaseServiceKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const waitlistTable = process.env.SUPABASE_WAITLIST_TABLE ?? "Lia_beta_users";
const waitlistConflictTarget = process.env.SUPABASE_WAITLIST_CONFLICT_TARGET ?? "email";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WaitlistPayload;
    const rawEmail = body.email?.trim().toLowerCase();
    const name = body.name?.trim();
    const consent = Boolean(body.consent);
    const locale = typeof body.locale === "string" ? body.locale : null;

    if (!rawEmail || !emailRegex.test(rawEmail)) {
      return NextResponse.json(
        { success: false, message: "유효한 이메일 주소를 입력해주세요." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { success: false, message: "개인정보 처리 및 뉴스레터 수신 동의가 필요합니다." },
        { status: 400 }
      );
    }

    const record: Record<string, unknown> = {
      email: rawEmail,
      name: name || null,
      consent,
      locale,
      submitted_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from(waitlistTable)
      .upsert(record, { onConflict: waitlistConflictTarget });

    if (error) {
      if (error.code === "42703") {
        const minimalRecord: Record<string, unknown> = {
          email: rawEmail,
          name: name || null,
        };

        const { error: minimalError } = await supabase
          .from(waitlistTable)
          .upsert(minimalRecord, { onConflict: waitlistConflictTarget });

        if (minimalError && minimalError.code !== "23505") {
          throw minimalError;
        }
      } else if (error.code === "PGRST204") {
        const { error: insertError } = await supabase
          .from(waitlistTable)
          .insert(record);

        if (insertError && insertError.code !== "23505") {
          throw insertError;
        }
      } else if (error.code !== "23505") {
        throw error;
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("waitlist submission failed", error);

    return NextResponse.json(
      { success: false, message: "대기자 명단 저장 중 문제가 발생했습니다." },
      { status: 500 }
    );
  }
}
