import { ROUTES } from "../routes";

export function logout() {
  localStorage.removeItem("access_token");

  window.location.href = ROUTES.LOGIN;
}
