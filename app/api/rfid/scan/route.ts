import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()

  console.log("BODY MASUK:", body)   // 🔍 debug 1

  const { uid } = body

  console.log("UID MASUK:", uid)     // 🔍 debug 2

  if (!uid) {
    console.log("UID kosong!")       // 🔍 debug 3
    return NextResponse.json({
      success: false,
      message: 'UID kosong',
    })
  }

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('rfid_uid', uid)
    .single()

  console.log("HASIL CEK USER:", user) // 🔍 debug 4

  if (!user) {
    console.log("Masuk pending UID")   // 🔍 debug 5

    await supabase.from('pending_uid').insert({
      uid,
    })

    return NextResponse.json({
      success: false,
      message: 'UID belum terdaftar',
    })
  }

  console.log("User ditemukan → absensi") // 🔍 debug 6

  await supabase.from('attendance').insert({
    user_id: user.id,
  })

  return NextResponse.json({
    success: true,
    message: 'Absensi berhasil',
  })
}