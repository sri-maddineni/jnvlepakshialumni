"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth } from "@/app/database/firebaseconfig";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { AuthError } from "firebase/auth";

export default function LoginPage() {
    const { signInWithEmail, signInWithGoogle, resetPassword, signOutUser } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [resetting, setResetting] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);
        setLoading(true);
        try {
            if (auth.currentUser && auth.currentUser.email && auth.currentUser.email !== email) {
                await signOutUser();
            }
            await signInWithEmail(email, password);
            router.push("/");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Login failed";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    

    const onGoogle = async () => {
      setError(null);
      setInfo(null);
      setLoading(true);
    
      try {
        await signInWithGoogle();
        router.push("/");
      } catch (err) {
        // Narrow the error type safely
        const error = err as AuthError & { customData?: { email?: string } };
    
        const code = error.code;
        const emailFromErr = error.customData?.email;
    
        if (code === "auth/account-exists-with-different-credential" && emailFromErr) {
          try {
            const methods = await fetchSignInMethodsForEmail(auth, emailFromErr);
            if (methods.includes("password")) {
              setError(
                "Account exists with email & password. Please sign in with your password first; you can link Google later."
              );
            } else {
              setError("Account exists with a different provider. Please use the previously used method.");
            }
          } catch {
            setError("Account exists with different credentials. Please sign in with your password.");
          }
        } else {
          const message = error.message || "Google sign-in failed";
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };
    

    const onForgotPassword = async () => {
        setError(null);
        setInfo(null);
        if (!email) {
            setError("Enter your email to reset your password.");
            return;
        }
        try {
            setResetting(true);
            await resetPassword(email);
            setInfo("Password reset email sent. Check your inbox.");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to send reset email";
            setError(message);
        } finally {
            setResetting(false);
        }
    };

    return (
        <div className="mx-auto max-w-md px-4 sm:px-6 py-10">
            <h1 className="text-2xl font-bold mb-6 text-[#FF9933]">Login</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-600"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="mt-2 text-right">
                        <button type="button" onClick={onForgotPassword} className="text-sm text-[#138808] hover:underline" disabled={resetting}>
                            {resetting ? "Sending..." : "Forgot password?"}
                        </button>
                    </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                {info && <p className="text-sm text-green-700">{info}</p>}
                <button disabled={loading} className="w-full rounded-md bg-[#138808] text-white py-2 font-medium disabled:opacity-60 hover:opacity-90">{loading ? "Signing in..." : "Sign in"}</button>
            </form>
            <div className="my-4 text-center text-sm text-neutral-500">or</div>
            <button onClick={onGoogle} disabled={loading} className="w-full rounded-md border border-[#FF9933] py-2 font-medium disabled:opacity-60 hover:bg-[#FF9933]/10">Continue with Google</button>
        </div>
    );
}


