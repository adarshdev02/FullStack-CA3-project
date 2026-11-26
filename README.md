# MealBridge

MealBridge is a MERN website that connects food donors with NGOs and food receivers. Donors publish surplus-food donations, and NGOs search for and request available donations.

## Features

- JWT authentication with bcrypt password hashing
- Responsive React dashboard
- Donor registration and NGO/recipient registration
- Profile settings for updating user details and NGO city
- Surplus-food donation creation and city search
- Smart Match recommendations prioritize same-city donors and pickup locations, plus pickups due within 24 hours
- Food quantity requests
- Request approval, rejection, cancellation, and completion
- MongoDB Atlas data persistence

## Setup

1. Install Node.js 18+ and create a MongoDB Atlas cluster.
2. Copy `server\.env.example` to `server\.env`.
3. Set `MONGO_URI`, `JWT_SECRET`, `PORT`, and `CLIENT_URL` in `server\.env`.
4. Install and start the backend:

   ```powershell
   cd server
   npm install
   npm run dev
   ```

5. In another terminal, install and start the frontend:

   ```powershell
   cd client
   npm install
   npm run dev
   ```

6. Open the Vite URL, normally `http://localhost:5173`.

Never expose the MongoDB URI or JWT secret in the client.

## Assignment checklist

1. Multiple components: `client/src/components/`
2. Responsive design: Tailwind responsive classes in all dashboard pages
3. Tailwind CSS: `client/tailwind.config.js` and `client/src/index.css`
4. Fetch API: `client/src/services/api.js`
5. Error handling: API helper, form messages, Express error middleware
6. Props/state: reusable layout and role-based components use props and `useState`
7. Conditional rendering: protected routes, donor/NGO views, and request statuses
8. React Router/protected routes: `client/src/App.jsx`, `client/src/routes/ProtectedRoute.jsx`
9. Forms/validation: authentication, donation, and request forms with server validation
10. Hooks/Context: `AuthContext`, `useState`, `useEffect`
11. REST API: `server/routes/` and controllers
12. Environment variables: `server/.env.example`
13. MongoDB: Mongoose persistence in `server/models/`
14. MongoDB Atlas: configurable `MONGO_URI`
15. Mongoose schemas: User, Donation, and FoodRequest
