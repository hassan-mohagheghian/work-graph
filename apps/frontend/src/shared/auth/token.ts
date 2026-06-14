export function getToken() {
  if (typeof window == "undefined") return null;
  return localStorage.getItem("access_token");
}

export function clearToken() {
  localStorage.removeItem("access_token");
}
