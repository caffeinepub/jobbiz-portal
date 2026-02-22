import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ApprovalStatus = {
    __kind__: "pending";
    pending: null;
} | {
    __kind__: "approved";
    approved: Time;
} | {
    __kind__: "rejected";
    rejected: {
        timestamp: Time;
        reason: string;
    };
};
export type Time = bigint;
export interface Business {
    id: string;
    contact: string;
    name: string;
    description: string;
    approvalStatus: ApprovalStatus;
    category: string;
    location: string;
}
export interface Employer {
    id: string;
    contact: string;
    size: string;
    description: string;
    website: string;
    approvalStatus: ApprovalStatus;
    companyName: string;
    industry: string;
}
export interface Employee {
    id: string;
    contact: string;
    name: string;
    education: string;
    experience: string;
    approvalStatus: ApprovalStatus;
    skills: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveBusiness(id: string): Promise<void>;
    approveEmployee(id: string): Promise<void>;
    approveEmployer(id: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllBusinesses(): Promise<Array<Business>>;
    getAllEmployees(): Promise<Array<Employee>>;
    getAllEmployers(): Promise<Array<Employer>>;
    getBusiness(id: string): Promise<Business | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEmployee(id: string): Promise<Employee | null>;
    getEmployer(id: string): Promise<Employer | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listBusiness(id: string, name: string, category: string, description: string, contact: string, location: string): Promise<void>;
    registerEmployee(id: string, name: string, contact: string, experience: string, skills: string, education: string): Promise<void>;
    registerEmployer(id: string, companyName: string, industry: string, size: string, website: string, description: string, contact: string): Promise<void>;
    rejectBusiness(id: string, reason: string): Promise<void>;
    rejectEmployee(id: string, reason: string): Promise<void>;
    rejectEmployer(id: string, reason: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
