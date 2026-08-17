const resolveApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
  }

  return "https://interview-practice-ai-8ekg.onrender.com";
};

const API_URL = resolveApiUrl();
const API_BASE_URL = `${API_URL}/api`;

const request = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "The server is taking too long to respond. Please try again or start the backend server.",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const getHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  let data = {};

  try {
    data = await response.json();
  } catch {
    const text = await response.text().catch(() => "");
    data = text ? { message: text } : {};
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || "Something went wrong");
  }

  return data;
};

export const api = {
  // Auth API
  async register(username, email, password) {
    const res = await request(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  async login(emailOrUsername, password) {
    const res = await request(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrUsername, password }),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  async getMe() {
    const res = await request(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },

  logout() {
    localStorage.removeItem("token");
  },

  // Interviews API
  async generateQuestion(topic) {
    const res = await request(`${API_BASE_URL}/interviews/generate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ topic }),
    });
    return await handleResponse(res);
  },

  async submitAnswer(topic, question, userAnswer) {
    const res = await request(`${API_BASE_URL}/interviews/submit`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ topic, question, userAnswer }),
    });
    return await handleResponse(res);
  },

  async getHistory() {
    const res = await request(`${API_BASE_URL}/interviews`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },

  async updateInterview(id, updates) {
    const res = await request(`${API_BASE_URL}/interviews/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    return await handleResponse(res);
  },

  async deleteInterview(id) {
    const res = await request(`${API_BASE_URL}/interviews/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },
};
