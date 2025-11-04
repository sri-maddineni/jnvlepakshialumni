"use client";
import React from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { HiHome, HiUserGroup, HiClipboardList, HiCog, HiUserCircle, HiShieldCheck, HiEye, HiPencil, HiCheck, HiTrash, HiUser, HiPhone, HiRefresh, HiSortAscending, HiSortDescending } from "react-icons/hi";
import ProfileModal from "../../components/Modals/ProfileModal";
import StatusModal from "../../components/Modals/StatusModal";
import ConfirmModal from "../../components/Modals/ConfirmModal";
import ReplaceConfirmModal from "../../components/Modals/ReplaceConfirmModal";
import { Alumni, AlumniFormData, AlumniSuggestionRequest, AlumniSuggestionHistory, ContactPageRequest } from "../../types";
import Image from "next/image";
import { useState } from "react";
import { toast } from "../../components/Toaster";

// Helper function to convert to title case
const toTitleCase = (str: string): string => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
};

// Helper function to format school name
const formatSchoolName = (school: string): string => {
    const titleCaseSchool = toTitleCase(school);
    if (titleCaseSchool.toLowerCase().startsWith('jnv')) {
        return titleCaseSchool;
    }
    return `Jnv ${titleCaseSchool}`;
};

const menu = [
    { name: "Dashboard", icon: <HiHome className="w-6 h-6" />, key: "dashboard" },
    { name: "Alumni", icon: <HiUserGroup className="w-6 h-6" />, key: "alumni" },
    // { name: "Requests", icon: <HiClipboardList className="w-6 h-6" />, key: "requests" },
    // { name: "Manage Users", icon: <HiUserCircle className="w-6 h-6" />, key: "users" },

    { name: "Add Alumni", icon: <HiUserCircle className="w-6 h-6" />, key: "add-alumni" },
    { name: "Alum Sugg.", icon: <HiClipboardList className="w-6 h-6 text-blue-600" />, key: "alumni-suggestions" },
    { name: "History", icon: <HiClipboardList className="w-6 h-6 text-green-600" />, key: "history" },
    { name: "Contact Page", icon: <HiClipboardList className="w-6 h-6 text-red-600" />, key: "contact-page" },
    { name: "Settings", icon: <HiCog className="w-6 h-6" />, key: "settings" },
];

function AddAlumniForm() {
    const [form, setForm] = React.useState<AlumniFormData>({
        fullName: "",
        email: "",
        phone: "",
        jnvSchool: "",
        qualification: "",
        profession: "",
        role: "",
        organisation: "",
        homePlace: "",
        homeCity: "",
        homeState: "",
        homePincode: "",
        workCity: "",
        workState: "",
    });
    const [schools, setSchools] = React.useState<string[]>([]);
    const [professions, setProfessions] = React.useState<string[]>([]);
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");
    const [formLoading, setFormLoading] = React.useState(false);
    React.useEffect(() => {
        async function fetchOptions() {
            const { getAllAlumni } = await import("../../firebase/firebaseops");
            const all = await getAllAlumni();
            const schoolSet = new Set<string>();
            const professionSet = new Set<string>();
            all.forEach((data: Alumni) => {
                if (data.jnvSchool) schoolSet.add(data.jnvSchool);
                if (data.profession) professionSet.add(data.profession);
            });
            setSchools(Array.from(schoolSet));
            setProfessions(Array.from(professionSet));
        }
        fetchOptions();
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setFormLoading(true);
        try {
            const { addAlumni } = await import("../../firebase/firebaseops");
            await addAlumni({
                fullName: toTitleCase(form.fullName),
                email: form.email.toLowerCase(),
                phone: form.phone,
                jnvSchool: formatSchoolName(form.jnvSchool),
                qualification: toTitleCase(form.qualification),
                profession: toTitleCase(form.profession),
                role: toTitleCase(form.role),
                organisation: toTitleCase(form.organisation),
                homePlace: toTitleCase(form.homePlace),
                homeCity: toTitleCase(form.homeCity),
                homeState: toTitleCase(form.homeState),
                homePincode: form.homePincode,
                workCity: toTitleCase(form.workCity),
                workState: toTitleCase(form.workState),
                createdAt: new Date().toISOString(),
            });
            setSuccess("Alumni added successfully!");
            setForm({
                fullName: "",
                email: "",
                phone: "",
                jnvSchool: "",
                qualification: "",
                profession: "",
                role: "",
                organisation: "",
                homePlace: "",
                homeCity: "",
                homeState: "",
                homePincode: "",
                workCity: "",
                workState: "",
            });
        } catch (err) {
            setError("Failed to add alumni. Please try again." + err);
        } finally {
            setFormLoading(false);
        }
    };
    return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-green-700 flex items-center gap-2">
                <span>Add Alumni</span>
            </h1>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit} autoComplete="off">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-semibold flex items-center gap-1">Full Name <span className="text-red-500">*</span></label>
                        <input name="fullName" value={form.fullName} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="font-semibold flex items-center gap-1">Email <span className="text-red-500">*</span></label>
                        <input name="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="font-semibold flex items-center gap-1">Phone</label>
                        <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="font-semibold flex items-center gap-1">JNV School <span className="text-red-500">*</span></label>
                        <input name="jnvSchool" value={form.jnvSchool} onChange={handleChange} required list="schools" className="w-full border rounded px-3 py-2 mt-1" />
                        <datalist id="schools">
                            {schools.map(s => <option key={s} value={s} />)}
                        </datalist>
                    </div>
                    <div>
                        <label className="font-semibold flex items-center gap-1">Qualification</label>
                        <input name="qualification" value={form.qualification} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="font-semibold flex items-center gap-1">Profession</label>
                        <input name="profession" value={form.profession} onChange={handleChange} list="professions" className="w-full border rounded px-3 py-2 mt-1" />
                        <datalist id="professions">
                            {professions.map(p => <option key={p} value={p} />)}
                        </datalist>
                    </div>
                    <div>
                        <label className="font-semibold flex items-center gap-1">Role</label>
                        <input name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="font-semibold flex items-center gap-1">Organisation</label>
                        <input name="organisation" value={form.organisation} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="font-semibold mb-2">Home Location</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="font-medium">Place</label>
                            <input name="homePlace" value={form.homePlace} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                        </div>
                        <div>
                            <label className="font-medium">City</label>
                            <input name="homeCity" value={form.homeCity} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                        </div>
                        <div>
                            <label className="font-medium">State</label>
                            <input name="homeState" value={form.homeState} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                        </div>
                        <div>
                            <label className="font-medium">Pincode</label>
                            <input name="homePincode" value={form.homePincode} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="font-semibold mb-2">Work Location</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="font-medium">City <span className="text-red-500">*</span></label>
                            <input name="workCity" value={form.workCity} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1" />
                        </div>
                        <div>
                            <label className="font-medium">State <span className="text-red-500">*</span></label>
                            <input name="workState" value={form.workState} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1" />
                        </div>
                    </div>
                </div>
                {error && <div className="text-red-600 font-medium mt-2">{error}</div>}
                {success && <div className="text-green-600 font-medium mt-2">{success}</div>}
                <button type="submit" disabled={formLoading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-green-700 transition disabled:opacity-60">
                    {formLoading ? "Adding..." : "Add Alumni"}
                </button>
            </form>
        </div>
    );
}

