"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { user, signOutUser } = useAuth();

    return (
        <header className="w-full border-b border-neutral-200 bg-white/80 backdrop-blur sticky top-0 z-50">
            <nav className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex items-center justify-between">
                <Link href="/" className="flex flex-col leading-tight">
                    <span className="text-lg sm:text-xl font-bold tracking-tight">
                        <span className="text-[#FF9933]">JNV</span> <span className="text-[#138808]">Lepakshi</span>
                    </span>
                </Link>

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
                    {!user && (
                        <>
                            <li><Link className="hover:text-[#FF9933]" href="/auth/login">Login</Link></li>
                            <li><Link href="/auth/register" className="rounded bg-[#138808] text-white px-3 py-1.5 hover:opacity-90">Register</Link></li>
                        </>
                    )}
                    {user && (
                        <li>
                            <button onClick={signOutUser} className="rounded bg-[#138808] text-white px-3 py-1.5 hover:opacity-90">Sign out</button>
                        </li>
                    )}
                </ul>
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
                            <li>
                                <button onClick={() => { setOpen(false); void signOutUser(); }} className="rounded bg-[#138808] text-white px-3 py-1.5">Sign out</button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </header>
    );
}


