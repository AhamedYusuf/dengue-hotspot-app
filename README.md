# Dengue Hotspot Reporter

## The Problem

Dengue outbreaks in Sri Lanka often spread faster than health authorities can track them through official channels alone. By the time an area's case count is reported through formal surveillance systems, transmission may already be widespread within that neighborhood. Residents and local health workers often have earlier, on-the-ground visibility into emerging clusters — stagnant water sites, a spike in cases at a single school, an area everyone locally already knows is bad — but no simple way to surface that information into one place where it can be seen, verified, and acted on.

## Our Solution

Dengue Hotspot Reporter lets anyone submit a report of a suspected dengue hotspot — an area, a date, a case count, and notes — which appears immediately on a shared, browsable list. Health authorities can review incoming reports and mark them as verified, giving the community a way to distinguish confirmed hotspots from unconfirmed ones at a glance. Users can search the list by area to quickly check if their neighborhood already has a report on file before submitting a new one.

## Main Features
- Report submission with client- and server-side validation
- Browse and search reported hotspots
- Mark reports as verified

## Technologies Used
React, Vite, Tailwind CSS, Node.js, Express, MongoDB Atlas, Mongoose, Claude, Antigravity

## AI Tools Used (Declaration)
- Claude — Generated the `GET /api/reports` Express route, the MongoDB seed script with sample Sri Lankan dengue data, and the `HotspotList.jsx` / `ReportCard.jsx` React components (fetch logic, loading/error/empty states, responsive layout). Output was tested manually with `curl` against the running server and in-browser against the live UI; fixed a route-mounting bug in `server.js` (route wasn't wired to the app) and a file-content mix-up between the client and server `getReports.js` files during setup.
- Antigravity — Used to scaffold the overall frontend (Vite + React + Tailwind setup, project structure, base configuration). Output was tested by running `npm run dev` and checking the app rendered correctly in the browser; fixed a missing `@tailwindcss/vite` dependency that caused the dev server to fail to start.

## Team Members & Contributions
- [Ahamed M.A.U, IT24101779] — Report submission feature: form UI, validation, POST API route
- [Yusuf S.A, IT24103319] — Hotspot browsing feature: list UI, GET API route, sample data
- [Jassin M.N.M, IT24103137] — Search feature: search UI, filtered GET API route
- [Umair M.W.M, IT24102527] — Verification feature: verify button UI, PUT API route

## Installation & Running Locally

### Backend
\`\`\`bash
cd server
npm install
\`\`\`
Create `server/.env`:
\`\`\`
MONGO_URI=mongodb+srv://usmanahamed678_db_user:oEgf3FiuUuLiOnAv@cluster0.43fnumy.mongodb.net/?appName=Cluster0
PORT=5050
\`\`\`
Seed sample data:
\`\`\`bash
node seed/seedReports.js
\`\`\`
Start the server:
\`\`\`bash
npm run start
\`\`\`

### Frontend
\`\`\`bash
cd client
npm install
\`\`\`
Create `client/.env`:
\`\`\`
VITE_API_URL=http://localhost:5050
\`\`\`
Start the dev server:
\`\`\`bash
npm run dev
\`\`\`

