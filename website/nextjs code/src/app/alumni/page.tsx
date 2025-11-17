'use client';
import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllAlumni, AlumniRecord } from '@/app/database/dbops';
import { AlumniStatus, Roles } from '@/app/database/Enums';
import { FaSearch, FaBriefcase, FaMapMarkerAlt, FaEnvelope, FaPhone, FaGraduationCap, FaChevronLeft, FaChevronRight, FaCheckCircle, FaClock, FaUserShield, FaEye, FaKey, FaUsers, FaLock } from 'react-icons/fa';
import { IconType } from 'react-icons';

function getInitials(name: string) {
    const parts = name.split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts[parts.length - 1]?.[0] ?? "";
    return (first + last).toUpperCase();
}

const privilegedRoles = new Set<Roles>([
    Roles.Admin,
    Roles.Treasurer,
    Roles.Governing_body,
    Roles.Verification_committee,
]);

const getRoleLabel = (role?: Roles | null) => {
    switch (role) {
        case Roles.Admin:
            return 'Administrator';
        case Roles.Treasurer:
            return 'Treasurer';
        case Roles.Governing_body:
            return 'Governing Body';
        case Roles.Verification_committee:
            return 'Verification Committee';
        case Roles.Alumni:
            return 'Approved Alumni';
        default:
            return 'Member';
    }
};

type RolePerk = {
    icon: IconType;
    label: string;
    detail: string;
};

