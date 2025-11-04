"use client";
import { useRouter } from "next/navigation";
import { HiArrowNarrowLeft } from "react-icons/hi";

export default function GoBackButton() {
    const router = useRouter();
    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 mb-4 bg-gray-100 hover:bg-green-200 hover:border-amber-200 text-green-700 rounded-lg font-semibold transition-colors focus:outline-none"
            aria-label="Go back"
        >
            <HiArrowNarrowLeft className="w-5 h-5" />
            <span>Go Back</span>
        </button>
    );
} 