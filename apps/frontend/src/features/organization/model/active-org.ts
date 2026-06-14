const ACTIVE_ORG_KEY = "active_org";

export function setActiveOrg(orgId: string) {
  localStorage.setItem(ACTIVE_ORG_KEY, orgId);
}

export function getActiveOrg() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_ORG_KEY);
}

export function clearActiveOrg() {
  localStorage.removeItem(ACTIVE_ORG_KEY);
}
