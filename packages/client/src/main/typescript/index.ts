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
    startsAt: DateAsString;
    endsAt: DateAsString;
}

export interface CreateProjectRequest {
    name: string;
    referenceCode: string;
    startsAt: DateAsString;
    endsAt: DateAsString;
}

export interface ProjectDetails {
    id: string;
    name: string;
    referenceCode: string;
    startsAt: DateAsString;
    endsAt: DateAsString;
}

export interface ProjectPlanDetails {
    id: string;
    startsAt: DateAsString;
    endsAt: DateAsString;
    vehicleModel: string;
    registrationNumber: string;
    activeTrips: number;
    railings: number;
    meters: number;
}

export interface RoadRailing {
    wkt: string;
    srid: number;
}

export interface CreateVehicleRequest {
    imageUrl: string;
    registrationNumber: string;
    camera: boolean;
    description: string;
    gnssId: string;
}

export interface VehicleDetails {
    id: string;
    imageUrl: string;
    registrationNumber: string;
    camera: boolean;
    description: string;
    gnssId: string;
}

export type DateAsString = string;

export type UserRole = "DRIVER" | "PLANNER";
