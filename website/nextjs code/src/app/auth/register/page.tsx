"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
    const { registerWithEmail, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await registerWithEmail(email, password);
            router.push("/");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Registration failed";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const onGoogle = async () => {
        setError(null);
        setLoading(true);
        try {
            await signInWithGoogle();
            router.push("/");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Google sign-in failed";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md px-4 sm:px-6 py-10">
            <h1 className="text-2xl font-bold mb-6 text-[#FF9933]">Register</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button disabled={loading} className="w-full rounded-md bg-[#138808] text-white py-2 font-medium disabled:opacity-60 hover:opacity-90">{loading ? "Registering..." : "Create account"}</button>
            </form>
            <div className="my-4 text-center text-sm text-neutral-500">or</div>
            <button onClick={onGoogle} disabled={loading} className="w-full rounded-md border border-[#FF9933] py-2 font-medium disabled:opacity-60 hover:bg-[#FF9933]/10">Continue with Google</button>
        </div>
    );
}


