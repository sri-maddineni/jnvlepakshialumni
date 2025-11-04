import React, { useEffect, useState } from "react";
import { getAllAlumni } from "../firebase/firebaseops";
import { HiUserGroup, HiAcademicCap, HiBriefcase } from "react-icons/hi";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NetworkStats() {
    const [stats, setStats] = useState({
        total: 0,
        uniqueSchools: 0,
        uniqueProfessions: 0,
        loading: true,
    });

    useEffect(() => {
        async function fetchStats() {
            const alumni = await getAllAlumni();
            const schoolSet = new Set<string>();
            const professionSet = new Set<string>();
            alumni.forEach(a => {
                if (a.jnvSchool) schoolSet.add(a.jnvSchool.trim().toLowerCase());
                if (a.profession) professionSet.add(a.profession.trim().toLowerCase());
            });
            setStats({
                total: alumni.length,
                uniqueSchools: schoolSet.size,
                uniqueProfessions: professionSet.size,
                loading: false,
            });
        }
        fetchStats();
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <Link href="/alumni/" title="View alumni" className="flex flex-col items-center bg-blue-600 rounded-xl shadow p-6 hover:scale-110 transform transition cursor-pointer w-full">
                    <HiUserGroup className="w-10 h-10 text-white mb-2" />
                    <div className="text-2xl font-bold text-white">{stats.loading ? "-" : stats.total}</div>
                    <div className="flex items-center text-white">
                        Total Alumni
                        <span className="ml-2">
                            <ArrowRight />
                        </span>
                    </div>
                </Link>

                <Link href="/alumni/schools" title="View schools" className="flex flex-col items-center bg-green-700 rounded-xl shadow p-6 hover:scale-110 transform transition cursor-pointer w-full">
                    <HiAcademicCap className="w-10 h-10 text-white mb-2" />
                    <div className="text-2xl font-bold text-white hover:text-white transition">
                        {stats.loading ? "-" : stats.uniqueSchools}
                    </div>
                    <div className="flex items-center text-white">
                        different jnv&#39; s
                        <span className="ml-2">
                            <ArrowRight />
                        </span>
                    </div>
                </Link>

                <div className="flex flex-col items-center bg-red-500 rounded-xl shadow p-6">
                    <HiBriefcase className="w-10 h-10 text-white mb-2" />
                    <div className="text-2xl font-bold text-white">{stats.loading ? "-" : stats.uniqueProfessions}</div>
                    <div className="text-white">different Professions</div>
                </div>
            </div>
        </div>
    );
}