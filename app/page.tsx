import Link from "next/link"

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      {/* HEADER - SAME AS MARKETPLACE */}
      <header className="bg-white border-b border-black/10">
        <div className="max-w-[1200px] mx-auto px-4 h-[64px] flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1a73e8] rounded-full flex items-center justify-center font-black text-white text-[14px]">T</div>
            <span className="font-black text-[18px] text-black">Tumani</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/marketplace" className="font-bold text-[14px] text-black/60 hover:text-black">Marketplace</Link>
            <Link href="/my-trips" className="font-bold text-[14px] text-black/60 hover:text-black">My Trips</Link>
            <Link href="/send" className="bg-black text-white font-black px-5 py-2 rounded-full text-[14px]">Post Trip</Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-8 md:py-14">
        {/* HERO */}
        <div className="max-w-[700px]">
          <h1 className="font-black text-[40px] md:text-[56px] leading-[0.9] text-black tracking-tight">
            Send anything,<br />go anywhere.
          </h1>
          <p className="font-bold text-[16px] text-black/60 mt-4">
            Malawi's trusted network of verified Hilux drivers. Book rides, send parcels, run errands.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="mt-8 bg-white border-2 border-black/10 rounded-[16px] p-2 flex gap-2 max-w-[700px] shadow-sm">
          <input placeholder="Where from? e.g. Salima" className="flex-1 bg-[#f6f7f9] rounded-[12px] px-4 py-3 font-bold text-[14px] text-black outline-none" />
          <input placeholder="Where to? e.g. Lilongwe" className="flex-1 bg-[#f6f7f9] rounded-[12px] px-4 py-3 font-bold text-[14px] text-black outline-none" />
          <Link href="/marketplace" className="bg-black text-white font-black px-6 py-3 rounded-[12px] text-[14px]">Search</Link>
        </div>

        {/* 4 CARDS - CUSTOMER EXPERIENCE */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[700px]">

          <Link href="/send" className="bg-white border-2 border-black/10 rounded-[20px] p-6 hover:border-black hover:shadow-sm transition-all group">
            <div className="w-12 h-12 bg-[#e8f0fe] rounded-[12px] flex items-center justify-center text-[22px]">📦</div>
            <h3 className="font-black text-[20px] text-black mt-4 group-hover:text-[#1a73e8]">Send Parcel</h3>
            <p className="font-bold text-[13px] text-black/60 mt-1">Lilongwe to Mzuzu today. Get tracking code TUM-XXXXX</p>
            <p className="font-black text-[13px] text-black mt-3">From MK 5,000 →</p>
          </Link>

          <Link href="/marketplace" className="bg-white border-2 border-black/10 rounded-[20px] p-6 hover:border-black hover:shadow-sm transition-all group">
            <div className="w-12 h-12 bg-[#e6f4ea] rounded-[12px] flex items-center justify-center text-[22px]">🚗</div>
            <h3 className="font-black text-[20px] text-black mt-4 group-hover:text-[#1a73e8]">Book a Ride</h3>
            <p className="font-bold text-[13px] text-black/60 mt-1">Find verified Hilux seats leaving now</p>
            <p className="font-black text-[13px] text-black mt-3">See trips →</p>
          </Link>

          <Link href="/errands" className="bg-white border-2 border-black/10 rounded-[20px] p-6 hover:border-black hover:shadow-sm transition-all group">
            <div className="w-12 h-12 bg-[#fef7e0] rounded-[12px] flex items-center justify-center text-[22px]">🏃</div>
            <h3 className="font-black text-[20px] text-black mt-4 group-hover:text-[#1a73e8]">Send Errand</h3>
            <p className="font-bold text-[13px] text-black/60 mt-1">Buy, deliver, queue for you in town</p>
            <p className="font-black text-[13px] text-black mt-3">Post errand →</p>
          </Link>

          <Link href="/track" className="bg-white border-2 border-black/10 rounded-[20px] p-6 hover:border-black hover:shadow-sm transition-all group">
            <div className="w-12 h-12 bg-[#f3e8fd] rounded-[12px] flex items-center justify-center text-[22px]">📍</div>
            <h3 className="font-black text-[20px] text-black mt-4 group-hover:text-[#1a73e8]">Track Parcel</h3>
            <p className="font-bold text-[13px] text-black/60 mt-1">Enter code TUM-XXXXX to track live</p>
            <p className="font-black text-[13px] text-black mt-3">Track now →</p>
          </Link>

        </div>

        {/* TRUST */}
        <div className="mt-10 flex gap-6 font-bold text-[12px] text-black/40">
          <span>✓ Verified drivers</span>
          <span>✓ Plate checked</span>
          <span>✓ WhatsApp direct</span>
        </div>
      </main>
    </div>
  )
}