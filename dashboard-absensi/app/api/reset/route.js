import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type");

  let query = supabase.from("absensi").delete();

  const now = new Date();

  // HARIAN
  if (type === "daily") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    query = query.gte("waktu", start.toISOString());
  }

  // BULANAN
  else if (type === "monthly") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    query = query.gte("waktu", start.toISOString());
  }

  // TAHUNAN
  else if (type === "yearly") {
    const start = new Date(now.getFullYear(), 0, 1);

    query = query.gte("waktu", start.toISOString());
  }

  // ALL
  else if (type === "all") {
    query = supabase.from("absensi").delete().neq("id", 0);
  }

  const { error } = await query;

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }

  return NextResponse.json({
    success: true,
    message: "Data berhasil direset",
  });
}