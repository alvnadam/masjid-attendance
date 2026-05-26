import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(req) {
  const body = await req.json();

  const { id } = body;

  const { error } = await supabase
    .from("absensi")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }

  return NextResponse.json({
    success: true,
    message: "Data berhasil dihapus",
  });
}