import { help_story } from './../types/index';
import { db } from "./firebaseconfig";
import { collection, getDocs, query, where, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import * as paths from "./paths";
import { collection as fbCollection, getDocs as fbGetDocs, addDoc as fbAddDoc, deleteDoc as fbDeleteDoc, doc as fbDoc } from "firebase/firestore";
import { CONTACT_PAGE_REQUESTS_PATH } from "./paths";
import { Alumni, AlumniData, AlumniSuggestionRequest, AlumniSuggestionRequestData, AlumniSuggestionHistory, ContactPageRequestData } from "../types";

export const alumniCollection = collection(db, paths.ALUMNI_COLLECTION_PATH);
export const helpStoriesCollection = collection(db, paths.HELP_STORIES_COLLECTION_PATH);

export async function getAllAlumni(): Promise<Alumni[]> {
    const snapshot = await getDocs(alumniCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alumni));
}

export async function addAlumni(data: AlumniData) {
    return addDoc(alumniCollection, data);
}

export async function checkDuplicateAlumniEmail(email: string) {
    const q = query(alumniCollection, where("email", "==", email.toLowerCase()));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
}

export async function getAlumniById(id: string): Promise<Alumni | null> {
    const alumniDoc = doc(db, paths.ALUMNI_COLLECTION_PATH, id);
    const snapshot = await getDoc(alumniDoc);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as Alumni : null;
}

export async function getAlumniByEmail(email: string): Promise<Alumni | null> {
    const q = query(alumniCollection, where("email", "==", email.toLowerCase()));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Alumni;
}

export async function deleteAlumni(id: string) {
    const { doc, deleteDoc } = await import("firebase/firestore");
    const ref = doc(alumniCollection, id);
    await deleteDoc(ref);
}

export async function isUserRegisteredAlumni(email: string): Promise<boolean> {
    if (!email) return false;
    const alumni = await getAlumniByEmail(email);
    return !!alumni;
}

export const alumniSuggestionRequestsCollection = collection(db, paths.ALUMNI_SUGGESTION_REQUESTS_PATH);

export async function addAlumniSuggestionRequest(data: AlumniSuggestionRequestData) {
    return addDoc(alumniSuggestionRequestsCollection, data);
}

export async function getAllAlumniSuggestionRequests(): Promise<AlumniSuggestionRequest[]> {
    const snapshot = await getDocs(alumniSuggestionRequestsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AlumniSuggestionRequest));
}

export const alumniSuggestionsHistoryCollection = fbCollection(db, paths.alumniSuggestionsHistoryCollection);

export async function addAlumniSuggestionToHistory(suggestion: AlumniSuggestionRequest, statusMessage: string) {
    // Add to history
    await fbAddDoc(alumniSuggestionsHistoryCollection, {
        ...suggestion,
        statusMessage: statusMessage || "",
        completedAt: new Date().toISOString(),
    });
    // Remove from suggestions
    if (suggestion.id) {
        const suggestionDoc = fbDoc(db, alumniSuggestionRequestsCollection.path, suggestion.id);
        await fbDeleteDoc(suggestionDoc);
    }
}

export async function getAllAlumniSuggestionsHistory(): Promise<AlumniSuggestionHistory[]> {
    const snapshot = await fbGetDocs(alumniSuggestionsHistoryCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AlumniSuggestionHistory));
}

export const contactPageRequestsCollection = collection(db, CONTACT_PAGE_REQUESTS_PATH);

export async function addContactPageRequest(data: ContactPageRequestData) {
    return addDoc(contactPageRequestsCollection, data);
}

export async function deleteContactPageRequest(id: string) {
    const { doc, deleteDoc } = await import("firebase/firestore");
    const ref = doc(contactPageRequestsCollection, id);
    await deleteDoc(ref);
}

export async function addHelpStory(data: {
    personaName: string;
    personaId: string;
    personb: string;
    story: string;
}) {
    return await addDoc(collection(db, paths.HELP_STORIES_COLLECTION_PATH), {
        ...data,
        createdAt: serverTimestamp(),
    });
}
