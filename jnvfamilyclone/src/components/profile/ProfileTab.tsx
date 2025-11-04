import React, { useEffect, useState } from "react";
import { useUser, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getAllAlumni } from "../../firebase/firebaseops";
import { HiUser, HiOfficeBuilding, HiBriefcase, HiLocationMarker, HiAcademicCap, HiIdentification, HiHome, HiPhone, HiPencil, HiPlus } from "react-icons/hi";
import { Alumni } from "../../types";
import { GraduationCap, GraduationCapIcon } from "lucide-react";

export default function ProfileTab() {
    const { user, isSignedIn } = useUser();
    const router = useRouter();
    const [alumni, setAlumni] = useState<Alumni | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            if (!user?.primaryEmailAddress?.emailAddress) {
                setLoading(false);
                setAlumni(null);
                return;
            }
            const all = await getAllAlumni();
            const found = all.find((a: Alumni) => a.email === user.primaryEmailAddress?.emailAddress.toLowerCase());
            setAlumni(found || null);
            setLoading(false);
        }
        if (isSignedIn) fetchProfile();
    }, [user, isSignedIn]);

    return (
        <>
            <SignedIn>
                <h2 className="text-2xl font-bold mb-4 text-green-700">Profile</h2>
                {loading ? (
                    <div className="text-gray-500">Loading profile...</div>
                ) : !alumni ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-red-600 font-semibold">You are not registered as an alumni.</div>
                        <button
                            onClick={() => router.push("/alumni/register")}
                            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            <HiPlus className="w-5 h-5" /> Add Profile
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-4 mb-6">
                            <HiUser className="w-10 h-10 text-green-600" />
                            <h1 className="text-3xl font-bold text-green-700">{alumni.fullName}</h1>
                            <button
                                onClick={() => router.push("/me/edit-profile")}
                                className="ml-auto flex items-center gap-1 px-4 py-2 rounded-md text-base font-semibold text-yellow-700 hover:text-white hover:bg-yellow-500 transition-colors"
                            >
                                <HiPencil className="w-5 h-5" /> Edit Profile
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex items-center gap-2">
                                <HiIdentification className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-700">{alumni.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <HiPhone className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-400">+91 {alumni.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <HiAcademicCap className="w-5 h-5 text-yellow-500" />
                                <span className="text-gray-700">{alumni.jnvSchool || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <HiAcademicCap className="w-5 h-5 text-blue-500" />
                                <span className="text-gray-700">{alumni.qualification || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <HiBriefcase className="w-5 h-5 text-green-600" />
                                <span className="text-gray-700">{alumni.profession || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <HiIdentification className="w-5 h-5 text-green-600" />
                                <span className="text-gray-700">{alumni.role || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <HiOfficeBuilding className="w-5 h-5 text-green-600" />
                                <span className="text-gray-700">{alumni.organisation || "-"}</span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2 mb-2"><HiHome className="w-5 h-5 text-yellow-600" />Home Location</h2>
                            <div className="text-gray-700 ml-7">
                                {alumni.homePlace && <span>{alumni.homePlace}, </span>}
                                {alumni.homeCity && <span>{alumni.homeCity}, </span>}
                                {alumni.homeState && <span>{alumni.homeState}, </span>}
                                {alumni.homePincode && <span>{alumni.homePincode}</span>}
                                {!(alumni.homePlace || alumni.homeCity || alumni.homeState || alumni.homePincode) && <span>-</span>}
                            </div>
                        </div>
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2 mb-2"><HiLocationMarker className="w-5 h-5 text-red-500" />Work Location</h2>
                            <div className="text-gray-700 ml-7">
                                {alumni.workCity && <span>{alumni.workCity}, </span>}
                                {alumni.workState && <span>{alumni.workState}</span>}
                                {!(alumni.workCity || alumni.workState) && <span>-</span>}
                            </div>
                        </div>
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2 mb-2"><GraduationCap className="w-5 h-5 text-red-500" />Batch</h2>
                            <div className="text-gray-700 ml-7">
                                {alumni.startyear && <span>{alumni.startyear} - </span>}
                                {alumni.endyear && <span>{alumni.endyear}</span>}
                                {!(alumni.startyear || alumni.endyear) && <span>-</span>}
                            </div>
                        </div>
                    </>
                )}
            </SignedIn>
            <SignedOut>
                <div className="flex flex-col items-center justify-center gap-6">
                    <h2 className="text-2xl font-semibold text-red-600">Sign in required</h2>
                    <p className="text-gray-700">Please sign in to view your profile.</p>
                    <SignInButton mode="modal">
                        <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Sign In</button>
                    </SignInButton>
                </div>
            </SignedOut>
        </>
    );
} 