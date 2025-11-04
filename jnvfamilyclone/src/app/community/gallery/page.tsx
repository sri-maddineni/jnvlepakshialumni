"use client";
import React from "react";
import GoBackButton from "../../../components/GoBackButton";

export default function GalleryPage() {
    return (
        <main className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
            <GoBackButton />
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 mt-8">
                <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">Gallery</h1>
                <p className="text-gray-600 text-center mb-8">Welcome to the public gallery. Photos and media from our community will appear here.</p>
                {/* Future: Add image grid here */}
                <div className="text-center text-gray-400">No images yet. Stay tuned!</div>
            </div>
        </main>
    );
} 