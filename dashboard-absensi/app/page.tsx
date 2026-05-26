'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface AbsensiRecord {
  id?: number;
  waktu: string;
  jamaah?: {
    nama: string;
  };
}

type LoadingState = 'loading' | 'success' | 'error' | 'empty';

const THEME = {
  dark: '#0f2626',
  darkAlt: '#1a3a3a',
  gold: '#d4af37',
  goldLight: '#e8c94d',
  grayText: '#a0a0a0',
  white: '#ffffff',
  accentGreen: '#2d5f5f',
};

export default function Home() {
  const [data, setData] = useState<AbsensiRecord[]>([]);
  const [status, setStatus] = useState<LoadingState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchAbsensi();
  }, []);

  const fetchAbsensi = async () => {
    try {
      setStatus('loading');

      const { data, error } = await supabase
        .from('absensi')
        .select(`
          id,
          waktu,
          jamaah(nama)
        `)
        .order('waktu', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setData([]);
        setStatus('empty');
        return;
      }

      setData(data);
      setStatus('success');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Terjadi kesalahan'
      );
      setStatus('error');
    }
  };

  const totalHadir = data.length;

  const hari = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
  });

  const tanggal = new Date().toLocaleDateString('id-ID');

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
      </nav>



      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* STATS CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* HARI */}
          <div
            style={{
              backgroundColor: THEME.darkAlt,
              borderColor: THEME.gold,
            }}
            className="border rounded-2xl p-8 backdrop-blur-md"
          >
            <p style={{ color: THEME.grayText }} className="text-sm mb-2 font-semibold tracking-wide">
              HARI
            </p>
            <h2 style={{ color: THEME.white }} className="text-3xl font-bold capitalize font-serif">
              {hari}
            </h2>
          </div>

          {/* TANGGAL */}
          <div
            style={{
              backgroundColor: THEME.darkAlt,
              borderColor: THEME.gold,
            }}
            className="border rounded-2xl p-8 backdrop-blur-md"
          >
            <p style={{ color: THEME.grayText }} className="text-sm mb-2 font-semibold tracking-wide">
              TANGGAL
            </p>
            <h2 style={{ color: THEME.white }} className="text-3xl font-bold font-serif">
              {tanggal}
            </h2>
          </div>

          {/* TOTAL HADIR */}
          <div
            style={{
              backgroundColor: THEME.darkAlt,
              borderColor: THEME.gold,
            }}
            className="border rounded-2xl p-8 backdrop-blur-md"
          >
            <p style={{ color: THEME.grayText }} className="text-sm mb-2 font-semibold tracking-wide">
              TOTAL HADIR
            </p>
            <h2 style={{ color: THEME.gold }} className="text-5xl font-bold font-serif">
              {totalHadir}
            </h2>
          </div>
        </section>

        {/* MENU CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Ranking */}
          <Link
            href="/ranking"
            style={{
              backgroundColor: THEME.darkAlt,
              borderColor: THEME.gold,
            }}
            className="border rounded-2xl p-8 hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="text-5xl mb-6 group-hover:scale-110 transition">🏆</div>
            <h2 style={{ color: THEME.gold }} className="text-2xl font-bold mb-3 font-serif">
              Ranking Jamaah
            </h2>
            <p style={{ color: THEME.grayText }} className="text-sm">
              Lihat jamaah paling rajin dan konsisten hadir
            </p>
          </Link>

          {/* Admin */}
          <Link
            href="/admin"
            style={{
              backgroundColor: THEME.darkAlt,
              borderColor: THEME.gold,
            }}
            className="border rounded-2xl p-8 hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="text-5xl mb-6 group-hover:scale-110 transition">👤</div>
            <h2 style={{ color: THEME.gold }} className="text-2xl font-bold mb-3 font-serif">
              Tambah Jamaah
            </h2>
            <p style={{ color: THEME.grayText }} className="text-sm">
              Daftarkan nama jamaah & UID RFID baru
            </p>
          </Link>

          {/* Manage */}
          <Link
            href="/manage"
            style={{
              backgroundColor: THEME.darkAlt,
              borderColor: THEME.gold,
            }}
            className="border rounded-2xl p-8 hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="text-5xl mb-6 group-hover:scale-110 transition">⚙️</div>
            <h2 style={{ color: THEME.gold }} className="text-2xl font-bold mb-3 font-serif">
              Kelola Data
            </h2>
            <p style={{ color: THEME.grayText }} className="text-sm">
              Hapus data & reset absensi
            </p>
          </Link>
        </section>

        {/* LOADING STATE */}
        {status === 'loading' && (
          <div
            style={{ backgroundColor: THEME.darkAlt }}
            className="rounded-2xl p-12 text-center border border-gray-700"
          >
            <div className="text-6xl mb-6 animate-pulse">⏳</div>
            <h2 style={{ color: THEME.white }} className="text-2xl font-bold font-serif">
              Memuat Data Absensi...
            </h2>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'error' && (
          <div
            style={{
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              borderColor: '#dc2626',
            }}
            className="border-l-4 rounded-2xl p-10"
          >
            <h2 style={{ color: '#ef4444' }} className="text-2xl font-bold mb-4 font-serif">
              ⚠️ Terjadi Kesalahan
            </h2>
            <p style={{ color: '#fca5a5' }} className="mb-6">
              {errorMessage}
            </p>
            <button
              onClick={fetchAbsensi}
              style={{
                backgroundColor: '#dc2626',
                color: THEME.white,
              }}
              className="px-6 py-3 rounded-lg font-bold hover:opacity-90 transition"
            >
              🔄 Coba Lagi
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {status === 'empty' && (
          <div
            style={{
              backgroundColor: THEME.darkAlt,
              borderColor: THEME.gold,
            }}
            className="border rounded-2xl p-12 text-center"
          >
            <div className="text-7xl mb-6">📭</div>
            <h2 style={{ color: THEME.white }} className="text-3xl font-bold mb-3 font-serif">
              Belum Ada Data Absensi
            </h2>
            <p style={{ color: THEME.grayText }} className="text-lg">
              Mulai dengan menambahkan jamaah dan RFID tag
            </p>
          </div>
        )}

        {/* TABLE */}
        {status === 'success' && (
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
              className="px-8 py-8 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div>
                <h2 style={{ color: THEME.white }} className="text-2xl font-bold font-serif mb-2">
                  📋 Riwayat Kehadiran
                </h2>
                <p style={{ color: THEME.grayText }} className="text-sm">
                  Total {data.length} jamaah hadir
                </p>
              </div>
              <button
                onClick={fetchAbsensi}
                style={{
                  backgroundColor: THEME.gold,
                  color: THEME.dark,
                }}
                className="px-6 py-3 rounded-lg font-bold hover:opacity-90 transition whitespace-nowrap"
              >
                🔄 Refresh
              </button>
            </div>

            {/* TABLE CONTENT */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderBottomColor: THEME.gold }} className="border-b">
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
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
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
                        <div className="flex items-center gap-3">
                          <div
                            style={{
                              backgroundColor: THEME.gold,
                              color: THEME.dark,
                            }}
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                          >
                            {item.jamaah?.nama?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <p style={{ color: THEME.white }} className="font-semibold">
                              {item.jamaah?.nama || 'Unknown'}
                            </p>
                            <p style={{ color: THEME.grayText }} className="text-xs">
                              Jamaah
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* WAKTU */}
                      <td className="px-6 py-5">
                        <p style={{ color: THEME.white }} className="font-medium">
                          {formatDateTime(item.waktu)}
                        </p>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5 text-center">
                        <span
                          style={{
                            backgroundColor: 'rgba(212, 175, 55, 0.15)',
                            color: THEME.gold,
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm"
                        >
                          <span
                            style={{ backgroundColor: THEME.gold }}
                            className="w-2 h-2 rounded-full"
                          ></span>
                          Hadir
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ color: THEME.grayText }} className="py-12 text-center text-sm border-t border-gray-700 mt-16">
        <p className="mb-2">Sistem Absensi Masjid RFID • Powered by Next.js & Supabase</p>
        <p style={{ color: THEME.gold }}>✨ Jaga Istiqomah Ibadahmu ✨</p>
      </footer>

      {/* GOOGLE FONTS LINK */}
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

/**
 * Format datetime to Indonesian locale with timezone
 * Handles invalid dates gracefully
 */
function formatDateTime(waktu: string): string {
  try {
    const date = new Date(waktu);

    // Validate the date
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return date.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + ' WIB';
  } catch {
    return 'Invalid date';
  }
}