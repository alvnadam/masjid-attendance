"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const THEME = {
  dark: "#0f2626",
  darkAlt: "#1a3a3a",
  gold: "#d4af37",
  grayText: "#a0a0a0",
  white: "#ffffff",
  accentGreen: "#2d5f5f",
};

export default function Ranking() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH DATA
  // =========================
  async function fetchData() {
    try {
      setLoading(true);

      const { data, error } = await supabase.rpc(
        "ranking_jamaah"
      );

      if (error) {
        console.log(error);

        setError(
          error.message ||
            "Gagal mengambil data ranking"
        );

        setData([]);
        return;
      }

      setData(data || []);
      setError("");
    } catch (err) {
      console.log(err);

      setError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // LOAD AWAL
  // =========================
  useEffect(() => {
    fetchData();
  }, []);

  const chartColors = [
    "#d4af37",
    "#60a5fa",
    "#34d399",
    "#a78bfa",
    "#f59e0b",
  ];

  const topThree = data.slice(0, 3);

  const medalIcons = ["🥇", "🥈", "🥉"];

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
            alt="Logo"
            className="h-14 w-auto"
          />

          <div>
            <h1
              style={{ color: THEME.gold }}
              className="text-2xl font-bold"
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
          className="px-6 py-2 rounded-lg font-bold"
        >
          ← Kembali
        </Link>
      </nav>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1
            style={{ color: THEME.white }}
            className="text-5xl font-bold mb-3"
          >
            🏆 Ranking Jamaah
          </h1>

          <p
            style={{ color: THEME.grayText }}
            className="text-lg"
          >
            Ranking berdasarkan jumlah kehadiran
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div
            style={{ backgroundColor: THEME.darkAlt }}
            className="rounded-2xl p-12 text-center"
          >
            <div className="text-6xl mb-4 animate-pulse">
              ⏳
            </div>

            <p
              style={{ color: THEME.white }}
              className="text-xl font-semibold"
            >
              Memuat data ranking...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500 rounded-2xl p-6 mb-8">
            <p className="text-red-300">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          data.length === 0 && (
            <div
              style={{
                backgroundColor: THEME.darkAlt,
              }}
              className="rounded-2xl p-12 text-center"
            >
              <div className="text-6xl mb-4">
                📭
              </div>

              <p
                style={{ color: THEME.white }}
                className="text-2xl font-bold mb-2"
              >
                Belum Ada Data
              </p>

              <p
                style={{ color: THEME.grayText }}
              >
                Belum ada absensi jamaah
              </p>
            </div>
          )}

        {/* CONTENT */}
        {!loading &&
          !error &&
          data.length > 0 && (
            <>
              {/* TOP 3 */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {topThree.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        THEME.darkAlt,
                      borderColor: THEME.gold,
                    }}
                    className="border rounded-2xl p-8 text-center"
                  >
                    <div className="text-7xl mb-4">
                      {medalIcons[index]}
                    </div>

                    <h2
                      style={{
                        color: THEME.white,
                      }}
                      className="text-3xl font-bold mb-3"
                    >
                      {item.nama}
                    </h2>

                    <div
                      style={{
                        backgroundColor:
                          THEME.gold,
                        color: THEME.dark,
                      }}
                      className="inline-block px-6 py-3 rounded-full font-bold text-lg"
                    >
                      {item.total} Hadir
                    </div>

                    <p
                      style={{
                        color:
                          THEME.grayText,
                      }}
                      className="mt-4"
                    >
                      ⏰ {item.avg_time}
                    </p>
                  </div>
                ))}
              </section>

              {/* TABLE */}
              <div
                style={{
                  backgroundColor:
                    THEME.darkAlt,
                }}
                className="rounded-2xl overflow-hidden mb-10"
              >
                <div
                  style={{
                    backgroundColor:
                      THEME.accentGreen,
                  }}
                  className="px-6 py-5"
                >
                  <h2
                    style={{
                      color: THEME.white,
                    }}
                    className="text-2xl font-bold"
                  >
                    📋 Data Ranking
                  </h2>
                </div>

                <table className="w-full">
                  <thead className="bg-black/20">
                    <tr>
                      <th className="p-4 text-left text-yellow-400">
                        Rank
                      </th>

                      <th className="p-4 text-left text-yellow-400">
                        Nama
                      </th>

                      <th className="p-4 text-right text-yellow-400">
                        Total
                      </th>

                      <th className="p-4 text-center text-yellow-400">
                        Avg Time
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-700"
                      >
                        <td className="p-4">
                          <div className="bg-yellow-500 text-black w-10 h-10 rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                        </td>

                        <td className="p-4 text-white font-semibold">
                          {item.nama}
                        </td>

                        <td className="p-4 text-right text-yellow-400 font-bold">
                          {item.total}
                        </td>

                        <td className="p-4 text-center text-white">
                          {item.avg_time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CHART */}
              <div
                style={{
                  backgroundColor:
                    THEME.darkAlt,
                }}
                className="rounded-2xl p-8"
              >
                <h2
                  style={{ color: THEME.white }}
                  className="text-2xl font-bold mb-8"
                >
                  📊 Grafik Kehadiran
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={400}
                >
                  <BarChart data={data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />

                    <XAxis
                      dataKey="nama"
                      stroke="#a0a0a0"
                    />

                    <YAxis stroke="#a0a0a0" />

                    <Tooltip />

                    <Bar
                      dataKey="total"
                      radius={[10, 10, 0, 0]}
                    >
                      {data.map((_, index) => (
                        <Cell
                          key={index}
                          fill={
                            chartColors[
                              index %
                                chartColors.length
                            ]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
      </main>
    </div>
  );
}