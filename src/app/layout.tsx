import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/footer";
import Script from "next/script"; 
import { Toaster } from 'sonner';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Giocattoli Caristia",
    template: "%s | Giocattoli Caristia",
  },
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white text-zinc-900`}>
        
        <Toaster 
          position="top-center" 
          expand={false} 
          richColors 
          closeButton
          toastOptions={{
            style: { 
              borderRadius: '1.5rem', 
              padding: '1rem',
              border: 'none',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
            },
            className: "font-sans font-bold uppercase tracking-tight text-xs",
          }}
        />

        <Header />

        <main className="flex-grow w-full">
          {children}
        </main>

        <Footer />

        <Script 
          src="https://elfsightcdn.com/platform.js" 
          strategy="afterInteractive" 
        />
        <SpeedInsights />
      </body>
    </html>
  );
}