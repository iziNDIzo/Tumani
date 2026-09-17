import Link from "next/link"

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        {/* HERO - FIXED LINE HEIGHT */}
        <div className="max-w-[700px] mt-6">
          <h1 className="font-black text-[42px] md:text-[64px] leading-[1.05] tracking-[-0.04em] text-black">
            Send anything,<br/>go anywhere.
          </h1>
          <p className="font-medium text-[16px] text-black/60 mt-4 leading-[1.5]">
            Malawi's trusted network of verified Hilux drivers. Book rides, send parcels, run errands.
          </p>
        </div>

        {/* SEARCH - FIXED */}
        <div className="mt-8 bg-white border border-black/10 rounded-[20px] p-2 flex flex-col md:flex-row gap-2 max-w-[700px] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <input placeholder="Where from? e.g. Salima" className="flex-1 bg-[#f6f7f9] rounded-[12px] px-4 py-3.5 font-bold text-[14px] text-black outline-none placeholder:text-black/40" />
          <input placeholder="Where to? e.g. Lilongwe" className="flex-1 bg-[#f6f7f9] rounded-[12px] px-4 py-3.5 font-bold text-[14px] text-black outline-none placeholder:text-black/40" />
          <Link href="/marketplace" className="bg-black text-white font-black px-8 py-3.5 rounded-[12px] text-[14px] text-center">Search</Link>
        </div>

        {/* 4 CARDS */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[800px]">
          <Link href="/send" className="bg-white border border-black/10 rounded-[20px] p-6 hover:border-black/20 hover:shadow-sm transition-all">
            <div className="w-12 h-12 bg-[#f0f4ff] rounded-[12px] flex items-center justify-center text-[22px]">📦</div>
            <h3 className="font-black text-[18px] text-black mt-5">Send Parcel</h3>
            <p className="font-medium text-[13px] text-black/60 mt-1 leading-[1.4]">Lilongwe to Mzuzu today. Get tracking code TUM-XXXXX</p>
            <p className="font-black text-[13px] text-black mt-4">From MK 5,000 →</p>
          </Link>

          <Link href="/marketplace" className="bg-white border border-black/10 rounded-[20px] p-6 hover:border-black/20 hover:shadow-sm transition-all">
            <div className="w-12 h-12 bg-[#eef8f0] rounded-[12px] flex items-center justify-center text-[22px]">🚗</div>
            <h3 className="font-black text-[18px] text-black mt-5">Book a Ride</h3>
            <p className="font-medium text-[13px] text-black/60 mt-1 leading-[1.4]">Find verified Hilux seats leaving now</p>
            <p className="font-black text-[13px] text-black mt-4">See trips →</p>
          </Link>

          <Link href="/errands" className="bg-white border border-black/10 rounded-[20px] p-6 hover:border-black/20 hover:shadow-sm transition-all">
            <div className="w-12 h-12 bg-[#fff8e1] rounded-[12px] flex items-center justify-center text-[22px]">🏃</div>
            <h3 className="font-black text-[18px] text-black mt-5">Send Errand</h3>
            <p className="font-medium text-[13px] text-black/60 mt-1 leading-[1.4]">Buy, deliver, queue for you in town</p>
            <p className="font-black text-[13px] text-black mt-4">Post errand →</p>
          </Link>

          <Link href="/track" className="bg-white border border-black/10 rounded-[20px] p-6 hover:border-black/20 hover:shadow-sm transition-all">
            <div className="w-12 h-12 bg-[#f5f0ff] rounded-[12px] flex items-center justify-center text-[22px]">📍</div>
            <h3 className="font-black text-[18px] text-black mt-5">Track Parcel</h3>
            <p className="font-medium text-[13px] text-black/60 mt-1 leading-[1.4]">Enter code TUM-XXXXX to track live</p>
            <p className="font-black text-[13px] text-black mt-4">Track now →</p>
          </Link>
        </div>
      </main>
    </div>
  )
}