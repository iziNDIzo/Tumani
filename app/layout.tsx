"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

export default function Navbar(){
  const [user,setUser]=useState<any>(null)
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=> setUser(data.user))
  },[])

  return(
    <nav className="h-[64px] w-full bg-white border-b border-black/10 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* LEFT */}
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-[#1a73e8] rounded-full flex items-center justify-center font-black text-white">T</div>
        <span className="font-black text-[20px] tracking-tight">Tumani</span>
      </Link>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <Link href="/marketplace" className="hidden md:flex px-5 py-2.5 rounded-full bg-black text-white font-black text-[13px] hover:bg-black/80">
          Find Trips
        </Link>

        {user? (
          <Link href="/drive" className="px-5 py-2.5 rounded-full bg-[#1a73e8] text-white font-black text-[13px]">
            My Drive
          </Link>
        ) : (
          <Link href="/auth" className="px-6 py-2.5 rounded-full bg-white border-2 border-black/10 text-black font-black text-[13px] hover:bg-black hover:text-white transition">
            Login as Driver
          </Link>
        )}
      </div>
    </nav>
  )
}