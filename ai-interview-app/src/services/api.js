const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://interview-practice-ai-8ekg.onrender.com"
).replace(/\/$/, "");
const API_BASE_URL = `${API_URL}/api`;

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
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || "Something went wrong");
  }
  return data;
};

export const api = {
  // Auth API
  async register(username, email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
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
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
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
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
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
    const res = await fetch(`${API_BASE_URL}/interviews/generate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ topic }),
    });
    return await handleResponse(res);
  },

  async submitAnswer(topic, question, userAnswer) {
    const res = await fetch(`${API_BASE_URL}/interviews/submit`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ topic, question, userAnswer }),
    });
    return await handleResponse(res);
  },

  async getHistory() {
    const res = await fetch(`${API_BASE_URL}/interviews`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },

  async updateInterview(id, updates) {
    const res = await fetch(`${API_BASE_URL}/interviews/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    return await handleResponse(res);
  },

  async deleteInterview(id) {
    const res = await fetch(`${API_BASE_URL}/interviews/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },
};
