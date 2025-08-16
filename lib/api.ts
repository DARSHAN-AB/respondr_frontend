// lib/api.ts
import axios, { AxiosInstance } from 'axios';
import { PendingReport } from '@/lib/types';

const API_BASE_URL = 'http://localhost:3001';

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
  baseURL: process.env.NEXT_PUBLIC_API_URL || API_BASE_URL,
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

export const handleAssignment = async (assignmentId: number, action: { action: 'accept' | 'cancel' }) => {
  console.log('Calling handleAssignment API:', { assignmentId, action });
  const response = await api.post(`/api/driver/assignment/${assignmentId}`, action);
  return response.data;
};

export const submitVerification = async (data: VerificationRequest): Promise<VerificationResponse> => {
  console.log('Calling submitVerification API:', {
    licenseNumber: data.licenseNumber,
    ambulanceRegistration: data.ambulanceRegistration,
    address: data.address,
    userId: data.userId,
    idProof: data.idProof.name,
    license: data.license.name,
  });
  const formData = new FormData();
  formData.append('licenseNumber', data.licenseNumber);
  formData.append('ambulanceRegistration', data.ambulanceRegistration);
  formData.append('address', data.address);
  formData.append('userId', String(data.userId));
  formData.append('idProof', data.idProof);
  formData.append('license', data.license);

  const response = await api.post<VerificationResponse>('/api/driver-verification/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getAdminVerificationRequests = async (): Promise<AdminVerification[]> => {
  console.log('Calling getAdminVerificationRequests API with baseURL:', api.defaults.baseURL);
  try {
    const response = await api.get('/api/admin-verification/requests');
    return response.data;
  } catch (error) {
    console.error('Error in getAdminVerificationRequests:', error.response?.data || error.message);
    throw error;
  }
};

export const approveVerification = async (id: string, reviewed_by: number): Promise<{ message: string }> => {
  console.log('Calling approveVerification API:', { id, reviewed_by });
  const response = await api.put(`/api/admin-verification/approve/${id}`, { reviewed_by });
  return response.data;
};

export const rejectVerification = async (id: string, reviewed_by: number, remarks?: string): Promise<{ message: string }> => {
  console.log('Calling rejectVerification API:', { id, reviewed_by, remarks });
  const response = await api.put(`/api/admin-verification/reject/${id}`, { reviewed_by, remarks });
  return response.data;
};

export const updateUserProfile = async (token: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update profile")
  }

  return response.json()
}

// Settings API
export const getUserSettings = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/user/settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user settings")
  }

  return response.json()
}

export const updateUserSettings = async (token: string, settings: any) => {
  const response = await fetch(`${API_BASE_URL}/user/settings`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  })

  if (!response.ok) {
    throw new Error("Failed to update settings")
  }

  return response.json()
}


export const getUserReports = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/reports/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch reports")
  }

  return response.json()
}

export const getUserBookings = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/bookings/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch bookings")
  }

  return response.json()
}

