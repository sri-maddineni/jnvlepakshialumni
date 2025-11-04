"use client";
import React, { useState } from "react";

interface StatusModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (statusMessage: string) => void;
}

export default function StatusModal({ open, onClose, onSubmit }: StatusModalProps) {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(status);
        setLoading(false);
        setStatus("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative max-h-[75vh] overflow-y-auto flex flex-col">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-extrabold mb-6 text-green-700 text-center">Complete Suggestion</h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
                    <textarea
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        placeholder="Add an optional status message..."
                        rows={3}
                        className="border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition mt-2 disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Completing..." : "Mark as Completed"}
                    </button>
                </form>
            </div>
        </div>
    );
} 