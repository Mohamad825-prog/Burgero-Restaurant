## Burgero Restaurant — README A full‑stack restaurant
Burgero Restaurant — README
A full‑stack restaurant web app with a user-facing website (browse menu, place orders, send contact messages) and an admin panel (manage orders, messages, and menu items). The project uses a backend API as the single source of truth so both the user site and admin panel stay synchronized.

Features
User Website
Browse menu items and special items
Place orders (saved to the database via the backend API)
Send contact messages (saved to the database via the backend API)
Admin Panel
View and manage orders (load from backend, update status, delete)
View and manage contact messages (load from backend, mark as read, delete, delete all)
Add menu items and special items (saved via backend API so they appear on the user site)
Architecture (Data Flow)
After API integration remediation:

User Website → Backend API → Database → Admin Panel

Orders: POST /api/orders → stored in DB → admin reads via GET /api/orders
Messages: POST /api/messages → stored in DB → admin reads via GET /api/messages
Menu items/specials: admin creates via API → stored in DB → user site reads from API
Key idea: No localStorage-based “fake sync”. The database is the authoritative source.

Tech Stack (typical)
Frontend (User site): React (or similar SPA)
Admin Frontend: React
Backend: Node.js / Express
Database: MySQL
API: REST (/api/...)
(Adjust this section if your stack differs.)

Project Structure (high level)
admin-frontend/ — Admin panel UI
src/pages/OrderManagementPage.js
src/pages/ContactMessagesPage.js
src/pages/AddItemPage.js
src/services/adminApiService.js
frontend/ (or similar) — User-facing website UI
backend/ (or similar) — API + DB integration
Setup & Run
1) Backend
Install dependencies
Configure your MySQL connection / environment variables (if applicable)
Start the server
The admin frontend expects the API here:

js
const API_BASE_URL = 'http://localhost:5000/api';
So make sure your backend is running on:

http://localhost:5000
2) Admin Frontend
Install dependencies
Start the dev server
Login (if your app requires auth) — ensure a token exists in localStorage if the API is protected.
3) User Frontend
Install dependencies
Start the dev server
Use the UI to place orders / send messages
Admin API Integration Notes (What was fixed)
Previously, the admin panel was not synced:

Admin orders/messages were loaded from localStorage (wrong)
Admin menu items were saved to localStorage (wrong)
Now the admin panel uses the backend API:

Updated files
admin-frontend/src/pages/OrderManagementPage.js
Fetch orders from API
Update order status via API
Delete orders via API
admin-frontend/src/pages/ContactMessagesPage.js
Fetch messages from API
Mark message as read via API
Delete message(s) via API
admin-frontend/src/pages/AddItemPage.js
Add menu/special items via API (with validation)
admin-frontend/src/services/adminApiService.js
Added deleteAllMessages() (calls DELETE /api/messages)
Testing Checklist
Place an order from the user website → appears in admin panel → Order Management
Send a message from the user website → appears in admin panel → Contact Messages
Add a menu item from the admin panel → appears on the user website
Update an order status from admin → status persists after refresh
Delete orders/messages → removed from DB and UI
Troubleshooting
API not reachable / nothing loads
Confirm backend is running on http://localhost:5000
Check browser console for CORS errors
If authentication is required, confirm the token exists and is valid
Admin adds items but user site doesn’t show them
Hard refresh the user site (Ctrl + Shift + R)
Check backend logs to confirm the item is being saved to DB
Validation errors
Make sure required fields are provided:

Menu items: name, price
Special items: title, price
Messages: name, email, message
Orders: all required order fields
Optional Enhancements
Real-time updates via WebSockets (Socket.io) for new orders/messages
Pagination for large order/message lists
Search & filtering in admin pages
Role-based access control for admin endpoints
License
Add your license here (e.g., MIT) or remove this section if not applicable.
