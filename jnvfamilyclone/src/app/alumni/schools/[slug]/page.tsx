"use client";
import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getAllAlumni } from "../../../../firebase/firebaseops";
import slugify from "../../../../utils/slugify";
import { Alumni } from "../../../../types";
import { HiUser } from "react-icons/hi";
import Link from "next/link";
import GoBackButton from "@/components/GoBackButton";
import { SearchIcon } from "lucide-react";

const PER_PAGE = 24;

export default function SchoolAlumniPage() {
    const { user, isSignedIn } = useUser();
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;
    const [alumni, setAlumni] = useState<Alumni[]>([]);
    const [schoolName, setSchoolName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchAlumni() {
            try {
                const all = await getAllAlumni();
                const filtered = all.filter(a => a.jnvSchool && slugify(a.jnvSchool) === slug);
                setAlumni(filtered);
                setSchoolName(filtered[0]?.jnvSchool || "");
            } catch (err) {
                setError("Failed to load alumni.");
            } finally {
                setLoading(false);
            }
        }
        fetchAlumni();
    }, [slug]);

    // Registration check (reuse logic)
    const [checkingRegistration, setCheckingRegistration] = useState(true);
    useEffect(() => {
        async function checkRegistration() {
            if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) {
                setCheckingRegistration(false);
                return;
            }
            const { isUserRegisteredAlumni } = await import("../../../../firebase/firebaseops");
            const registered = await isUserRegisteredAlumni(user.primaryEmailAddress.emailAddress);
            if (!registered) {
                router.replace("/alumni/register");
            } else {
                setCheckingRegistration(false);
            }
        }
        checkRegistration();
    }, [isSignedIn, user?.primaryEmailAddress?.emailAddress, router]);

    if (!isSignedIn) {
        return (
            <SignedOut>
                <div className="flex flex-col items-center justify-center w-full h-screen gap-6">
                    <h2 className="text-2xl font-semibold text-red-600">Sign in required</h2>
                    <p className="text-gray-700">Please sign in to view alumni for this school.</p>
                    <SignInButton mode="modal">
                        <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Sign In</button>
                    </SignInButton>
                </div>
            </SignedOut>
        );
    }

    if (checkingRegistration) {
        return <div className="flex justify-center items-center min-h-screen"><div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    // Pagination
    const totalPages = Math.max(1, Math.ceil(alumni.length / PER_PAGE));
    const paginated = alumni.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <main className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
            <GoBackButton />
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-green-700 mb-6">{schoolName ? `Alumni from ${schoolName}` : "School Alumni"}</h1>
                    <Link href="/alumni/" className="mt-6 inline-flex items-center text-red-600"> <SearchIcon className="w-5 h-5 mr-2" /> Search for an alumni </Link>
                </div>
                {loading ? (
                    <div className="text-gray-500">Loading alumni...</div>
                ) : error ? (
                    <div className="text-red-600">{error}</div>
                ) : alumni.length === 0 ? (
                    <div className="text-gray-500">No alumni found for this school.</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {paginated.map(a => (
                                <div key={a.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2 border border-gray-100 hover:shadow-xl transition h-[320px] min-h-[320px] max-h-[340px]">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center text-2xl font-bold text-blue-700 mb-2 shadow border-2 border-white">
                                        <HiUser className="w-8 h-8 text-blue-300" />
                                    </div>
                                    <div className="text-base font-semibold text-gray-800 text-center truncate w-full" title={a.fullName}>{a.fullName?.toUpperCase()}</div>
                                    <div className="text-blue-700 font-medium text-center line-clamp-1 w-full" title={a.profession}>{a.profession || <span className="text-gray-400">Profession not set</span>}</div>
                                    <div className="text-gray-600 text-center line-clamp-1 w-full" title={a.organisation}>{a.organisation || <span className="text-gray-400">Organisation not set</span>}</div>
                                    <div className="flex-1" />
                                    <Link href={`/alumni/profile/${a.id}`} className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 hover:text-blue-900 transition-colors text-center w-full shadow">View Profile</Link>
                                </div>
                            ))}
                        </div>
                        {/* Pagination controls */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mt-8 gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    className="px-3 py-1 rounded bg-gray-100 text-gray-600 font-semibold hover:bg-green-100 disabled:opacity-10 disabled:cursor-not-allowed"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >Prev</button>
                                <span className="text-gray-700 text-sm">Page {page} of {totalPages}</span>
                                <button
                                    className="px-3 py-1 cursor-pointer rounded bg-gray-100 text-gray-600 font-semibold hover:bg-green-100 disabled:opacity-10 disabled:cursor-not-allowed"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >Next</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
} 