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

export interface Geometry {
    wkt: string;
    srid: number;
}

export interface CreateProjectPlanRequest {
    projectId: string;
    importUrl: string;
    startsAt: DateAsString;
    endsAt: DateAsString;
    vehicleId?: string | null;
}

export interface CreateProjectPlanResponse {
    projectPlanId: string;
}

export interface CreateProjectRequest {
    name: string;
    referenceCode: string;
    startsAt: DateAsString;
    endsAt?: DateAsString | null;
}

export interface CreateProjectResponse {
    projectId: string;
}

export interface ProjectDetails {
    id: string;
    name: string;
    referenceCode: string;
    startsAt: DateAsString;
    endsAt: DateAsString;
    capturedLength: number;
    totalLength: number;
    deviations: number;
    notes: number;
    status: ProjectStatus;
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

export interface CreateTripNoteRequest {
    note: string;
}

export interface CreateTripRequest {
    planId: string;
    vehicleId: string;
}

export interface TripDetails {
    id: string;
    startedAt: DateAsString;
    endedAt: DateAsString;
    gnssLog: string;
    cameraLogs: { [P in CameraPosition]?: string };
}

export interface TripNoteDetails {
    id: string;
    note: string;
    geometry: Geometry;
}

export interface UpdateTripRequest {
    endedAt: DateAsString;
    gnssLog: string;
    cameraLogs: { [P in CameraPosition]?: string };
}

export interface CreateVehicleRequest {
    imageUrl?: string | null;
    registrationNumber: string;
    model: string;
    camera: boolean;
    description: string;
    gnssId: string;
}

export interface UpdateVehicleRequest {
    imageUrl: string;
    registrationNumber: string;
    model: string;
    camera: boolean;
    description: string;
    gnssId: string;
    inactiveFrom: DateAsString;
}

export interface VehicleDetails {
    id: string;
    imageUrl: string;
    registrationNumber: string;
    model: string;
    camera: boolean;
    description: string;
    gnssId: string;
    inactiveFrom: DateAsString;
    active: boolean;
}

export type DateAsString = string;

export type UserRole = "DRIVER" | "PLANNER";

export type ProjectStatus = "UPCOMING" | "ONGOING" | "PREVIOUS";

export type CameraPosition = "LEFT" | "RIGHT" | "TOP";
