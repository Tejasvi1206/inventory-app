# Inventory & Order Management System

A full-stack Inventory & Order Management System built with FastAPI, React, PostgreSQL, and Docker.

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Python, FastAPI, SQLAlchemy |
| Frontend | React 18, React Router, Axios |
| Database | PostgreSQL 15 |
| Containerization | Docker, Docker Compose |

## Features

- **Product Management** — Add, view, update, delete products with SKU, price, quantity
- **Customer Management** — Add, view, delete customers with unique email enforcement
- **Order Management** — Create orders with automatic inventory deduction, view & cancel orders
- **Dashboard** — Summary stats + low stock alerts
- **Business Rules** — Unique SKUs, unique emails, no negative stock, automatic total calculation

---

## 🚀 Quick Start (Docker)

```bash
git clone <your-repo-url>
cd inventory-app

# Copy env file
cp .env.example .env   # edit if needed

# Build & run everything
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Local Development (without Docker)

### Backend

```bash
cd backend
pip install -r requirements.txt

# Set env var (use your local PostgreSQL)
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory_db

uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

---

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /products | Create product |
| GET | /products | List all products |
| GET | /products/{id} | Get product |
| PUT | /products/{id} | Update product |
| DELETE | /products/{id} | Delete product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /customers | Create customer |
| GET | /customers | List all customers |
| GET | /customers/{id} | Get customer |
| DELETE | /customers/{id} | Delete customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /orders | Create order (deducts stock) |
| GET | /orders | List all orders |
| GET | /orders/{id} | Get order details |
| DELETE | /orders/{id} | Cancel order (restores stock) |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /dashboard | Summary stats + low stock |

---

## Deployment Guide

### Backend → Render

1. Push code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your repo, set **Root Directory** to `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add env var: `DATABASE_URL` = your PostgreSQL connection string
7. Add a free PostgreSQL database on Render and copy its URL

### Frontend → Vercel

1. Go to https://vercel.com → New Project
2. Import your GitHub repo, set **Root Directory** to `frontend`
3. Add env var: `REACT_APP_API_URL` = your Render backend URL
4. Deploy

### Docker Hub (Backend Image)

```bash
docker build -t yourdockerid/inventory-backend:latest ./backend
docker push yourdockerid/inventory-backend:latest
```

---

## Project Structure

```
inventory-app/
├── docker-compose.yml
├── .env
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── database.py
│       ├── models/
│       │   ├── models.py     # SQLAlchemy ORM models
│       │   └── schemas.py    # Pydantic schemas
│       └── routers/
│           ├── products.py
│           ├── customers.py
│           ├── orders.py
│           └── dashboard.py
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/
        ├── App.js
        ├── api/client.js
        └── pages/
            ├── Dashboard.js
            ├── Products.js
            ├── Customers.js
            └── Orders.js
```
