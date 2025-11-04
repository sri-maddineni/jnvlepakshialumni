import { HandIcon, PencilIcon } from "lucide-react";
import React from "react";
import { HiUser, HiBookOpen, HiCog, HiHand } from "react-icons/hi";

const menu = [
    { key: "profile", label: "Profile", icon: <HiUser className="w-6 h-6" /> },
    { key: "stories", label: "Stories", icon: <HiBookOpen className="w-6 h-6" /> },
    { key: "settings", label: "Settings", icon: <HiCog className="w-6 h-6" /> },
    { key: "add-help-story", label: "Help Story", icon: <PencilIcon className="w-5 h-5" /> },
];

export default function ProfileSidebar({ selected, onSelect }: { selected: string; onSelect: (key: string) => void }) {
    return (
        <aside className="w-76 bg-white border-r border-green-100 p-6 flex flex-col gap-4 min-h-screen">
            <div className="flex items-center gap-2 mb-8">
                <HiUser className="w-7 h-7 text-green-600" />
                <span className="text-xl font-bold text-green-700">My Account</span>
            </div>
            {menu.map((item) => (
                <button
                    key={item.key}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-50 transition-colors w-full text-left ${selected === item.key ? "bg-green-100 font-semibold" : ""}`}
                    onClick={() => onSelect(item.key)}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            ))}
        </aside>
    );
} 