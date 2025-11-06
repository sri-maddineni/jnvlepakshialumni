import { AlumniStatus } from "@/app/database/Enums";
import {Timestamp} from "firebase/firestore";
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