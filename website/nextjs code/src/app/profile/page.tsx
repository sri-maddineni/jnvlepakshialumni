"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getAlumniByUid, updateAlumni, getAllAlumni, AlumniRecord } from "@/app/database/dbops";
import { AlumniStatus, Roles } from "@/app/database/Enums";
import { FaUser, FaGraduationCap, FaBriefcase, FaMapMarkerAlt, FaSave, FaEdit, FaEnvelope, FaPhone } from "react-icons/fa";

function getInitials(name: string) {
    const parts = name.split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts[parts.length - 1]?.[0] ?? "";
    return (first + last).toUpperCase();
}

type PendingAlumniWithSupporters = (AlumniRecord & {
    id: string;
    supporters: Array<{ uid: string; name: string; email: string }>;
});

export default function ProfilePage() {
    const { user, userRole, loading: authLoading } = useAuth();
    const router = useRouter();
    const [alumniData, setAlumniData] = useState<(AlumniRecord & { id: string }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [pendingAlumni, setPendingAlumni] = useState<PendingAlumniWithSupporters[]>([]);
    const [loadingPending, setLoadingPending] = useState(false);

    // Form state
    const [fullName, setFullName] = useState("");
    const [mobile, setMobile] = useState("");
    const [aadhar, setAadhar] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [profession, setProfession] = useState("");
    const [professionOther, setProfessionOther] = useState("");
    const [organisationName, setOrganisationName] = useState("");
    const [workRole, setWorkRole] = useState("");
    const [currentCity, setCurrentCity] = useState("");
    const [currentState, setCurrentState] = useState("");
    const [workCity, setWorkCity] = useState("");
    const [workState, setWorkState] = useState("");
    const [role, setRole] = useState("")

    const professionOptions = ["Doctor", "Police", "Engineering", "IT", "Non-IT", "Government", "Entrepreneur", "Teacher", "Self Business", "Lawyer", "Other"];

    const fetchProfile = useCallback(async () => {
        if (!user?.uid) return;
        try {
            setLoading(true);
            const data = await getAlumniByUid(user.uid);
            if (!data) {
                setError("Profile not found. Please complete your registration.");
                return;
            }
            setAlumniData(data);
            // Populate form fields
            setFullName(data.fullName || "");
            setMobile(data.mobile || "");
            setAadhar(data.aadhar || "");
            setBloodGroup(data.bloodGroup || "");
            setProfession(data.profession || "");
            setProfessionOther(data.professionOther || "");
            setOrganisationName(data.organisationName || "");
            setWorkRole(data.workRole || "");
            setCurrentCity(data.currentCity || "");
            setCurrentState(data.currentState || "");
            setWorkCity(data.workCity || "");
            setWorkState(data.workState || "");
            setRole(data.role || "user")


            // Fetch pending alumni if user is admin or governing body
            if (data.userRole === Roles.Admin ||
                data.userRole === Roles.Governing_body ||
                userRole === Roles.Admin ||
                userRole === Roles.Governing_body) {
                fetchPendingAlumni();
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, [user?.uid, userRole]);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push("/auth/login");
            return;
        }
        fetchProfile();
    }, [user, userRole, authLoading, router, fetchProfile]);

    const fetchPendingAlumni = async () => {
        try {
            setLoadingPending(true);
            const allAlumni = await getAllAlumni();
            const pending = allAlumni.filter(a => a.status === AlumniStatus.Pending);

            // Fetch supporter details for each pending alumni
            const pendingWithSupporters: PendingAlumniWithSupporters[] = await Promise.all(
                pending.map(async (alumni) => {
                    const supporterDetails = await Promise.all(
                        (alumni.supportedBy || []).map(async (supporterUid) => {
                            const supporter = await getAlumniByUid(supporterUid);
                            return {
                                uid: supporterUid,
                                name: supporter?.fullName || "Unknown",
                                email: supporter?.email || "N/A"
                            };
                        })
                    );
                    return {
                        ...alumni,
                        supporters: supporterDetails
                    };
                })
            );
            setPendingAlumni(pendingWithSupporters);
        } catch (err) {
            console.error("Error fetching pending alumni:", err);
        } finally {
            setLoadingPending(false);
        }
    };

    const handleSave = async () => {
        if (!user?.uid || !alumniData) return;
        setError(null);
        setInfo(null);
        setSaving(true);
        try {
            await updateAlumni(user.uid, {
                fullName,
                mobile,
                aadhar: aadhar || undefined,
                bloodGroup,
                profession: profession === "Other" ? "Other" : profession,
                professionOther: profession === "Other" ? professionOther : undefined,
                organisationName: organisationName || undefined,
                workRole: workRole || undefined,
                currentCity,
                currentState,
                workCity: workCity || undefined,
                workState: workState || undefined,
            });
            setInfo("Profile updated successfully!");
            setEditing(false);
            await fetchProfile(); // Refresh data
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
                <p className="text-neutral-600">Loading profile...</p>
            </div>
        );
    }

    if (!alumniData) {
        return (
            <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                    <p className="text-red-800">{error || "Profile not found"}</p>
                    <button
                        onClick={() => router.push("/auth/register")}
                        className="mt-4 rounded-md bg-[#138808] text-white px-4 py-2 hover:opacity-90"
                    >
                        Complete Registration
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    <span className="text-[#FF9933]">My</span> <span className="text-[#138808]">Profile</span>
                </h1>
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 rounded-md bg-[#138808] text-white px-4 py-2 hover:opacity-90"
                    >
                        <FaEdit />
                        Edit Profile
                    </button>
                )}
            </div>

            {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>}
            {info && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">{info}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Header Card */}
                <div className="lg:col-span-3 rounded-2xl border border-neutral-200 bg-white p-6">
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#FF9933]/20 to-[#138808]/20 flex items-center justify-center text-neutral-700 font-semibold text-2xl">
                            {getInitials(alumniData.fullName)}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-neutral-900">{alumniData.fullName}</h2>
                            <p className="text-neutral-600 mt-1">{alumniData.email}</p>
                            <div className="flex items-center gap-4 mt-2">

                                {/* <span className="px-3 py-1 rounded-full bg-[#138808]/10 text-[#138808] text-sm font-semibold">
                                    {alumniData.role === "teacher" ? "Teacher" : alumniData.role === "alumni" ? "Alumni" : ""}
                                </span> */}
                                {/* admin, alumni, governingbody  */}
                                {/* {alumniData.userRole && (
                                    <span className="px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] text-sm font-semibold">
                                        {alumniData.userRole === Roles.Admin ? "Admin" :
                                            alumniData.userRole === Roles.Governing_body ? "Governing Body" :
                                                alumniData.userRole === Roles.Teacher ? "Teacher" :
                                                    alumniData.userRole === Roles.Alumni ? "Alumni" : ""}
                                    </span>
                                )}



                                {!alumniData.userRole && (
                                    <span className="px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] text-sm font-semibold">
                                        {alumniData.userRole}
                                    </span>
                                )} */}
                                {/* to add teacher or alumni  */}



                                {/* role from database  */}
                                <span className="px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] text-sm font-semibold">
                                    {role}
                                </span>

                                {/* approved or not */}
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${alumniData.status === AlumniStatus.Approved
                                        ? "bg-green-100 text-green-800"
                                        : alumniData.status === AlumniStatus.Pending
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-neutral-100 text-neutral-800"
                                        }`}
                                >
                                    {alumniData.status.toUpperCase()}
                                </span>


                            </div>
                        </div>
                    </div>
                </div>

                {/* Education Details */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FaGraduationCap className="text-[#FF9933] text-xl" />
                        <h3 className="text-lg font-semibold">Education</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div>
                            <span className="text-neutral-600">Batch:</span>
                            <p className="font-medium text-neutral-900">{alumniData.joinedYear} - {alumniData.passedOutYear}</p>
                        </div>
                        <div>
                            <span className="text-neutral-600">Classes:</span>
                            <p className="font-medium text-neutral-900">{alumniData.joinedClass} - {alumniData.passedOutClass}</p>
                        </div>
                        <div>
                            <span className="text-neutral-600">Hall Ticket:</span>
                            <p className="font-medium text-neutral-900">{alumniData.hallTicket}</p>
                        </div>
                    </div>
                </div>

                {/* Personal Details */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FaUser className="text-[#138808] text-xl" />
                        <h3 className="text-lg font-semibold">Personal</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                        {editing ? (
                            <>
                                <div>
                                    <label className="block text-neutral-600 mb-1">Mobile</label>
                                    <input
                                        type="text"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-neutral-600 mb-1">Aadhar (optional)</label>
                                    <input
                                        type="text"
                                        value={aadhar}
                                        onChange={(e) => setAadhar(e.target.value)}
                                        className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-neutral-600 mb-1">Blood Group</label>
                                    <input
                                        type="text"
                                        value={bloodGroup}
                                        onChange={(e) => setBloodGroup(e.target.value)}
                                        className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <span className="text-neutral-600">Mobile:</span>
                                    <p className="font-medium text-neutral-900">{alumniData.mobile}</p>
                                </div>
                                {alumniData.aadhar && (
                                    <div>
                                        <span className="text-neutral-600">Aadhar:</span>
                                        <p className="font-medium text-neutral-900">{alumniData.aadhar}</p>
                                    </div>
                                )}
                                <div>
                                    <span className="text-neutral-600">Blood Group:</span>
                                    <p className="font-medium text-neutral-900">{alumniData.bloodGroup}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Professional Details */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FaBriefcase className="text-[#FF9933] text-xl" />
                        <h3 className="text-lg font-semibold">Professional</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                        {editing ? (
                            <>
                                <div>
                                    <label className="block text-neutral-600 mb-1">Profession</label>
                                    <select
                                        value={profession}
                                        onChange={(e) => setProfession(e.target.value)}
                                        className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                    >
                                        <option value="">Select profession</option>
                                        {professionOptions.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    {profession === "Other" && (
                                        <input
                                            placeholder="Please specify"
                                            value={professionOther}
                                            onChange={(e) => setProfessionOther(e.target.value)}
                                            className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-neutral-600 mb-1">Organisation</label>
                                    <input
                                        type="text"
                                        value={organisationName}
                                        onChange={(e) => setOrganisationName(e.target.value)}
                                        className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-neutral-600 mb-1">Work Role</label>
                                    <input
                                        type="text"
                                        value={workRole}
                                        onChange={(e) => setWorkRole(e.target.value)}
                                        placeholder="e.g., Associate Software Engineer"
                                        className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <span className="text-neutral-600">Profession:</span>
                                    <p className="font-medium text-neutral-900">
                                        {alumniData.profession}
                                        {alumniData.professionOther && ` - ${alumniData.professionOther}`}
                                    </p>
                                </div>
                                {alumniData.organisationName && (
                                    <div>
                                        <span className="text-neutral-600">Organisation:</span>
                                        <p className="font-medium text-neutral-900">{alumniData.organisationName}</p>
                                    </div>
                                )}
                                {alumniData.workRole && (
                                    <div>
                                        <span className="text-neutral-600">Work Role:</span>
                                        <p className="font-medium text-neutral-900">{alumniData.workRole}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Location Details */}
                <div className="lg:col-span-3 rounded-2xl border border-neutral-200 bg-white p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FaMapMarkerAlt className="text-[#138808] text-xl" />
                        <h3 className="text-lg font-semibold">Location</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-semibold text-neutral-700 mb-3">Home Address</h4>
                            {editing ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-neutral-600 mb-1">City</label>
                                        <input
                                            type="text"
                                            value={currentCity}
                                            onChange={(e) => setCurrentCity(e.target.value)}
                                            className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-neutral-600 mb-1">State</label>
                                        <input
                                            type="text"
                                            value={currentState}
                                            onChange={(e) => setCurrentState(e.target.value)}
                                            className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-neutral-900">{alumniData.currentCity}, {alumniData.currentState}</p>
                            )}
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-neutral-700 mb-3">Work Location (optional)</h4>
                            {editing ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-neutral-600 mb-1">Work City</label>
                                        <input
                                            type="text"
                                            value={workCity}
                                            onChange={(e) => setWorkCity(e.target.value)}
                                            className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-neutral-600 mb-1">Work State</label>
                                        <input
                                            type="text"
                                            value={workState}
                                            onChange={(e) => setWorkState(e.target.value)}
                                            className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-neutral-900">
                                    {alumniData.workCity && alumniData.workState
                                        ? `${alumniData.workCity}, ${alumniData.workState}`
                                        : "Not provided"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Alumni Section - Only for Admin and Governing Body */}
            {(userRole === Roles.Admin || userRole === Roles.Governing_body || alumniData?.userRole === Roles.Admin || alumniData?.userRole === Roles.Governing_body) && (
                <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50/30 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <FaUser className="text-yellow-600 text-xl" />
                        <h2 className="text-2xl font-bold text-yellow-800">Pending Alumni Approvals</h2>
                    </div>
                    {loadingPending ? (
                        <p className="text-neutral-600">Loading pending alumni...</p>
                    ) : pendingAlumni.length === 0 ? (
                        <p className="text-neutral-600">No pending alumni at the moment.</p>
                    ) : (
                        <div className="space-y-6">
                            {pendingAlumni.map((alumni) => (
                                <div
                                    key={alumni.id}
                                    className="rounded-lg border border-yellow-200 bg-white p-6"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center text-neutral-700 font-semibold text-lg flex-shrink-0">
                                            {getInitials(alumni.fullName)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-neutral-900">{alumni.fullName}</h3>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
                                                <div className="flex items-center gap-1">
                                                    <FaEnvelope className="text-[#138808]" />
                                                    <span>{alumni.email}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaPhone className="text-[#FF9933]" />
                                                    <span>{alumni.mobile}</span>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-sm text-neutral-600">
                                                <span>Batch: {alumni.joinedYear} - {alumni.passedOutYear}</span>
                                                {alumni.profession && (
                                                    <span className="ml-4">Profession: {alumni.profession}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Supporters Section */}
                                    <div className="mt-4 pt-4 border-t border-yellow-200">
                                        <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                                            Supporters ({alumni.supporters.length})
                                        </h4>
                                        {alumni.supporters.length === 0 ? (
                                            <p className="text-sm text-neutral-500 italic">No supporters yet</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {alumni.supporters.map((supporter, idx) => (
                                                    <div
                                                        key={supporter.uid || idx}
                                                        className="flex items-center gap-3 text-sm bg-neutral-50 rounded-md p-2"
                                                    >
                                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FF9933]/20 to-[#138808]/20 flex items-center justify-center text-neutral-700 font-semibold text-xs flex-shrink-0">
                                                            {getInitials(supporter.name)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-neutral-900 truncate">{supporter.name}</p>
                                                            <p className="text-neutral-600 text-xs truncate">{supporter.email}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {editing && (
                <div className="mt-6 flex gap-4 justify-end">
                    <button
                        onClick={() => {
                            setEditing(false);
                            setError(null);
                            setInfo(null);
                            fetchProfile(); // Reset form
                        }}
                        className="rounded-md border border-neutral-300 px-6 py-2 hover:bg-neutral-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 rounded-md bg-[#138808] text-white px-6 py-2 hover:opacity-90 disabled:opacity-60"
                    >
                        <FaSave />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            )}
        </div>
    );
}

