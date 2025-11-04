"use client";
import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { getAllAlumni, alumniCollection } from "../../../firebase/firebaseops";
import { useRouter } from "next/navigation";
import { HiUser, HiCheck } from "react-icons/hi";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseconfig";
import Toaster, { toast } from "../../../components/Toaster";
import { Alumni } from "../../../types";
import GoBackButton from "../../../components/GoBackButton";

export default function EditProfile() {
    const { user, isSignedIn } = useUser();
    const router = useRouter();
    const [alumni, setAlumni] = useState<Alumni | null>(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<Partial<Alumni> | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            if (!user?.primaryEmailAddress?.emailAddress) {
                setLoading(false);
                setAlumni(null);
                setForm(null);
                return;
            }
            const all = await getAllAlumni();
            const found = all.find((a: Alumni) => a.email === user.primaryEmailAddress?.emailAddress.toLowerCase());
            setAlumni(found || null);
            setForm(found ? { ...found } : null);
            setLoading(false);
        }
        if (isSignedIn) fetchProfile();
    }, [user, isSignedIn]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Helper function to convert to title case
    const toTitleCase = (str: string): string => {
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
    };

    // Helper function to format school name
    const formatSchoolName = (school: string): string => {
        const titleCaseSchool = school;
        if (titleCaseSchool.toLowerCase().startsWith('jnv')) {
            return titleCaseSchool;
        }
        return `Jnv ${titleCaseSchool}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!alumni?.id) return;
        setSaving(true);
        try {
            const alumniDoc = doc(db, alumniCollection.path, alumni.id);
            await updateDoc(alumniDoc, {
                fullName: form?.fullName || "",
                phone: form?.phone || "",
                jnvSchool: formatSchoolName(form?.jnvSchool || ""),
                qualification: form?.qualification || "",
                profession: form?.profession || "",
                role: form?.role || "",
                organisation: form?.organisation || "",
                homePlace: form?.homePlace || "",
                homeCity: form?.homeCity || "",
                homeState: form?.homeState || "",
                homePincode: form?.homePincode || "",
                workCity: form?.workCity || "",
                workState: form?.workState || "",
                email: alumni.email, // never change email
                startyear: form?.startyear || "",
                endyear: form?.endyear || "",
            });
            toast.success("Profile updated successfully!");
            setTimeout(() => router.push("/me/profile"), 1000);
        } catch (err) {
            toast.error("Failed to update profile. Please try again." + err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
            <GoBackButton />
            <Toaster />
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
                <SignedIn>
                    {loading ? (
                        <div className="text-gray-500">Loading profile...</div>
                    ) : !alumni ? (
                        <div className="text-red-600 font-semibold">You are not registered as an alumni.</div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold mb-6 text-green-700 flex items-center gap-2">
                                <HiUser className="w-8 h-8 text-green-600" /> Edit Profile
                            </h1>
                            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit} autoComplete="off">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Full Name</label>
                                        <input name="fullName" value={form?.fullName || ""} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1" />
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Email</label>
                                        <input name="email" value={form?.email || ""} disabled className="w-full border rounded px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Phone</label>
                                        <input name="phone" value={form?.phone || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">JNV School</label>
                                        <input name="jnvSchool" value={form?.jnvSchool || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Qualification</label>
                                        <input name="qualification" value={form?.qualification || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Profession</label>
                                        <input name="profession" value={form?.profession || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Role</label>
                                        <input name="role" value={form?.role || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Organisation</label>
                                        <input name="organisation" value={form?.organisation || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h2 className="font-semibold mb-2">Home Location</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="font-medium">Place</label>
                                            <input name="homePlace" value={form?.homePlace || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                        </div>
                                        <div>
                                            <label className="font-medium">City</label>
                                            <input name="homeCity" value={form?.homeCity || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                        </div>
                                        <div>
                                            <label className="font-medium">State</label>
                                            <input name="homeState" value={form?.homeState || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                        </div>
                                        <div>
                                            <label className="font-medium">Pincode</label>
                                            <input name="homePincode" value={form?.homePincode || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h2 className="font-semibold mb-2">Work Location</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-medium">City</label>
                                            <input name="workCity" value={form?.workCity || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                        </div>
                                        <div>
                                            <label className="font-medium">State</label>
                                            <input name="workState" value={form?.workState || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h2 className="font-semibold mb-2">Batch</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-medium">Start year</label>
                                            <input name="startyear" value={form?.startyear || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                        </div>
                                        <div>
                                            <label className="font-medium">End year</label>
                                            <input name="endyear" value={form?.endyear || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={saving} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                                    {saving ? <HiCheck className="w-5 h-5 animate-spin" /> : <HiCheck className="w-5 h-5" />} Save Changes
                                </button>
                            </form>
                        </>
                    )}
                </SignedIn>
                <SignedOut>
                    <div className="flex flex-col items-center justify-center gap-6">
                        <h2 className="text-2xl font-semibold text-red-600">Sign in required</h2>
                        <p className="text-gray-700">Please sign in to edit your profile.</p>
                        <SignInButton mode="modal">
                            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Sign In</button>
                        </SignInButton>
                    </div>
                </SignedOut>
            </div>
        </main>
    );
} 