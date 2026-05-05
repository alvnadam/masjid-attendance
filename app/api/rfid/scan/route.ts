import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { uid } = await req.json()

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('uid_rfid', uid)
    .single()

  if (!user) {
    await supabase
      .from('pending_uid')
      .upsert({ uid })

    return NextResponse.json({
      success: false,
      message: 'UID belum terdaftar'
    })
  }

  await supabase
    .from('attendance')
    .insert({
      user_id: user.id
    })

  return NextResponse.json({
    success: true,
    nama: user.nama,
    message: 'Absensi berhasil'
  })
}