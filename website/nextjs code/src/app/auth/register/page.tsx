"use client";

import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createAlumni, getAlumniByHallTicket, AlumniRole } from "@/app/database/dbops";
import { auth } from "@/app/database/firebaseconfig";
import { AlumniStatus } from "@/app/database/Enums";

export default function RegisterPage() {
    const { user, loading, registerWithEmail } = useAuth();
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
    const [workRole, setWorkRole] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [donationOption, setDonationOption] = useState<"500" | "more" | "none">("none");
    const [donationAmount, setDonationAmount] = useState<number | "">("");
    const [transactionId, setTransactionId] = useState("");
    const [donationDetails, setDonationDetails] = useState("");

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            router.push("/profile");
        }
    }, [user, loading, router]);

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="mx-auto max-w-xl px-4 sm:px-6 py-10">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    // Don't render registration form if user is logged in
    if (user) {
        return null;
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);
        setIsSubmitting(true);
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
            // Validate donation fields if payment option selected - payment is mandatory when selected
            if (donationOption !== "none") {
                if (!transactionId.trim()) {
                    throw new Error("Please enter transaction ID");
                }
                if (donationOption === "more" && (!donationAmount || Number(donationAmount) < 500)) {
                    throw new Error("Please enter a valid donation amount (minimum ₹500)");
                }
            }

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
                workRole: workRole || undefined,
                donationAmount: donationOption !== "none" ? (donationOption === "500" ? 500 : Number(donationAmount)) : undefined,
                transactionId: donationOption !== "none" ? transactionId.trim() : undefined,
                donationDetails: donationDetails.trim() || undefined,
                status: AlumniStatus.Pending,
                supportedBy: [],
                approvedBy: undefined,
            }, uid);
            setInfo("Registration submitted successfully");
            router.push("/profile");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Registration failed";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Google sign-in removed from registration flow as requested

    const professionOptions = ["Doctor", "Police", "Engineering", "IT", "Non-IT", "Government", "Entrepreneur", "Teacher", "Self Business", "Lawyer", "Other"];

    const generateWhatsAppMessage = () => {
        const donationAmountText = donationOption === "500" ? "₹500" : donationOption === "more" ? `₹${donationAmount}` : "No donation";

        let message = `*New Registration - Payment Notification*\n\n`;
        message += `*Personal Details:*\n`;
        message += `Name: ${fullName}\n`;
        message += `Role: ${role === 'alumni' ? 'Alumni' : 'Teacher'}\n`;
        message += `Email: ${email || 'Not provided yet'}\n`;
        message += `Mobile: ${mobile}\n`;
        message += `Hall Ticket: ${hallTicket}\n\n`;

        message += `*Academic Details:*\n`;
        message += `Joined Year: ${joinedYear}\n`;
        message += `Passed Out Year: ${passedOutYear}\n`;
        message += `Joined Class: ${joinedClass}\n`;
        message += `Passed Out Class: ${passedOutClass}\n\n`;

        message += `*Contact & Profession:*\n`;
        message += `Blood Group: ${bloodGroup}\n`;
        message += `Profession: ${profession}${profession === 'Other' ? ` (${professionOther})` : ''}\n`;
        if (organisationName) message += `Organization: ${organisationName}\n`;
        if (workRole) message += `Work Role: ${workRole}\n`;
        message += `Current City: ${currentCity}, ${currentState}\n`;
        if (workCity) message += `Work City: ${workCity}, ${workState}\n`;
        if (aadhar) message += `Aadhar: ${aadhar}\n`;
        message += `\n`;

        message += `*Donation Details:*\n`;
        message += `Donation Amount: ${donationAmountText}\n`;
        message += `Transaction ID: ${transactionId}\n`;
        if (donationDetails) message += `Transaction Details: ${donationDetails}\n`;

        return encodeURIComponent(message);
    };

    const handleNotifyAdmin = () => {
        if (donationOption === "none") {
            setError("Please select a payment option first");
            return;
        }
        if (!transactionId.trim()) {
            setError("Please enter transaction ID first");
            return;
        }

        const treasurerPhone = "919985309646"; // International format: 91 (India) + 9985309646
        const message = generateWhatsAppMessage();
        const whatsappUrl = `https://wa.me/${treasurerPhone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-6 text-sm">
            {[1, 2, 3, 4, 5].map((s) => (
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
                        {/* <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                        </div> */}
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
                    <div>
                        <label className="block text-sm font-medium mb-1">Work role / Job title (optional)</label>
                        <input value={workRole} onChange={(e) => setWorkRole(e.target.value)} placeholder="e.g., Associate Software Engineer" className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
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
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Donation</label>
                        <p className="text-xs text-neutral-600 mb-3">Donations with donor names will be displayed on the website.</p>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="donation"
                                    value="500"
                                    checked={donationOption === "500"}
                                    onChange={() => {
                                        setDonationOption("500");
                                        setDonationAmount(500);
                                    }}
                                />
                                I can pay ₹500/-
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="donation"
                                    value="more"
                                    checked={donationOption === "more"}
                                    onChange={() => {
                                        setDonationOption("more");
                                        setDonationAmount("");
                                    }}
                                />
                                I can pay more than ₹500/-
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="donation"
                                    value="none"
                                    checked={donationOption === "none"}
                                    onChange={() => {
                                        setDonationOption("none");
                                        setDonationAmount("");
                                        setTransactionId("");
                                        setDonationDetails("");
                                    }}
                                />
                                I can&#39;t pay
                            </label>
                        </div>
                    </div>

                    {donationOption === "more" && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Donation Amount (₹) <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value ? Number(e.target.value) : "")}
                                min="500"
                                required={donationOption === "more"}
                                className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                            />
                            <p className="text-xs text-neutral-500 mt-1">Minimum amount is ₹500</p>
                        </div>
                    )}

                    {donationOption !== "none" && (
                        <div className="border border-neutral-300 rounded-md p-4 space-y-4 bg-neutral-50">
                            <h3 className="font-medium text-sm">Payment Details</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-neutral-600 mb-1">Account Number</p>
                                    <p className="text-sm font-mono font-medium">020210100172155</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-600 mb-1">IFSC Code</p>
                                    <p className="text-sm font-mono font-medium">UBIN0802026</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-neutral-600 mb-1">Branch</p>
                                <p className="text-sm">HINDUPUR MAIN BAZAR BRANCH, ANANTHAPUR, 525201</p>
                            </div>

                            <div>
                                <p className="text-xs text-neutral-600 mb-2">QR Code</p>
                                <div className="border border-neutral-300 rounded p-2 bg-white inline-block">
                                    <div className="w-48 h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center text-xs text-neutral-500 text-center p-2 border-2 border-dashed border-neutral-400">
                                        <div>
                                            <div className="text-base font-medium mb-1">QR Code</div>
                                            <div className="text-[10px]">(Dummy Image)</div>
                                            <div className="text-[10px] mt-2">Place actual QR code at</div>
                                            <div className="text-[10px] font-mono">/public/images/payment/qr-code.png</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-neutral-300 pt-4">
                                <p className="text-xs text-neutral-600 mb-1">Treasurer Contact</p>
                                <p className="text-sm font-medium">D Sreenivasa Reddy</p>
                                <p className="text-sm">Phone: 9985309646</p>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Transaction ID <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        required
                                        className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Transaction Details (optional)</label>
                                    <textarea
                                        value={donationDetails}
                                        onChange={(e) => setDonationDetails(e.target.value)}
                                        rows={3}
                                        className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {donationOption !== "none" && transactionId.trim() && (
                        <div className="border border-[#138808] rounded-md p-3 bg-green-50">
                            <p className="text-xs text-neutral-600 mb-2">Notify the treasurer about this payment:</p>
                            <button
                                type="button"
                                onClick={handleNotifyAdmin}
                                className="w-full rounded-md bg-[#25D366] text-white px-4 py-2 font-medium hover:opacity-90 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                Notify Admin via WhatsApp
                            </button>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-between">
                        <button onClick={() => {
                            setError(null);
                            setStep(3);
                        }} className="rounded-md border border-neutral-300 px-4 py-2">Back</button>
                        <button
                            onClick={() => {
                                setError(null);
                                // If payment option selected, validate before proceeding
                                if (donationOption !== "none") {
                                    if (!transactionId.trim()) {
                                        setError("Please enter transaction ID to proceed");
                                        return;
                                    }
                                    if (donationOption === "more" && (!donationAmount || Number(donationAmount) < 500)) {
                                        setError("Please enter a valid donation amount (minimum ₹500)");
                                        return;
                                    }
                                }
                                setStep(5);
                            }}
                            className="rounded-md bg-[#138808] text-white px-4 py-2"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {step === 5 && (
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
                        <button type="button" onClick={() => setStep(4)} className="rounded-md border border-neutral-300 px-4 py-2">Back</button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-md bg-[#138808] text-white px-4 py-2 font-medium disabled:opacity-60 hover:opacity-90"
                        >
                            {isSubmitting ? "Submitting..." : "Complete Registration"}
                        </button>
                    </div>
                </form>
            )}


        </div>
    );
}


