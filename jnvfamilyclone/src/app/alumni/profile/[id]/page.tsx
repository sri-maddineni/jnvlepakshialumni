"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { getAlumniById, getAlumniByEmail } from "../../../../firebase/firebaseops";
import { HiUser, HiOfficeBuilding, HiBriefcase, HiLocationMarker, HiAcademicCap, HiIdentification, HiHome, HiPhone } from "react-icons/hi";
import GoBackButton from "../../../../components/GoBackButton";
import { Alumni } from "../../../../types";
import Image from "next/image";
import Toaster, { toast } from "../../../../components/Toaster";
import { useRouter } from "next/navigation";
import { ConstructionIcon, Copy, CopyIcon, CopyPlus, GraduationCap } from "lucide-react";

export default function AlumniProfile() {
    const { id } = useParams();
    const { user, isSignedIn } = useUser();
    const router = useRouter();
    const [alumni, setAlumni] = useState<Alumni | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [profileImageLoading, setProfileImageLoading] = useState(false);
    const [checkingRegistration, setCheckingRegistration] = useState(true);
    const [userregistered, setUserregistered] = useState(false)

    // Registration check and redirect
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
                setUserregistered(true)
                setCheckingRegistration(false);
            }
        }
        checkRegistration();
    }, [isSignedIn, user?.primaryEmailAddress?.emailAddress, router]);

    useEffect(() => {
        async function fetchAlumni() {
            if (!id) return;
            const data = await getAlumniById(id as string);
            setAlumni(data);
            setLoading(false);
        }
        fetchAlumni();
    }, [id]);

    // Fetch profile image when alumni data is loaded
    useEffect(() => {
        async function fetchProfileImage() {
            if (!alumni?.email) return;

            setProfileImageLoading(true);
            try {
                const { getUserProfileImageByEmail } = await import('../../../actions/clerkActions');
                const imageUrl = await getUserProfileImageByEmail(alumni.email);
                setProfileImageUrl(imageUrl);
            } catch (error) {
                console.error('Error fetching profile image:', error);
            } finally {
                setProfileImageLoading(false);
            }
        }

        fetchProfileImage();
    }, [alumni?.email]);

    if (checkingRegistration) {
        return (
            <main className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
                <Toaster />
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center min-h-[300px]">
                    <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </main>
        );
    }

    if (!isSignedIn) {
        return (
            <SignedOut>
                <div className="flex flex-col items-center justify-center w-full h-screen gap-6">
                    <h2 className="text-2xl font-semibold text-red-600">Sign in required</h2>
                    <p className="text-gray-700">Please sign in to view alumni profiles.</p>
                    <SignInButton mode="modal">
                        <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Sign In</button>
                    </SignInButton>
                </div>
            </SignedOut>
        );
    }


    if (userregistered) {
        return (
            <main className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
                <GoBackButton />
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
                    <SignedIn>
                        {loading ? (
                            <div className="text-gray-500">Loading profile...</div>
                        ) : !alumni ? (
                            <div className="text-red-600 font-semibold">Alumni not found.</div>
                        ) : (
                            <>
                                <div className="flex items-center gap-4 mb-6">
                                    {profileImageLoading ? (
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
                                                {alumni.fullName ? alumni.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : <HiUser className="w-8 h-8 text-blue-300" />}

                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center text-2xl font-bold text-blue-700 shadow border-2 border-white">
                                            {alumni.fullName ? alumni.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : <HiUser className="w-8 h-8 text-blue-300" />}
                                        </div>
                                    )}
                                    <div className="flex flex-row items-center gap-4">
                                        <h1 className="text-3xl font-bold text-green-700">{alumni.fullName} </h1>
                                        <CopyIcon className="text-black-50 w-4 h-4" onClick={() => {
                                            navigator.clipboard.writeText(alumni.id || "");
                                            alert("alumni id Copied to clipboard")
                                        }} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="flex items-center gap-2">
                                        <HiIdentification className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-700">{alumni.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <HiPhone className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-400">+91 ***** *****</span>
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
                                        {/* {alumni.homePlace && <span>{alumni.homePlace}, </span>} */}
                                        {alumni.homeCity && <span>{alumni.homeCity}, </span>}
                                        {alumni.homeState && <span>{alumni.homeState}, </span>}
                                        {/* {alumni.homePincode && <span>{alumni.homePincode}</span>} */}
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
                                <div className="text-sm text-gray-500 italic">
                                    <span className="text-amber-600">Note:</span> For privacy reasons, phone number is hidden. Connect via email.
                                    <h5>For phone number, please contact the admin.</h5>
                                </div>
                            </>
                        )}
                    </SignedIn>
                    <SignedOut>
                        <div className="flex flex-col items-center justify-center gap-6">
                            <h2 className="text-2xl font-semibold text-red-600">Sign in required</h2>
                            <p className="text-gray-700">Please sign in to view alumni profiles.</p>
                            <SignInButton mode="modal">
                                <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Sign In</button>
                            </SignInButton>
                        </div>
                    </SignedOut>
                </div>
                <Toaster />
            </main>
        );
    }
} 