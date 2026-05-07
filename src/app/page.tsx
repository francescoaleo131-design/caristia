import Image from "next/image";
import HeadOne from "@/components/main";
import Head from "next/head";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 font-sans white:bg-white">
    <main className="min-h-screen bg-white">
     <HeadOne />
    </main>
    </div>
  );
}
