import HeroSlider from "@/components/HeroSlider";
// import GoverningBody from "@/components/GoverningBody";
import Link from "next/link";
import Image from "next/image";
import { FaTrophy, FaHandsHelping, FaLightbulb } from "react-icons/fa";

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <div className="hidden md:block">
            <Image src="/images/logos/logo png.png" alt="Logo" width={72} height={72} className="object-contain" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">
              <span className="text-[#FF9933]">Alumni Association</span> <br /> <span className="text-[#138808]">Jawahar Navodaya Vidyalaya, Lepakshi</span>
            </h1>
            <p className="mt-1"><span className="text-[#FF9933]">Enter to Learn</span> • <span className="text-[#138808]">Leave to Serve</span></p>
          </div>
          <div className="hidden md:block">
            <Image src="/images/logos/jnv logo.png" alt="JNV Logo" width={72} height={72} className="object-contain" />
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <HeroSlider />
      </div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link href="/npl-2025" className="group rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="text-[#FF9933] text-3xl">
              <FaTrophy />
            </div>
            <div>
              <h3 className="text-lg font-semibold">NPL 2025</h3>
              <p className="text-sm text-neutral-600">Cricket event for alumni connection and fun.</p>
            </div>
          </Link>
          <Link href="/nava-bandham-seva" className="group rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="text-[#138808] text-3xl">
              <FaHandsHelping />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Nava Bandham Seva</h3>
              <p className="text-sm text-neutral-600">Helping hands from JNV alumni.</p>
            </div>
          </Link>
          <Link href="/ideas" className="group rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="text-[#FF9933] text-3xl">
              <FaLightbulb />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Ideas</h3>
              <p className="text-sm text-neutral-600">Share and explore initiatives for the community.</p>
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}
