"use client";
import React from "react";
import { HiUser, HiOfficeBuilding, HiBriefcase, HiLocationMarker, HiAcademicCap, HiIdentification, HiHome, HiPhone } from "react-icons/hi";
import { Alumni } from "../../types";

interface ProfileModalProps {
    open: boolean;
    alumniId: string | null;
    onClose: () => void;
}

export default function ProfileModal({ open, alumniId, onClose }: ProfileModalProps) {
    const [alumni, setAlumni] = React.useState<Alumni | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        if (!open || !alumniId) return;
        setLoading(true);
        setError("");
        setAlumni(null);
        import("../../firebase/firebaseops").then(({ getAlumniById }) =>
            getAlumniById(alumniId)
                .then((data) => {
                    setAlumni(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Failed to load profile.");
                    setLoading(false);
                })
        );
    }, [open, alumniId]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative max-h-[75vh] overflow-y-auto flex flex-col">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-extrabold mb-6 text-green-700 text-center flex items-center gap-2 justify-center">
                    <HiUser className="w-7 h-7 text-green-600" /> Alumni Profile
                </h2>
                {loading ? (
                    <div className="text-gray-500 text-center">Loading...</div>
                ) : error ? (
                    <div className="text-red-600 text-center">{error}</div>
                ) : !alumni ? (
                    <div className="text-gray-500 text-center">No profile found.</div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <HiUser className="w-6 h-6 text-green-600" /> {alumni.fullName}
                        </div>
                        <div className="flex items-center gap-2"><HiIdentification className="w-5 h-5 text-gray-400" /> {alumni.email}</div>
                        <div className="flex items-center gap-2"><HiPhone className="w-5 h-5 text-gray-400" /> {alumni.phone || "-"}</div>
                        <div className="flex items-center gap-2"><HiAcademicCap className="w-5 h-5 text-yellow-500" /> {alumni.jnvSchool || "-"}</div>
                        <div className="flex items-center gap-2"><HiAcademicCap className="w-5 h-5 text-blue-500" /> {alumni.qualification || "-"}</div>
                        <div className="flex items-center gap-2"><HiBriefcase className="w-5 h-5 text-green-600" /> {alumni.profession || "-"}</div>
                        <div className="flex items-center gap-2"><HiIdentification className="w-5 h-5 text-green-600" /> {alumni.role || "-"}</div>
                        <div className="flex items-center gap-2"><HiOfficeBuilding className="w-5 h-5 text-green-600" /> {alumni.organisation || "-"}</div>
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-1"><HiHome className="w-5 h-5 text-yellow-600" /> Home Location</h3>
                            <div className="text-gray-700 ml-7">
                                {[alumni.homePlace, alumni.homeCity, alumni.homeState, alumni.homePincode].filter(Boolean).join(", ") || "-"}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-1"><HiLocationMarker className="w-5 h-5 text-red-500" /> Work Location</h3>
                            <div className="text-gray-700 ml-7">
                                {[alumni.workCity, alumni.workState].filter(Boolean).join(", ") || "-"}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 