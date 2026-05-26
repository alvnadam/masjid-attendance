import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { uid, name, email } = await req.json()

  if (!uid || !name) {
    return NextResponse.json({
      success: false,
      message: 'UID dan nama wajib diisi',
    })
  }

  const { error } = await supabase
    .from('users')
    .insert({
      name,
      email,
      rfid_uid: uid,
    })

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    })
  }

  await supabase
    .from('pending_uid')
    .delete()
    .eq('uid', uid)

  return NextResponse.json({
    success: true,
    message: 'UID berhasil didaftarkan',
  })
}