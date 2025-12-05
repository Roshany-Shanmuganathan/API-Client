/**
 * Centralized API Client
 *
 * This file creates a single axios instance that is used throughout the application.
 * It handles:
 * - Base URL configuration from environment variables
 * - Automatic token injection for authenticated requests
 * - Error handling and token expiration
 */

import axios, { AxiosError, AxiosInstance } from "axios";

// Get API base URL from environment variable
// Next.js requires NEXT_PUBLIC_ prefix for client-side environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL environment variable is not set. Please add it to your .env file."
  );
}

/**
 * Create axios instance with base configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor - adds authentication token to requests
 * This runs before every API call
 */
apiClient.interceptors.request.use(
  config => {
    // Only run on client side (browser)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handles errors globally
 * This runs after every API response
 */
apiClient.interceptors.response.use(
  response => response,
  (
    error: AxiosError<{ success: false; message: string; errors?: string[] }>
  ) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear stored authentication data
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to home page
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
