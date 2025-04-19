# DesignCraft UI Component Library

A React-based UI component library for storing, searching, and managing reusable UI components with MongoDB Atlas integration.

## Environment Setup

This application uses environment variables for configuration. There are two main environment files:

### Development (.env)

```
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/...

# Server Configuration 
PORT=5000
NODE_ENV=development

# Frontend Configuration
VITE_API_URL=/api
```

### Production (.env.production)

```
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/...

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend Configuration
VITE_API_URL=https://your-api-domain.com/api
```

## Running the Application

### Development Mode

Run the application in development mode with:

```bash
npm run dev:full
```

This starts both the backend server and frontend development server concurrently.
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api (proxied through /api)

### Production Build

Build the frontend for production:

```bash
npm run build
```

This creates optimized files in the `dist` directory.

### Running Production Server

Start the backend server in production mode:

```bash
npm run server:prod
```

## Deployment

### Frontend Deployment

1. Build the application with `npm run build`
2. Deploy the `dist` directory to a static hosting service like Vercel, Netlify, or GitHub Pages
3. Ensure your production API URL is correct in `.env.production`

### Backend Deployment

1. Deploy the server to a hosting service like Heroku, Render, or Railway
2. Set the environment variables on your hosting platform
3. Make sure CORS is properly configured to allow requests from your frontend domain

## Features

- Create and manage component categories
- Add new component variants
- Edit and delete component variants
- Live preview component variants with iframe
- Copy component code to clipboard
- Responsive design
- Admin-only management features

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB installed locally or a MongoDB Atlas account
- Arweave wallet for authentication

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start MongoDB locally:
   ```
   mongod
   ```
4. Run the development server:
   ```
   npm run dev:full
   ```

## Project Structure

- `src/`: Frontend React application
  - `components/`: UI and layout components
  - `pages/`: Route pages
  - `context/`: React context providers
  - `api/`: API client functions
  - `types/`: TypeScript type definitions
- `server/`: Backend Express API
  - `index.js`: Main server file with MongoDB integration

## Usage

The application has two types of users:

1. **Regular Users**: Can browse components, view code, and copy components for their projects
2. **Admin Users**: Can add new components, edit existing ones, and manage the component library

Admin access is determined by the wallet address.

## License

This project is licensed under the MIT License.