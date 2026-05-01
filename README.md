# FoodDash - Professional QR-Based Restaurant Ordering System

FoodDash is a modern, full-stack web application designed for restaurants to streamline the ordering process using table-specific QR codes. It features a robust admin dashboard, real-time kitchen tracking, and a premium customer interface.

## 🚀 Key Features

- **Table QR Ordering:** Customers scan a table-specific QR code to browse the menu and order without an app.
- **Real-Time Staff Dashboards:**
  - **Kitchen:** Live "Pending" and "Preparing" view with audio notifications for new orders.
  - **Orders:** Front-of-House tracking for "Ready" and "Served" items.
- **Full Admin Control:** 
  - Manage Menu (Add/Delete/Stock Toggle).
  - Configure restaurant settings (Total tables).
  - Sales Analytics & Stats.
- **Live Order Tracking:** Customers get real-time visual and audio feedback on their food status.
- **Premium UI:** Built with React and Tailwind CSS for a sleek, responsive experience.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios, React-Hot-Toast.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (via Mongoose).
- **Security:** JWT Authentication, Bcrypt password hashing.

## 📦 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd food-ordering-system
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

## 🚀 Running the App

### Start Backend
```bash
cd backend
npm start
```

### Start Frontend
```bash
cd frontend
npm run dev
```

## 📜 License
This project is licensed under the MIT License.
