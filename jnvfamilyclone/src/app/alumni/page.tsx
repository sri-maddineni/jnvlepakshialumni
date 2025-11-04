"use client";
import React, { useEffect, useState, useMemo } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { getAllAlumni } from "../../firebase/firebaseops";
import { HiUser, HiSearch, HiX, HiRefresh, HiArrowNarrowUp } from "react-icons/hi";
import GoBackButton from "../../components/GoBackButton";
import Image from "next/image";
import Toaster, { toast } from "../../components/Toaster";

type Alumni = {
    id: string;
    fullName?: string;
    email?: string;
    profession?: string;
    organisation?: string;
    workCity?: string;
    workState?: string;
    role?: string;
    jnvSchool?: string;
    qualification?: string;
};

// Helper to deduplicate and normalize options (limit to maxCount, Title Case)
function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}
function getNormalizedOptions(list: string[], maxCount = 5): string[] {
    const map = new Map<string, { value: string; count: number }>();
    list.forEach(val => {
        if (!val) return;
        const key = val.trim().toLowerCase();
        if (map.has(key)) {
            map.get(key)!.count++;
        } else {
            map.set(key, { value: val.trim(), count: 1 });
        }
    });
    // Sort by count desc, then alphabetically, then limit, then Title Case
    return Array.from(map.values())
        .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
        .slice(0, maxCount)
        .map(x => toTitleCase(x.value));
}

