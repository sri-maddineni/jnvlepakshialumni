"use client";
import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { getAllAlumni } from "../../../firebase/firebaseops";
import { useRouter } from "next/navigation";
import { HiUser, HiOfficeBuilding, HiBriefcase, HiLocationMarker, HiAcademicCap, HiIdentification, HiHome, HiPhone, HiPencil } from "react-icons/hi";
import { Alumni } from "../../../types";
import ProfileSidebar from "../../../components/profile/Sidebar";
import ProfileTab from "../../../components/profile/ProfileTab";
import StoriesTab from "../../../components/profile/StoriesTab";
import AddHelpStory from "../../../components/profile/AddHelpStory";
import SettingsTab from "../../../components/profile/SettingsTab";

export default function Profile() {
    const { user, isSignedIn } = useUser();
    const [selectedTab, setSelectedTab] = React.useState("profile");

    return (
        <main className="flex min-h-screen bg-gray-50">
            <ProfileSidebar selected={selectedTab} onSelect={setSelectedTab} />
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
                    {selectedTab === "profile" && <ProfileTab />}
                    {selectedTab === "stories" && <StoriesTab />}
                    {selectedTab === "settings" && <SettingsTab />}
                    {selectedTab === "add-help-story" && <AddHelpStory />}
                </div>
            </div>
        </main>
    );
} 