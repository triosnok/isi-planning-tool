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
    id: string;
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
    imageAnalysis: ImageAnalysis;
    storageRemaining: number;
}

export interface CaptureLogDetails {
    name: string;
    updatedAt: DateAsString;
    size: number;
}

export interface CapturedMetersByDay {
    date: DateAsString;
    meters: number;
}

export interface ImageAnalysis {
    overall: ImageStatus;
    remarks: ImageRemark[];
    positions: { [P in CameraPosition]?: ImagePositionAnalysis };
}

export interface ImagePositionAnalysis {
    count: number;
    target: number;
    status: ImageStatus;
}

export interface CreateDeviationRequest {
    captureId: string;
    deviationType: string;
    details: { [index: string]: string };
}

export interface DeviationCount {
    type: string;
    count: number;
}

export interface DeviationDetails {
    roadSegment: string;
    railingId: number;
    position: Geometry;
    deviationType: string;
    details: { [index: string]: string };
}

export interface FileUploadResponse {
    url: string;
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
    status: ProjectStatus;
    progress: number;
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
    segments: string[];
    activeTrips: number;
    railings: number;
    meters: number;
}

export interface RailingImportDetails {
    count: number;
    url: string;
    importedAt: DateAsString;
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

export interface RailingCapture {
    id: string;
    segmentId: string;
    railingId: number;
    tripId: string;
    planId: string;
    projectId: string;
    tripSequenceNumber: number;
    geometry: Geometry;
    segmentCoverage: Range;
    imageUrls: { [P in CameraPosition]?: string };
    capturedAt: DateAsString;
}

export interface RailingRoadSegments {
    reference: string;
    category: RoadCategory;
}

export interface Range {
    start: number;
    end: number;
}

export interface RoadRailing {
    id: number;
    geometry: Geometry;
    length: number;
    captureGrade: number;
    capturedAt?: DateAsString | null;
    segments: RailingRoadSegments[];
}

export interface RoadSegment {
    id: string;
    railingId: number;
    roadReference: string;
    roadSystemReference: string;
    geometry: Geometry;
    category: RoadCategory;
    length: number;
}

export interface SearchResult {
    type: "PROJECT" | "USER" | "VEHICLE" | "RAILING" | "ROAD_SEGMENT";
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
    vehicleId: string;
    vehicleModel: string;
    vehicleRegistrationNumber: string;
    project: string;
    driver: string;
    startedAt: DateAsString;
    endedAt: DateAsString;
    sequenceNumber: number;
    noteCount: number;
    deviations: number;
    captureDetails: CaptureDetails;
}

export interface TripNoteDetails {
    id: string;
    note: string;
    geometry?: Geometry | null;
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
    imageUrl?: string | null;
    password: string;
    passwordConfirmation: string;
    role: UserRole;
}

export interface UpdateUserAccountRequest {
    fullName: string;
    email: string;
    phoneNumber?: string | null;
    imageUrl?: string | null;
    changePassword: boolean;
    password?: string | null;
    passwordConfirmation?: string | null;
    role: UserRole;
}

export interface UserAccountDetails {
    id: string;
    fullName: string;
    email: string;
    imageUrl: string;
    phoneNumber: string;
    role: UserRole;
    status: UserStatus;
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
    imageUrl?: string | null;
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

export interface ProjectResult extends SearchResult {
    type: "PROJECT";
    id: string;
    name: string;
    referenceCode: string;
}

export interface UserResult extends SearchResult {
    type: "USER";
    id: string;
    fullName: string;
    email: string;
}

export interface VehicleResult extends SearchResult {
    type: "VEHICLE";
    id: string;
    model: string;
    registrationNumber: string;
}

export interface RailingResult extends SearchResult {
    type: "RAILING";
    id: number;
    projectId: string;
    projectName: string;
    projectReferenceCode: string;
}

export interface RoadSegmentResult extends SearchResult {
    type: "ROAD_SEGMENT";
    id: string;
    railingId: number;
    roadSystemReference: string;
    projectId: string;
    projectName: string;
    projectReferenceCode: string;
}

export type DateAsString = string;

export type UserRole = "DRIVER" | "PLANNER";

export type UserStatus = "AVAILABLE" | "DRIVING";

export type CaptureAction = "RESUME" | "PAUSE";

export type ImageRemark = "LEFT_RIGHT_IMBALANCE" | "TOP_SIDE_IMBALANCE";

export type ImageStatus = "OK" | "WITHIN_TOLERANCE" | "OUT_OF_TOLERANCE";

export type PositionSubject = "VEHICLE" | "DRIVER";

export type ProjectStatus = "UPCOMING" | "ONGOING" | "PREVIOUS";

export type RoadCategory = "PRIVATE" | "FOREST" | "MUNICIPALITY" | "COUNTY" | "NATIONAL" | "EUROPE" | "UNKNOWN";

export type CameraPosition = "LEFT" | "RIGHT" | "TOP";

export type ResultType = "PROJECT" | "USER" | "VEHICLE" | "RAILING" | "ROAD_SEGMENT";

export type SearchResultUnion = ProjectResult | UserResult | VehicleResult | RailingResult | RoadSegmentResult;
