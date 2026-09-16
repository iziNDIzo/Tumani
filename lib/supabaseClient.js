import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eokovansipqjdhtktovl.supabase.co'
const supabaseAnonKey = 'sb_publishable_GnLQccxtItmlGlGoYjvFfg_V1W4c...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)