export default function Alumni() {
    const { user } = useUser();
    const [alumni, setAlumni] = useState<Alumni[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [profileImages, setProfileImages] = useState<Record<string, string | null>>({});
    // Pagination state
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(24);
    // Filter state
    // const [role, setRole] = useState("");
    // Filter options
    // const [roleOptions, setRoleOptions] = useState<string[]>([]);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Searchable fields for alumni page
    const SEARCH_FIELDS = [
        { key: 'fullName', label: 'Name' },
        { key: 'jnvSchool', label: 'School' },
        { key: 'profession', label: 'Profession' },
        { key: 'organisation', label: 'Organisation' },
        { key: 'workCity', label: 'Work City' },
        { key: 'workState', label: 'Work State' },
        { key: 'role', label: 'Role' },
    ];
    const [selectedFields, setSelectedFields] = React.useState<string[]>(SEARCH_FIELDS.map(f => f.key));
    const allSelected = selectedFields.length === SEARCH_FIELDS.length;
    const handleAllToggle = () => {
        setSelectedFields(allSelected ? [] : SEARCH_FIELDS.map(f => f.key));
    };

    const handleFieldToggle = (key: string) => {
        setSelectedFields(prev =>
            prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
        );
    };

    useEffect(() => {
        async function fetchAlumni() {
            const list = await getAllAlumni();
            const typedList = list as Alumni[];
            typedList.sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
            setAlumni(typedList);
            setLoading(false);
            // Extract filter options (case-insensitive, deduped, limit 10)
            const cityList = typedList.map(a => a.workCity || "").filter(Boolean);
            const schoolList = typedList.map(a => a.jnvSchool || "").filter(Boolean);
            const professionList = typedList.map(a => a.profession || "").filter(Boolean);
            // setCityOptions(getNormalizedOptions(cityList)); // Removed
            // setSchoolOptions(getNormalizedOptions(schoolList)); // Removed
            // setProfessionOptions(getNormalizedOptions(professionList)); // Removed
        }
        fetchAlumni();
    }, []);

    // Fetch profile images for all alumni in batch
    useEffect(() => {
        async function fetchProfileImages() {
            if (alumni.length === 0) return;

            // setProfileImagesLoading(true); // Removed
            try {
                const { getMultipleUserProfileImages } = await import('../actions/clerkActions');
                const emails = alumni.map(a => a.email).filter(Boolean) as string[];
                const images = await getMultipleUserProfileImages(emails);
                setProfileImages(images);
            } catch (error) {
                console.error('Error fetching profile images:', error);
            } finally {
                // setProfileImagesLoading(false); // Removed
            }
        }

        fetchProfileImages();
    }, [alumni]);

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState("");
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 200);
        return () => clearTimeout(handler);
    }, [search]);

    const filteredAlumni = useMemo(() => {
        let result = alumni;
        if (debouncedSearch) {
            const s = debouncedSearch.toLowerCase();
            result = result.filter(a =>
                selectedFields.some(field => {
                    const value = a[field as keyof Alumni] as string | undefined;
                    return value && value.toLowerCase().includes(s);
                })
            );
        }
        // if (city) result = result.filter(a => (a.workCity || "").toLowerCase().includes(city.toLowerCase())); // Removed
        // if (school) result = result.filter(a => (a.jnvSchool || "").toLowerCase().includes(school.toLowerCase())); // Removed
        // if (profession) result = result.filter(a => (a.profession || "").toLowerCase().includes(profession.toLowerCase())); // Removed
        // if (role) result = result.filter(a => (a.role || "").toLowerCase().includes(role.toLowerCase())); // Removed
        return result;
    }, [alumni, debouncedSearch, selectedFields]); // Removed role

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(filteredAlumni.length / perPage));
    const paginatedAlumni = filteredAlumni.slice((page - 1) * perPage, page * perPage);
    useEffect(() => {
        // Reset to page 1 if search or perPage changes
        setPage(1);
    }, [debouncedSearch, perPage]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 200);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Avatar component with Clerk API integration
    const AlumniAvatar = ({ alumni, profileImages }: { alumni: Alumni; profileImages: Record<string, string | null> }) => {
        const profileImageUrl = profileImages[alumni.email || ''] || null;
        const initials = alumni.fullName ? alumni.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "";



        if (profileImageUrl) {
            return (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center text-2xl font-bold text-blue-700 mb-2 shadow border-2 border-white overflow-hidden">
                    <Image
                        src={profileImageUrl}
                        alt={alumni.fullName || "Profile"}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                    <div className="hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-yellow-100 text-2xl font-bold text-blue-700">
                        {initials || <HiUser className="w-8 h-8 text-blue-300" />}
                    </div>
                </div>
            );
        }

        return (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center text-2xl font-bold text-blue-700 mb-2 shadow border-2 border-white">
                {initials || <HiUser className="w-8 h-8 text-blue-300" />}
            </div>
        );
    };

    return (
        <main className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
            <GoBackButton />
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
                <SignedIn>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-green-700 flex items-center gap-2">
                               All Our Alumni
                                <button
                                    type="button"
                                    className={`ml-2 p-1 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 ${loading ? 'animate-spin' : ''}`}
                                    title="Refresh"
                                    aria-label="Refresh alumni list"
                                    onClick={async () => {
                                        setLoading(true);
                                        // setProfileImagesLoading(true); // Removed
                                        // Refetch alumni
                                        const list = await getAllAlumni();
                                        const typedList = list as Alumni[];
                                        typedList.sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
                                        setAlumni(typedList);
                                        setLoading(false);
                                        // Refetch profile images
                                        try {
                                            const { getMultipleUserProfileImages } = await import('../actions/clerkActions');
                                            const emails = typedList.map(a => a.email).filter(Boolean) as string[];
                                            const images = await getMultipleUserProfileImages(emails);
                                            setProfileImages(images);
                                        } catch (error) {
                                            console.error('Error fetching profile images:', error);
                                        } finally {
                                            // setProfileImagesLoading(false); // Removed
                                        }
                                    }}
                                >
                                    <HiRefresh className={`w-6 h-6 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
                                </button>
                            </h1>
                            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">{alumni.length} total</span>
                        </div>
                        <div className="flex items-center gap-2 self-end md:self-auto">
                            <label htmlFor="perPage" className="text-sm text-gray-600">Show</label>
                            <select
                                id="perPage"
                                value={perPage}
                                onChange={e => setPerPage(Number(e.target.value))}
                                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                            >
                                {[12, 24, 60, 120].map(n => <option key={n} value={n}>{n} / page</option>)}
                            </select>
                        </div>
                    </div>
                    {/* All button and search field checkboxes */}
                    <div className="flex flex-nowrap overflow-x-auto gap-2 mb-4 items-center pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-200">
                        <button
                            type="button"
                            className={`px-3 py-1 rounded font-semibold text-xs border ${allSelected ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-green-50'} whitespace-nowrap`}
                            onClick={handleAllToggle}
                        >
                            {allSelected ? 'Deselect All' : 'Select All'}
                        </button>
                        {SEARCH_FIELDS.map(f => (
                            <label key={f.key} className="flex items-center gap-1 text-xs font-medium bg-gray-100 px-2 py-1 rounded cursor-pointer whitespace-nowrap sm:text-xs md:text-sm">
                                <input
                                    type="checkbox"
                                    checked={selectedFields.includes(f.key)}
                                    onChange={() => handleFieldToggle(f.key)}
                                    className="accent-green-600"
                                />
                                {f.label}
                            </label>
                        ))}
                    </div>
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                        <div className="flex items-center w-full md:w-1/2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder={selectedFields.length === 0 ? 'Select at least one field to search.' : `Search by ${selectedFields.map(f => SEARCH_FIELDS.find(sf => sf.key === f)?.label).join(' or ') || '...'}`}
                                    className="w-full border rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:cursor-not-allowed"
                                    disabled={selectedFields.length === 0}
                                    title={selectedFields.length === 0 ? 'Please select at least one field above to enable search.' : ''}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <HiSearch className="w-5 h-5" />
                                </span>
                                {search && (
                                    <button
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                                        onClick={() => setSearch("")}
                                        tabIndex={-1}
                                        aria-label="Clear search"
                                    >
                                        <HiX className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <span className="ml-3 text-xs text-gray-500 font-semibold whitespace-nowrap">{filteredAlumni.length}/{alumni.length}</span>
                        </div>
                        {/* Removed city, school, profession autocomplete filters */}
                    </div>
                    {loading ? (
                        <div className="text-gray-500">Loading alumni...</div>
                    ) : filteredAlumni.length === 0 ? (
                        <div className="text-gray-500">No alumni found.</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {paginatedAlumni.map(a => (
                                    <div key={a.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2 border border-gray-100 hover:shadow-xl transition h-[320px] min-h-[320px] max-h-[340px]">
                                        <AlumniAvatar alumni={a} profileImages={profileImages} />
                                        <div className="text-base font-semibold text-gray-800 text-center truncate w-full" title={a.fullName}>{a.fullName?.toUpperCase()}</div>
                                        <div className="text-blue-700 font-medium text-center line-clamp-1 w-full" title={a.profession}>{a.profession || <span className="text-gray-400">Profession not set</span>}</div>
                                        <div className="text-gray-600 text-center line-clamp-1 w-full" title={a.organisation}>{a.organisation || <span className="text-gray-400">Organisation not set</span>}</div>
                                        <div className="text-xs text-gray-500 text-center line-clamp-1 w-full" title={a.workCity && a.workState ? `${a.workCity}, ${a.workState}` : undefined}>
                                            {a.workCity && a.workState ? `${a.workCity}, ${a.workState}` : <span className="text-gray-300">Location not set</span>}
                                        </div>
                                        {/* {a.qualification && <div className="mt-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold shadow-sm line-clamp-1 w-full text-center" title={a.qualification}>{a.qualification}</div>} */}
                                        {a.role && <div className="mt-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold shadow-sm line-clamp-1 w-full text-center" title={a.role}>{a.role}</div>}
                                        <div className="flex-1" />
                                        <Link
                                            href={"#"}
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                const { isUserRegisteredAlumni } = await import("../../firebase/firebaseops");
                                                const email = user?.primaryEmailAddress?.emailAddress;
                                                if (!email) return;
                                                const registered = await isUserRegisteredAlumni(email);
                                                if (!registered) {
                                                    toast.error("Only registered alumni can view profiles.");
                                                    return;
                                                }
                                                window.location.href = `/alumni/profile/${a.id}`;
                                            }}
                                            className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 hover:text-blue-900 transition-colors text-center w-full shadow"
                                        >
                                            View Profile
                                        </Link>
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
                </SignedIn>
                <SignedOut>
                    <div className="flex flex-col items-center justify-center gap-6">
                        <h2 className="text-2xl font-semibold text-red-600">Sign in required</h2>
                        <p className="text-gray-700">Please sign in to view the alumni directory.</p>
                        <SignInButton mode="modal">
                            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Sign In</button>
                        </SignInButton>
                    </div>
                </SignedOut>
            </div>
            {showScrollTop && (
                <button
                    className="fixed bottom-4 right-4 z-50 bg-yellow-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 animate-pulse"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    title="Scroll to top"
                    aria-label="Scroll to top"
                >
                    <HiArrowNarrowUp className="w-6 h-6" />
                </button>
            )}
            <Toaster />
        </main>
    );
} 