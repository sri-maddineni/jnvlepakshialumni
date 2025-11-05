// import { db } from "./firebaseconfig";
// import { doc, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from "firebase/firestore";

// export async function updateField(documentPath: string, field: string, value: unknown): Promise<void> {
//     const ref = doc(db, documentPath);
//     await updateDoc(ref, { [field]: value });
// }

// export async function addToArrayField(documentPath: string, field: string, value: unknown): Promise<void> {
//     const ref = doc(db, documentPath);
//     await updateDoc(ref, { [field]: arrayUnion(value) });
// }

// export async function removeFromArrayField(documentPath: string, field: string, value: unknown): Promise<void> {
//     const ref = doc(db, documentPath);
//     await updateDoc(ref, { [field]: arrayRemove(value) });
// }

// export async function setMerge(documentPath: string, data: Record<string, unknown>): Promise<void> {
//     const ref = doc(db, documentPath);
//     await setDoc(ref, data, { merge: true });
// }

// export async function getDocument<T = unknown>(documentPath: string): Promise<(T & { id: string }) | null> {
//     const ref = doc(db, documentPath);
//     const snap = await getDoc(ref);
//     if (!snap.exists()) return null;
//     return { id: snap.id, ...(snap.data() as T) };
// }


