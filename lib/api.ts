// lib/api.ts
import axios, { AxiosInstance } from 'axios';
import { PendingReport } from '@/lib/types';

// Default API URL (Azure backend)
const DEFAULT_API_URL =
  'https://respondrweb-server-adh7gwfubed0cyfy.centralindia-01.azurewebsites.net';

// Prefer environment variable, fallback to Azure URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}

interface AuthResponse {
  token: string;
  userId: number;
  role: string;
}

interface VerificationRequest {
  licenseNumber: string;
  ambulanceRegistration: string;
  address: string;
  userId: number;
  idProof: File;
  license: File;
}

interface VerificationResponse {
  message: string;
  status: string;
}

interface AdminVerification {
  id: number;
  driverName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleRegistration: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  idProofUrl: string;
  licenseUrl: string;
  driver_id: number;
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Set Authorization header with token');
  } else {
    delete api.defaults.headers.common['Authorization'];
    console.log('Cleared Authorization header');
  }
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  console.log('Calling login API:', data);
  const response = await api.post<AuthResponse>('/api/auth/login', data);
  return response.data;
};

export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  console.log('Calling signup API:', data);
  const response = await api.post<AuthResponse>('/api/auth/signup', data);
  return response.data;
};

export const getPendingReports = async (): Promise<PendingReport[]> => {
  console.log('Calling getPendingReports API');
  const response = await api.get('/api/driver/pending');
  return response.data;
};

export const handleAssignment = async (
  assignmentId: number,
  action: { action: 'accept' | 'cancel' }
) => {
  console.log('Calling handleAssignment API:', { assignmentId, action });
  const response = await api.post(
    `/api/driver/assignment/${assignmentId}`,
    action
  );
  return response.data;
};

export const submitVerification = async (
  data: VerificationRequest
): Promise<VerificationResponse> => {
  console.log('Calling submitVerification API');
  const formData = new FormData();
  formData.append('licenseNumber', data.licenseNumber);
  formData.append('ambulanceRegistration', data.ambulanceRegistration);
  formData.append('address', data.address);
  formData.append('userId', String(data.userId));
  formData.append('idProof', data.idProof);
  formData.append('license', data.license);

  const response = await api.post<VerificationResponse>(
    '/api/driver-verification/submit',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const getAdminVerificationRequests =
  async (): Promise<AdminVerification[]> => {
    console.log(
      'Calling getAdminVerificationRequests API with baseURL:',
      api.defaults.baseURL
    );
    try {
      const response = await api.get('/api/admin-verification/requests');
      return response.data;
    } catch (error: any) {
      console.error(
        'Error in getAdminVerificationRequests:',
        error.response?.data || error.message
      );
      throw error;
    }
  };

export const approveVerification = async (
  id: string,
  reviewed_by: number
): Promise<{ message: string }> => {
  const response = await api.put(`/api/admin-verification/approve/${id}`, {
    reviewed_by,
  });
  return response.data;
};

export const rejectVerification = async (
  id: string,
  reviewed_by: number,
  remarks?: string
): Promise<{ message: string }> => {
  const response = await api.put(`/api/admin-verification/reject/${id}`, {
    reviewed_by,
    remarks,
  });
  return response.data;
};

// --- User Profile & Settings APIs ---
export const updateUserProfile = async (token: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};

export const getUserSettings = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/user/settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Failed to fetch user settings');
  return response.json();
};

export const updateUserSettings = async (token: string, settings: any) => {
  const response = await fetch(`${API_BASE_URL}/api/user/settings`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) throw new Error('Failed to update settings');
  return response.json();
};

export const getUserReports = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/reports/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Failed to fetch reports');
  return response.json();
};

export const getUserBookings = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/bookings/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Failed to fetch bookings');
  return response.json();
};

// --- Hospitals API stays same (uses Google/Overpass) ---

// --- Create Report ---
export async function createReport(data: {
  type: 'SOS' | 'Booking';
  latitude: number;
  longitude: number;
  description?: string;
  photo?: File;
}) {
  console.log('Calling createReport API:', data);
  const isSOS = data.type === 'SOS';

  let res: Response;

  if (isSOS) {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('latitude', String(data.latitude));
    formData.append('longitude', String(data.longitude));
    if (data.description) formData.append('description', data.description);
    if (data.photo) formData.append('photo', data.photo);

    res = await fetch(`${API_BASE_URL}/api/report/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')!}`,
      },
      body: formData,
    });
  } else {
    res = await fetch(`${API_BASE_URL}/api/report/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')!}`,
      },
      body: JSON.stringify({
        type: data.type,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description,
      }),
    });
  }

  if (!res.ok) {
    const text = await res.text();
    console.error('Error from server:', text);

    if (res.status === 409) {
      throw new Error('No available ambulances at the moment.');
    }

    throw new Error('Report creation failed');
  }

  return await res.json();
}

export default api;
