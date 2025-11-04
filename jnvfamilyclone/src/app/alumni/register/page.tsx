"use client";
import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { addAlumni, checkDuplicateAlumniEmail } from "../../../firebase/firebaseops";
import Toaster, { toast } from "../../../components/Toaster";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseconfig";
import * as paths from "../../../firebase/paths";

const alumniCollection = collection(db, paths.ALUMNI_COLLECTION_PATH);

export default function RegisterAlumni() {
    const { user, isSignedIn } = useUser();
    const router = useRouter();
    const [form, setForm] = useState({
        fullName: "",
        email: user?.primaryEmailAddress?.emailAddress || "",
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
    const [schools, setSchools] = useState<string[]>([]);
    const [professions, setProfessions] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true); // loading for duplicate check
    const [formLoading, setFormLoading] = useState(false); // loading for form submit
    const [showForm, setShowForm] = useState(false);

    // Fetch autocomplete options on mount
    useEffect(() => {
        async function fetchOptions() {
            const snapshot = await getDocs(alumniCollection);
            const schoolSet = new Set<string>();
            const professionSet = new Set<string>();
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.jnvSchool) schoolSet.add(data.jnvSchool);
                if (data.profession) professionSet.add(data.profession);
            });
            setSchools(Array.from(schoolSet));
            setProfessions(Array.from(professionSet));
        }
        fetchOptions();
    }, []);

    // Keep email in sync with Clerk
    useEffect(() => {
        setForm(f => ({ ...f, email: user?.primaryEmailAddress?.emailAddress || "" }));
    }, [user]);

    // Check for duplicate registration on mount
    useEffect(() => {
        async function checkDuplicate() {
            if (!user?.primaryEmailAddress?.emailAddress) {
                setLoading(false);
                setShowForm(false);
                return;
            }
            setLoading(true);
            const isDuplicate = await checkDuplicateAlumniEmail(user.primaryEmailAddress.emailAddress);
            if (isDuplicate) {
                toast.error("You are already registered as an alumni.");
                setTimeout(() => router.push("/alumni"), 1500);
                setShowForm(false);
            } else {
                setShowForm(true);
            }
            setLoading(false);
        }
        if (isSignedIn) checkDuplicate();
    }, [user, isSignedIn, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setFormLoading(true);
        // Check for duplicate email again (race condition safety)
        const isDuplicate = await checkDuplicateAlumniEmail(form.email);
        if (isDuplicate) {
            setError("An alumni with this email is already registered.");
            setFormLoading(false);
            return;
        }
        // Add new alumni with title case formatting
        try {
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
            setSuccess("Registration successful!");
            setForm({
                fullName: "",
                email: user?.primaryEmailAddress?.emailAddress || "",
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
            setTimeout(() => router.push("/alumni"), 1200);
        } catch (err) {
            setError("Failed to register. Please try again." + err);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <Toaster />
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
                <SignedIn>
                    {loading && (
                        <div className="w-full h-1 bg-green-100 rounded mb-6 overflow-hidden">
                            <div className="h-1 bg-green-600 animate-pulse w-1/2"></div>
                        </div>
                    )}
                    {showForm && !loading && (
                        <>
                            <h1 className="text-3xl font-bold mb-6 text-green-700 flex items-center gap-2">
                                <span>Register as Alumni</span>
                            </h1>
                            {/* Privacy reassurance message */}
                            <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-blue-800 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                                <span>
                                    <strong>Your privacy matters:</strong> Your <span className="font-semibold">phone number</span> will <span className="underline">not</span> be visible to others. Home address details (except <span className="font-semibold">work location</span>) are <span className="underline">not</span> shown publicly. Only your work city and state are visible in the alumni directory.
                                </span>
                            </div>
                            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit} autoComplete="off">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Full Name <span className="text-red-500">*</span></label>
                                        <input name="fullName" value={form.fullName} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1" />
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Email</label>
                                        <input name="email" value={form.email} disabled className="w-full border rounded px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Phone <span className="text-red-500">*</span></label>
                                        <input name="phone" value={form.phone} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1" />
                                        <div className="text-xs text-gray-500 mt-1 ml-1">Not visible to others</div>
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">JNV School <span className="text-red-500">*</span></label>
                                        <input name="jnvSchool" value={form.jnvSchool} onChange={handleChange} required list="schools" className="w-full border rounded px-3 py-2 mt-1" />
                                        <datalist id="schools">
                                            {schools.map(s => <option key={s} value={s} />)}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Qualification <span className="text-red-500">*</span></label>
                                        <input name="qualification" value={form.qualification} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1" />
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Profession <span className="text-red-500">*</span></label>
                                        <input name="profession" value={form.profession} onChange={handleChange} required list="professions" className="w-full border rounded px-3 py-2 mt-1" />
                                        <datalist id="professions">
                                            {professions.map(p => <option key={p} value={p} />)}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Role</label>
                                        <input name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Organisation <span className="text-red-500">*</span></label>
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
                                            <label className="font-medium">City <span className="text-red-500">*</span></label>
                                            <input name="homeCity" value={form.homeCity} required onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                        </div>
                                        <div>
                                            <label className="font-medium">State <span className="text-red-500">*</span></label>
                                            <input name="homeState" value={form.homeState} required onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                        </div>
                                        <div>
                                            <label className="font-medium">Pincode</label>
                                            <input name="homePincode" value={form.homePincode} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 ml-1">Home location is not visible to others</div>
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
                                    {formLoading ? "Registering..." : "Register"}
                                </button>
                            </form>
                        </>
                    )}
                </SignedIn>
                <SignedOut>
                    <div className="flex flex-col items-center justify-center gap-6">
                        <h2 className="text-2xl font-semibold text-red-600">Sign in required</h2>
                        <p className="text-gray-700">Please sign in to register as alumni.</p>
                        <SignInButton mode="modal">
                            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Sign In</button>
                        </SignInButton>
                    </div>
                </SignedOut>
            </div>
        </main>
    );
} 