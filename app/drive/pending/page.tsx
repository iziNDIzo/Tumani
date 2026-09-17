"use client"
import Link from "next/link"

export default function PendingPage(){
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fcfcfc] flex items-center justify-center p-4">
      <div className="w-full max-w-[520px] bg-white rounded-[32px] border border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-8 md:p-10 text-center">

        <div className="w-24 h-24 mx-auto bg-[#fef3c7] rounded-full flex items-center justify-center text-4xl animate-pulse">
          🔍
        </div>

        <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-black tracking-widest">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
          VERIFICATION IN PROGRESS
        </div>

        <h1 className="font-black text-[32px] leading-[0.95] tracking-tight mt-5">
          We're verifying your vehicle
        </h1>
        <p className="text-[16px] font-medium text-black/60 mt-3 leading-[1.5]">
          Thanks for joining Tumani! Our team is checking your registration and photos. This usually takes <span className="font-black text-black">30 minutes</span>.
        </p>

        <div className="mt-8 text-left bg-[#f8f7ff] rounded-2xl p-5 border border-black/5 space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-[13px]">1</div>
            <div>
              <p className="font-black text-[14px]">Photos & plate check</p>
              <p className="text-[12px] text-black/50 font-medium">We make sure your vehicle is real</p>
            </div>
            <div className="ml-auto text-green-600 font-black text-[12px]">✓ Done</div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-[13px]">2</div>
            <div>
              <p className="font-black text-[14px]">WhatsApp verification</p>
              <p className="text-[12px] text-black/50 font-medium">Customers can reach you</p>
            </div>
            <div className="ml-auto text-amber-600 font-black text-[12px]">● In progress</div>
          </div>
          <div className="flex gap-3 opacity-50">
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center font-black text-[13px]">3</div>
            <div>
              <p className="font-black text-[14px]">Go live!</p>
              <p className="text-[12px] text-black/50 font-medium">Start accepting trips & earning</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Link href="/trip" className="h-[56px] bg-black text-white rounded-full font-black text-[14px] flex items-center justify-center">
            Browse Trips
          </Link>
          <a href="https://wa.me/265888000000" className="h-[56px] border-2 border-black rounded-full font-black text-[14px] flex items-center justify-center">
            Contact Support
          </a>
        </div>

        <p className="text-[11px] font-bold text-black/30 mt-6 tracking-wide">
          We'll send you a WhatsApp once you're verified. No need to re-upload.
        </p>
      </div>
    </div>
  )
}