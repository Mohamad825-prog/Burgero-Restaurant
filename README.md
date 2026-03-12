# Burgero-Restaurant

Burgero-Restaurant is a full-stack restaurant management and ordering platform. It includes a customer-facing frontend, an admin dashboard, and a backend API for menu, orders, and messaging.

## Project Structure

- **admin-frontend/**: Admin dashboard for managing menu, orders, specials, and customer messages.
- **burgero/**: Customer-facing frontend for browsing menu, placing orders, and viewing testimonials.
- **burgero-backend/**: Node.js backend API for authentication, menu management, orders, and messaging.

## Features

- Customer menu browsing and ordering
- Admin menu and order management
- Special menu items
- Customer testimonials and contact messages
- Image uploads for menu items
- Authentication for admin access

## Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn

### Backend Setup
1. Navigate to `burgero-backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure database in `config/database.js` and `config/supabase.js`
4. Start the server:
   ```bash
   npm start
   ```

### Admin Frontend Setup
1. Navigate to `admin-frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Customer Frontend Setup
1. Navigate to `burgero/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Deployment
See `DEPLOYMENT.md` in each folder for deployment instructions.

## License
See [LICENSE](LICENSE) for license information.

## Contact
For support or inquiries, please contact the project owner or open an issue in the repository.
