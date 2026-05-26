"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Jamaah {
  id: number;
  nama: string;
  uid: string;
}

const THEME = {
  dark: "#0f2626",
  darkAlt: "#1a3a3a",
  gold: "#d4af37",
  goldLight: "#e8c94d",
  grayText: "#a0a0a0",
  white: "#ffffff",
  accentGreen: "#2d5f5f",
};

export default function AdminPage() {
  const [jamaah, setJamaah] = useState<Jamaah[]>([]);
  const [nama, setNama] = useState("");
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJamaah();
    fetchPendingRFID();

    // auto refresh pending RFID tiap 2 detik
    const interval = setInterval(() => {
      fetchPendingRFID();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // FETCH DATA JAMAAH
  // =========================
  async function fetchJamaah() {
    try {
      const { data, error } = await supabase
        .from("jamaah")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.log(error);
        alert("Gagal mengambil data jamaah");
        return;
      }

      setJamaah(data || []);
    } catch (err) {
      console.log(err);
      alert("Terjadi error");
    }
  }

  // =========================
  // FETCH UID RFID BARU
  // =========================
  async function fetchPendingRFID() {
    try {
      const { data, error } = await supabase
        .from("pending_rfid")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setUid(data.uid);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // =========================
  // TAMBAH JAMAAH
  // =========================
  async function tambahJamaah() {
    if (!nama || !uid) {
      alert("Nama dan UID wajib diisi");
      return;
    }

    try {
      setLoading(true);

      // cek duplicate uid
      const { data: cekUid } = await supabase
        .from("jamaah")
        .select("*")
        .eq("uid", uid)
        .maybeSingle();

      if (cekUid) {
        alert("UID sudah terdaftar");
        setLoading(false);
        return;
      }

      // insert jamaah
      const { error } = await supabase
        .from("jamaah")
        .insert([
          {
            nama,
            uid,
          },
        ]);

      if (error) {
        console.log(error);
        alert("Gagal tambah jamaah");
        setLoading(false);
        return;
      }

      // hapus pending RFID
      await supabase
        .from("pending_rfid")
        .delete()
        .eq("uid", uid);

      alert("Jamaah berhasil ditambahkan");

      setNama("");
      setUid("");

      await fetchJamaah();

    } catch (err) {
      console.log(err);
      alert("Terjadi error");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // HAPUS JAMAAH
  // =========================
  async function hapusJamaah(uid: string) {
    const confirmDelete = confirm(
      "Yakin ingin menghapus jamaah ini?"
    );

    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("jamaah")
        .delete()
        .eq("uid", uid);

      if (error) {
        console.log(error);
        alert("Gagal menghapus jamaah");
        return;
      }

      alert("Jamaah berhasil dihapus");

      await fetchJamaah();

    } catch (err) {
      console.log(err);
      alert("Terjadi error");
    }
  }

  return (
    <div
      style={{
        backgroundColor: THEME.dark,
        backgroundImage: `linear-gradient(135deg, ${THEME.dark} 0%, ${THEME.darkAlt} 100%)`,
      }}
      className="min-h-screen"
    >
      {/* NAVBAR */}
      <nav
        style={{ backgroundColor: THEME.darkAlt }}
        className="border-b border-gray-700 px-6 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <img
            src="/logo_masjid_makan_makan.png"
            alt="Logo Masjid"
            className="h-14 w-auto"
          />

          <div className="flex flex-col">
            <h1
              style={{ color: THEME.gold }}
              className="text-2xl font-bold leading-tight"
            >
              Sistem Absensi
            </h1>

            <p
              style={{ color: THEME.grayText }}
              className="text-sm"
            >
              Masjid Makan-Makan
            </p>
          </div>
        </div>

        <Link
          href="/"
          style={{
            backgroundColor: THEME.gold,
            color: THEME.dark,
          }}
          className="px-6 py-2 rounded-lg font-bold hover:opacity-90 transition"
        >
          ← Kembali
        </Link>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div
          style={{
            backgroundColor: THEME.darkAlt,
            borderColor: THEME.gold,
          }}
          className="border rounded-2xl p-8 mb-10"
        >
          <h1
            style={{ color: THEME.white }}
            className="text-4xl font-bold mb-2 font-serif"
          >
            👥 Kelola Jamaah
          </h1>

          <p
            style={{ color: THEME.grayText }}
            className="text-lg"
          >
            Tambah dan kelola data jamaah dengan UID RFID
          </p>
        </div>

        {/* FORM */}
        <div
          style={{
            backgroundColor: THEME.darkAlt,
            borderColor: THEME.gold,
          }}
          className="border rounded-2xl p-8 mb-10"
        >
          <h2
            style={{ color: THEME.gold }}
            className="text-2xl font-bold mb-8 font-serif"
          >
            ➕ Tambah Data Jamaah
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* INPUT NAMA */}
            <input
              type="text"
              placeholder="Nama Jamaah"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              style={{
                backgroundColor: THEME.dark,
                borderColor: THEME.gold,
                color: THEME.white,
              }}
              className="border px-4 py-3 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            />

            {/* INPUT UID */}
            <input
              type="text"
              placeholder="UID RFID"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              style={{
                backgroundColor: THEME.dark,
                borderColor: THEME.gold,
                color: THEME.white,
              }}
              className="border px-4 py-3 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            />

            {/* BUTTON */}
            <button
              onClick={tambahJamaah}
              disabled={loading}
              style={{
                backgroundColor: loading
                  ? THEME.grayText
                  : THEME.gold,
                color: THEME.dark,
              }}
              className="font-bold rounded-lg hover:opacity-90 transition disabled:opacity-60"
            >
              {loading
                ? "⏳ Loading..."
                : "✓ Tambah"}
            </button>

          </div>
        </div>

        {/* TABLE */}
        <div
          style={{ backgroundColor: THEME.darkAlt }}
          className="rounded-2xl overflow-hidden border border-gray-700 shadow-2xl"
        >
          {/* HEADER TABLE */}
          <div
            style={{
              backgroundColor: THEME.accentGreen,
              borderBottomColor: THEME.gold,
            }}
            className="px-8 py-6 border-b"
          >
            <h2
              style={{ color: THEME.white }}
              className="text-2xl font-bold font-serif"
            >
              📋 Data Jamaah
            </h2>

            <p
              style={{ color: THEME.grayText }}
              className="text-sm mt-1"
            >
              Total {jamaah.length} jamaah terdaftar
            </p>
          </div>

          {/* EMPTY */}
          {jamaah.length === 0 ? (
            <div
              style={{ color: THEME.grayText }}
              className="p-12 text-center"
            >
              <div className="text-5xl mb-4">
                📭
              </div>

              <p className="text-lg">
                Belum ada data jamaah
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">

                <thead>
                  <tr
                    style={{
                      backgroundColor:
                        "rgba(212, 175, 55, 0.05)",
                      borderBottomColor: THEME.gold,
                    }}
                    className="border-b"
                  >
                    <th
                      style={{ color: THEME.gold }}
                      className="px-6 py-4 text-left text-sm font-semibold"
                    >
                      NO
                    </th>

                    <th
                      style={{ color: THEME.gold }}
                      className="px-6 py-4 text-left text-sm font-semibold"
                    >
                      NAMA JAMAAH
                    </th>

                    <th
                      style={{ color: THEME.gold }}
                      className="px-6 py-4 text-left text-sm font-semibold"
                    >
                      UID RFID
                    </th>

                    <th
                      style={{ color: THEME.gold }}
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      AKSI
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {jamaah.map((item, index) => (
                    <tr
                      key={item.uid}
                      style={{
                        borderBottomColor:
                          "rgba(212, 175, 55, 0.1)",
                      }}
                      className="border-b hover:bg-gray-800/50 transition-all"
                    >
                      {/* NO */}
                      <td className="px-6 py-5">
                        <div
                          style={{
                            backgroundColor: THEME.gold,
                            color: THEME.dark,
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                        >
                          {index + 1}
                        </div>
                      </td>

                      {/* NAMA */}
                      <td className="px-6 py-5">
                        <p
                          style={{ color: THEME.white }}
                          className="font-semibold"
                        >
                          {item.nama}
                        </p>
                      </td>

                      {/* UID */}
                      <td className="px-6 py-5">
                        <p
                          style={{ color: THEME.grayText }}
                          className="font-mono text-sm"
                        >
                          {item.uid}
                        </p>
                      </td>

                      {/* HAPUS */}
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() =>
                            hapusJamaah(item.uid)
                          }
                          style={{
                            backgroundColor: "#dc2626",
                            color: THEME.white,
                          }}
                          className="px-5 py-2 rounded-lg font-bold hover:opacity-90 transition"
                        >
                          🗑️ Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </main>

      {/* FOOTER */}
      <footer
        style={{ color: THEME.grayText }}
        className="py-12 text-center text-sm border-t border-gray-700 mt-16"
      >
        <p>
          Sistem Absensi Masjid RFID • Powered by
          Next.js & Supabase
        </p>
      </footer>

      {/* FONT */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@400;500;600;700&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }

        h1, h2, h3, .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
    </div>
  );
}