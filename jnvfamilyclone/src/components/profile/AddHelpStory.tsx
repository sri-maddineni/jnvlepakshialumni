"use client";
import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { HiUser, HiCheck } from "react-icons/hi";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { alumniCollection, getAllAlumni, helpStoriesCollection } from "@/firebase/firebaseops";
import * as paths from "../../firebase/paths";
import { Alumni, help_story } from "@/types";
import { db } from "@/firebase/firebaseconfig";
import Toaster, { toast } from "../Toaster";
import GoBackButton from "../GoBackButton";
import { HiHandRaised } from "react-icons/hi2";
import { create } from "domain";

export default function EditProfile() {
    const { user, isSignedIn } = useUser();
    const router = useRouter();
    const [alumni, setAlumni] = useState<Alumni | null>(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<Partial<help_story> | null>(null);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!alumni?.id) return;
        setSaving(true);

        try {
            const helpstoriesRef = collection(db, paths.HELP_STORIES_COLLECTION_PATH);
            const helpsRecieved = collection(db, paths.HELPS_RECIEVED_COLLECTION_PATH)

            const storyDoc = await addDoc(helpstoriesRef, {
                A_name: form?.A_name || "",
                A_school: form?.A_school || "",
                A_Id: form?.A_Id || "",
                B_Id: alumni.id || "",
                B_name: alumni.fullName || "",
                storyText: form?.storyText || "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            const userStoriesRef = doc(db, "/Database/JNVFamily v0/alumni/", alumni.id, "helps_recieved", storyDoc.id);

            await setDoc(userStoriesRef, {
                storyRef: storyDoc, // 🔥 this will be a Firestore reference
                createdAt: new Date(),
            });

            toast.success("Story added successfully!");
            setTimeout(() => router.push("/me/profile"), 1000);
            form && setForm(null);
        } catch (err) {
            toast.error("Failed to add story. Please try again. " + err);
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
                                <HiUser className="w-8 h-8 text-green-600" /> Add help story
                            </h1>
                            <h5 className="text-xxl font-normal mb-3 text-blue-500 flex items-center gap-2"><HiHandRaised className="w-4 h-4 text-red-500" /> Share your story where someone helped you from our alumni.</h5>
                            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit} autoComplete="off">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Name </label>
                                        <input name="A_name" value={form?.A_name || ""} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1" />
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">Id </label>
                                        <input name="A_id" value={form?.A_Id || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                    </div>
                                    <div>
                                        <label className="font-semibold flex items-center gap-1">JNV school </label>
                                        <input name="A_school" value={form?.A_school || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
                                    </div>


                                </div>
                                <div className="mt-4">
                                    <h2 className="font-semibold flex items-center gap-1">Story behind</h2>

                                    <div>
                                        <label className="font-medium">How the person &#34;<span className="font-semibold">{form?.A_name}</span>&#34; helped { }</label>
                                        <textarea
                                            name="storyText"
                                            value={form?.storyText || ""}
                                            onChange={handleChange}
                                            rows={4}   // 👈 number of visible rows
                                            className="w-full border rounded px-3 py-2 mt-1 resize-y"
                                            placeholder="Write your story here..."
                                        />
                                    </div>


                                </div>

                                <button type="submit" disabled={saving} className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                                    {saving ? <HiCheck className="w-5 h-5 animate-spin" /> : <HiCheck className="w-5 h-5" />} Add story
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