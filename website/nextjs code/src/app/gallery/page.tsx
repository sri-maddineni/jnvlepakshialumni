import { FaImages, FaVideo, FaCalendar } from "react-icons/fa";

export default function GalleryPage() {
    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    <span className="text-[#FF9933]">Gallery</span>
                </h1>
                <p className="text-neutral-600">Memories and moments from JNV Lepakshi alumni events, gatherings, and celebrations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center hover:shadow-md transition-shadow">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-[#FF9933]/10 p-4">
                            <FaImages className="text-[#FF9933] text-2xl" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Event Photos</h3>
                    <p className="text-sm text-neutral-600">Captured moments from reunions, sports events, and alumni meets</p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center hover:shadow-md transition-shadow">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-[#138808]/10 p-4">
                            <FaVideo className="text-[#138808] text-2xl" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Videos</h3>
                    <p className="text-sm text-neutral-600">Recordings from special events and alumni gatherings</p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center hover:shadow-md transition-shadow">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-[#FF9933]/10 p-4">
                            <FaCalendar className="text-[#FF9933] text-2xl" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Memories</h3>
                    <p className="text-sm text-neutral-600">Timeline of our journey and achievements together</p>
                </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center">
                <p className="text-neutral-600 mb-2">Gallery content is being organized and will be available soon.</p>
                <p className="text-sm text-neutral-500">If you have photos or videos to share, please contact us.</p>
            </div>
        </div>
    );
}

