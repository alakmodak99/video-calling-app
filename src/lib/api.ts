/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  callId: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  startTime?: string;
  endTime?: string;
  duration: number;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
  host: User;
  participants: User[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  avatar?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface UpdateMeetingRequest {
  title?: string;
  description?: string;
  status?: "scheduled" | "ongoing" | "completed" | "cancelled";
  startTime?: string;
  endTime?: string;
  duration?: number;
  participantCount?: number;
}

class ApiService {
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  }

  private getHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();

    // Store token in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  }

  async getProfile(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to get profile");
    }

    return response.json();
  }

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  }

  // Meeting endpoints
  async createMeeting(meetingData: any): Promise<Meeting> {
    const response = await fetch(`${API_BASE_URL}/meetings`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create meeting");
    }

    return response.json();
  }

  async getMeetings(): Promise<Meeting[]> {
    const response = await fetch(`${API_BASE_URL}/meetings`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to get meetings");
    }

    return response.json();
  }

  async getMeetingHistory(limit: number = 10): Promise<Meeting[]> {
    const response = await fetch(
      `${API_BASE_URL}/meetings/history?limit=${limit}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get meeting history");
    }

    return response.json();
  }

  async getMeeting(id: string): Promise<Meeting> {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get meeting");
    }

    return response.json();
  }

  async joinMeeting(id: string): Promise<Meeting> {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}/join`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to join meeting");
    }

    return response.json();
  }

  // CallId-based helpers for simpler FE flow
  async getMeetingByCallId(callId: string): Promise<Meeting | null> {
    const response = await fetch(`${API_BASE_URL}/meetings/by-call/${callId}`, {
      headers: this.getHeaders(),
    });
    if (response.status === 204) return null;
    if (!response.ok) {
      // When not found, backend returns null; treat 200 with null as no meeting
      try {
        const data = await response.json();
        return data ?? null;
      } catch {
        return null;
      }
    }
    const data = await response.json();
    return data ?? null;
  }

  async createOrGetMeetingByCallId(
    callId: string,
    payload?: Partial<any>
  ): Promise<Meeting> {
    const response = await fetch(`${API_BASE_URL}/meetings/by-call/${callId}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload ?? {}),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create meeting by callId");
    }
    return response.json();
  }

  async joinByCallId(callId: string): Promise<Meeting> {
    const response = await fetch(
      `${API_BASE_URL}/meetings/by-call/${callId}/join`,
      {
        method: "POST",
        headers: this.getHeaders(),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to join meeting by callId");
    }
    return response.json();
  }

  async startByCallId(callId: string): Promise<Meeting> {
    const response = await fetch(
      `${API_BASE_URL}/meetings/by-call/${callId}/start`,
      {
        method: "POST",
        headers: this.getHeaders(),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to start meeting by callId");
    }
    return response.json();
  }

  async endByCallId(callId: string): Promise<Meeting> {
    const response = await fetch(
      `${API_BASE_URL}/meetings/by-call/${callId}/end`,
      {
        method: "POST",
        headers: this.getHeaders(),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to end meeting by callId");
    }
    return response.json();
  }

  async startMeeting(id: string): Promise<Meeting> {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}/start`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to start meeting");
    }

    return response.json();
  }

  async endMeeting(id: string): Promise<Meeting> {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}/end`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to end meeting");
    }

    return response.json();
  }

  async updateMeeting(
    id: string,
    meetingData: Partial<UpdateMeetingRequest>
  ): Promise<Meeting> {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update meeting");
    }

    return response.json();
  }

  async deleteMeeting(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete meeting");
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }
}

export const apiService = new ApiService();
