"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, googleProvider } from "@/app/database/firebaseconfig";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    User,
    sendPasswordResetEmail
} from "firebase/auth";
import { Roles } from "@/app/database/Enums";
import { getAlumniByUid, AlumniRecord, updateAlumni } from "@/app/database/dbops";
// import { AlumniStatus } from "@/app/database/Enums";

type UserRole = Roles | null;

type AuthContextValue = {
    user: User | null;
    userRole: UserRole;
    alumniData: (AlumniRecord & { id: string }) | null;
    loading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    registerWithEmail: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOutUser: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [alumniData, setAlumniData] = useState<(AlumniRecord & { id: string }) | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                try {
                    // Fetch alumni record to get role and status
                    const alumni = await getAlumniByUid(firebaseUser.uid);
                    if (alumni) {
                        const googlePhoto = firebaseUser.photoURL;
                        if (googlePhoto && googlePhoto !== alumni.photoUrl) {
                            try {
                                await updateAlumni(firebaseUser.uid, { photoUrl: googlePhoto });
                                alumni.photoUrl = googlePhoto;
                            } catch (photoErr) {
                                console.error("Failed to sync Google photo URL:", photoErr);
                            }
                        }
                        setAlumniData(alumni);
                        // Determine user role based on alumni record
                        // Use userRole field if exists, otherwise default to User
                        // The normalizeAlumniData function in dbops.ts will map role: "admin" to userRole: Roles.Admin
                        setUserRole(alumni.userRole || Roles.User);

                    } else {
                        setAlumniData(null);
                        setUserRole(null);
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    setAlumniData(null);
                    setUserRole(null);
                }
            } else {
                setAlumniData(null);
                setUserRole(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signInWithEmail = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const registerWithEmail = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleProvider);
    };

    const signOutUser = async () => {
        await signOut(auth);
    };

    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const value = useMemo(
        () => ({ user, userRole, alumniData, loading, signInWithEmail, registerWithEmail, signInWithGoogle, signOutUser, resetPassword }),
        [user, userRole, alumniData, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}


