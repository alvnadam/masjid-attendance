'use client'

import { useEffect, useState } from 'react'

export default function RegisterRFIDPage() {
  const [pendingUIDs, setPendingUIDs] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedUID, setSelectedUID] = useState('')

  async function fetchPending() {
    try {
      const res = await fetch('/api/rfid/pending')
      const data = await res.json()

      if (Array.isArray(data)) {
        setPendingUIDs(data)
      } else {
        console.error('Data bukan array:', data)
        setPendingUIDs([])
      }
    } catch (err) {
      console.error(err)
      setPendingUIDs([])
    }
  }

  async function registerUID() {
    if (!selectedUID || !name) {
      alert('Pilih UID dan isi nama dulu!')
      return
    }

    const res = await fetch('/api/rfid/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: selectedUID, name, email }),
    })

    const data = await res.json()
    alert(data.message)

    setName('')
    setEmail('')
    setSelectedUID('')

    fetchPending()
  }

  useEffect(() => {
    fetchPending()
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Register RFID Jamaah
      </h1>

      {/* LIST UID */}
      <div className="grid gap-4 mb-8">
        {pendingUIDs.length === 0 && (
          <p className="text-gray-500">
            Belum ada UID yang masuk
          </p>
        )}

        {pendingUIDs.map((item) => (
          <button
            key={item.uid}
            onClick={() => setSelectedUID(item.uid)}
            className={`p-4 rounded border ${
              selectedUID === item.uid
                ? 'bg-blue-500 text-white'
                : 'bg-white'
            }`}
          >
            {item.uid}
          </button>
        ))}
      </div>

      {/* FORM */}
      {selectedUID && (
        <div className="space-y-4">
          <p className="font-semibold">
            UID: {selectedUID}
          </p>

          <input
            type="text"
            placeholder="Nama Jamaah"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <button
            onClick={registerUID}
            className="bg-green-600 text-white px-6 py-3 rounded"
          >
            Register UID
          </button>
        </div>
      )}
    </div>
  )
}