/* tslint:disable */
/* eslint-disable */

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignInResponse {
    accessToken: string;
}

export interface UserProfile {
    fullName: string;
    email: string;
    phoneNumber: string;
    role: UserRole;
}

export interface CreateProjectPlanRequest {
    importUrl: string;
    startsAt: Date;
    endsAt: Date;
}

export interface CreateProjectRequest {
    name: string;
    referenceCode: string;
    startsAt: Date;
    endsAt: Date;
}

export interface CreateProjectResponse {
    projectId: string;
}

export interface ProjectDetails {
    id: string;
    name: string;
    referenceCode: string;
    startsAt: Date;
    endsAt: Date;
}

export interface RoadRailing {
    wkt: string;
    srid: number;
}

export type UserRole = "DRIVER" | "PLANNER";
