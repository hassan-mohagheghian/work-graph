export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  LOGOUT: "/logout",
  ORGANIZATIONS: "/organizations",

  // Organization
  ORG_DETAIL: (id: string) => `/organizations/${id}`,
  ORG_SETTINGS: (id: string) => `/organizations/${id}/settings`,
  ORG_MEMBERS: (id: string) => `/organizations/${id}/members`,
  ORG_PROJECTS: (id: string) => `/organizations/${id}/projects`,

  // Project
  PROJECT_NEW: (orgId: string) => `/organizations/${orgId}/projects/new`,
  PROJECT_DETAIL: (orgId: string, pid: string) =>
    `/organizations/${orgId}/projects/${pid}`,
  PROJECT_ROADMAP: (orgId: string, pid: string) =>
    `/organizations/${orgId}/projects/${pid}/roadmap`,
  PROJECT_MILESTONES: (orgId: string, pid: string) =>
    `/organizations/${orgId}/projects/${pid}/milestones`,
  MILESTONE_DETAIL: (orgId: string, pid: string, mid: string) =>
    `/organizations/${orgId}/projects/${pid}/milestones/${mid}`,
  PROJECT_TASKS: (orgId: string, pid: string) =>
    `/organizations/${orgId}/projects/${pid}/tasks`,
  TASK_DETAIL: (orgId: string, pid: string, tid: string) =>
    `/organizations/${orgId}/projects/${pid}/tasks/${tid}`,
  PROJECT_DOCUMENTS: (orgId: string, pid: string) =>
    `/organizations/${orgId}/projects/${pid}/documents`,
  PROJECT_MEMBERS: (orgId: string, pid: string) =>
    `/organizations/${orgId}/projects/${pid}/members`,
  PROJECT_SETTINGS: (orgId: string, pid: string) =>
    `/organizations/${orgId}/projects/${pid}/settings`,
} as const;