// Hospitals API using Google Places API for real data
export const getNearbyHospitals = async (latitude: number, longitude: number, radius = 5000) => {
  try {
    // First try Google Places API if available
    const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (googleApiKey) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=hospital&key=${googleApiKey}`,
        {
          method: "GET",
        },
      )

      if (response.ok) {
        const data = await response.json()

        if (data.results && data.results.length > 0) {
          const hospitals = data.results.map((place: any, index: number) => {
            const distance = calculateDistance(
              latitude,
              longitude,
              place.geometry.location.lat,
              place.geometry.location.lng,
            )

            return {
              id: place.place_id || `google-${index}`,
              name: place.name || "Hospital",
              address: place.vicinity || "Address not available",
              phone: "Phone not available", // Would need Place Details API for phone
              distance: `${distance.toFixed(1)} km`,
              rating: place.rating || Math.random() * 2 + 3,
              hours: place.opening_hours?.open_now ? "Open now" : "Hours not available",
              emergency: true, // Assume hospitals have emergency services
              specialties: getGoogleSpecialties(place.types || []),
              image:
                place.photos && place.photos[0]
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${place.photos[0].photo_reference}&key=${googleApiKey}`
                  : `https://placehold.co/600x400/e74c3c/ffffff?text=${encodeURIComponent(place.name || "Hospital")}`,
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }
          })

          return hospitals.sort((a: any, b: any) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
        }
      }
    }

    // Fallback to Overpass API
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${latitude},${longitude});
        way["amenity"="hospital"](around:${radius},${latitude},${longitude});
        relation["amenity"="hospital"](around:${radius},${latitude},${longitude});
      );
      out center meta;
    `

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    })

    if (!response.ok) {
      throw new Error("Failed to fetch hospitals from Overpass API")
    }

    const data = await response.json()

    // Transform the data to our format
    const hospitals = data.elements
      .map((element: any) => {
        const lat = element.lat || element.center?.lat
        const lon = element.lon || element.center?.lon
        const tags = element.tags || {}

        if (!lat || !lon) return null

        // Calculate distance
        const distance = calculateDistance(latitude, longitude, lat, lon)

        return {
          id: element.id.toString(),
          name: tags.name || "Hospital",
          address:
            tags["addr:full"] ||
            `${tags["addr:street"] || ""} ${tags["addr:city"] || ""}`.trim() ||
            "Address not available",
          phone: tags.phone || tags["contact:phone"] || "Phone not available",
          distance: `${distance.toFixed(1)} km`,
          rating: Math.random() * 2 + 3, // Random rating between 3-5
          hours: tags.opening_hours || "24/7",
          emergency: tags.emergency === "yes" || tags["healthcare:speciality"]?.includes("emergency") || true,
          specialties: getSpecialties(tags),
          image: `https://placehold.co/600x400/e74c3c/ffffff?text=${encodeURIComponent(tags.name || "Hospital")}`,
          latitude: lat,
          longitude: lon,
        }
      })
      .filter((hospital: any) => hospital !== null)

    return hospitals.sort((a: any, b: any) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
  } catch (error) {
    console.error("Error fetching hospitals:", error)
    // Fallback to mock data if all APIs fail
    return getMockHospitals(latitude, longitude)
  }
}


// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Helper function to extract specialties from Google Places types
function getGoogleSpecialties(types: string[]): string[] {
  const specialties = []

  if (types.includes("hospital")) specialties.push("General Medicine")
  if (types.includes("emergency_room")) specialties.push("Emergency Care")
  if (types.includes("pharmacy")) specialties.push("Pharmacy")
  if (types.includes("doctor")) specialties.push("Medical Care")

  // Default specialties if none found
  if (specialties.length === 0) {
    specialties.push("General Medicine", "Emergency Care")
  }

  return specialties.slice(0, 3) // Limit to 3 specialties
}

// Helper function to extract specialties from tags
function getSpecialties(tags: any): string[] {
  const specialties = []

  if (tags.emergency === "yes") specialties.push("Emergency Care")
  if (tags["healthcare:speciality"]) {
    const specs = tags["healthcare:speciality"].split(";")
    specialties.push(...specs.map((s: string) => s.trim().replace("_", " ")))
  }
  if (tags.beds) specialties.push(`${tags.beds} Beds`)

  // Default specialties if none found
  if (specialties.length === 0) {
    specialties.push("General Medicine", "Emergency Care")
  }

  return specialties.slice(0, 3) // Limit to 3 specialties
}

// Fallback mock hospitals
function getMockHospitals(latitude: number, longitude: number) {
  return [
    {
      id: "mock-1",
      name: "City General Hospital",
      address: "123 Main Street, Downtown",
      phone: "(555) 123-4567",
      distance: "1.2 km",
      rating: 4.5,
      hours: "24/7",
      emergency: true,
      specialties: ["Emergency Care", "Cardiology", "Neurology"],
      image: "https://placehold.co/600x400/e74c3c/ffffff?text=City+General",
      latitude: latitude + 0.01,
      longitude: longitude + 0.01,
    },
    {
      id: "mock-2",
      name: "Regional Medical Center",
      address: "456 Oak Avenue, Westside",
      phone: "(555) 234-5678",
      distance: "2.5 km",
      rating: 4.2,
      hours: "24/7",
      emergency: true,
      specialties: ["Trauma Center", "Pediatrics", "Orthopedics"],
      image: "https://placehold.co/600x400/3498db/ffffff?text=Regional+Medical",
      latitude: latitude - 0.02,
      longitude: longitude + 0.015,
    },
  ]
}

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

    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || API_BASE_URL}/api/report/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')!}`,
      },
      body: formData,
    });
  } else {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || API_BASE_URL}/api/report/create`, {
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
    console.error("Error from server:", text);

    if (res.status === 409) {
      throw new Error("No available ambulances at the moment.");
    }

    throw new Error("Report creation failed");
  }

  return await res.json();
}

export default api;