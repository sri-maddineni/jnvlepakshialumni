import Image from "next/image";

type Member = {
    name: string;
    role: string;
    photo: string;
};

const members: Member[] = [
    { name: "President Name", role: "President", photo: "/images/home1.jpg" },
    { name: "Secretary Name", role: "Secretary", photo: "/images/home2.jpg" },
    { name: "Treasurer1 Name", role: "Treasurer", photo: "/images/home3.jpg" },
    { name: "Treasurer11 Name", role: "Treasurer", photo: "/images/home3.jpg" },
    { name: "Treasurer2 Name", role: "Treasurer", photo: "/images/home3.jpg" },
    { name: "Treasurer3 Name", role: "Treasurer", photo: "/images/home3.jpg" },
];

export default function GoverningBody() {
    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#FF9933]">Governing Body</h2>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 sm:gap-6">
                {members.map((m) => (
                    <div key={m.name} className="rounded-xl border border-[#138808]/30 bg-white p-4 text-center">
                        <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full">
                            <Image src={m.photo} alt={m.name} fill className="object-cover" />
                        </div>
                        <div className="mt-3">
                            <p className="font-semibold leading-tight text-neutral-900">{m.name}</p>
                            <p className="text-sm" style={{ color: "#138808" }}>{m.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}


