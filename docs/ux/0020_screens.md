# WorkGraph Screens

---

## Public Screens

### 1. Login

Purpose: Authenticate user

Fields:

- email
- password

Actions:

- login
- redirect on success

---

### 2. Register

Purpose: Create new account

Fields:

- email
- password
- username

Actions:

- create account
- auto-login

---

## Protected Screens

### 3. Organization List / Switcher

Purpose: Select active organization

States:

- multiple orgs → list
- single org → auto-select
- none → empty state

Actions:

- select org
- create org

---

### 4. Create Organization

Purpose: Create new workspace

Fields:

- organization name

Actions:

- submit
- redirect to dashboard

---

### 5. Organization Dashboard

Purpose: Main application area

Sections:

- organization header
- members (future)
- settings (future)

---

### 6. Profile

Purpose: User settings

Fields:

- user info display

Actions:

- update profile (future)
