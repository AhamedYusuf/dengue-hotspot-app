## AI Prompt Log

**Person:** P1
**Tool:** Claude
**Prompt (summary):** Build a POST /api/reports Express route saving to MongoDB with server-side validation (area, date, caseCount required), plus a ReportForm.jsx with matching client-side validation and inline error messages
**Purpose:** Submit report feature
**How output was checked/modified:** tested with valid/invalid input, confirmed error messages displayed correctly

**Person:** P1
**Tool:** Antigravity
**Prompt (summary):** Scaffold ReportForm.jsx frontend structure and styling
**Purpose:** Submit report feature (frontend)
**How output was checked/modified:** 

---

**Person:** P2
**Tool:** Claude
**Prompt (summary):** Build GET /api/reports route, seed script, and HotspotList page for browse feature
**Purpose:** Hotspot browsing feature
**How output was checked/modified:** Tested route with curl; fixed server.js route mounting; fixed client/server file mix-up; verified UI renders seeded data correctly

**Person:** P2
**Tool:** Antigravity
**Prompt (summary):** Scaffold the frontend — Vite + React + Tailwind setup
**Purpose:** Frontend project setup
**How output was checked/modified:** Ran dev server to verify it builds; fixed missing @tailwindcss/vite dependency

---

**Person:** P3
**Tool:** Claude
**Prompt (summary):** Build a GET /api/reports?search= route with case-insensitive partial match on area, plus a debounced SearchBar.jsx
**Purpose:** Search feature
**How output was checked/modified:** 

**Person:** P3
**Tool:** Antigravity
**Prompt (summary):** Scaffold SearchBar.jsx frontend structure and styling
**Purpose:** Search feature (frontend)
**How output was checked/modified:** 

---

**Person:** P4
**Tool:** Claude
**Prompt (summary):** Build a PUT /api/reports/:id route flipping verified boolean, plus a VerifyButton.jsx showing verified state
**Purpose:** Verify feature
**How output was checked/modified:** 

**Person:** P4
**Tool:** Antigravity
**Prompt (summary):** Scaffold VerifyButton.jsx frontend structure and styling
**Purpose:** Verify feature (frontend)
**How output was checked/modified:** 
