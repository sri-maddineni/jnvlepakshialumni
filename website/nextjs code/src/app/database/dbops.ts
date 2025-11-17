import { db } from "./firebaseconfig";
import { collection, query, where, limit, getDocs, Timestamp, setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { ALL_ALUMNI } from "./paths";
import { AlumniStatus, Roles } from "./Enums";

export type AlumniRole = "alumni" | "teacher";

// Helper function to normalize alumni data from Firestore
// Maps legacy "role: admin" to "userRole: Roles.Admin"
function normalizeAlumniData(data: Record<string, unknown> & { id: string }): AlumniRecord & { id: string } {
    const normalized = { ...data };

    // If role is "admin" or "governingbody", map it to userRole
    if (normalized.role === "admin" || normalized.role === "governingbody") {
        if (normalized.role === "admin") {
            normalized.userRole = Roles.Admin;
            normalized.role = "alumni" as AlumniRole; // Set role to alumni
        } else if (normalized.role === "governingbody") {
            normalized.userRole = Roles.Governing_body;
            normalized.role = "alumni" as AlumniRole; // Set role to alumni
        }
    }

    return normalized as AlumniRecord & { id: string };
}

export type AlumniRecord = {
    uid: string;
    role: AlumniRole;
    userRole?: Roles; // Admin, Governing_body, etc. - optional, defaults to Alumni
    fullName: string;
    photoUrl?: string;
    joinedYear: number;
    passedOutYear: number;
    joinedClass: string;
    passedOutClass: string;
    hallTicket: string;
    email: string;
    mobile: string;
    aadhar?: string;
    bloodGroup: string;
    profession: string;
    professionOther?: string;
    organisationName?: string;
    currentCity: string;
    currentState: string;
    workCity?: string;
    workState?: string;
    workRole?: string; // Job title/position at organization
    status: AlumniStatus;
    supportedBy: string[]; // array of alumni uids or identifiers
    approvedBy?: string;   // governing body member uid or identifier
    donationAmount?: number; // Donation amount in rupees
    transactionId?: string; // Payment transaction ID
    donationDetails?: string; // Additional donation details/notes
    createdAt: Timestamp;
};

export async function getAlumniByHallTicket(hallTicket: string) {
    const q = query(
        collection(db, ALL_ALUMNI),
        where("hallTicket", "==", hallTicket),
        limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return normalizeAlumniData({ id: doc.id, ...doc.data() });
}

export async function getAlumniByEmail(email: string) {
    const q = query(
        collection(db, ALL_ALUMNI),
        where("email", "==", email),
        limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return normalizeAlumniData({ id: doc.id, ...doc.data() });
}

export async function createAlumni(record: Omit<AlumniRecord, "createdAt">, id: string) {
    const cleaned = Object.fromEntries(
        Object.entries(record).filter(([, v]) => v !== undefined && v !== null)
    );
    const ref = doc(collection(db, ALL_ALUMNI), id);
    await setDoc(ref, { ...cleaned, createdAt: Timestamp.now() });
    return id;
}

// export async function getAllAlumni() {
//     const q = query(collection(db, ALL_ALUMNI));
//     const snap = await getDocs(q);
//     return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as AlumniRecord & { id: string }[];
// }

export async function getAllAlumni() {
    const q = query(collection(db, ALL_ALUMNI));
    const snap = await getDocs(q);

    return snap.docs.map(
        (doc) => normalizeAlumniData({ id: doc.id, ...doc.data() })
    );
}

export async function getAlumniByUid(uid: string) {
    const ref = doc(collection(db, ALL_ALUMNI), uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return normalizeAlumniData({ id: snap.id, ...snap.data() });
}

export async function updateAlumni(uid: string, updates: Partial<Omit<AlumniRecord, "uid" | "createdAt" | "status" | "supportedBy" | "approvedBy">>) {
    const cleaned = Object.fromEntries(
        Object.entries(updates).filter(([, v]) => v !== undefined && v !== null)
    );
    const ref = doc(collection(db, ALL_ALUMNI), uid);
    await updateDoc(ref, cleaned);
}

export async function addSupporter(alumniUid: string, supporterUid: string) {
    const ref = doc(collection(db, ALL_ALUMNI), alumniUid);
    await updateDoc(ref, {
        supportedBy: arrayUnion(supporterUid)
    });
}
