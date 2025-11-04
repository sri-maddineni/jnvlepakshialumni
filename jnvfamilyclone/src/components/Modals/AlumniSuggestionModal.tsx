"use client";
import React, { useState } from "react";
import { addAlumniSuggestionRequest } from "../../firebase/firebaseops";
import { toast } from "../Toaster";
import { useUser } from "@clerk/nextjs";
import { getAlumniByEmail } from "../../firebase/firebaseops";

interface AlumniSuggestionModalProps {
    open: boolean;
    onClose: () => void;
}

export default function AlumniSuggestionModal({ open, onClose }: AlumniSuggestionModalProps) {
    const { user, isSignedIn } = useUser();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        profession: "",
        role: "",
        organisation: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

    // Check if the current user is a registered alumni
    React.useEffect(() => {
        async function checkRegistration() {
            if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) {
                setIsRegistered(false);
                return;
            }
            const { isUserRegisteredAlumni } = await import("../../firebase/firebaseops");
            const registered = await isUserRegisteredAlumni(user.primaryEmailAddress.emailAddress);
            setIsRegistered(registered);
        }
        checkRegistration();
    }, [isSignedIn, user?.primaryEmailAddress?.emailAddress]);

    if (!open) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let requesterAlumniId = null;
            const requesterEmail = user?.primaryEmailAddress?.emailAddress || "";
            // Try to get alumni id from localStorage
            if (requesterEmail) {
                requesterAlumniId = localStorage.getItem("alumniId");
                if (!requesterAlumniId) {
                    const { getAlumniByEmail } = await import("../../firebase/firebaseops");
                    const alumni = await getAlumniByEmail(requesterEmail);
                    if (alumni && alumni.id) {
                        requesterAlumniId = alumni.id;
                        localStorage.setItem("alumniId", requesterAlumniId);
                    }
                }
            }
            else {
                toast.error("sign in first");
            }

            await addAlumniSuggestionRequest({
                ...form,
                createdAt: new Date().toISOString(),
                requestedByEmail: requesterEmail,
                requestedByAlumniId: requesterAlumniId || null,
            });

            toast.success("Suggestion done");
            setForm({
                name: "",
                email: "",
                phone: "",
                profession: "",
                role: "",
                organisation: "",
                message: "",
            });
            onClose();
        } catch (err) {
            toast.error("Failed to submit suggestion. Please try again." + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-2 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative max-h-[75vh] overflow-y-auto flex flex-col">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                    onClick={onClose}
                    disabled={loading}
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-extrabold mb-6 text-green-700 text-center">Suggest an Alumni</h2>
                {isRegistered === false ? (
                    <div className="text-red-600 font-semibold text-center py-12">Only registered alumni can suggest an alumni.</div>
                ) : (
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Name"
                            required
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            type="email"
                            // required
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                            type="tel"
                            // required
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <input
                            name="profession"
                            value={form.profession}
                            onChange={handleChange}
                            placeholder="Profession"
                            required
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <input
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            placeholder="Role"
                            required
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <input
                            name="organisation"
                            value={form.organisation}
                            onChange={handleChange}
                            placeholder="Organisation"
                            required
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Message (optional)"
                            rows={3}
                            className="border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <button
                            type="submit"
                            className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition mt-2 disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Suggestion"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
} 