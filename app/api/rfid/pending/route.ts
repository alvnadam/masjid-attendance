import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('pending_uid')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return NextResponse.json([])
  }

  return NextResponse.json(data ?? [])
}