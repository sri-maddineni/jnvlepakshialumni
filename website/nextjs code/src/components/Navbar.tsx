"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { user, signOutUser } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const showBack = pathname !== "/";
    const handleSignOut = async () => {
        await signOutUser();
        router.push("/");
    };
    const handleMobileSignOut = async () => {
        setOpen(false);
        await handleSignOut();
    };

    return (
        <header className="w-full border-b border-neutral-200 bg-white/80 backdrop-blur sticky top-0 z-50">
            <nav className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2 leading-tight">
                    {showBack && (
                        <button
                            type="button"
                            aria-label="Go back"
                            onClick={() => router.back()}
                            className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M15.78 5.22a.75.75 0 0 1 0 1.06L10.06 12l5.72 5.72a.75.75 0 1 1-1.06 1.06l-6.25-6.25a.75.75 0 0 1 0-1.06l6.25-6.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/images/logos/logo png.png" alt="Logo" width={36} height={36} />
                        <span className="text-lg sm:text-xl font-bold tracking-tight">
                            <span className="text-[#FF9933]">JNV</span> <span className="text-[#138808]">Lepakshi</span>
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <button aria-label="Toggle Menu" onClick={() => setOpen(!open)} className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M3.75 6.75A.75.75 0 0 1 4.5 6h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm.75 4.5a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5h-15Z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <ul className="hidden sm:flex items-center gap-5 text-sm font-medium">
                        <li><Link className="hover:text-[#FF9933]" href="/">Home</Link></li>
                        <li><Link className="hover:text-[#FF9933]" href="/about">About</Link></li>
                        <li><Link className="hover:text-[#FF9933]" href="/alumni">Alumni</Link></li>
                        <li><Link className="hover:text-[#FF9933]" href="/contact">Contact</Link></li>
                        <li><Link className="hover:text-[#FF9933]" href="/gallery">Gallery</Link></li>
                        {!user && (
                            <>
                                <li><Link className="hover:text-[#FF9933]" href="/auth/login">Login</Link></li>
                                <li><Link href="/auth/register" className="rounded bg-[#138808] text-white px-3 py-1.5 hover:opacity-90">Register</Link></li>
                            </>
                        )}
                        {user && (
                            <>
                                <li><Link className="hover:text-[#FF9933]" href="/profile">Profile</Link></li>
                                <li>
                                    <button onClick={handleSignOut} className="rounded bg-[#138808] text-white px-3 py-1.5 hover:opacity-90">Sign out</button>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* JNV logo removed from navbar; shown in hero on larger screens */}
                </div>
            </nav>
            {open && (
                <div className="sm:hidden border-t border-neutral-200">
                    <ul className="px-4 py-3 space-y-2 text-sm font-medium">
                        <li><Link className="text-neutral-800" href="/" onClick={() => setOpen(false)}>Home</Link></li>
                        <li><Link className="text-neutral-800" href="/about" onClick={() => setOpen(false)}>About</Link></li>
                        <li><Link className="text-neutral-800" href="/alumni" onClick={() => setOpen(false)}>Alumni</Link></li>
                        <li><Link className="text-neutral-800" href="/contact" onClick={() => setOpen(false)}>Contact</Link></li>
                        {!user && (
                            <>
                                <li><Link className="text-neutral-800" href="/auth/login" onClick={() => setOpen(false)}>Login</Link></li>
                                <li><Link className="text-neutral-800" href="/auth/register" onClick={() => setOpen(false)}>Register</Link></li>
                            </>
                        )}
                        {user && (
                            <>
                                <li><Link className="text-neutral-800" href="/profile" onClick={() => setOpen(false)}>Profile</Link></li>
                                <li>
                                    <button onClick={handleMobileSignOut} className="rounded bg-[#138808] text-white px-3 py-1.5">
                                        Sign out
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </header>
    );
}


