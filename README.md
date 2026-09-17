# Revamping — Inventory Management System

A MERN stack inventory management system for a rental business (cameras, speakers, lighting equipment — priced hourly / half-day / full-day).

## Overview

Three user roles — Admin, Manager, Employee — manage products, categories, and stock levels. Admins also get reports, CSV/PDF exports, and an AI-powered assistant for quick lookups.

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT auth, Supabase Storage, Google Gemini (AI assistant)

**Frontend:** React, Vite, React Router, Tailwind CSS, Axios, Recharts, jsPDF

## Project Structure

### Backend
```text
backend/
├── config/
├── middleware/
├── utils/
├── modules/
│   ├── auth/
│   ├── products/       (includes category)
│   ├── stock/
│   ├── reports/
│   ├── assistant/
│   └── procurement/     ← planned
├── server.js
```

### Frontend
```text
frontend/src/
├── assets/
├── components/
│   ├── common/
│   ├── forms/
│   ├── layout/
│   └── assistant/
├── context/
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── profile/
│   ├── users/
│   ├── categories/
│   ├── products/
│   ├── stock/
│   └── reports/
├── routes/
├── services/
├── utils/
```

## Features

- ✅ Authentication (login, logout, forgot/reset password)
- ✅ User Management
- ✅ Category Management
- ✅ Product Catalog (with images)
- ✅ Stock Control (in/out/adjustment, history, low stock)
- ✅ Reports (low stock, stock movements — CSV & PDF export)
- ✅ AI Assistant (Stage 1 — product/stock lookups, admin only)
- ✅ Profile Management
- ✅ Dashboard (role-aware, admin charts)
- 🔲 Procurement Management (not started)
- 🔲 AI Assistant conversation memory (Stage 2/3)

## Setup

**Backend**
```bash
cd backend
npm install
npm start
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`, frontend on `http://localhost:5173`.
