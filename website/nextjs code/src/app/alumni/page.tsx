'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllAlumni, AlumniRecord, addSupporter } from '@/app/database/dbops';
import { AlumniStatus, Roles } from '@/app/database/Enums';
import { FaSearch, FaBriefcase, FaMapMarkerAlt, FaEnvelope, FaPhone, FaGraduationCap, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function getInitials(name: string) {
    const parts = name.split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts[parts.length - 1]?.[0] ?? "";
    return (first + last).toUpperCase();
}

export default function AlumniPage() {
    const { user, userRole, alumniData, loading: authLoading } = useAuth();
    const router = useRouter();
    const [alumni, setAlumni] = useState<(AlumniRecord & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [professionFilter, setProfessionFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [supporting, setSupporting] = useState<Set<string>>(new Set()); // Track which alumni are being supported
    const itemsPerPage = 15;

    // Check if user can access this page
    const canAccess = useMemo(() => {
        if (authLoading) return false;
        if (!user || !alumniData) return false;
        // Access if: status is Approved OR userRole is Admin/Governing_body/Alumni
        return alumniData.status === AlumniStatus.Approved ||
            userRole === Roles.Admin ||
            userRole === Roles.Governing_body ||
            userRole === Roles.Alumni;
    }, [user, alumniData, userRole, authLoading]);

    // Check if user can see contact details (admin or governing body only)
    const canSeeContactDetails = useMemo(() => {
        return userRole === Roles.Admin || userRole === Roles.Governing_body || userRole === Roles.Alumni;
    }, [userRole]);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/auth/login');
            return;
        }
        if (!canAccess) {
            // User is logged in but status is pending - show access denied
            return;
        }
        async function fetchAlumni() {
            try {
                const data = await getAllAlumni();
                data.sort((a, b) => b.passedOutYear - a.passedOutYear);
                setAlumni(data);
            } catch (err) {
                console.error('Error fetching alumni:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchAlumni();
    }, [user, canAccess, authLoading, router]);

    // Separate approved and pending alumni
    const { approvedAlumni, pendingAlumni } = useMemo(() => {
        const approved = alumni.filter(a => a.status === AlumniStatus.Approved);
        const pending = alumni.filter(a => a.status === AlumniStatus.Pending);
        return { approvedAlumni: approved, pendingAlumni: pending };
    }, [alumni]);

    // Filter approved alumni (main list)
    const filteredApprovedAlumni = useMemo(() => {
        return approvedAlumni.filter((a) => {
            const matchesSearch = searchQuery === "" ||
                a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.currentCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (a.organisationName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

            const matchesProfession = professionFilter === "all" || a.profession === professionFilter;

            return matchesSearch && matchesProfession;
        });
    }, [approvedAlumni, searchQuery, professionFilter]);

    // Pagination for approved alumni
    const totalPages = Math.ceil(filteredApprovedAlumni.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAlumni = filteredApprovedAlumni.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, professionFilter]);

    const professions = useMemo(() => {
        const unique = new Set(alumni.map(a => a.profession).filter(Boolean));
        return Array.from(unique).sort();
    }, [alumni]);

    const approvedCount = approvedAlumni.length;
    const pendingCount = pendingAlumni.length;

    // Handle supporting a pending alumni
    const handleSupport = async (alumniId: string, alumniUid: string) => {
        if (!user?.uid) return;

        // Check if already supported
        const alumniRecord = alumni.find(a => a.id === alumniId);
        if (alumniRecord?.supportedBy?.includes(user.uid)) {
            return; // Already supported
        }

        setSupporting(prev => new Set(prev).add(alumniId));
        try {
            await addSupporter(alumniUid, user.uid);
            // Update local state
            setAlumni(prev => prev.map(a =>
                a.id === alumniId
                    ? { ...a, supportedBy: [...(a.supportedBy || []), user.uid] }
                    : a
            ));
        } catch (error) {
            console.error('Error adding supporter:', error);
            alert('Failed to add support. Please try again.');
        } finally {
            setSupporting(prev => {
                const next = new Set(prev);
                next.delete(alumniId);
                return next;
            });
        }
    };

    // Show access denied if user is pending
    if (!authLoading && user && alumniData && !canAccess) {
        return (
            <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
                    <h1 className="text-2xl font-bold mb-2 text-yellow-800">Access Restricted</h1>
                    <p className="text-yellow-700 mb-4">
                        Your registration is currently pending approval. Only approved alumni can access the alumni directory.
                    </p>
                    <p className="text-sm text-yellow-600">
                        Please wait for your registration to be approved by the governing body.
                    </p>
                </div>
            </div>
        );
    }

    if (authLoading || loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
                <p className="text-neutral-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    <span className="text-[#FF9933]">Alumni</span> <span className="text-[#138808]">Directory</span>
                </h1>
                <p className="text-neutral-600">Connect with JNV Lepakshi alumni worldwide</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-lg border border-neutral-200 bg-white p-4">
                    <p className="text-sm text-neutral-600">Total Registered</p>
                    <p className="text-2xl font-bold text-neutral-900">{alumni.length}</p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-white p-4">
                    <p className="text-sm text-neutral-600">Verified Alumni</p>
                    <p className="text-2xl font-bold text-[#138808]">{approvedCount}</p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-white p-4">
                    <p className="text-sm text-neutral-600">Pending Approval</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 space-y-4">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search by name, profession, city, or organisation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    <select
                        value={professionFilter}
                        onChange={(e) => setProfessionFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                    >
                        <option value="all">All Professions</option>
                        {professions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>

            {/* Approved Alumni List */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-neutral-600">Loading alumni...</p>
                </div>
            ) : paginatedAlumni.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-neutral-600">No alumni found matching your criteria.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {paginatedAlumni.map((a) => (
                            <div
                                key={a.id}
                                className="rounded-2xl border border-neutral-200 bg-white p-6 hover:shadow-lg transition-shadow h-full flex flex-col"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#FF9933]/20 to-[#138808]/20 flex items-center justify-center text-neutral-700 font-semibold text-lg flex-shrink-0">
                                        {getInitials(a.fullName)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-semibold text-neutral-900 truncate">{a.fullName}</h2>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-neutral-600">
                                            <FaGraduationCap className="text-[#FF9933]" />
                                            <span>{a.joinedYear} - {a.passedOutYear}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm flex-1">
                                    {a.profession && (
                                        <div className="flex items-start gap-2">
                                            <FaBriefcase className="text-[#138808] mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <span className="font-medium text-neutral-800">{a.profession}</span>
                                                {a.professionOther && <span className="text-neutral-600"> - {a.professionOther}</span>}
                                            </div>
                                        </div>
                                    )}
                                    {a.workRole && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-neutral-600">Role:</span>
                                            <span className="font-medium text-neutral-800">{a.workRole}</span>
                                        </div>
                                    )}
                                    {a.organisationName && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-neutral-600">At:</span>
                                            <span className="font-medium text-neutral-800">{a.organisationName}</span>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-2">
                                        <FaMapMarkerAlt className="text-[#FF9933] mt-0.5 flex-shrink-0" />
                                        <span className="text-neutral-800">
                                            {a.currentCity}, {a.currentState}
                                            {a.workCity && a.workCity !== a.currentCity && (
                                                <span className="text-neutral-600"> • Work: {a.workCity}, {a.workState}</span>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {canSeeContactDetails && (
                                    <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2">
                                        <a href={`mailto:${a.email}`} className="flex items-center gap-2 text-sm text-[#138808] hover:underline">
                                            <FaEnvelope />
                                            <span className="truncate">{a.email}</span>
                                        </a>
                                        <a href={`tel:${a.mobile.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-[#FF9933] hover:underline">
                                            <FaPhone />
                                            <span>{a.mobile}</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6 mb-8">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                            >
                                <FaChevronLeft />
                            </button>
                            <span className="px-4 py-2 text-sm text-neutral-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-md border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Pending Alumni Section */}
            {pendingAlumni.length > 0 && (userRole === Roles.Admin || userRole === Roles.Governing_body || userRole === Roles.Alumni || (alumniData?.status === AlumniStatus.Approved)) && (
                <div className="mt-12 pt-8 border-t border-neutral-200">

                    <h2 className="text-2xl text-center font-bold mb-6 text-yellow-600">Pending for Approval</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingAlumni.map((a) => (
                            <div
                                key={a.id}
                                className="rounded-2xl border border-yellow-200 bg-yellow-50/30 p-6 hover:shadow-lg transition-shadow h-full flex flex-col"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center text-neutral-700 font-semibold text-lg flex-shrink-0">
                                        {getInitials(a.fullName)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-semibold text-neutral-900 truncate">{a.fullName}</h2>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-neutral-600">
                                            <FaGraduationCap className="text-[#FF9933]" />
                                            <span>{a.joinedYear} - {a.passedOutYear}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm flex-1">
                                    {a.profession && (
                                        <div className="flex items-start gap-2">
                                            <FaBriefcase className="text-[#138808] mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <span className="font-medium text-neutral-800">{a.profession}</span>
                                                {a.professionOther && <span className="text-neutral-600"> - {a.professionOther}</span>}
                                            </div>
                                        </div>
                                    )}
                                    {a.workRole && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-neutral-600">Role:</span>
                                            <span className="font-medium text-neutral-800">{a.workRole}</span>
                                        </div>
                                    )}
                                    {a.organisationName && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-neutral-600">At:</span>
                                            <span className="font-medium text-neutral-800">{a.organisationName}</span>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-2">
                                        <FaMapMarkerAlt className="text-[#FF9933] mt-0.5 flex-shrink-0" />
                                        <span className="text-neutral-800">
                                            {a.currentCity}, {a.currentState}
                                        </span>
                                    </div>
                                </div>

                                {canSeeContactDetails && (
                                    <div className="mt-4 pt-4 border-t border-yellow-200 space-y-2">
                                        <a href={`mailto:${a.email}`} className="flex items-center gap-2 text-sm text-[#138808] hover:underline">
                                            <FaEnvelope />
                                            <span className="truncate">{a.email}</span>
                                        </a>
                                        <a href={`tel:${a.mobile.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-[#FF9933] hover:underline">
                                            <FaPhone />
                                            <span>{a.mobile}</span>
                                        </a>
                                    </div>
                                )}

                                {/* Support Section */}
                                {user?.uid && !a.supportedBy?.includes(user.uid) && (
                                    <div className="mt-4 pt-4 border-t border-yellow-200">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-neutral-700">Do you know him/her?</span>
                                            <button
                                                onClick={() => handleSupport(a.id, a.uid)}
                                                disabled={supporting.has(a.id)}
                                                className="px-4 py-1.5 rounded-md bg-[#138808] text-white text-sm font-medium hover:bg-[#138808]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {supporting.has(a.id) ? 'Adding...' : 'Yes'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {user?.uid && a.supportedBy?.includes(user.uid) && (
                                    <div className="mt-4 pt-4 border-t border-yellow-200">
                                        <span className="text-sm text-[#138808] font-medium">✓ You have supported this alumni</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
