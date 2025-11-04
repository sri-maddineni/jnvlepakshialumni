"use client";
import React from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import GoBackButton from "../../../components/GoBackButton";

export default function StoriesPage() {
    return (
        <main className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
            <GoBackButton />
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 mt-8">
                <h1 className="text-3xl font-bold text-yellow-700 mb-4 text-center">Stories</h1>
                <SignedIn>
                    <p className="text-gray-600 text-center mb-8">Share your experience with the community.</p>
                    {/* Future: Add story submission form and list here */}
                    <div className="text-center text-gray-400">No stories yet. Be the first to share!</div>
                </SignedIn>
                <SignedOut>
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-gray-600 text-center">Please sign in to view and share stories.</p>
                        <SignInButton mode="modal">
                            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Sign In</button>
                        </SignInButton>
                    </div>
                </SignedOut>
            </div>
        </main>
    );
} 