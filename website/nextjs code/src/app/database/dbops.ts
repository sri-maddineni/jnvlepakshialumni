import { db } from "./firebaseconfig";
import { collection, query, where, limit, getDocs, Timestamp, setDoc, doc } from "firebase/firestore";
import { ALL_ALUMNI } from "./paths";
import { AlumniStatus } from "./Enums";

export type AlumniRole = "alumni" | "teacher";

export type AlumniRecord = {
    uid: string;
    role: AlumniRole;
    fullName: string;
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
    status: AlumniStatus;
    supportedBy: string[]; // array of alumni uids or identifiers
    approvedBy?: string;   // governing body member uid or identifier
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
    return { id: doc.id, ...doc.data() } as unknown as AlumniRecord & { id: string };
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
      (doc) => ({ id: doc.id, ...doc.data() } as AlumniRecord & { id: string })
    );
  }
  