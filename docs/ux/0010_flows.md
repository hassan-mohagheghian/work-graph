# WorkGraph Main UX Flows

## 1. Authentication Flow

### Login Flow

Login Page
→ Enter email/password
→ Submit
→ Success → Redirect to Organization Selector or Dashboard
→ Error → Show inline error message

---

### Register Flow

Register Page
→ Enter email/password/username
→ Submit
→ Success → Auto login
→ Redirect to Organization Creation

---

## 2. Organization Flow

### First-time user (no organization)

Login/Register
→ No organizations exist
→ Show Empty State
→ CTA: "Create Organization"

Create Organization
→ Enter organization name
→ Submit
→ Organization created
→ Redirect to Organization Dashboard

---

### Existing user

Dashboard Entry
→ Load user organizations
→ Show Organization List
→ Select organization → Enter dashboard

---

## 3. Organization Switching Flow

Inside App
→ Click Org Switcher
→ List organizations
→ Select one
→ Reload context
→ Enter selected organization dashboard

---

## 4. Profile Flow

User Menu
→ Profile Page
→ View user details
→ (Optional) update password / info

---

## 5. Core Screens List

- Login
- Register
- Organization List / Switcher
- Create Organization
- Organization Dashboard
- Profile

---

## 6. UI State Handling

### Empty States

- No organizations → show CTA "Create Organization"

### Loading States

- Show skeleton loaders for:
  - org list
  - dashboard

### Error States

- Invalid login → inline error
- API failure → toast notification

### Auth States

- Not logged in → redirect to login
- Logged in → protected routes only

---

## 7. Navigation Structure

### Public

- /login
- /register

### Protected

- /app (root)
- /app/orgs
- /app/org/:id
- /app/profile
