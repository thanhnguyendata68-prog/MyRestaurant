# Bep Viet Charlie - Restaurant Web App

A full-stack restaurant website built with React + Vite and Express + MongoDB.

## Features

- Browse menu items with categories and add to cart
- Place orders and save order history to MongoDB
- User authentication with localStorage session
- Manager dashboard and menu management (add/edit/delete items)
- Sitemap page and responsive navigation across pages
- Scroll-animated navbar on major pages

## Manager Account (Demo)

Use this account to access manager tools:

- Email: `manager@bepviet.com`
- Password: `manager123`
- Manager page: `/manager/menu`

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Express
- Database: MongoDB
- Styling: CSS

## Project Structure

```text
.
├── server/
│   ├── models/
│   └── routes/
├── src/
│   ├── pages/
│   ├── styles/
│   ├── lib/
│   ├── data/
│   └── user/
├── public/
├── server.js
└── package.json
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:5000/api
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### 3) Run app

Run frontend + backend together:

```bash
npm run dev:all
```

Or run separately:

```bash
npm run server
npm run dev
```

## Available Scripts

- `npm run dev` - start frontend (Vite)
- `npm run server` - start backend (Express)
- `npm run dev:all` - run frontend + backend concurrently
- `npm run build` - production build
- `npm run preview` - preview build
- `npm run lint` - lint project

## API Endpoints

### Orders

- `POST /api/orders` - create order
- `GET /api/orders` - get orders (optional filter by user/email)
- `GET /api/orders/:id` - get single order
- `PATCH /api/orders/:id/status` - update order status
- `DELETE /api/orders/:id` - delete order

### Health

- `GET /api/health` - health check

## Image Upload Notes (Manager)

In the manager add/edit modal you can:

- Paste a direct image URL
- Upload an image from laptop (saved as data URL)

For stable project assets, place images in `public/images/...` and use paths like:

```text
/images/menu/pho1.jpg
```

## Author

Built by Charlie for COMP125 project.
