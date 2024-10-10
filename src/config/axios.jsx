import axios from "axios";

// Set up the base URL for the API (pointing to your ASP.NET Core backend)
const baseUrl = "http://localhost:5213/api/";

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json", // Default content type for API requests
  },
});

// Handle actions before making API requests (such as attaching the token)
const handleBefore = (config) => {
  // Get the JWT token from local storage
  const token = localStorage.getItem("token")?.replaceAll('"', "");

  // If a token is found, add it to the Authorization header of the request
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
};

// Add the handleBefore function as an interceptor for all outgoing requests
api.interceptors.request.use(handleBefore, (error) => {
  return Promise.reject(error);
});

// Export the configured Axios instance for use in your project
export default api;
