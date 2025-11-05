"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createAlumni, getAlumniByHallTicket, AlumniRole } from "@/app/database/dbops";
import { auth } from "@/app/database/firebaseconfig";
import { AlumniStatus } from "@/app/database/Enums";

export default function RegisterPage() {
    const { registerWithEmail } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<AlumniRole>("alumni");
    const [fullName, setFullName] = useState("");
    const [joinedYear, setJoinedYear] = useState<number | "">("");
    const [passedOutYear, setPassedOutYear] = useState<number | "">("");
    const [joinedClass, setJoinedClass] = useState("");
    const [passedOutClass, setPassedOutClass] = useState("");
    const [hallTicket, setHallTicket] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [aadhar, setAadhar] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [profession, setProfession] = useState("");
    const [professionOther, setProfessionOther] = useState("");
    const [organisationName, setOrganisationName] = useState("");
    const [currentCity, setCurrentCity] = useState("");
    const [currentState, setCurrentState] = useState("");
    const [workCity, setWorkCity] = useState("");
    const [workState, setWorkState] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);
        setLoading(true);
        try {
            if (password.length < 6) {
                throw new Error("Password must be at least 6 characters");
            }
            if (!fullName || !joinedYear || !passedOutYear || !joinedClass || !passedOutClass || !hallTicket || !mobile || !bloodGroup || !profession || !currentCity || !currentState) {
                throw new Error("Please fill all required fields");
            }
            const dup = await getAlumniByHallTicket(hallTicket.trim());
            if (dup) {
                throw new Error("Hall ticket already registered");
            }
            await registerWithEmail(email, password);
            const uid = auth.currentUser?.uid ?? "";
            // Create alumni document
            await createAlumni({
                uid,
                role,
                fullName,
                joinedYear: Number(joinedYear),
                passedOutYear: Number(passedOutYear),
                joinedClass,
                passedOutClass,
                hallTicket: hallTicket.trim(),
                email,
                mobile,
                aadhar: aadhar || undefined,
                bloodGroup,
                profession: profession === "Other" ? "Other" : profession,
                professionOther: profession === "Other" ? professionOther : undefined,
                organisationName: organisationName || undefined,
                currentCity,
                currentState,
                workCity: workCity || undefined,
                workState: workState || undefined,
                status: AlumniStatus.Pending,
                supportedBy: [],
                approvedBy: undefined,
            }, uid);
            setInfo("Registration submitted successfully");
            router.push("/");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Registration failed";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // Google sign-in removed from registration flow as requested

    const professionOptions = ["Doctor", "Police", "Engineering", "IT", "Non-IT", "Government", "Entrepreneur", "Teacher", "Self Business", "Lawyer", "Other"];

    const StepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-6 text-sm">
            {[1, 2, 3, 4].map((s) => (
                <span key={s} className={`h-2 w-2 rounded-full ${s <= step ? 'bg-[#138808]' : 'bg-neutral-300'}`}></span>
            ))}
        </div>
    );

    return (
        <div className="mx-auto max-w-xl px-4 sm:px-6 py-10">
            <h1 className="text-2xl font-bold mb-2 text-[#FF9933]">Register</h1>
            <p className="text-sm text-neutral-600 mb-4">Become a registered JNV Lepakshi {role === 'alumni' ? 'alumni' : 'teacher'}.</p>
            <StepIndicator />

            {step === 1 && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Register as</label>
                        <div className="flex gap-4">
                            <label className="inline-flex items-center gap-2 text-sm">
                                <input type="radio" name="role" value="alumni" checked={role === 'alumni'} onChange={() => setRole('alumni')} /> Alumni
                            </label>
                            <label className="inline-flex items-center gap-2 text-sm">
                                <input type="radio" name="role" value="teacher" checked={role === 'teacher'} onChange={() => setRole('teacher')} /> Teacher
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Full name</label>
                        <input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Joined year</label>
                            <input type="number" value={joinedYear} onChange={(e) => setJoinedYear(e.target.value ? Number(e.target.value) : '')} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Passed out year</label>
                            <input type="number" value={passedOutYear} onChange={(e) => setPassedOutYear(e.target.value ? Number(e.target.value) : '')} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Joined class</label>
                            <input value={joinedClass} onChange={(e) => setJoinedClass(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Passed out class</label>
                            <input value={passedOutClass} onChange={(e) => setPassedOutClass(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">10th class hallticket number</label>
                        <input value={hallTicket} onChange={(e) => setHallTicket(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                    </div>
                    <div className="flex justify-end">
                        <button onClick={() => setStep(2)} className="rounded-md bg-[#138808] text-white px-4 py-2">Next</button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Mobile number</label>
                            <input value={mobile} onChange={(e) => setMobile(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Aadhar (optional)</label>
                            <input value={aadhar} onChange={(e) => setAadhar(e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Blood group</label>
                            <input value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Profession</label>
                        <select value={profession} onChange={(e) => setProfession(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]">
                            <option value="" disabled>Select profession</option>
                            {professionOptions.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        {profession === 'Other' && (
                            <input placeholder="Please specify" value={professionOther} onChange={(e) => setProfessionOther(e.target.value)} className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Organisation working name</label>
                        <input value={organisationName} onChange={(e) => setOrganisationName(e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                    </div>
                    <div className="flex justify-between">
                        <button onClick={() => setStep(1)} className="rounded-md border border-neutral-300 px-4 py-2">Back</button>
                        <button onClick={() => setStep(3)} className="rounded-md bg-[#138808] text-white px-4 py-2">Next</button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Home city</label>
                            <input value={currentCity} onChange={(e) => setCurrentCity(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Home state</label>
                            <input value={currentState} onChange={(e) => setCurrentState(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Work city (optional)</label>
                            <input value={workCity} onChange={(e) => setWorkCity(e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Work state (optional)</label>
                            <input value={workState} onChange={(e) => setWorkState(e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button onClick={() => setStep(2)} className="rounded-md border border-neutral-300 px-4 py-2">Back</button>
                        <button onClick={() => setStep(4)} className="rounded-md bg-[#138808] text-white px-4 py-2">Next</button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-600"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">Minimum 6 characters.</p>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {info && <p className="text-sm text-green-700">{info}</p>}
                    <div className="flex justify-between">
                        <button type="button" onClick={() => setStep(3)} className="rounded-md border border-neutral-300 px-4 py-2">Back</button>
                        <button disabled={loading} className="rounded-md bg-[#138808] text-white px-4 py-2 font-medium disabled:opacity-60 hover:opacity-90">{loading ? "Submitting..." : "Submit"}</button>
                    </div>
                </form>
            )}


        </div>
    );
}


