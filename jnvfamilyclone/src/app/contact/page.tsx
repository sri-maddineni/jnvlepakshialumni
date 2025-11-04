"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { addContactPageRequest } from "../../firebase/firebaseops";
import Toaster, { toast } from "../../components/Toaster";
import GoBackButton from "../../components/GoBackButton";

const contactTypes = [
    { value: "issue", label: "website Issue" },
    { value: "suggestion", label: "Suggestion" },
    { value: "feedback", label: "Feedback" },
    { value: "partnership", label: "Partnership" },
    { value: "getintouch", label: "Get in touch" },
    { value: "help", label: "I need help" },
    { value: "other", label: "Other" },
];

export default function ContactPage() {
    const { user, isSignedIn } = useUser();
    const [form, setForm] = useState({
        type: "help",
        email: isSignedIn ? user?.primaryEmailAddress?.emailAddress || "" : "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    // Update email when user data loads
    useEffect(() => {
        if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
            setForm(prev => ({ ...prev, email: user.primaryEmailAddress!.emailAddress }));
        }
    }, [isSignedIn, user?.primaryEmailAddress, user?.primaryEmailAddress?.emailAddress]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addContactPageRequest({
                ...form,
                createdAt: new Date().toISOString(),
            });
            toast.success("Message sent!");
            setForm({
                type: "issue",
                email: isSignedIn ? user?.primaryEmailAddress?.emailAddress || "" : "",
                message: "",
            });
        } catch (err) {
            toast.error("Failed to send message. Please try again." + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
            <GoBackButton />
            <Toaster />
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6 text-green-700 text-center">Contact Us</h1>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
                    <div>
                        <label className="font-semibold mb-1 block">Type of Contact <span className="text-red-500">*</span></label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2"
                        >
                            {contactTypes.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="font-semibold mb-1 block">Email <span className="text-red-500">*</span></label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            disabled={isSignedIn}
                            className={`w-full border rounded px-3 py-2 ${isSignedIn ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        />
                    </div>
                    <div>
                        <label className="font-semibold mb-1 block">Message <span className="text-red-500">*</span></label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full border rounded px-3 py-2 resize-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition mt-2 disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </button>
                </form>

                {/* Developer Information */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500 mb-2">
                        Designed and Developed by{" "}
                        <span className="font-semibold text-blue-700">Srihari Maddineni</span>
                        , from JNV Ongole
                    </p>
                    <p className="text-sm text-gray-500">
                        <a href="tel:+916304214514" className="text-red-700 hover:underline">+91 63042 14514</a>
                    </p>
                </div>
            </div>
        </main>
    );
} 