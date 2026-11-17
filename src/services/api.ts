/**
 * ECE StudyHub Frontend API Client
 * Connects React UI components to Express.js REST API endpoints.
 */

const API_BASE_URL = "http://localhost:5000/api";

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("ece_studyhub_jwt_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem("ece_studyhub_jwt_token", data.token);
    }
    return data;
  } catch (error) {
    console.warn("Backend API unavailable, falling back to mock authentication:", error);
    return { success: false, message: "Backend offline" };
  }
}

export async function fetchCurrentUser() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: "Backend offline" };
  }
}

export async function fetchCoursesApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/courses`);
    return await res.json();
  } catch (error) {
    return { success: false, message: "Backend offline" };
  }
}

export async function fetchAttendanceSummaryApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/attendance/summary`, {
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: "Backend offline" };
  }
}

export async function fetchResultsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/results`, {
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: "Backend offline" };
  }
}

export async function fetchNoticesApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/notices`);
    return await res.json();
  } catch (error) {
    return { success: false, message: "Backend offline" };
  }
}