function AlumniList({ onView, onEdit }: { onView: (alumni: Alumni) => void; onEdit: (alumni: Alumni) => void }) {
    const [alumni, setAlumni] = React.useState<Alumni[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [search, setSearch] = React.useState("");
    const [profileImages, setProfileImages] = React.useState<Record<string, string | null>>({});
    const [profileImagesLoading, setProfileImagesLoading] = React.useState(false);
    const [showReplaceModal, setShowReplaceModal] = useState(false);
    const [replaceAlumni, setReplaceAlumni] = useState<{ id: string; fullName: string; oldValue: string }[]>([]);
    // Searchable fields and their labels
    const SEARCH_FIELDS = [
        { key: 'fullName', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'jnvSchool', label: 'School' },
        { key: 'qualification', label: 'Qualification' },
        { key: 'profession', label: 'Profession' },
        { key: 'role', label: 'Role' },
        { key: 'organisation', label: 'Organisation' },
        { key: 'homePlace', label: 'Home Place' },
        { key: 'homeCity', label: 'Home City' },
        { key: 'homeState', label: 'Home State' },
        { key: 'homePincode', label: 'Home Pincode' },
        { key: 'workCity', label: 'Work City' },
        { key: 'workState', label: 'Work State' },
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

    const [sortField, setSortField] = React.useState<'name' | 'createdAt'>("createdAt");
    const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>("desc");

    const [replaceField, setReplaceField] = useState("jnvSchool");
    const [replaceValue, setReplaceValue] = useState("");
    const [replacing, setReplacing] = useState(false);
    const REPLACE_FIELDS = [
        { key: "jnvSchool", label: "School" },
        { key: "role", label: "Role" },
        { key: "profession", label: "Profession" },
        { key: "workCity", label: "Work City" },
        { key: "workState", label: "Work State" },
        { key: "homeCity", label: "Home City" },
        { key: "homeState", label: "Home State" },
    ];

    // Fetch alumni data
    const fetchAlumniData = async () => {
        setLoading(true);
        setProfileImagesLoading(true);
        const { getAllAlumni } = await import("../../firebase/firebaseops");
        const all = await getAllAlumni();
        setAlumni(all);
        setLoading(false);
        // Fetch profile images in batch
        try {
            const { getMultipleUserProfileImages } = await import('../actions/clerkActions');
            const emails = all.map(a => a.email).filter(Boolean) as string[];
            const images = await getMultipleUserProfileImages(emails);
            setProfileImages(images);
        } catch (error) {
            console.error('Error fetching profile images:', error);
        } finally {
            setProfileImagesLoading(false);
        }
    };

    React.useEffect(() => {
        fetchAlumniData();
    }, []);

    const filtered = alumni.filter(a => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return selectedFields.some(field => {
            const value = a[field as keyof Alumni] as string | undefined;
            return value && value.toLowerCase().includes(q);
        });
    });

    // Sorting logic
    const sortedAlumni = React.useMemo(() => {
        const arr = [...filtered];
        if (sortField === "name") {
            arr.sort((a, b) => {
                const nA = (a.fullName || "").toLowerCase();
                const nB = (b.fullName || "").toLowerCase();
                return sortDir === "asc" ? nA.localeCompare(nB) : nB.localeCompare(nA);
            });
        } else if (sortField === "createdAt") {
            arr.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return sortDir === "asc" ? dateA - dateB : dateB - dateA;
            });
        }
        return arr;
    }, [filtered, sortField, sortDir]);

    // Helper to check if profile is incomplete (3 or more required fields missing/empty, except phone)
    const isIncomplete = (a: Alumni) => {
        const requiredFields = [
            a.fullName,
            a.email,
            a.jnvSchool,
            a.qualification,
            a.profession,
            a.role,
            a.organisation,
            a.homePlace,
            a.homeCity,
            a.homeState,
            a.homePincode,
            a.workCity,
            a.workState,
            a.createdAt,
        ];
        const emptyCount = requiredFields.filter(f => !f || f.trim() === "").length;
        return emptyCount >= 3;
    };

    if (loading) return (
        <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    if (!alumni.length) return <div className="text-gray-500">No alumni found.</div>;
    return (
        <div>
            {/* Refresh button, checkboxes, and search bar */}
            <div className="flex flex-wrap gap-2 mb-2 items-center">
                <button
                    type="button"
                    className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    title="Refresh alumni list"
                    onClick={fetchAlumniData}
                >
                    <HiRefresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                    type="button"
                    className={`px-3 py-1 rounded font-semibold text-xs border ${allSelected ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-green-50'}`}
                    onClick={handleAllToggle}
                >
                    {allSelected ? 'Deselect All' : 'Select All'}
                </button>
                {SEARCH_FIELDS.map(f => (
                    <label key={f.key} className="flex items-center gap-1 text-xs font-medium bg-gray-100 px-2 py-1 rounded cursor-pointer">
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
            <div className="mb-4 flex items-center gap-2">
                <div className="flex items-center w-full max-w-xs">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={`Search by ${selectedFields.map(f => SEARCH_FIELDS.find(sf => sf.key === f)?.label).join(' or ') || '...'}`}
                            className="w-full border rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        </span>
                        {search && (
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                                onClick={() => setSearch("")}
                                tabIndex={-1}
                                aria-label="Clear search"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></svg>
                            </button>
                        )}
                    </div>
                    <span className="ml-3 text-xs text-gray-500 font-semibold whitespace-nowrap">{filtered.length}/{alumni.length}</span>
                </div>
                {/* Sort dropdown */}
                <div className="flex items-center gap-1">
                    <label className="text-sm text-gray-600 font-semibold">Sort:</label>
                    <select
                        value={sortField}
                        onChange={e => setSortField(e.target.value as 'name' | 'createdAt')}
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                    >
                        <option value="name">Name</option>
                        <option value="createdAt">Created</option>
                    </select>
                    <button
                        className="ml-1 p-1 rounded hover:bg-gray-100"
                        onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}
                        title={sortDir === "asc" ? "Ascending" : "Descending"}
                    >
                        {sortDir === "asc" ? <HiSortAscending className="w-5 h-5" /> : <HiSortDescending className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            {/* Find & Replace UI (only when search is active) */}
            {search.trim() && (
                <div className="flex flex-col sm:flex-row items-center gap-2 mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <span className="font-semibold text-yellow-700">Find & Replace:</span>
                    <select
                        value={replaceField}
                        onChange={e => setReplaceField(e.target.value)}
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200"
                    >
                        {REPLACE_FIELDS.map(f => (
                            <option key={f.key} value={f.key}>{f.label}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={replaceValue}
                        onChange={e => setReplaceValue(e.target.value)}
                        placeholder="New value"
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200"
                    />
                    <button
                        className="bg-yellow-600 text-white px-4 py-1 rounded font-semibold hover:bg-yellow-700 transition disabled:opacity-60"
                        disabled={!replaceValue || replacing}
                        onClick={() => {
                            // Gather all exact matches
                            const searchValue = search.trim().toLowerCase();
                            const matches = sortedAlumni
                                .filter(a => ((a[replaceField as keyof Alumni] || '').trim().toLowerCase() === searchValue))
                                .map(a => ({ id: a.id, fullName: a.fullName || '', oldValue: a[replaceField as keyof Alumni] || '' }));
                            setReplaceAlumni(matches);
                            setShowReplaceModal(true);
                        }}
                    >
                        Replace
                    </button>
                </div>
            )}
            <ReplaceConfirmModal
                open={showReplaceModal}
                onClose={() => setShowReplaceModal(false)}
                onConfirm={async () => {
                    setShowReplaceModal(false);
                    setReplacing(true);
                    for (const a of replaceAlumni) {
                        try {
                            const { db } = await import("../../firebase/firebaseconfig");
                            const { alumniCollection } = await import("../../firebase/firebaseops");
                            const { doc, updateDoc } = await import("firebase/firestore");
                            const alumniDoc = doc(db, alumniCollection.path, a.id);
                            await updateDoc(alumniDoc, { [replaceField]: replaceValue });
                            toast.success(`Updated ${a.fullName}`);
                        } catch (err) {
                            toast.error(`Failed to update ${a.fullName}`);
                            console.log(err)
                        }
                    }
                    setReplacing(false);
                    setReplaceValue("");
                }}
                alumni={replaceAlumni}
                field={replaceField}
                newValue={replaceValue}
                fieldLabel={REPLACE_FIELDS.find(f => f.key === replaceField)?.label || replaceField}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {sortedAlumni.map(a => {
                    const profileImageUrl = profileImages[a.email || ''] || null;
                    const initials = a.fullName ? a.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "";
                    return (
                        <div key={a.id} className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2 border border-gray-100 hover:shadow-xl transition">
                            {/* Red dot for incomplete profile */}
                            {isIncomplete(a) && (
                                <span className="absolute top-3 right-3 w-3 h-3 rounded-full bg-red-500 border-2 border-white animate-pulse" title="Incomplete profile"></span>
                            )}
                            {/* Avatar and name side by side */}
                            <div className="flex items-center gap-3 w-full justify-center mb-1">
                                {profileImagesLoading ? (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center text-xl font-bold text-blue-700 shadow border-2 border-white animate-pulse">
                                        <div className="w-6 h-6 bg-blue-200 rounded-full"></div>
                                    </div>
                                ) : profileImageUrl ? (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center text-xl font-bold text-blue-700 shadow border-2 border-white overflow-hidden">
                                        <Image
                                            src={profileImageUrl}
                                            alt={a.fullName || "Profile"}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                        <div className="hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-yellow-100 text-xl font-bold text-blue-700">
                                            {initials || <HiUser className="w-7 h-7 text-blue-300" />}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center text-xl font-bold text-blue-700 shadow border-2 border-white">
                                        {initials || <HiUser className="w-7 h-7 text-blue-300" />}
                                    </div>
                                )}
                                <div className="text-base font-semibold text-gray-800 text-left truncate uppercase" title={a.fullName}>{a.fullName}</div>
                            </div>
                            <div className="text-blue-700 font-medium text-center line-clamp-1 w-full" title={a.profession}>{a.profession || <span className="text-gray-400">Profession not set</span>}</div>
                            <div className="text-gray-600 text-center line-clamp-1 w-full" title={a.organisation}>{a.organisation || <span className="text-gray-400">Organisation not set</span>}</div>
                            <div className="text-xs text-gray-500 text-center line-clamp-1 w-full" title={a.email}>{a.email}</div>
                            {/* Action row: phone, view, edit */}
                            <div className="flex gap-2 mt-2 items-center justify-center w-full">
                                {a.phone && a.phone.trim() !== "" && (
                                    <span className="text-green-500" title="Phone available">
                                        <HiPhone className="w-4 h-4" />
                                    </span>
                                )}
                                <button onClick={() => onView(a)} className="p-2 rounded hover:bg-green-100" title="View"><HiEye className="w-5 h-5 text-blue-600" /></button>
                                <button onClick={() => onEdit(a)} className="p-2 rounded hover:bg-yellow-100" title="Edit"><HiPencil className="w-5 h-5 text-yellow-600" /></button>
                                {/* Delete alumni button */}
                                <button
                                    onClick={async () => {
                                        if (window.confirm(`Are you sure you want to delete alumni '${a.fullName}'? This cannot be undone.`)) {
                                            try {
                                                const { deleteAlumni } = await import("../../firebase/firebaseops");
                                                await deleteAlumni(a.id);
                                                fetchAlumniData();
                                            } catch (err) {
                                                alert("Failed to delete alumni. Please try again." + err);
                                            }
                                        }
                                    }}
                                    className="p-2 rounded hover:bg-red-100"
                                    title="Delete"
                                >
                                    <HiTrash className="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {sortedAlumni.length === 0 && (
                <div className="text-center text-gray-400 py-6">No alumni match your search.</div>
            )}
        </div>
    );
}

function AlumniView({ alumni, onBack }: { alumni: Alumni; onBack: () => void }) {
    const [profileImageUrl, setProfileImageUrl] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const initials = alumni.fullName ? alumni.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "";

    React.useEffect(() => {
        async function fetchProfileImage() {
            if (!alumni.email) {
                setLoading(false);
                return;
            }

            try {
                const { getUserProfileImageByEmail } = await import('../actions/clerkActions');
                const imageUrl = await getUserProfileImageByEmail(alumni.email);
                setProfileImageUrl(imageUrl);
            } catch (error) {
                console.error('Error fetching profile image:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProfileImage();
    }, [alumni.email]);

    if (!alumni) return null;

    return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
            <button onClick={onBack} className="mb-4 text-green-600 hover:underline">&larr; Back to list</button>
            <div className="flex items-center gap-4 mb-6">
                {loading ? (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center text-2xl font-bold text-blue-700 shadow border-2 border-white animate-pulse">
                        <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
                    </div>
                ) : profileImageUrl ? (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center text-2xl font-bold text-blue-700 shadow border-2 border-white overflow-hidden">
                        <Image
                            src={profileImageUrl}
                            alt={alumni.fullName || "Profile"}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        <div className="hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-yellow-100 text-2xl font-bold text-blue-700">
                            {initials || <HiUser className="w-8 h-8 text-blue-300" />}
                        </div>
                    </div>
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center text-2xl font-bold text-blue-700 shadow border-2 border-white">
                        {initials || <HiUser className="w-8 h-8 text-blue-300" />}
                    </div>
                )}
                <h1 className="text-3xl font-bold text-green-700 flex items-center gap-2">
                    <HiEye className="w-7 h-7 text-blue-600" /> <span>{alumni.fullName}</span>
                </h1>
            </div>
            <div className="space-y-2">
                <div><b>Email:</b> {alumni.email}</div>
                <div><b>Phone:</b> {alumni.phone}</div>
                <div><b>JNV School:</b> {alumni.jnvSchool}</div>
                <div><b>Qualification:</b> {alumni.qualification || "-"}</div>
                <div><b>Profession:</b> {alumni.profession}</div>
                <div><b>Role:</b> {alumni.role}</div>
                <div><b>Organisation:</b> {alumni.organisation}</div>
                <div><b>Home:</b> {alumni.homePlace}, {alumni.homeCity}, {alumni.homeState}, {alumni.homePincode}</div>
                <div><b>Work:</b> {alumni.workCity}, {alumni.workState}</div>
            </div>
        </div>
    );
}

function AlumniEdit({ alumni, onBack }: { alumni: Alumni; onBack: () => void }) {
    const [form, setForm] = React.useState<Alumni>(alumni);
    const [saving, setSaving] = React.useState(false);
    const [success, setSuccess] = React.useState("");
    const [error, setError] = React.useState("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess("");
        setError("");
        try {
            const { db } = await import("../../firebase/firebaseconfig");
            const { alumniCollection } = await import("../../firebase/firebaseops");
            const { doc, updateDoc } = await import("firebase/firestore");
            const alumniDoc = doc(db, alumniCollection.path, alumni.id);
            await updateDoc(alumniDoc, {
                fullName: form.fullName || "",
                phone: form.phone || "",
                jnvSchool: formatSchoolName(form.jnvSchool || ""),
                qualification: form.qualification || "",
                profession: form.profession || "",
                role: form.role || "",
                organisation: form.organisation || "",
                homePlace: form.homePlace || "",
                homeCity: form.homeCity || "",
                homeState: form.homeState || "",
                homePincode: form.homePincode || "",
                workCity: form.workCity || "",
                workState: form.workState || "",
                email: form.email || "", // never change email
            });
            setSuccess("Alumni updated successfully!");
        } catch (err) {
            setError("Failed to update alumni. Please try again." + err);
        } finally {
            setSaving(false);
        }
    };
    return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
            <button onClick={onBack} className="mb-4 text-green-600 hover:underline">&larr; Back to list</button>
            <h1 className="text-3xl font-bold mb-6 text-green-700 flex items-center gap-2">
                <HiPencil className="w-7 h-7 text-yellow-600" /> <span>Edit Alumni</span>
            </h1>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit} autoComplete="off">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-semibold flex items-center gap-1">Full Name</label>
                        <input name="fullName" value={form.fullName || ""} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="font-semibold flex items-center gap-1">Email</label>
                        <input name="email" value={form.email || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1 bg-gray-100 " />
                    </div>
                    <div>
                        <label className="font-semibold flex items-center gap-1">Phone</label>
                        <input name="phone" value={form.phone || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="font-semibold flex items-center gap-1">JNV School</label>
                        <input name="jnvSchool" value={form.jnvSchool || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="font-semibold flex items-center gap-1">Qualification</label>
                        <input name="qualification" value={form.qualification || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="font-semibold flex items-center gap-1">Profession</label>
                        <input name="profession" value={form.profession || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="font-semibold flex items-center gap-1">Role</label>
                        <input name="role" value={form.role || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="font-semibold flex items-center gap-1">Organisation</label>
                        <input name="organisation" value={form.organisation || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="font-semibold mb-2">Home Location</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="font-medium">Place</label>
                            <input name="homePlace" value={form.homePlace || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                        </div>
                        <div>
                            <label className="font-medium">City</label>
                            <input name="homeCity" value={form.homeCity || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                        </div>
                        <div>
                            <label className="font-medium">State</label>
                            <input name="homeState" value={form.homeState || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                        </div>
                        <div>
                            <label className="font-medium">Pincode</label>
                            <input name="homePincode" value={form.homePincode || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="font-semibold mb-2">Work Location</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="font-medium">City</label>
                            <input name="workCity" value={form.workCity || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                        </div>
                        <div>
                            <label className="font-medium">State</label>
                            <input name="workState" value={form.workState || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                        </div>
                    </div>
                </div>
                {error && <div className="text-red-600 font-medium mt-2">{error}</div>}
                {success && <div className="text-green-600 font-medium mt-2">{success}</div>}
                <button type="submit" disabled={saving} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving ? <HiPencil className="w-5 h-5 animate-spin" /> : <HiPencil className="w-5 h-5" />} Save Changes
                </button>
            </form>
        </div>
    );
}

function AlumniSuggestionsList() {
    const [suggestions, setSuggestions] = React.useState<AlumniSuggestionRequest[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [profileModalId, setProfileModalId] = React.useState<string | null>(null);
    const [statusModal, setStatusModal] = React.useState<{ open: boolean; suggestion: AlumniSuggestionRequest | null }>({ open: false, suggestion: null });
    React.useEffect(() => {
        async function fetchSuggestions() {
            const { getAllAlumniSuggestionRequests } = await import("../../firebase/firebaseops");
            const all = await getAllAlumniSuggestionRequests();
            setSuggestions(all);
            setLoading(false);
        }
        fetchSuggestions();
    }, []);
    const handleComplete = async (suggestion: AlumniSuggestionRequest, statusMessage: string) => {
        const { addAlumniSuggestionToHistory } = await import("../../firebase/firebaseops");
        await addAlumniSuggestionToHistory(suggestion, statusMessage);
        setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
        setStatusModal({ open: false, suggestion: null });
    };
    if (loading) return <div className="text-gray-500">Loading suggestions...</div>;
    if (!suggestions.length) return <div className="text-gray-500">No alumni suggestions found.</div>;
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow">
                <thead>
                    <tr className="bg-blue-50">
                        <th className="px-2 py-2 text-center">Name</th>
                        <th className="px-2 py-2 text-center">Email</th>
                        <th className="px-2 py-2 text-center">Phone</th>
                        <th className="px-2 py-2 text-center">Profession</th>
                        <th className="px-2 py-2 text-center">Role</th>
                        <th className="px-2 py-2 text-center">Organisation</th>
                        <th className="px-2 py-2 text-center">Message</th>
                        <th className="px-2 py-2 text-center">View</th>
                        <th className="px-2 py-2 text-center">Req At</th>
                        <th className="px-2 py-2 text-center">Done</th>
                    </tr>
                </thead>
                <tbody>
                    {suggestions.map(s => (
                        <tr key={s.id} className="border-b hover:bg-blue-50">
                            <td className="px-2 py-2 text-left">{s.name}</td>
                            <td className="px-2 py-2 text-left">{s.email}</td>
                            <td className="px-2 py-2 text-left">{s.phone}</td>
                            <td className="px-2 py-2 text-left">{s.profession}</td>
                            <td className="px-2 py-2 text-left">{s.role}</td>
                            <td className="px-2 py-2 text-left">{s.organisation}</td>
                            <td className="px-2 py-2 text-left" title={s.message}>view</td>
                            <td className="px-2 py-2 text-left">
                                {s.requestedByAlumniId ? (
                                    <button onClick={() => setProfileModalId(s.requestedByAlumniId!)} title="View Profile">
                                        <HiUserCircle className="w-6 h-6 text-green-600 hover:text-blue-600" />
                                    </button>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td>
                            <td className="px-2 py-2 text-left text-xs text-gray-500">{s.createdAt ? new Date(s.createdAt).toLocaleString() : '-'}</td>
                            <td className="px-2 py-2 text-center">
                                <button onClick={() => setStatusModal({ open: true, suggestion: s })} title="Mark as Completed">
                                    <HiCheck className="w-6 h-6 text-green-600 hover:text-blue-600" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ProfileModal open={!!profileModalId} alumniId={profileModalId} onClose={() => setProfileModalId(null)} />
            <StatusModal
                open={statusModal.open}
                onClose={() => setStatusModal({ open: false, suggestion: null })}
                onSubmit={msg => statusModal.suggestion && handleComplete(statusModal.suggestion, msg)}
            />
        </div>
    );
}

function AlumniSuggestionsHistoryList() {
    const [history, setHistory] = React.useState<AlumniSuggestionHistory[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [profileModalId, setProfileModalId] = React.useState<string | null>(null);
    React.useEffect(() => {
        async function fetchHistory() {
            const { getAllAlumniSuggestionsHistory } = await import("../../firebase/firebaseops");
            const all = await getAllAlumniSuggestionsHistory();
            setHistory(all);
            setLoading(false);
        }
        fetchHistory();
    }, []);
    if (loading) return <div className="text-gray-500">Loading history...</div>;
    if (!history.length) return <div className="text-gray-500">No completed alumni suggestions found.</div>;
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow">
                <thead>
                    <tr className="bg-green-50">
                        <th className="px-2 py-2 text-center">Name</th>
                        <th className="px-2 py-2 text-center">Email</th>
                        <th className="px-2 py-2 text-center">Profession</th>
                        <th className="px-2 py-2 text-center">Organisation</th>
                        <th className="px-2 py-2 text-center">Message</th>
                        <th className="px-2 py-2 text-center">Status</th>
                        <th className="px-2 py-2 text-center">Completed At</th>
                        <th className="px-2 py-2 text-center">Requested By</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map(h => (
                        <tr key={h.id} className="border-b hover:bg-green-50">
                            <td className="px-2 py-2 text-left">{h.name}</td>
                            <td className="px-2 py-2 text-left">{h.email}</td>
                            <td className="px-2 py-2 text-left">{h.profession}</td>
                            <td className="px-2 py-2 text-left">{h.organisation}</td>
                            <td className="px-2 py-2 text-left" title={h.message}>view</td>
                            <td className="px-2 py-2 text-left">{h.statusMessage || '-'}</td>
                            <td className="px-2 py-2 text-left text-xs text-gray-500">{h.completedAt ? new Date(h.completedAt).toLocaleString() : '-'}</td>
                            <td className="px-2 py-2 text-center">
                                {h.requestedByAlumniId ? (
                                    <button onClick={() => setProfileModalId(h.requestedByAlumniId!)} title="View Profile">
                                        <HiUserCircle className="w-6 h-6 text-green-600 hover:text-blue-600" />
                                    </button>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ProfileModal open={!!profileModalId} alumniId={profileModalId} onClose={() => setProfileModalId(null)} />
        </div>
    );
}

function ContactPageAdminList() {
    const [messages, setMessages] = React.useState<ContactPageRequest[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [confirm, setConfirm] = React.useState<{ open: boolean; id: string | null; action: "delete" | "complete" | null }>({ open: false, id: null, action: null });
    React.useEffect(() => {
        async function fetchMessages() {
            const { getDocs } = await import("firebase/firestore");
            const { contactPageRequestsCollection } = await import("../../firebase/firebaseops");
            const snapshot = await getDocs(contactPageRequestsCollection);
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactPageRequest)));
            setLoading(false);
        }
        fetchMessages();
    }, []);
    const handleDelete = async (id: string) => {
        const { deleteContactPageRequest } = await import("../../firebase/firebaseops");
        await deleteContactPageRequest(id);
        setMessages(messages.filter(m => m.id !== id));
        setConfirm({ open: false, id: null, action: null });
    };
    if (loading) return <div className="text-gray-500">Loading contact messages...</div>;
    if (!messages.length) return <div className="text-gray-500">No contact messages found.</div>;
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow">
                <thead>
                    <tr className="bg-red-50">
                        <th className="px-2 py-2 text-center">Type</th>
                        <th className="px-2 py-2 text-center">Email</th>
                        <th className="px-2 py-2 text-center">Message</th>
                        <th className="px-2 py-2 text-center">Created At</th>
                        <th className="px-2 py-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map(m => (
                        <tr key={m.id} className="border-b hover:bg-red-50">
                            <td className="px-2 py-2 text-left">{m.type}</td>
                            <td className="px-2 py-2 text-left">{m.email}</td>
                            <td className="px-2 py-2 text-left" title={m.message}>{m.message}</td>
                            <td className="px-2 py-2 text-left text-xs text-gray-500">{m.createdAt ? new Date(m.createdAt).toLocaleString() : '-'}</td>
                            <td className="px-2 py-2 text-center flex gap-2 justify-center">
                                <button onClick={() => setConfirm({ open: true, id: m.id, action: "delete" })} title="Delete">
                                    <HiTrash className="w-6 h-6 text-red-600 hover:text-red-800" />
                                </button>
                                <button onClick={() => setConfirm({ open: true, id: m.id, action: "complete" })} title="Mark as Completed">
                                    <HiCheck className="w-6 h-6 text-green-600 hover:text-green-800" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ConfirmModal
                open={confirm.open}
                onClose={() => setConfirm({ open: false, id: null, action: null })}
                onConfirm={() => confirm.id && handleDelete(confirm.id)}
                message={confirm.action === "delete" ? "Are you sure you want to delete this message?" : "Mark this message as completed? This will remove it from the list."}
            />
        </div>
    );
}

function HistoryTabs() {
    const [tab, setTab] = React.useState<'alumni'>("alumni");
    return (
        <div>
            <div className="flex gap-4 border-b mb-6">
                <button
                    className={`px-4 py-2 font-semibold border-b-2 transition-colors ${tab === "alumni" ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-green-600"}`}
                    onClick={() => setTab("alumni")}
                >
                    Alumni Suggestions
                </button>
                {/* Future: Add more history types here */}
            </div>
            {tab === "alumni" && <AlumniSuggestionsHistoryList />}
        </div>
    );
}

function AdminDashboardSummary() {
    const [counts, setCounts] = React.useState({
        alumni: 0,
        alumniSuggestions: 0,
        alumniSuggestionsHistory: 0,
        contactMessages: 0,
    });
    React.useEffect(() => {
        async function fetchCounts() {
            const { getAllAlumni } = await import("../../firebase/firebaseops");
            const { getAllAlumniSuggestionRequests } = await import("../../firebase/firebaseops");
            const { getAllAlumniSuggestionsHistory } = await import("../../firebase/firebaseops");
            const { getDocs } = await import("firebase/firestore");
            const { contactPageRequestsCollection } = await import("../../firebase/firebaseops");
            const [alumni, suggestions, history, contactSnap] = await Promise.all([
                getAllAlumni(),
                getAllAlumniSuggestionRequests(),
                getAllAlumniSuggestionsHistory(),
                getDocs(contactPageRequestsCollection),
            ]);
            setCounts({
                alumni: alumni.length,
                alumniSuggestions: suggestions.length,
                alumniSuggestionsHistory: history.length,
                contactMessages: contactSnap.docs.length,
            });
        }
        fetchCounts();
    }, []);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-green-50 rounded-xl shadow p-6 flex flex-col items-center">
                <HiUserGroup className="w-10 h-10 text-green-600 mb-2" />
                <div className="text-2xl font-bold text-green-700">{counts.alumni}</div>
                <div className="text-gray-700">Total Alumni</div>
            </div>
            <div className="bg-blue-50 rounded-xl shadow p-6 flex flex-col items-center">
                <HiClipboardList className="w-10 h-10 text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-blue-700">{counts.alumniSuggestions}</div>
                <div className="text-gray-700">Pending Alumni Suggestions</div>
            </div>
            <div className="bg-green-100 rounded-xl shadow p-6 flex flex-col items-center">
                <HiClipboardList className="w-10 h-10 text-green-700 mb-2" />
                <div className="text-2xl font-bold text-green-800">{counts.alumniSuggestionsHistory}</div>
                <div className="text-gray-700">Completed Alumni Suggestions</div>
            </div>
            <div className="bg-red-50 rounded-xl shadow p-6 flex flex-col items-center">
                <HiClipboardList className="w-10 h-10 text-red-600 mb-2" />
                <div className="text-2xl font-bold text-red-700">{counts.contactMessages}</div>
                <div className="text-gray-700">Contact Messages</div>
            </div>
        </div>
    );
}

export default function AdminPage() {
    const { user, isSignedIn } = useUser();
    const router = useRouter();
    const isAdmin = user?.publicMetadata?.role === "admin";
    const [selected, setSelected] = React.useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [alumniTab, setAlumniTab] = React.useState<"list" | "view" | "edit">("list");
    const [selectedAlumni, setSelectedAlumni] = React.useState<Alumni | null>(null);

    React.useEffect(() => {
        if (isSignedIn && !isAdmin) {
            router.replace("/");
        }
    }, [isSignedIn, isAdmin, router]);

    return (
        <main className="flex min-h-screen bg-gray-50">
            <SignedIn>
                {isAdmin ? (
                    <div className="flex w-full min-h-screen">
                        {/* Sidebar for desktop */}
                        <aside className="hidden md:flex w-64 bg-white border-r border-green-100 p-6 flex-col gap-4 min-h-screen">
                            <div className="flex items-center gap-2 mb-8">
                                <HiShieldCheck className="w-7 h-7 text-green-600" />
                                <span className="text-xl font-bold text-green-700">Admin Panel</span>
                            </div>
                            {menu.map((item) => (
                                <button
                                    key={item.key}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-50 transition-colors w-full text-left ${selected === item.key ? "bg-green-100 font-semibold" : ""}`}
                                    onClick={() => setSelected(item.key)}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </button>
                            ))}
                        </aside>
                        {/* Floating hamburger for mobile */}
                        <button
                            className="md:hidden fixed bottom-4 right-4 z-50 bg-green-600 text-white rounded-full p-4 shadow-lg focus:outline-none hover:bg-green-700 transition"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open admin menu"
                        >
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        {/* Mobile sidebar drawer */}
                        {sidebarOpen && (
                            <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex">
                                <aside className="w-64 bg-white border-r border-green-100 p-6 flex flex-col gap-4 min-h-screen animate-slide-in">
                                    <div className="flex items-center gap-2 mb-8">
                                        <HiShieldCheck className="w-7 h-7 text-green-600" />
                                        <span className="text-xl font-bold text-green-700">Admin Panel</span>
                                    </div>
                                    {menu.map((item) => (
                                        <button
                                            key={item.key}
                                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-50 transition-colors w-full text-left ${selected === item.key ? "bg-green-100 font-semibold" : ""}`}
                                            onClick={() => { setSelected(item.key); setSidebarOpen(false); }}
                                        >
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </button>
                                    ))}
                                </aside>
                                <div className="flex-1" onClick={() => setSidebarOpen(false)} />
                            </div>
                        )}
                        {/* Main Content */}
                        <section className="flex-1 p-4 md:p-10 pt-4 md:pt-10 w-full overflow-x-auto">
                            {selected === "dashboard" && (
                                <>
                                    <AdminDashboardSummary />
                                </>
                            )}
                            {selected === "add-alumni" && <AddAlumniForm />}
                            {selected === "alumni" && alumniTab === "list" && (
                                <AlumniList
                                    onView={a => { setSelectedAlumni(a); setAlumniTab("view"); }}
                                    onEdit={a => { setSelectedAlumni(a); setAlumniTab("edit"); }}
                                />
                            )}
                            {selected === "alumni" && alumniTab === "view" && selectedAlumni && (
                                <AlumniView alumni={selectedAlumni} onBack={() => setAlumniTab("list")} />
                            )}
                            {selected === "alumni" && alumniTab === "edit" && selectedAlumni && (
                                <AlumniEdit alumni={selectedAlumni} onBack={() => setAlumniTab("list")} />
                            )}
                            {selected === "alumni-suggestions" && <AlumniSuggestionsList />}
                            {selected === "history" && <HistoryTabs />}
                            {selected === "contact-page" && <ContactPageAdminList />}
                        </section>
                    </div>
                ) : null}
            </SignedIn>
            <SignedOut>
                <div className="flex flex-col items-center justify-center w-full h-screen gap-6">
                    <h2 className="text-2xl font-semibold text-red-600">Sign in required</h2>
                    <p className="text-gray-700">Please sign in as an admin to access the dashboard.</p>
                    <SignInButton mode="modal">
                        <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Sign In</button>
                    </SignInButton>
                </div>
            </SignedOut>
        </main>
    );
} 