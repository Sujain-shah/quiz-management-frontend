export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function saveSession(data) {
  const token = data.token || data.accessToken || data.jwt;
  const user = data.user || data.data?.user || null;

  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function roleOf(user) {
  return String(user?.role || "").toUpperCase();
}