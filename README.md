# 🚗 Uber MERN Clone (Real-Time GPS Tracking & Interactive Maps)

A high-performance, production-ready MERN Stack (MongoDB, Express, React, Node.js) clone of Uber, engineered to emulate the exact real-time flow of passenger booking and captain fulfillment. Features fully-interactive maps, offline/fallback routing, custom animated vehicle indicators, a robust OTP verification handshake, and a global notification toast overlay.

---

## 🌟 Key Features

### 🗺️ Premium Maps & Real-time Tracking
- **Interactive Routing Map**: Uses **Leaflet.js** and **OpenStreetMap (OSM)** for a fast, free, offline-ready mapping layout.
- **Dynamic Path Retraction**: The navigation polyline shrinks frame-by-frame precisely as the captain moves toward the destination.
- **Phase-Aware Routing**: Autodetects if the ride is in the `accepted` stage (routing from captain to pickup) or `ongoing` stage (pickup to destination).
- **Interactive HUD**: Displays a floating "Captain heading to pickup" or "Ride in progress" overlay showing remaining kilometers in real-time.
- **Custom Dynamic Markers**: 
  - 🟢 Green Pin: Pickup Location
  - 🔴 Red Pin: Destination Location
  - 🔵 Pulsing Dot: Passenger's live GPS position
  - 🚗 Dynamic Captain Vehicle Badge (Car, Moto, or Auto icon)

### 📲 Ride Booking Flow (End-to-End Handshake)
1. **Fare Estimation**: Instantly calculates and displays price estimates for **UberGo (Car)**, **UberMoto (Bike)**, and **UberAuto** based on exact route distances.
2. **Search Autocomplete**: Autocompletes addresses using the Google Places API or falls back elegantly to Photon (OSM) geocoding.
3. **Socket.io Handshake**: Real-time room joining, dispatching ride requests to nearby matching captains within a 2km radius.
4. **Interactive OTP Flow**: The driver must enter a 6-digit OTP provided by the user to officially start the ride.
5. **Secure payment flow**: The passenger can pay via UPI, Card, or Cash, automatically triggering a live toast notification on the captain's screen.

### 🔔 Custom Notifications & Audio cues
- **Global Toast Stack**: An in-app spring-animated notification deck for instant feedback (e.g., booking, captain confirmation, OTP receipt, ride start, and payment success).
- **Web Push Notifications**: Requests native browser permissions so drivers receive notifications even when the browser tab is running in the background.

---

## 🏗️ System Architecture & Stack

### Backend
- **Node.js** & **Express** REST API
- **MongoDB** & **Mongoose** (User, Captain, and Ride schemas)
- **JSON Web Tokens (JWT)** for secure, role-based authentication
- **Socket.io** for real-time bi-directional location broadcasts and ride status sync
- **OSRM (Open Source Routing Machine)** & **Photon API** (fallbacks for Google Maps API restrictions)

### Frontend
- **React.js** (Vite-powered, fast HMR)
- **Tailwind CSS** for modern, fully responsive dashboard designs
- **GSAP (GreenSock)** for buttery-smooth panels, sheets, and slider animations
- **Leaflet** for vector map layering and path rendering
- **Remix Icons** for clean, consistent interface graphics

---

## 🚀 Installation & Local Development

### 1. Prerequisites
Ensure you have Node.js (v18+) and MongoDB installed locally, or a MongoDB Atlas connection string.

### 2. Clone the Repository
```bash
git clone https://github.com/Sg-2003/HomelyHub.git
cd HomelyHub
```

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_MAPS_API=optional_google_maps_api_key
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### 4. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory:
   ```env
   VITE_BASE_URL=http://localhost:3000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🎨 Production Deployment

### Backend Deployment (Render / Heroku)
1. Set the environment variables in your deployment dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (usually auto-configured by host)
2. Ensure Websockets are enabled on the service provider.

### Frontend Deployment (Vercel)
This frontend can be instantly deployed to Vercel. 
1. Install Vercel CLI or link your GitHub repo to the Vercel Dashboard.
2. Set `VITE_BASE_URL` to your deployed backend URL.
3. Configure the output directory to `dist`.

---

## 📄 License
This project is licensed under the MIT License.
