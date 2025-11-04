"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { HiUser, HiHeart, HiOutlineHeart } from "react-icons/hi";

// Dummy data for help stories
const dummyStories = [
    {
        id: "1",
        giver: { name: "John Doe", email: "john@email.com" },
        receiver: { name: "Priya Singh", email: "priya@email.com" },
        description: "Helped with job referral at XYZ Corp.",
        date: "2024-07-20",
        likes: ["john@email.com", "alice@email.com"]
    },
    {
        id: "2",
        giver: { name: "Priya Singh", email: "priya@email.com" },
        receiver: { name: "Amit Patel", email: "amit@email.com" },
        description: "Guided on higher studies in the US.",
        date: "2024-07-18",
        likes: ["amit@email.com"]
    },
    {
        id: "3",
        giver: { name: "Amit Patel", email: "amit@email.com" },
        receiver: { name: "John Doe", email: "john@email.com" },
        description: "Helped with accommodation during alumni meet.",
        date: "2024-07-15",
        likes: []
    }
];

const FILTERS = [
    { label: "All", value: "all" },
    { label: "Help Given", value: "given" },
    { label: "Help Received", value: "received" }
];

export default function HelpingHandsPage() {
    const { user, isSignedIn } = useUser();
    const [filter, setFilter] = useState("all");
    const [stories, setStories] = useState(dummyStories);

    // Filter stories based on selected tab
    const filteredStories = stories.filter(story => {
        if (filter === "all") return true;
        if (filter === "given") return isSignedIn && user?.primaryEmailAddress?.emailAddress
            ? story.giver.email === user.primaryEmailAddress.emailAddress
            : false;
        if (filter === "received") return isSignedIn && user?.primaryEmailAddress?.emailAddress
            ? story.receiver.email === user.primaryEmailAddress.emailAddress
            : false;
        return true;
    });

    // Like/unlike handler
    const handleLike = (storyId: string) => {
        if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) return;
        setStories(prevStories => prevStories.map(story => {
            if (story.id !== storyId) return story;
            const email = user.primaryEmailAddress!.emailAddress;
            const hasLiked = story.likes.includes(email);
            return {
                ...story,
                likes: hasLiked
                    ? story.likes.filter(e => e !== email)
                    : [...story.likes, email]
            };
        }));
    };

    return (
        <main className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-green-700 mb-2 flex items-center gap-2">
                    Helping Hands
                </h1>
                <p className="text-gray-600 mb-6">
                    A place to share and celebrate help given and received among JNV alumni. Only signed-in users can like or filter by their own stories.
                </p>
                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {FILTERS.map(f => (
                        <button
                            key={f.value}
                            className={`px-4 py-2 rounded-full font-semibold border transition-colors ${filter === f.value ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50"}`}
                            onClick={() => setFilter(f.value)}
                            disabled={filter === f.value}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                {/* Stories List */}
                <div className="space-y-6">
                    {filteredStories.length === 0 && (
                        <div className="text-gray-400 text-center py-8">No stories found for this filter.</div>
                    )}
                    {filteredStories.map(story => (
                        <div key={story.id} className="bg-gray-50 rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center gap-4 border border-gray-100">
                            <div className="flex flex-col items-center gap-2 md:w-1/4">
                                <div className="flex items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center text-xl font-bold text-blue-700 shadow border-2 border-white">
                                        <HiUser className="w-8 h-8 text-blue-300" />
                                    </div>
                                    <span className="font-semibold text-green-700">{story.giver.name}</span>
                                </div>
                                <span className="text-xs text-gray-400">Gave Help</span>
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">to</span>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-100 to-blue-100 flex items-center justify-center text-lg font-bold text-blue-700 shadow border-2 border-white">
                                        <HiUser className="w-6 h-6 text-blue-300" />
                                    </div>
                                    <span className="font-semibold text-blue-700">{story.receiver.name}</span>
                                </div>
                                <div className="text-gray-700 italic">&quot;{story.description}&quot;</div>
                                <div className="text-xs text-gray-400">{new Date(story.date).toLocaleDateString()}</div>
                            </div>
                            <div className="flex flex-col items-center gap-2 md:w-20">
                                <button
                                    className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold border transition-colors ${isSignedIn ? "bg-pink-100 hover:bg-pink-200 text-pink-700 border-pink-200" : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"}`}
                                    onClick={() => isSignedIn && handleLike(story.id)}
                                    disabled={!isSignedIn}
                                    title={isSignedIn ? "Like this story" : "Sign in to like"}
                                >
                                    {isSignedIn && user?.primaryEmailAddress?.emailAddress && story.likes.includes(user.primaryEmailAddress.emailAddress)
                                        ? <HiHeart className="w-5 h-5 text-pink-600" />
                                        : <HiOutlineHeart className="w-5 h-5" />}
                                    <span>{story.likes.length}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
} 