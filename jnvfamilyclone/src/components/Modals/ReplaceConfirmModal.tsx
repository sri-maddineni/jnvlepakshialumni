import React from "react";
import { HiArrowNarrowRight } from "react-icons/hi";

export default function ReplaceConfirmModal({ open, onClose, onConfirm, alumni, field, newValue, fieldLabel }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    alumni: { id: string; fullName: string; oldValue: string }[];
    field: string;
    newValue: string;
    fieldLabel: string;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative max-h-[80vh] overflow-y-auto flex flex-col">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4 text-center text-yellow-700">Confirm Replace</h2>
                <div className="mb-4 text-sm text-gray-700 text-center">
                    You are about to update <b>{alumni.length}</b> alumni: <b>{fieldLabel}</b> → <b>{newValue}</b>
                </div>
                <div className="divide-y divide-gray-200 mb-6">
                    {alumni.map(a => (
                        <div key={a.id} className="flex items-center gap-2 py-2">
                            <span className="font-semibold text-gray-800 flex-1 truncate">{a.fullName}</span>
                            <span className="text-gray-500 text-xs bg-gray-100 rounded px-2 py-1">{a.oldValue || '-'}</span>
                            <HiArrowNarrowRight className="w-5 h-5 text-yellow-600" />
                            <span className="text-yellow-700 text-xs bg-yellow-50 rounded px-2 py-1">{newValue}</span>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4 justify-center mt-4">
                    <button
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 font-semibold"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 font-semibold"
                        onClick={onConfirm}
                    >
                        Confirm Replace
                    </button>
                </div>
            </div>
        </div>
    );
} 