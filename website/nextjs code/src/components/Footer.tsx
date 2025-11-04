import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full border-t border-neutral-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 grid gap-6 sm:grid-cols-4">
                <div>
                    <p className="text-base font-semibold"><span className="text-[#FF9933]">Alumni Association</span> <span className="text-[#138808]">JNV Lepakshi</span></p>
                    <p className="text-sm text-neutral-800 mt-1">Enter to Learn • Leave to Serve</p>
                </div>
                <div className="text-sm">
                    <p className="font-semibold mb-2 text-[#FF9933]">Quick Links</p>
                    <ul className="space-y-1 text-neutral-700">
                        <li><Link className="hover:text-[#138808]" href="/">Home</Link></li>
                        <li><Link className="hover:text-[#138808]" href="/about">About</Link></li>
                        <li><Link className="hover:text-[#138808]" href="/alumni">Alumni</Link></li>
                        <li><Link className="hover:text-[#138808]" href="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div className="text-sm">
                    <p className="font-semibold mb-2 text-[#FF9933]">Get Involved</p>
                    <ul className="space-y-1 text-neutral-700">
                        <li><Link className="hover:text-[#138808]" href="/auth/login">Login</Link></li>
                        <li><Link className="hover:text-[#138808]" href="/auth/register">Register</Link></li>
                    </ul>
                </div>
                <div className="text-sm">
                    <p className="font-semibold mb-2 text-[#FF9933]">Follow Us</p>
                    <div className="flex items-center gap-3">
                        <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-neutral-700 hover:text-[#138808]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.463h-1.261c-1.243 0-1.63.772-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
                            </svg>
                        </a>
                        <a href="https://instagram.com/yourpage" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-neutral-700 hover:text-[#138808]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm11 2a1 1 0 100 2 1 1 0 000-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
                            </svg>
                        </a>
                        <a href="https://wa.me/yourwhatsapplink" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-neutral-700 hover:text-[#138808]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                <path d="M20.52 3.48A11.91 11.91 0 0012.01 0C5.39 0 .03 5.36.03 11.98c0 2.11.55 4.16 1.6 5.98L0 24l6.2-1.59a11.95 11.95 0 005.8 1.5h.01c6.62 0 11.98-5.36 11.98-11.98a11.91 11.91 0 00-3.47-8.45zM12 22.03h-.01a10 10 0 01-5.1-1.39l-.37-.22-3.68.95.98-3.58-.24-.37A9.96 9.96 0 012.03 12C2.03 6.49 6.49 2.03 12 2.03c2.67 0 5.18 1.04 7.07 2.93A9.95 9.95 0 0121.97 12c0 5.51-4.46 10.03-9.97 10.03zm5.48-7.54c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.68.15-.2.3-.78.98-.95 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.51-1.78-1.69-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.68-1.63-.93-2.23-.25-.6-.5-.52-.68-.53h-.58c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.14 4.53.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.08 1.78-.72 2.03-1.42.25-.7.25-1.3.18-1.42-.08-.12-.27-.2-.58-.35z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t border-neutral-200">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 text-xs text-neutral-600 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span>© {new Date().getFullYear()} AAJNVL. All rights reserved.</span>
                    <span>Built with Next.js + Tailwind CSS</span>
                </div>
                <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 0%,#FF9933 33.33%,#FFFFFF 33.33%,#FFFFFF 66.66%,#138808 66.66%,#138808 100%)" }} />
            </div>
        </footer>
    );
}


