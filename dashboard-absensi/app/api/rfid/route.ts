import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "API RFID aktif",
  });
}

export async function POST(req: Request) {
  try {

    // =========================
    // AMBIL UID
    // =========================
    const body = await req.json();
    const uid = body.uid?.toLowerCase().trim();

    if (!uid) {
      return NextResponse.json({
        success: false,
        message: "UID kosong",
      });
    }

    console.log("UID MASUK:", uid);

    // =========================
    // CEK UID DI JAMAAH
    // =========================
    const { data: jamaah, error: jamaahError } =
      await supabase
        .from("jamaah")
        .select("*")
        .eq("uid", uid)
        .maybeSingle();

    // =========================
    // JIKA BELUM TERDAFTAR
    // =========================
    if (!jamaah || jamaahError) {

      console.log("UID BELUM TERDAFTAR");

      // simpan ke pending_rfid
      const { error: pendingError } =
        await supabase
          .from("pending_rfid")
          .upsert([
            {
              uid: uid,
            },
          ]);

      if (pendingError) {
        console.log("ERROR PENDING RFID:", pendingError);
      }

      return NextResponse.json({
        success: false,
        message: "UID belum terdaftar",
        uid,
      });
    }

    // =========================
    // CEK ABSEN HARI INI
    // =========================
    const today = new Date()
      .toISOString()
      .split("T")[0];

    const { data: sudahAbsen } =
      await supabase
        .from("absensi")
        .select("*")
        .eq("uid", uid)
        .eq("tanggal", today)
        .maybeSingle();

    // =========================
    // SUDAH ABSEN
    // =========================
    if (sudahAbsen) {

      console.log("SUDAH ABSEN");

      return NextResponse.json({
        success: false,
        message: "Anda sudah absen hari ini",
      });
    }

    // =========================
    // SIMPAN ABSENSI
    // =========================
    const { error: insertError } =
      await supabase
        .from("absensi")
        .insert([
          {
            uid,
            waktu: new Date().toISOString(),
            tanggal: today,
          },
        ]);

    if (insertError) {

      console.log("ERROR INSERT:", insertError);

      return NextResponse.json({
        success: false,
        message: "Gagal simpan absensi",
      });
    }

    console.log("ABSENSI BERHASIL");

    return NextResponse.json({
      success: true,
      message: `Absensi berhasil - ${jamaah.nama}`,
    });

  } catch (error) {

    console.log("SERVER ERROR:", error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}