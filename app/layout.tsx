import "./globals.css"
import Link from "next/link"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-white">
      <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body className="bg-white text-black min-h-screen antialiased">
        <header className="h-[68px] bg-white border-b-2 border-black/10 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-black">T</div>
            <span className="font-black text-[20px] text-black">Tumani</span>
          </Link>
          <div className="flex items-center gap-4">
           <Link href="/marketplace" className="font-black text-[14px] text-black outline-none focus:outline-none ring-0">Marketplace</Link>
            <Link href="/post" className="bg-blue-600 text-white font-black px-6 py-2.5 rounded-full text-[14px]">+ Post</Link>
          </div>
        </header>
        <main className="bg-white">{children}</main>
      </body>
    </html>
  )
}