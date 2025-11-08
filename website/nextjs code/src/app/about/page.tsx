import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">About</h1>
            <p className="text-neutral-700 leading-relaxed text-center">
                Alumni Association of Jawahar Navodaya Vidyalaya, Lepakshi. Our motto is <br />
                <span className="font-semibold"> “Enter to Learn, Leave to Serve.”</span> <br /> We aim to connect alumni,
                support current students, and serve our community through events and programs.
            </p>

            <section className="mt-10">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#FF9933] text-center">Governing Body</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((m) => (
                        <div key={m.name + m.role} className="rounded-2xl border border-neutral-200 bg-white p-6 h-full flex flex-col">
                            <div className="flex flex-col items-center text-center min-h-[160px]">
                                <div className="relative h-28 w-28 rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center shadow-md">
                                    {m.image ? (
                                        <Image
                                            src={m.image}
                                            alt=""
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-neutral-700 font-semibold text-lg">{getInitials(m.name)}</span>
                                    )}
                                </div>
                                <h3 className="mt-3 text-lg font-semibold text-neutral-900 leading-tight">{m.name}</h3>
                                {m.role && (
                                    <span className="mt-1 rounded-full bg-[#138808]/10 text-[#138808] px-2 py-1 text-xs font-semibold">
                                        {m.role}
                                    </span>
                                )}
                            </div>

                            <div className="mt-4 space-y-2 text-sm flex-1 text-center">
                                {m.batch && (
                                    <div className="text-center gap-2 font-medium text-neutral-800">
                                        {/* <span className="text-neutral-500">Batch</span> */}
                                        {m.batch}
                                    </div>
                                )}
                                {m.profession && (
                                    <div className="items-center text-center gap-3 font-medium text-neutral-800">
                                        {/* <span className="text-neutral-500">Profession</span> */}
                                        {m.profession}
                                    </div>
                                )}
                                {m.extra && <p className="text-neutral-700">{m.extra}</p>}
                            </div>

                            {/* No action buttons as requested */}
                        </div>
                    ))}
                </div>
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
        name: "Vema narayana Tholeti",
        batch: "1988-1995",
        profession: "Health & Life Insurance",
        contact: "9880425259",
        email: "t.vemanarayana@gmail.com",
        role: "PRESIDENT",
        image: "/images/governingbody/vemnarayana.jpg"
    },
    {
        name: "V RAJAREDDY",
        batch: "1998-2005",
        profession: "INCOME TAX DEPT",
        contact: "9985031110",
        email: "rr6093@gmail.com",
        role: "GENERAL SECRETARY",
        image: "/images/governingbody/raja reddy.jpg"
    },
    {
        name: "Vinod Kumar K",
        batch: "1991-1996",
        profession: "Technical Lead (Data Engineer)",
        contact: "9494432923",
        email: "kwinodkumar2020@gmail.com",
        role: "VICE PRESIDENT",
        image: "/images/governingbody/vinod.jpg"
    },
    {
        name: "G.REYAZ",
        batch: "1991-1998",
        profession: "PANCHAYAT RAJ DEPARTMENT — ZPHS, M.B.PALLI (Record Assistant)",
        contact: "9885892798",
        email: "g.reyaz10051981@gmail.com",
        role: "JOINT SECRETARY - I",
        image: "/images/governingbody/reyaz.jpg"
    },
    {
        name: "D Sreenivasa Reddy",
        batch: "1995-2002",
        profession: "GST Officer",
        contact: "9985309646",
        email: "dsreddy138@gmail.com",
        role: "TREASURER",
        image: "/images/governingbody/srinivasa reddy.jpg"
    },
    {
        name: "Y GANGADRI",
        batch: "1996-2003",
        profession: "Physical Director",
        contact: "9000033893",
        email: "gangs.ekalavya@gmail.com",
        role: "ASSOCIATE PRESIDENT - I",
        image: "/images/governingbody/gangadri.jpg"
    },
    {
        name: "M V Balaji",
        batch: "1990-1997",
        profession: "AGM in BSNL",
        contact: "9491985899",
        email: "balajimv404@gmail.com",
        role: "JOINT SECRETARY - II",
        image: "/images/governingbody/balaji.jpg"
    },
    {
        name: "S SUMATHI",
        contact: "96712 66999",
        role: "ASSOCIATE PRESIDENT - II",
        image: "/images/governingbody/sumathi.jpg"
    },
    {
        name: "Siva Kumar P",
        batch: "2006-2013",
        profession: "Product Manager (Healthcare IT)",
        contact: "9703905818",
        email: "pullasivakumar28@gmail.com",
        role: "EXECUTIVE COMMITTEE - I",
        image: "/images/governingbody/siva.jpg"
    },
    {
        name: "S Chaitrahas",
        batch: "2011-2016",
        profession: "Software Engineer",
        contact: "8125705877",
        email: "coolchaitrahas@gmail.com",
        role: "EXECUTIVE COMMITTEE - II",
        image: "/images/governingbody/chaitrahas.jpg"
    },
    {
        name: "H. Arunamma",
        batch: "1998-2005",
        profession: "APSRTC Conductor",
        contact: "9392097358",
        email: "shresta.srujan@gmail.com",
        role: "EXECUTIVE COMMITTEE - III",
        image: "/images/governingbody/arunamma.jpg"
    },
];
function getInitials(name: string) {
    const parts = name.split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts[parts.length - 1]?.[0] ?? "";
    return (first + last).toUpperCase();
}



