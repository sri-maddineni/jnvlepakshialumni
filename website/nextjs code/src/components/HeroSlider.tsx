"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
    { src: "/images/home1.jpg", title: "Events", caption: "Celebrating milestones together" },
    { src: "/images/home2.jpg", title: "Programs", caption: "Workshops and mentorships" },
    { src: "/images/home3.jpg", title: "Reunions", caption: "Reconnect with your batch" }
];

export default function HeroSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 3500);
        return () => clearInterval(id);
    }, []);

    return (
        <section className="w-full">
            <div className="relative w-full h-52 sm:h-64 md:h-80 overflow-hidden rounded-xl bg-neutral-100">
                {slides.map((s, i) => (
                    <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}>
                        <Image src={s.src} alt={s.title} fill priority className="object-cover" />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-xl font-semibold">{s.title}</h3>
                            <p className="text-sm opacity-90">{s.caption}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center gap-2 mt-3">
                {slides.map((_, i) => (
                    <button key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => setIndex(i)} className={`h-2 w-2 rounded-full ${i === index ? "bg-[#FF9933]" : "bg-neutral-300"}`} />
                ))}
            </div>
        </section>
    );
}


