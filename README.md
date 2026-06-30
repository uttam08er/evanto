# 🎉 Evently - Event Booking Platform

A full-stack event venue booking platform built with the MERN stack (MongoDB, Express, React, Node.js).

---

## 📋 TABLE OF CONTENTS

1. [Project Structure](#project-structure)
2. [Technologies Used](#technologies-used)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Setup Guide](#step-by-step-setup-guide)
5. [Environment Variables Explained](#environment-variables-explained)
6. [Running the Project](#running-the-project)
7. [Demo Login Credentials](#demo-login-credentials)
8. [API Endpoints](#api-endpoints)
9. [Deployment Guide](#deployment-guide)

---

## 📁 PROJECT STRUCTURE

```
evently/
├── client/                     ← React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         ← Navbar, Footer, LoadingSpinner, StarRating
│   │   │   ├── venue/          ← VenueCard
│   │   │   ├── booking/
│   │   │   ├── auth/
│   │   │   └── dashboard/
│   │   ├── pages/
│   │   │   ├── public/         ← Home, Venues, VenueDetail, Login, Register...
│   │   │   ├── user/           ← Dashboard, Bookings, Wishlist, Profile
│   │   │   ├── owner/          ← Owner Dashboard, Add Venue, Manage Venues
│   │   │   └── admin/          ← Admin Dashboard, Users, Venues, Bookings
│   │   ├── context/
│   │   │   └── AuthContext.jsx ← Global auth state
│   │   ├── services/
│   │   │   └── api.js          ← All API calls (axios)
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx ← Guards private pages
│   │   └── layouts/
│   │       └── MainLayout.jsx  ← Navbar + Footer wrapper
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                     ← Node.js Backend (Express)
    ├── config/
    │   ├── db.js               ← MongoDB connection
    │   ├── cloudinary.js       ← Image upload config
    │   └── socket.js           ← Socket.io setup
    ├── controllers/
    │   ├── authController.js   ← Register, Login, Forgot/Reset password
    │   ├── venueController.js  ← CRUD for venues
    │   ├── bookingController.js← Create booking + Stripe payment
    │   ├── reviewController.js ← Add/Edit/Delete reviews
    │   ├── wishlistController.js
    │   ├── notificationController.js
    │   └── adminController.js  ← Analytics, user/venue management
    ├── middleware/
    │   └── authMiddleware.js   ← protect + authorize (JWT check)
    ├── models/
    │   ├── User.js
    │   ├── Venue.js
    │   ├── Booking.js
    │   ├── Review.js
    │   ├── Wishlist.js
    │   ├── Notification.js
    │   └── Payment.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── venueRoutes.js
    │   ├── bookingRoutes.js
    │   ├── reviewRoutes.js
    │   ├── paymentRoutes.js
    │   ├── wishlistRoutes.js
    │   ├── notificationRoutes.js
    │   ├── userRoutes.js
    │   └── adminRoutes.js
    ├── services/
    │   └── emailService.js     ← Nodemailer email functions
    ├── utils/
    │   ├── jwtUtils.js         ← Token create/verify/send
    │   └── seedData.js         ← Demo data loader
    ├── .env.example
    ├── index.js                ← Server entry point
    └── package.json
```

---

## 🛠️ TECHNOLOGIES USED

**Frontend:** React 18, Vite, React Router, Axios, Tailwind CSS, Framer Motion, React Hook Form, React Toastify, Chart.js, Stripe.js

**Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs, Multer, Socket.io, Nodemailer, Stripe

**Database:** MongoDB Atlas (cloud)

**Services:** Cloudinary (images), Stripe (payments), Gmail SMTP (emails)

---

## ✅ PREREQUISITES

Before starting, make sure you have these installed on your computer:

### 1. Node.js (v18 or higher)
- Download from: https://nodejs.org
- Verify: open terminal and type `node --version` (should show v18.x.x or higher)

### 2. npm (comes with Node.js)
- Verify: `npm --version`

### 3. Git (optional but recommended)
- Download from: https://git-scm.com

### 4. Accounts you need to create (all free):
- **MongoDB Atlas**: https://mongodb.com (free 512MB cluster)
- **Cloudinary**: https://cloudinary.com (free 25GB storage)
- **Stripe**: https://stripe.com (test mode is free)
- **Gmail**: You need a Gmail account for sending emails

---

## 🚀 STEP-BY-STEP SETUP GUIDE

### STEP 1: Get the Project Files

If you downloaded the ZIP, extract it. If cloning from GitHub:
```bash
git clone <your-repo-url>
cd evently
```

### STEP 2: Set Up MongoDB Atlas (Free Cloud Database)

1. Go to https://mongodb.com and click "Try Free"
2. Create an account and log in
3. Click "Build a Database" → Choose "M0 FREE" → Choose a region near you → Click "Create"
4. **Create a database user:**
   - Username: `eventlyadmin` (any name)
   - Password: click "Autogenerate" and SAVE the password!
   - Click "Create User"
5. **Allow connections from anywhere:**
   - Click "Add My Current IP Address" OR type `0.0.0.0/0` to allow all
   - Click "Add Entry" then "Finish and Close"
6. **Get connection string:**
   - Click "Connect" → "Drivers" → Copy the string that looks like:
   - `mongodb+srv://eventlyadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true`
   - Replace `<password>` with the password you saved
   - Add `/evently` before the `?` to name your database:
   - Final: `mongodb+srv://eventlyadmin:YOURPASS@cluster0.xxxxx.mongodb.net/evently?retryWrites=true`

### STEP 3: Set Up Cloudinary (Free Image Storage)

1. Go to https://cloudinary.com and sign up for free
2. After login, you'll see your Dashboard
3. Copy these 3 values (you'll need them for .env):
   - **Cloud Name** (e.g., `dxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnop`)

### STEP 4: Set Up Stripe (Test Payment)

1. Go to https://stripe.com and create a free account
2. You'll be in "Test Mode" by default (that's fine for development)
3. Go to: **Developers** → **API Keys**
4. Copy:
   - **Publishable key** (starts with `pk_test_`) → goes in FRONTEND .env
   - **Secret key** (starts with `sk_test_`) → goes in BACKEND .env
5. **IMPORTANT**: Never swap these! Secret key = server only, Publishable key = frontend

### STEP 5: Set Up Gmail for Emails

1. Go to your Gmail account
2. Click your profile photo → **Manage your Google Account**
3. Click **Security** tab
4. Enable **2-Step Verification** (required first)
5. Go back to Security → scroll to **"App passwords"**
6. Click it → Select app: "Mail" → Select device: "Other" → Name it "Evently"
7. Google will give you a 16-character password like `abcd efgh ijkl mnop`
8. Save this password (you won't see it again!)
9. In .env use your Gmail address as `EMAIL_FROM` and this 16-char password as `EMAIL_PASSWORD`
   - Note: remove spaces from the password: `abcdefghijklmnop`

### STEP 6: Set Up Backend Environment Variables

Navigate to the `server` folder and create a `.env` file:

```bash
cd server
cp .env.example .env
```

Now open `server/.env` in any text editor (Notepad, VS Code, etc.) and fill in:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://eventlyadmin:YOURPASSWORD@cluster0.xxxxx.mongodb.net/evently?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_key_that_is_very_long_and_random_32chars
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
EMAIL_FROM=yourgmail@gmail.com
EMAIL_PASSWORD=your16charapppassword
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLIENT_URL=http://localhost:5173
```

### STEP 7: Set Up Frontend Environment Variables

```bash
cd ../client
cp .env.example .env
```

Open `client/.env` and fill in:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### STEP 8: Install Dependencies

Open TWO terminal windows/tabs:

**Terminal 1 - Backend:**
```bash
cd evently/server
npm install
```

**Terminal 2 - Frontend:**
```bash
cd evently/client
npm install
```

Wait for both to finish (may take 1-2 minutes each).

### STEP 9: Seed the Database with Demo Data

In the server terminal:
```bash
npm run seed
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared users
👥 Users seeded: admin@evently.com, owner@evently.com, user@evently.com
🗑️  Cleared venues
🏢 Venues seeded: The Grand Palace Banquet, Lakeview Resort & Spa, ...
🎉 Database seeded successfully!
```

### STEP 10: Start the Project

**Terminal 1 - Start Backend:**
```bash
cd evently/server
npm run dev
```
You should see: `🚀 Server running on http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd evently/client
npm run dev
```
You should see: `➜  Local: http://localhost:5173`

### STEP 11: Open in Browser

Open your browser and go to: **http://localhost:5173**

You should see the Evently homepage! 🎉

---

## 🔐 DEMO LOGIN CREDENTIALS

After running `npm run seed`:

| Role   | Email                  | Password  |
|--------|------------------------|-----------|
| Admin  | admin@evently.com      | admin123  |
| Owner  | owner@evently.com      | owner123  |
| User   | user@evently.com       | user123   |

---

## 💳 TEST PAYMENT

Use Stripe's test card (does NOT charge real money):
- **Card Number:** 4242 4242 4242 4242
- **Expiry:** Any future date (e.g., 12/26)
- **CVV:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

---

## 📡 API ENDPOINTS

| Method | Endpoint                          | Description            | Auth Required |
|--------|-----------------------------------|------------------------|---------------|
| POST   | /api/auth/register                | Register user          | No            |
| POST   | /api/auth/login                   | Login                  | No            |
| POST   | /api/auth/logout                  | Logout                 | Yes           |
| GET    | /api/auth/me                      | Get current user       | Yes           |
| POST   | /api/auth/forgot-password         | Request reset email    | No            |
| PUT    | /api/auth/reset-password/:token   | Reset password         | No            |
| PUT    | /api/auth/change-password         | Change password        | Yes           |
| GET    | /api/venues                       | Get all venues         | No            |
| GET    | /api/venues/featured              | Get featured venues    | No            |
| GET    | /api/venues/:id                   | Get venue details      | No            |
| POST   | /api/venues                       | Create venue           | Owner         |
| PUT    | /api/venues/:id                   | Update venue           | Owner         |
| DELETE | /api/venues/:id                   | Delete venue           | Owner/Admin   |
| POST   | /api/bookings                     | Create booking         | User          |
| PUT    | /api/bookings/:id/confirm-payment | Confirm Stripe payment | User          |
| GET    | /api/bookings/my-bookings         | User's bookings        | User          |
| PUT    | /api/bookings/:id/cancel          | Cancel booking         | User          |
| GET    | /api/reviews/:venueId             | Get venue reviews      | No            |
| POST   | /api/reviews/:venueId             | Add review             | User          |
| GET    | /api/wishlist                     | Get wishlist           | User          |
| POST   | /api/wishlist/:venueId            | Toggle wishlist        | User          |
| GET    | /api/notifications                | Get notifications      | Yes           |
| GET    | /api/admin/analytics              | Dashboard analytics    | Admin         |
| GET    | /api/admin/users                  | All users              | Admin         |
| PUT    | /api/admin/venues/:id/status      | Approve/reject venue   | Admin         |

---

## 🌐 DEPLOYMENT GUIDE

### Deploy Backend to Railway (Free)

1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repo and the `server` folder
4. Go to "Variables" tab and add ALL your .env variables
5. Railway auto-deploys and gives you a URL like: `https://evently-backend.railway.app`

### Deploy Frontend to Vercel (Free)

1. Go to https://vercel.com and sign up
2. Click "New Project" → Import your GitHub repo
3. Set "Root Directory" to `client`
4. Add environment variable: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
5. Also update your backend's `CLIENT_URL` variable to your Vercel URL
6. Click Deploy!

### Update CORS after Deployment

In your server `.env` on Railway, update:
```env
CLIENT_URL=https://your-app.vercel.app
```

---

## 🐛 COMMON ERRORS & FIXES

**Error: `MONGO_URI` not found**
→ Make sure you created `.env` file (not `.env.example`) in the server folder

**Error: Cannot connect to MongoDB**
→ Check your MongoDB Atlas IP whitelist. Add `0.0.0.0/0` for development.

**Error: Email not sending**
→ Make sure you're using Gmail App Password (16 chars), not your regular Gmail password

**Error: Stripe payment fails**
→ Use test card `4242 4242 4242 4242`. Make sure VITE_STRIPE_PUBLISHABLE_KEY starts with `pk_test_`

**Error: Images not uploading**
→ Check Cloudinary credentials. All 3 values (cloud name, API key, API secret) must be correct.

**Error: Module not found**
→ Run `npm install` again in both server and client folders

---

## 📞 SUPPORT

If you get stuck, the error message usually tells you what's wrong. Google the error message + "MERN stack" for quick answers.

Happy coding! 🚀
