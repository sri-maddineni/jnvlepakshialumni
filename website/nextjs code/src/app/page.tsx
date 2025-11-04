import HeroSlider from "@/components/HeroSlider";
import GoverningBody from "@/components/GoverningBody";

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          <span className="text-[#FF9933]">Alumni Association</span> of <span className="text-[#138808]">Jawahar Navodaya Vidyalaya, Lepakshi</span>
        </h1>
        <p className="mt-1 text-center"><span className="text-[#FF9933]">Enter to Learn</span> • <span className="text-[#138808]">Leave to Serve</span></p>
      </section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <HeroSlider />
      </div>
      <GoverningBody />
    </div>
  );
}
