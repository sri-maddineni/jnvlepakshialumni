"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useRef, useEffect, useState } from "react";
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { HiUser, HiShieldCheck, HiHome, HiInformationCircle, HiUserGroup, HiMail, HiPhotograph, HiCalendar, HiBookOpen, HiHeart } from "react-icons/hi";

const navLinks = [
    { name: "Home", href: "/", icon: <HiHome className="w-5 h-5" /> },
    { name: "About", href: "/about", icon: <HiInformationCircle className="w-5 h-5" /> },
    { name: "Alumni", href: "/alumni", icon: <HiUserGroup className="w-5 h-5" /> },
    { name: "Contact", href: "/contact", icon: <HiMail className="w-5 h-5" /> },
];

const communityLinks = [
    { name: "Gallery", href: "/community/gallery", icon: <HiPhotograph className="w-5 h-5" /> },
    { name: "Events", href: "/community/events", icon: <HiCalendar className="w-5 h-5" /> },
    { name: "Helping Hands", href: "/community/helping-hands", icon: <HiHeart className="w-5 h-5" /> },
    // Stories will be conditionally rendered
];

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const { isSignedIn, user } = useUser();
    const [communityOpen, setCommunityOpen] = useState(false);
    const communityRef = useRef<HTMLDivElement>(null);
    // Close dropdown on outside click
    useEffect(() => {
        if (!communityOpen) return;
        function handleClick(e: MouseEvent) {
            if (communityRef.current && !communityRef.current.contains(e.target as Node)) {
                setCommunityOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [communityOpen]);

    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

    // Determine if user is admin
    const isAdmin = user?.publicMetadata?.role === "admin";

    return (
        <nav className="bg-white border-b border-green-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-green-700 hover:text-yellow-600 transition-colors">JNV Alumni</Link>
                    </div>
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex gap-3 items-center">
                        {navLinks.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-base font-medium transition-colors
                ${isActive(item.href)
                                        ? "text-white bg-green-600 shadow"
                                        : "text-gray-800 hover:text-yellow-600 hover:bg-green-50"}
            `}
                                style={{ minWidth: 0 }}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        ))}
                        {/* Community Dropdown */}
                        <div className="relative" ref={communityRef}>
                            <button
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors text-gray-800 hover:text-yellow-600 hover:bg-green-50 focus:outline-none"
                                onClick={() => setCommunityOpen((open) => !open)}
                                aria-expanded={communityOpen}
                                aria-haspopup="true"
                            >
                                <HiBookOpen className="w-5 h-5" /> <span>Community</span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <div className={`absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 transition-all duration-150 ${communityOpen ? "block" : "hidden"}`}>
                                {communityLinks.map(link => (
                                    <Link key={link.name} href={link.href} className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-green-50 hover:text-green-700 transition-colors" onClick={() => setCommunityOpen(false)}>
                                        {link.icon} <span>{link.name}</span>
                                    </Link>
                                ))}
                                {isSignedIn && (
                                    <Link href="/community/stories" className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-green-50 hover:text-green-700 transition-colors" onClick={() => setCommunityOpen(false)}>
                                        <HiBookOpen className="w-5 h-5" /> <span>Stories</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                        {/* Admin/Profile link */}
                        {isSignedIn && (
                            isAdmin ? (
                                <>
                                    <Link
                                        href="/me/profile"
                                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-base font-medium transition-colors ${isActive("/me/profile") ? "text-white bg-green-600 shadow" : "text-gray-800 hover:text-yellow-600 hover:bg-green-50"}`}
                                        style={{ minWidth: 0 }}
                                    >
                                        <HiUser className="w-5 h-5" /> <span>Profile</span>
                                    </Link>
                                    <Link
                                        href="/admin"
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive("/admin") ? "text-white bg-green-600 shadow" : "text-gray-800 hover:text-yellow-600 hover:bg-green-50"}`}
                                        style={{ minWidth: 0 }}
                                    >
                                        <HiShieldCheck className="w-5 h-5" /> <span>Admin</span>
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href="/me/profile"
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive("/me/profile") ? "text-white bg-green-600 shadow" : "text-gray-800 hover:text-yellow-600 hover:bg-green-50"}`}
                                    style={{ minWidth: 0 }}
                                >
                                    <HiUser className="w-5 h-5" /> <span>Profile</span>
                                </Link>
                            )
                        )}
                    </div>
                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4 ml-4">
                        {isSignedIn ? (
                            <UserButton afterSignOutUrl="/" />
                        ) : (
                            <SignInButton mode="modal">
                                <button className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition-colors">Sign In</button>
                            </SignInButton>
                        )}
                    </div>
                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-green-700 hover:text-yellow-600 focus:outline-none"
                        >
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Mobile Navigation */}
                {menuOpen && (
                    <div className="md:hidden mt-2 bg-white rounded-lg shadow border border-green-100">
                        <div className="flex flex-col gap-1 p-2">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors
                        ${isActive(item.href)
                                            ? "text-white bg-green-600 shadow"
                                            : "text-gray-800 hover:text-yellow-600 hover:bg-green-50"}
                    `}
                                    style={{ minWidth: 0 }}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                            {/* Community Dropdown */}
                            <div className="relative" ref={communityRef}>
                                <button
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors text-gray-800 hover:text-yellow-600 hover:bg-green-50 focus:outline-none"
                                    onClick={() => setCommunityOpen((open) => !open)}
                                    aria-expanded={communityOpen}
                                    aria-haspopup="true"
                                >
                                    <HiBookOpen className="w-5 h-5" /> <span>Community</span>
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                <div className={`absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 transition-all duration-150 ${communityOpen ? "block" : "hidden"}`}>
                                    {communityLinks.map(link => (
                                        <Link key={link.name} href={link.href} className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-green-50 hover:text-green-700 transition-colors" onClick={() => setCommunityOpen(false)}>
                                            {link.icon} <span>{link.name}</span>
                                        </Link>
                                    ))}
                                    {isSignedIn && (
                                        <Link href="/stories" className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-green-50 hover:text-green-700 transition-colors" onClick={() => setCommunityOpen(false)}>
                                            <HiBookOpen className="w-5 h-5" /> <span>Stories</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                            {/* Admin/Profile link */}
                            {isSignedIn && (
                                isAdmin ? (
                                    <>
                                        <Link
                                            href="/me/profile"
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive("/me/profile") ? "text-white bg-green-600 shadow" : "text-gray-800 hover:text-yellow-600 hover:bg-green-50"}`}
                                            style={{ minWidth: 0 }}
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <HiUser className="w-5 h-5" /> <span>Profile</span>
                                        </Link>
                                        <Link
                                            href="/admin"
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive("/admin") ? "text-white bg-green-600 shadow" : "text-gray-800 hover:text-yellow-600 hover:bg-green-50"}`}
                                            style={{ minWidth: 0 }}
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <HiShieldCheck className="w-5 h-5" /> <span>Admin</span>
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href="/me/profile"
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive("/me/profile") ? "text-white bg-green-600 shadow" : "text-gray-800 hover:text-yellow-600 hover:bg-green-50"}`}
                                        style={{ minWidth: 0 }}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <HiUser className="w-5 h-5" /> <span>Profile</span>
                                    </Link>
                                )
                            )}
                            <div className="mt-2">
                                {isSignedIn ? (
                                    <UserButton afterSignOutUrl="/" />
                                ) : (
                                    <SignInButton mode="modal">
                                        <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition-colors">Sign In</button>
                                    </SignInButton>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
} 