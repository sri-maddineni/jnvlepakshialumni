import Image from "next/image";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";

export default function Npl2025Page() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
            <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
                {/* Hero Section - Centered */}
                <div className="text-center mb-6">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                        <span className="text-[#FF9933]">NPL</span> <span className="text-[#138808]">2025</span>
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl text-neutral-700 max-w-2xl mx-auto">
                        Navodaya Premier League 2025
                    </p>
                    {/* <p className="mt-2 text-base text-neutral-600 max-w-2xl mx-auto">
                        Details coming soon. Stay tuned for schedules, teams, and updates.
                    </p> */}
                </div>

                {/* Registration and Tournament Information Section */}
                <div className="max-w-6xl mx-auto mb-4 sm:mb-6">
                    <div className="bg-gradient-to-br from-white to-neutral-50 rounded-2xl border border-neutral-200/60 shadow-md p-4 sm:p-6 backdrop-blur-sm">
                        {/* Tournament Information */}
                        <div className="mb-4 sm:mb-5">
                            <h2 className="text-xs sm:text-base font-bold mb-2 sm:mb-4 text-center text-neutral-900 uppercase tracking-wide">
                                Tournament Information
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-[#FF9933]/10 to-[#FF9933]/5 rounded-xl border border-[#FF9933]/20 hover:border-[#FF9933]/40 transition-all">
                                    <div className="flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap">
                                        <FaMapMarkerAlt className="text-[#FF9933] text-base sm:text-lg flex-shrink-0" />
                                        <p className="text-sm sm:text-sm font-medium text-neutral-900 leading-tight text-center">JNV LEPAKSHI, ANANTHAPUR</p>
                                    </div>
                                </div>
                                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-[#138808]/10 to-[#138808]/5 rounded-xl border border-[#138808]/20 hover:border-[#138808]/40 transition-all">
                                    <div className="flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap">
                                        <FaCalendarAlt className="text-[#138808] text-base sm:text-lg flex-shrink-0" />
                                        <p className="text-sm sm:text-sm font-medium text-neutral-900 leading-tight text-center">Events date : 27th–28th Dec 2025</p>
                                    </div>
                                </div>
                                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all">
                                    <div className="flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap">
                                        <FaClock className="text-neutral-600 text-base sm:text-lg flex-shrink-0" />
                                        <p className="text-sm sm:text-sm font-medium text-neutral-900 leading-tight text-center">Registration deadline : 20th Nov 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Register Button */}
                        <div className="flex justify-center">
                            <a
                                href="https://forms.gle/ADWSiMMo5kwkBEvp6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#138808] to-[#0f6f06] text-white px-5 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold hover:from-[#0f6f06] hover:to-[#0a5a04] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 uppercase tracking-wide"
                            >
                                Register for NPL 2025
                            </a>
                        </div>
                    </div>
                </div>

                {/* Advisory Body Section */}
                {members.length > 0 && (
                    <section className="mt-6 sm:mt-10">
                        <div className="text-center mb-8 sm:mb-10">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                                <span className="text-[#FF9933]">NPL</span> <span className="text-[#138808]">Committee</span>
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-[#FF9933] to-[#138808] mx-auto rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
                            {members.map((m) => (
                                <div
                                    key={m.name + m.role}
                                    className="group rounded-2xl border border-neutral-200/60 bg-gradient-to-br from-white to-neutral-50/50 p-6 h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#138808]/30"
                                >
                                    <div className="flex flex-col items-center text-center min-h-[180px]">
                                        <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center shadow-lg ring-4 ring-white group-hover:ring-[#138808]/20 transition-all duration-300 group-hover:scale-105">
                                            {m.image ? (
                                                <Image
                                                    src={m.image}
                                                    alt={m.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <span className="text-neutral-700 font-bold text-xl">{getInitials(m.name)}</span>
                                            )}
                                        </div>
                                        <h3 className="mt-5 text-lg sm:text-xl font-bold text-neutral-900 leading-tight">{m.name}</h3>
                                        {m.role && (
                                            <span className="mt-3 rounded-full bg-gradient-to-r from-[#138808]/15 to-[#138808]/10 text-[#138808] px-4 py-1.5 text-xs font-bold uppercase tracking-wide border border-[#138808]/20">
                                                {m.role}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-5 space-y-2.5 text-sm flex-1 text-center border-t border-neutral-200/60 pt-4">
                                        {m.batch && (
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-neutral-500 text-xs">Batch:</span>
                                                <span className="font-semibold text-neutral-800">{m.batch}</span>
                                            </div>
                                        )}
                                        {m.profession && (
                                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                                <span className="text-neutral-500 text-xs">Profession:</span>
                                                <span className="font-medium text-neutral-800 text-center">{m.profession}</span>
                                            </div>
                                        )}
                                        {m.extra && <p className="text-neutral-600 text-xs italic">{m.extra}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </section>
        </div>
    );
}


type Member = {
    name: string;
    role?: string;
    batch?: string;
    profession?: string;
    contact?: string;
    email?: string;
    extra?: string;
    image?: string;
};


const members: Member[] = [
    // {
    //     name: "N V Ramana Reddy",
    //     batch: "1987-1994",
    //     profession: "Labour Officer (Govt of AP)",
    //     contact: "99664 04404",
    //     email: "nvenkataramanareddy@gmail.com"
    // },


    {
        name: "Vinod Kumar K",
        batch: "1991-1996",
        profession: "Technical Lead (Data Engineer)",
        contact: "9494432923",
        email: "kwinodkumar2020@gmail.com",
        role: "CHAIRMAN (NPL)",
        image: "/images/governingbody/vinod.jpg"
    },
    // {
    //     name: "G.REYAZ",
    //     batch: "1991-1998",
    //     profession: "PANCHAYAT RAJ DEPARTMENT — ZPHS, M.B.PALLI (Record Assistant)",
    //     contact: "9885892798",
    //     email: "g.reyaz10051981@gmail.com",
    //     role: "JOINT SECRETARY - I",
    //     image: "/images/governingbody/reyaz.jpg"
    // },
    // {
    //     name: "D Sreenivasa Reddy",
    //     batch: "1995-2002",
    //     profession: "GST Officer",
    //     contact: "9985309646",
    //     email: "dsreddy138@gmail.com",
    //     role: "TREASURER",
    //     image: "/images/governingbody/srinivasa reddy.jpg"
    // },
    // {
    //     name: "Y GANGADRI",
    //     batch: "1996-2003",
    //     profession: "Physical Director",
    //     contact: "9000033893",
    //     email: "gangs.ekalavya@gmail.com",
    //     role: "ASSOCIATE PRESIDENT - I",
    //     image: "/images/governingbody/gangadri.jpg"
    // },
    // {
    //     name: "M V Balaji",
    //     batch: "1990-1997",
    //     profession: "AGM in BSNL",
    //     contact: "9491985899",
    //     email: "balajimv404@gmail.com",
    //     role: "JOINT SECRETARY - II",
    //     image: "/images/governingbody/balaji.jpg"
    // },
    // {
    //     name: "S SUMATHI",
    //     contact: "96712 66999",
    //     role: "ASSOCIATE PRESIDENT - II",
    //     image: "/images/governingbody/sumathi.jpg"
    // },
    // {
    //     name: "Siva Kumar P",
    //     batch: "2006-2013",
    //     profession: "Product Manager (Healthcare IT)",
    //     contact: "9703905818",
    //     email: "pullasivakumar28@gmail.com",
    //     role: "EXECUTIVE COMMITTEE - I",
    //     image: "/images/governingbody/siva.jpg"
    // },
    // {
    //     name: "S Chaitrahas",
    //     batch: "2011-2016",
    //     profession: "Software Engineer",
    //     contact: "8125705877",
    //     email: "coolchaitrahas@gmail.com",
    //     role: "EXECUTIVE COMMITTEE - II",
    //     image: "/images/governingbody/chaitrahas.jpg"
    // },
    // {
    //     name: "H. Arunamma",
    //     batch: "1998-2005",
    //     profession: "APSRTC Conductor",
    //     contact: "9392097358",
    //     email: "shresta.srujan@gmail.com",
    //     role: "EXECUTIVE COMMITTEE - III",
    //     image: "/images/governingbody/arunamma.jpg"
    // },
];
function getInitials(name: string) {
    const parts = name.split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts[parts.length - 1]?.[0] ?? "";
    return (first + last).toUpperCase();
}




