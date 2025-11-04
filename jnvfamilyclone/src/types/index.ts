// Alumni related types
export interface Alumni {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    jnvSchool?: string;
    qualification?: string;
    profession?: string;
    role?: string;
    organisation?: string;
    homePlace?: string;
    homeCity?: string;
    homeState?: string;
    homePincode?: string;
    workCity?: string;
    startyear?: string;
    endyear?: string;
    workState?: string;
    createdAt?: string;
}

// Alumni suggestion types
export interface AlumniSuggestionRequest {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profession?: string;
    role?: string;
    organisation?: string;
    message?: string;
    requestedByEmail?: string;
    requestedByAlumniId?: string | null;
    createdAt?: string;
}

export interface AlumniSuggestionHistory {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profession?: string;
    role?: string;
    organisation?: string;
    message?: string;
    requestedByEmail?: string;
    requestedByAlumniId?: string;
    statusMessage?: string;
    completedAt?: string;
    createdAt?: string;
}

// Contact page request types
export interface ContactPageRequest {
    id: string;
    type: string;
    email: string;
    message: string;
    createdAt?: string;
}

// Form data types
export interface AlumniFormData {
    fullName: string;
    email: string;
    phone: string;
    jnvSchool: string;
    qualification: string;
    profession: string;
    role: string;
    organisation: string;
    homePlace: string;
    homeCity: string;
    homeState: string;
    homePincode: string;
    workCity: string;
    workState: string;
}

export interface help_story {
    id?: string;
    A_name?: string; //helped
    A_school?: string;
    A_Id?: string;

    B_name?: string; //helped to
    B_school?: string;
    B_Id?: string;

    storyText?: string;
    uploadedby: string;
    createdAt?: string;
    updatedAt?: string;
    approved?: boolean;
}

// Firebase document data types (without id)
export type AlumniData = Omit<Alumni, 'id'>;
export type AlumniSuggestionRequestData = Omit<AlumniSuggestionRequest, 'id'>;
export type AlumniSuggestionHistoryData = Omit<AlumniSuggestionHistory, 'id'>;
export type ContactPageRequestData = Omit<ContactPageRequest, 'id'>; 