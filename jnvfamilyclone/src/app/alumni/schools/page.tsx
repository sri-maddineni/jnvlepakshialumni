"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllAlumni } from "../../../firebase/firebaseops";
import slugify from "../../../utils/slugify";

export default function SchoolsPage() {
    const router = useRouter();
    const [schools, setSchools] = useState<{ name: string; slug: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchSchools() {
            try {
                const alumni = await getAllAlumni();
                const schoolMap = new Map<string, number>();
                alumni.forEach(a => {
                    if (a.jnvSchool) {
                        const name = a.jnvSchool.trim();
                        schoolMap.set(name, (schoolMap.get(name) || 0) + 1);
                    }
                });
                const schoolsArr = Array.from(schoolMap.entries()).map(([name, count]) => ({
                    name,
                    slug: slugify(name),
                    count,
                })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
                setSchools(schoolsArr);
            } catch (err) {
                setError("Failed to load schools.");
            } finally {
                setLoading(false);
            }
        }
        fetchSchools();
    }, []);

    // Remove SignedIn, SignedOut, SignInButton, and registration check logic
    // Remove useEffect for registration check and related state
    // Remove if (!isSignedIn) block

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <main className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-green-700 mb-6">Schools</h1>
                {loading ? (
                    <div className="text-gray-500">Loading schools...</div>
                ) : error ? (
                    <div className="text-red-600">{error}</div>
                ) : schools.length === 0 ? (
                    <div className="text-gray-500">No schools found.</div>
                ) : (
                    <ul className="divide-y divide-gray-200 ">
                        {schools.map(school => (
                            <li key={school.slug + '-' + school.name}>
                                <button
                                    className="w-full flex items-center justify-between py-4 px-3 hover:bg-green-100 rounded transition hover:cursor-pointer"
                                    onClick={() => router.push(`/alumni/schools/${school.slug}`)}
                                >
                                    <span className="font-semibold text-lg text-blue-700">{school.name}</span>
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">{school.count} alumni</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
