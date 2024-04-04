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

export interface CaptureActionRequest {
    tripId: string;
    action: CaptureAction;
}

export interface CaptureDetails {
    usedStorage: number;
    totalStorage: number;
    position: Geometry;
    heading: number;
    gpsSignal: number;
    activeCapture: boolean;
    metersCaptured: number;
    images: { [P in CameraPosition]?: number };
    storageRemaining: number;
}

export interface CaptureLogDetails {
    name: string;
    updatedAt: DateAsString;
    size: number;
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
    progress: number;
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
    geometry: Geometry;
    captureGrade: number;
}

export interface RoadSegmentDetails {
    id: string;
    railing: string;
    geometry: string;
    direction: string;
    side: string;
    lastImportedAt: DateAsString;
}

export interface UpdateProjectRequest {
    name: string;
    referenceCode: string;
    startsAt: DateAsString;
    endsAt?: DateAsString | null;
}

export interface CreateTripNoteRequest {
    tripId: string;
    note: string;
}

export interface CreateTripRequest {
    planId: string;
    vehicleId: string;
    captureLogId?: string | null;
    replaySpeed?: number | null;
}

export interface TripDetails {
    id: string;
    driver: string;
    startedAt: DateAsString;
    endedAt: DateAsString;
    gnssLog: string;
    cameraLogs: { [P in CameraPosition]?: string };
    sequenceNumber: number;
    noteCount: number;
    deviations: number;
}

export interface TripNoteDetails {
    id: string;
    note: string;
    geometry: Geometry;
    createdAt: DateAsString;
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
    available: boolean;
    inactiveFrom: DateAsString;
    active: boolean;
}

export type DateAsString = string;

export type UserRole = "DRIVER" | "PLANNER";

export type CaptureAction = "RESUME" | "PAUSE";

export type ProjectStatus = "UPCOMING" | "ONGOING" | "PREVIOUS";

export type CameraPosition = "LEFT" | "RIGHT" | "TOP";
