"use client";
import React from "react";
import GoBackButton from "../../../components/GoBackButton";

export default function EventsPage() {
    return (
        <main className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
            <GoBackButton />
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 mt-8">
                <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">Events</h1>
                <p className="text-gray-600 text-center mb-8">See upcoming events and gatherings for the JNV Alumni community.</p>
                {/* Future: Add event list here */}
                <div className="text-center text-gray-400">No upcoming events at the moment.</div>
            </div>
        </main>
    );
} 