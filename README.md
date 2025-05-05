# 🔗 Trimio — URL Shortener + QR Code Generator

A full-stack URL Shortener app with QR code generation, built using **React.js**, **Node.js**, **MongoDB**, **Cloudinary**, and hosted serverless on **Vercel**.
Supports soft-delete, user link history, and QR code download.

### 🚀 Live Demo:

[https://trimio-shortner.vercel.app](https://trimio-shortner.vercel.app)

---

## 🛠 Tech Stack

* **Frontend**: React + Tailwind CSS + Axios + Toast Notifications
* **Backend**: Node.js + Express + Mongoose
* **Database**: MongoDB (Cloud - Atlas)
* **QR Storage**: Cloudinary (host QR images)
* **Hosting**: Vercel (Serverless deployment)

---

## 📦 Project Structure

```
backend/
  ├── controller/
  ├── model/
  ├── routes/
  ├── config/
  ├── index.js
  ├── .env
frontend/
  ├── src/
  ├── components/
  ├── App.jsx
  ├── .env
```

---

## ⚙️ Environment Variables Setup (`.env`)

### ✅ For **Backend** (`backend/.env`)

```env
PORT=3001
MONGO_URL =your_mongodb_connection_string
SERVER_URL = backend url (http://localhost:3001)
CLIENT_URL = frontend url (http://localhost:5173)

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
### ✅ For **Frontend** (`frontend/.env`)

```env
VITE_SERVER_URL = backend url (http://localhost:3001)
VITE_CLIENT_URL = frontend url (http://localhost:5173)

```

#### 📌 Example MongoDB Atlas URI:

```
mongodb+srv://username:password@cluster0.mongodb.net/yourDBname?retryWrites=true&w=majority
```

### 🔐 How to Get Your Cloudinary API Details

1. Go to [https://cloudinary.com/](https://cloudinary.com/) and **Sign Up** or **Log In**.
2. After login, go to the **Dashboard**.
3. Copy the following details:

   * **Cloud Name** → `CLOUDINARY_CLOUD_NAME`
   * **API Key** → `CLOUDINARY_API_KEY`
   * **API Secret** → `CLOUDINARY_API_SECRET`
4. Paste them into your `.env` file as shown above.

---

## 🔥 Features

* ✅ Shorten Long URLs
* ✅ Auto-generate QR Codes (Stored in Cloudinary)
* ✅ Save user link history (LocalStorage)
* ✅ Soft Delete (mark as deleted but not permanently removed)
* ✅ Download QR Code with timestamp filename
* ✅ Hosted on Vercel with serverless backend

---

## 🚀 Deployment Notes (Vercel Hosting)

* Backend is deployed as **Serverless Functions** on Vercel.
* Use **Cloudinary** to store QR codes.

### ✅ Vercel `.env` setup:

Go to Vercel Dashboard → Project → **Environment Variables** and add:
* `PORT`
* `MONGO_URL`
* `CLOUDINARY_CLOUD_NAME`
* `CLOUDINARY_API_KEY`
* `CLOUDINARY_API_SECRET`
* `SERVER_URL`
* `CLIENT_URL`

Same as Frontend...

---

## 💻 Run Locally

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm start
```

---

## 🤝 Credits

Developed by SK using MERN Stack ❤️

---

## 📩 Contact

For queries: [sathish31102004@gmail.com](mailto:sathish31102004@gmail.com)

---
