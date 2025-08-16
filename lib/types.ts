export interface User {
  user_id: number;
  role: 'Public' | 'Responder';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  role: 'Public' | 'Responder';
}

export interface SignupResponse {
  token: string;
}

export interface ReportRequest {
  type: 'SOS' | 'Booking';
  latitude: number;
  longitude: number;
  description?: string;
  destination?: string;
  photo?: File;
}

export interface ReportResponse {
  message: string;
  reportId: number;
}

export interface AssignmentAction {
  action: 'accept' | 'cancel';
}

export interface AssignmentResponse {
  message: string;
}

export interface ReportNotification {
  reportId: number;
  type: 'SOS' | 'Booking';
  latitude: number;
  longitude: number;
  photoUrl: string | null;
  description: string | null;
}

export interface PendingReport {
  report_id: number;
  type: 'SOS' | 'Booking';
  latitude: number;
  longitude: number;
  photo_url: string | null;
  description: string | null;
}