import "./globals.css"
import Link from "next/link"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-[#f6f7f9] text-black antialiased">
        {/* HEADER - LOGO NOW CLICKS TO HOMEPAGE */}
        <header className="h-[64px] bg-white border-b border-black/10 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-[16px]">T</div>
            <span className="font-black text-[20px] text-black tracking-tight">Tumani</span>
          </Link>
          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/marketplace" className="font-black text-[14px] text-black">Marketplace</Link>
            <Link href="/post" className="bg-blue-600 text-white font-black px-5 md:px-6 py-2.5 rounded-full text-[14px]">+ Post</Link>
          </div>
        </header>
        <main className="w-full overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  )
}