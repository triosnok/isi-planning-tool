/* tslint:disable */
/* eslint-disable */

export interface ForgotPasswordRequest {
    email: string;
}

export interface GetConfirmationCodeRequest {
    email: string;
    code: string;
}

export interface ResetPasswordRequest {
    code: string;
    password: string;
    passwordConfirmation: string;
}

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

export interface CreateDeviationRequest {
    captureId: string;
    deviationType: string;
    details: { [index: string]: string };
}

export interface DeviationDetails {
    roadSegment: string;
    railingId: number;
    position: Geometry;
    deviationType: string;
    details: { [index: string]: string };
}

export interface Geometry {
    wkt: string;
    srid: number;
}

export interface PositionEvent {
    driverId: string;
    vehicleId: string;
    tripId: string;
    geometry: Geometry;
    heading: number;
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
    projectId: string;
    projectName: string;
    startsAt: DateAsString;
    endsAt: DateAsString;
    vehicleId?: string | null;
    vehicleModel?: string | null;
    registrationNumber?: string | null;
    imports: RailingImportDetails[];
    activeTrips: number;
    railings: number;
    meters: number;
}

export interface RailingImportDetails {
    count: number;
    url: string;
    importedAt: DateAsString;
}

export interface RoadRailing {
    id: number;
    geometry: Geometry;
    length: number;
    captureGrade: number;
    capturedAt: DateAsString;
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
    projectPlanId: string;
    projectId: string;
    project: string;
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

export interface UpdateTripNoteRequest {
    note: string;
}

export interface UpdateTripRequest {
    endedAt: DateAsString;
    gnssLog: string;
    cameraLogs: { [P in CameraPosition]?: string };
}

export interface CreateUserAccountRequest {
    fullName: string;
    email: string;
    phoneNumber?: string | null;
    password: string;
    passwordConfirmation: string;
    role: UserRole;
}

export interface UpdateUserAccountRequest {
    fullName: string;
    email: string;
    phoneNumber?: string | null;
    changePassword: boolean;
    password?: string | null;
    passwordConfirmation?: string | null;
    role: UserRole;
}

export interface UserAccountDetails {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: UserRole;
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

export type PositionSubject = "VEHICLE" | "DRIVER";

export type ProjectStatus = "UPCOMING" | "ONGOING" | "PREVIOUS";

export type CameraPosition = "LEFT" | "RIGHT" | "TOP";
