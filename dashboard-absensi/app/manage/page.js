'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const THEME = {
  dark: '#0f2626',
  darkAlt: '#1a3a3a',
  gold: '#d4af37',
  goldLight: '#e8c94d',
  grayText: '#a0a0a0',
  white: '#ffffff',
  accentGreen: '#2d5f5f',
};

export default function ManagePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbsensi();
  }, []);

  async function fetchAbsensi() {
    setLoading(true);

    const { data, error } = await supabase
      .from('absensi')
      .select(`
        id,
        waktu,
        jamaah (
          nama
        )
      `)
      .order('waktu', { ascending: false });

    if (!error) {
      setData(data || []);
    }

    setLoading(false);
  }

  // =========================
  // HAPUS SATU DATA
  // =========================
  async function handleDelete(id) {
    const confirmDelete = confirm(
      'Yakin ingin menghapus data ini?'
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from('absensi')
      .delete()
      .eq('id', id);

    if (!error) {
      alert('Data berhasil dihapus');
      fetchAbsensi();
    } else {
      alert('Gagal menghapus data');
    }
  }

  // =========================
  // RESET DATA
  // =========================
  async function handleReset(type) {
    const confirmReset = confirm(
      `Yakin reset data ${type}?`
    );

    if (!confirmReset) return;

    let query = supabase.from('absensi').delete();

    const now = new Date();

    // HARIAN
    if (type === 'harian') {
      const today = now.toISOString().split('T')[0];

      query = query.gte('waktu', today);
    }

    // BULANAN
    if (type === 'bulanan') {
      const firstDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      query = query.gte(
        'waktu',
        firstDay.toISOString()
      );
    }

    // TAHUNAN
    if (type === 'tahunan') {
      const firstYear = new Date(
        now.getFullYear(),
        0,
        1
      );

      query = query.gte(
        'waktu',
        firstYear.toISOString()
      );
    }

    // SEMUA
    if (type === 'semua') {
      query = supabase
        .from('absensi')
        .delete()
        .neq('id', 0);
    }

    const { error } = await query;

    if (!error) {
      alert(`Reset ${type} berhasil`);
      fetchAbsensi();
    } else {
      alert('Gagal reset data');
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
            alt="Logo Masjid Makan-Makan"
            className="h-14 w-auto"
          />
          <div className="flex flex-col">
            <h1 style={{ color: THEME.gold }} className="text-2xl font-bold leading-tight">
              Sistem Absensi
            </h1>
            <p style={{ color: THEME.grayText }} className="text-sm">
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

        {/* PAGE HEADER */}
        <div
          style={{ backgroundColor: THEME.darkAlt, borderColor: THEME.gold }}
          className="border rounded-2xl p-8 mb-10"
        >
          <h1 style={{ color: THEME.white }} className="text-4xl font-bold mb-3 font-serif">
            ⚙️ Kelola Data
          </h1>
          <p style={{ color: THEME.grayText }} className="text-lg">
            Hapus data ganda dan reset data absensi sesuai periode
          </p>
        </div>

        {/* RESET BUTTONS */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

          {/* RESET HARIAN */}
          <button
            onClick={() => handleReset('harian')}
            style={{
              backgroundColor: THEME.darkAlt,
              borderColor: '#3b82f6',
            }}
            className="border rounded-2xl p-6 hover:scale-105 transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition">🗓️</div>
            <p style={{ color: THEME.gold }} className="font-bold text-lg">
              Reset Harian
            </p>
            <p style={{ color: THEME.grayText }} className="text-sm mt-1">
              Reset absensi hari ini
            </p>
          </button>

          {/* RESET BULANAN */}
          <button
            onClick={() => handleReset('bulanan')}
            style={{
              backgroundColor: THEME.darkAlt,
              borderColor: '#f59e0b',
            }}
            className="border rounded-2xl p-6 hover:scale-105 transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition">📅</div>
            <p style={{ color: THEME.gold }} className="font-bold text-lg">
              Reset Bulanan
            </p>
            <p style={{ color: THEME.grayText }} className="text-sm mt-1">
              Reset absensi bulan ini
            </p>
          </button>

          {/* RESET TAHUNAN */}
          <button
            onClick={() => handleReset('tahunan')}
            style={{
              backgroundColor: THEME.darkAlt,
              borderColor: '#a855f7',
            }}
            className="border rounded-2xl p-6 hover:scale-105 transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition">📆</div>
            <p style={{ color: THEME.gold }} className="font-bold text-lg">
              Reset Tahunan
            </p>
            <p style={{ color: THEME.grayText }} className="text-sm mt-1">
              Reset absensi tahun ini
            </p>
          </button>

          {/* RESET SEMUA */}
          <button
            onClick={() => handleReset('semua')}
            style={{
              backgroundColor: THEME.darkAlt,
              borderColor: '#dc2626',
            }}
            className="border rounded-2xl p-6 hover:scale-105 transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition">🗑️</div>
            <p style={{ color: '#ef4444' }} className="font-bold text-lg">
              Reset Semua
            </p>
            <p style={{ color: THEME.grayText }} className="text-sm mt-1">
              Reset seluruh data absensi
            </p>
          </button>

        </section>

        {/* TABLE DATA ABSENSI */}
        <div
          style={{ backgroundColor: THEME.darkAlt }}
          className="rounded-2xl overflow-hidden border border-gray-700 shadow-2xl"
        >
          {/* TABLE HEADER */}
          <div
            style={{
              backgroundColor: THEME.accentGreen,
              borderBottomColor: THEME.gold,
            }}
            className="px-8 py-6 border-b"
          >
            <h2 style={{ color: THEME.white }} className="text-2xl font-bold font-serif">
              📋 Data Absensi
            </h2>
            <p style={{ color: THEME.grayText }} className="text-sm mt-1">
              Total {data.length} data absensi
            </p>
          </div>

          {/* TABLE CONTENT */}
          {loading ? (
            <div
              style={{ color: THEME.grayText }}
              className="p-12 text-center"
            >
              <div className="text-5xl mb-4 animate-pulse">⏳</div>
              <p className="text-lg">Memuat data...</p>
            </div>
          ) : data.length === 0 ? (
            <div
              style={{ color: THEME.grayText }}
              className="p-12 text-center"
            >
              <div className="text-5xl mb-4">📭</div>
              <p className="text-lg">Belum ada data absensi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.05)',
                      borderBottomColor: THEME.gold,
                    }}
                    className="border-b"
                  >
                    <th style={{ color: THEME.gold }} className="px-6 py-4 text-left text-sm font-semibold">
                      NO
                    </th>
                    <th style={{ color: THEME.gold }} className="px-6 py-4 text-left text-sm font-semibold">
                      NAMA JAMAAH
                    </th>
                    <th style={{ color: THEME.gold }} className="px-6 py-4 text-left text-sm font-semibold">
                      WAKTU
                    </th>
                    <th style={{ color: THEME.gold }} className="px-6 py-4 text-center text-sm font-semibold">
                      AKSI
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={item.id}
                      style={{ borderBottomColor: 'rgba(212, 175, 55, 0.1)' }}
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
                        <p style={{ color: THEME.white }} className="font-semibold">
                          {item.jamaah?.nama || 'Unknown'}
                        </p>
                      </td>

                      {/* WAKTU */}
                      <td className="px-6 py-5">
                        <p style={{ color: THEME.grayText }} className="text-sm">
                          {new Date(item.waktu).toLocaleString('id-ID', {
                            timeZone: 'Asia/Jakarta',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </p>
                      </td>

                      {/* AKSI */}
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            backgroundColor: '#dc2626',
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
      <footer style={{ color: THEME.grayText }} className="py-12 text-center text-sm border-t border-gray-700 mt-16">
        <p>Sistem Absensi Masjid RFID • Powered by Next.js & Supabase</p>
      </footer>

      {/* FONTS */}
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