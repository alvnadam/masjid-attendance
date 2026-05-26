import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://pyerguwihyyanlsmjhxf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZXJndXdpaHl5YW5sc21qaHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjM4NzgsImV4cCI6MjA5MzQ5OTg3OH0.rG2u4_rskfDGrLRHw5HmG2ep77o_vplWTBdbSypLwT4'
)