export default function AlumniPage() {
    const { user, userRole, alumniData, loading: authLoading } = useAuth();
    const router = useRouter();
    const [alumni, setAlumni] = useState<(AlumniRecord & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [professionFilter, setProfessionFilter] = useState<string>("all");
    const [cityFilter, setCityFilter] = useState<string>("all");
    const [workCityFilter, setWorkCityFilter] = useState<string>("all");
    const [batchFilter, setBatchFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
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

    // Determine if user can see full contact details (phone numbers)
    const canSeeFullContact = useMemo(() => {
        return privilegedRoles.has(userRole as Roles);
    }, [userRole]);

    const statusBadge = (status: AlumniStatus) => {
        if (status === AlumniStatus.Approved) {
            return (
                <span className="relative inline-flex items-center group" aria-label="Verified profile">
                    <FaCheckCircle className="text-green-500" />
                    <span className="pointer-events-none absolute left-1/2 top-full z-10 -translate-x-1/2 -translate-y-1 mt-1 rounded bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                        Verified profile
                    </span>
                </span>
            );
        }
        return (
            <span className="relative inline-flex items-center group" aria-label="Pending verification">
                <FaClock className="text-yellow-500" />
                <span className="pointer-events-none absolute left-1/2 top-full z-10 -translate-x-1/2 -translate-y-1 mt-1 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    Pending verification
                </span>
            </span>
        );
    };

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
                (a.workCity?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                (a.organisationName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

            const matchesProfession = professionFilter === "all" || a.profession === professionFilter;
            const matchesCity = cityFilter === "all" || a.currentCity === cityFilter;
            const matchesWorkCity = workCityFilter === "all" || a.workCity === workCityFilter;
            const matchesBatch = batchFilter === "all" || `${a.joinedYear}-${a.passedOutYear}` === batchFilter;

            return matchesSearch && matchesProfession && matchesCity && matchesWorkCity && matchesBatch;
        });
    }, [approvedAlumni, searchQuery, professionFilter, cityFilter, workCityFilter, batchFilter]);

    // Pagination for approved alumni
    const totalPages = Math.ceil(filteredApprovedAlumni.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAlumni = filteredApprovedAlumni.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, professionFilter, cityFilter, workCityFilter, batchFilter]);

    const professions = useMemo(() => {
        const unique = new Set(alumni.map(a => a.profession).filter(Boolean));
        return Array.from(unique).sort();
    }, [alumni]);

    const cities = useMemo(() => {
        const unique = new Set(
            alumni
                .map(a => a.currentCity)
                .filter((city): city is string => Boolean(city))
        );
        return Array.from(unique).sort();
    }, [alumni]);

    const workCities = useMemo(() => {
        const unique = new Set(
            alumni
                .map(a => a.workCity)
                .filter((city): city is string => Boolean(city))
        );
        return Array.from(unique).sort();
    }, [alumni]);

    const batches = useMemo(() => {
        const unique = new Set(alumni.map(a => `${a.joinedYear}-${a.passedOutYear}`));
        return Array.from(unique).sort((a, b) => b.localeCompare(a));
    }, [alumni]);

    const approvedCount = approvedAlumni.length;
    const pendingCount = pendingAlumni.length;

    const roleAccessMeta = useMemo(() => {
        const role = userRole as Roles | undefined;
        const baseLabel = getRoleLabel(role);

        if (role && privilegedRoles.has(role)) {
            return {
                roleLabel: baseLabel,
                accessLabel: 'Privileged access',
                badgeClass: 'bg-emerald-100 text-emerald-700',
                description: 'You can view complete contact details and manage verification queues.',
                perks: [
                    { icon: FaEye, label: 'Full contacts', detail: 'Phone & email for every approved alumni' },
                    { icon: FaUserShield, label: 'Verification queue', detail: `${pendingCount} profiles awaiting review` },
                    { icon: FaKey, label: 'Management tools', detail: 'Approve, verify, and manage members' },
                ] as RolePerk[],
            };
        }

        if (role === Roles.Alumni) {
            return {
                roleLabel: baseLabel,
                accessLabel: 'Community access',
                badgeClass: 'bg-blue-100 text-blue-700',
                description: 'You can explore verified alumni and stay updated on pending profiles.',
                perks: [
                    { icon: FaEnvelope, label: 'Email outreach', detail: 'Contact peers via verified emails' },
                    { icon: FaUsers, label: 'Network growth', detail: `${alumni.length} registered members` },
                    { icon: FaUserShield, label: 'Profile tracker', detail: 'Follow the progress of pending verifications' },
                ] as RolePerk[],
            };
        }

        return {
            roleLabel: baseLabel,
            accessLabel: 'Limited view',
            badgeClass: 'bg-neutral-100 text-neutral-700',
            description: 'Only approved alumni emails are visible until your profile is verified.',
            perks: [
                { icon: FaEnvelope, label: 'Email-only access', detail: 'Phone numbers stay hidden for security' },
                { icon: FaLock, label: 'Secure data', detail: 'Sensitive details protected until approval' },
                { icon: FaUsers, label: 'Stay connected', detail: 'Complete your verification to unlock more' },
            ] as RolePerk[],
        };
    }, [userRole, pendingCount, alumni.length]);

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
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-1">
                        <span className="text-[#FF9933]">Alumni</span> <span className="text-[#138808]">Directory</span>
                    </h1>
                    <p className="text-neutral-600">Connect with JNV Lepakshi alumni worldwide</p>
                </div>
                <div className="w-full rounded-2xl border border-neutral-200 bg-white/90 p-4 shadow-sm lg:max-w-lg">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-neutral-500">Signed in as</p>
                            <p className="text-lg font-semibold text-neutral-900">{roleAccessMeta.roleLabel}</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${roleAccessMeta.badgeClass}`}>
                            {roleAccessMeta.accessLabel}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-600">{roleAccessMeta.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {roleAccessMeta.perks.map(({ icon: Icon, label, detail }) => (
                            <div
                                key={label}
                                className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50/80 px-3 py-1 text-xs text-neutral-600"
                                title={detail}
                            >
                                <Icon className="text-[#138808]" />
                                <span className="font-medium text-neutral-800">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <select
                        value={professionFilter}
                        onChange={(e) => setProfessionFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                    >
                        <option value="all">All Professions</option>
                        {professions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                    >
                        <option value="all">All Cities</option>
                        {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    {workCities.length > 0 && (
                        <select
                            value={workCityFilter}
                            onChange={(e) => setWorkCityFilter(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                        >
                            <option value="all">All Work Cities</option>
                            {workCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    )}
                    <select
                        value={batchFilter}
                        onChange={(e) => setBatchFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                    >
                        <option value="all">All Batches</option>
                        {batches.map(batch => <option key={batch} value={batch}>{batch.replace("-", " - ")}</option>)}
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
                                    {a.photoUrl ? (
                                        <Image
                                        src={a.photoUrl}
                                        alt={`${a.fullName} profile photo`}
                                        width={64}   // equivalent to h-16
                                        height={64}  // equivalent to w-16
                                        referrerPolicy="no-referrer"
                                        className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                                      />
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#FF9933]/20 to-[#138808]/20 flex items-center justify-center text-neutral-700 font-semibold text-lg flex-shrink-0">
                                            {getInitials(a.fullName)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-semibold text-neutral-900 truncate">{a.fullName}</h2>
                                            {statusBadge(a.status)}
                                        </div>
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

                                <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2">
                                    <a href={`mailto:${a.email}`} className="flex items-center gap-2 text-sm text-[#138808] hover:underline">
                                        <FaEnvelope />
                                        <span className="truncate">{a.email}</span>
                                    </a>
                                    {canSeeFullContact && a.mobile && (
                                        <a href={`tel:${a.mobile.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-[#FF9933] hover:underline">
                                            <FaPhone />
                                            <span>{a.mobile}</span>
                                        </a>
                                    )}
                                </div>
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
                                    {a.photoUrl ? (
                                        <Image
                                            src={a.photoUrl}
                                            alt={`${a.fullName} profile photo`}
                                            referrerPolicy="no-referrer"
                                            className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center text-neutral-700 font-semibold text-lg flex-shrink-0">
                                            {getInitials(a.fullName)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-semibold text-neutral-900 truncate">{a.fullName}</h2>
                                            {statusBadge(a.status)}
                                        </div>
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

                                <div className="mt-4 pt-4 border-t border-yellow-200 space-y-2">
                                    <a href={`mailto:${a.email}`} className="flex items-center gap-2 text-sm text-[#138808] hover:underline">
                                        <FaEnvelope />
                                        <span className="truncate">{a.email}</span>
                                    </a>
                                    {canSeeFullContact && a.mobile && (
                                        <a href={`tel:${a.mobile.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-[#FF9933] hover:underline">
                                            <FaPhone />
                                            <span>{a.mobile}</span>
                                        </a>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
