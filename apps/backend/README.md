# CRUD Express API

A production-ready RESTful API built with Express.js, MongoDB, and JWT authentication. Features a clean layered architecture with input validation, structured logging, and automatic error recovery.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Testing APIs](#testing-apis)
- [Logging System](#logging-system)
- [Error Handling](#error-handling)
- [Deployment](#deployment)

---

## Tech Stack

| Layer               | Technology                                |
| ------------------- | ----------------------------------------- |
| **Runtime**         | Node.js (ES Modules)                      |
| **Framework**       | Express.js v5                             |
| **Database**        | MongoDB (native driver v7)                |
| **Authentication**  | JWT (jsonwebtoken) + bcrypt               |
| **Validation**      | Zod                                       |
| **Logging**         | Winston (colorized console + file output) |
| **HTTP Logging**    | Custom middleware with duration tracking  |
| **Package Manager** | pnpm                                      |
| **Dev Tool**        | nodemon (auto-restart)                    |

---

## Project Structure

```
crud-express/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection manager
│   ├── controllers/
│   │   ├── auth.controller.js     # Auth request handlers
│   │   ├── user.controller.js     # User CRUD handlers
│   │   ├── category.controller.js # Category CRUD handlers
│   │   ├── product.controller.js  # Product CRUD handlers
│   │   ├── order.controller.js    # Order CRUD handlers
│   │   ├── review.controller.js   # Review request handlers (NEW)
│   │   ├── wishlist.controller.js # Wishlist request handlers (NEW)
│   │   └── analytics.controller.js # Analytics request handlers (NEW)
│   ├── middlewares/
│   │   ├── asyncHandler.middleware.js  # Wraps async routes to prevent crashes
│   │   ├── auth.middleware.js          # JWT verification
│   │   ├── requestId.middleware.js     # Request ID assignment
│   │   └── validate.middleware.js      # Zod schema validation
│   ├── models/
│   │   ├── user.model.js          # User database operations
│   │   ├── category.model.js      # Category database operations
│   │   ├── product.model.js       # Product database operations
│   │   ├── order.model.js         # Order database operations
│   │   ├── review.model.js        # Review operations + aggregations (NEW)
│   │   ├── wishlist.model.js      # Wishlist operations + $addToSet/$pull (NEW)
│   │   └── analytics.model.js     # Analytics aggregations (NEW)
│   ├── routes/
│   │   ├── auth.routes.js         # Auth route definitions
│   │   ├── user.routes.js         # User route definitions
│   │   ├── category.routes.js     # Category route definitions
│   │   ├── product.routes.js      # Product route definitions
│   │   ├── order.routes.js        # Order route definitions
│   │   ├── review.routes.js       # Review route definitions (NEW)
│   │   ├── wishlist.routes.js     # Wishlist route definitions (NEW)
│   │   └── analytics.routes.js    # Analytics route definitions (NEW)
│   ├── services/
│   │   ├── auth.service.js        # Auth business logic
│   │   ├── user.service.js        # User business logic
│   │   ├── category.service.js    # Category business logic
│   │   ├── product.service.js     # Product business logic
│   │   ├── order.service.js       # Order business logic
│   │   ├── review.service.js      # Review business logic (NEW)
│   │   ├── wishlist.service.js    # Wishlist business logic (NEW)
│   │   └── analytics.service.js   # Analytics business logic (NEW)
│   ├── utils/
│   │   ├── logger.js              # Winston logger with HTTP middleware
│   │   ├── jwt.util.js            # JWT generation/verification
│   │   ├── password.util.js       # bcrypt hash/compare
│   │   └── validation.schema.js   # Zod schemas for all routes
│   ├── app.js                     # Express app setup & middleware
│   └── server.js                  # Bootstrap + graceful shutdown + recovery
├── api-testing/                    # REST Client test files
│   ├── api.rest                   # Master test suite
│   ├── auth.rest                  # Authentication tests
│   ├── users.rest                 # User API tests
│   ├── categories.rest            # Category API tests
│   ├── products.rest              # Product API tests
│   ├── orders.rest                # Order API tests
│   ├── reviews.rest               # Review API tests (NEW)
│   ├── wishlist.rest              # Wishlist API tests (NEW)
│   └── analytics.rest             # Analytics API tests (NEW)
├── logs/                          # Auto-generated log files
│   ├── app.log                    # All logs (JSON)
│   ├── error.log                  # Error-only logs (JSON)
│   ├── http.log                   # HTTP request logs (JSON)
│   ├── exceptions.log             # Uncaught exceptions
│   └── rejections.log             # Unhandled rejections
├── .env                           # Environment variables
├── .gitignore
├── nodemon.json                   # Nodemon configuration
├── package.json
└── pnpm-lock.yaml
```

---

## Architecture

### Layered Design

```
Request → Routes → Middleware → Controller → Service → Model → Database
                              ↓
                        Validation
                        (Zod)
```

1. **Routes** - Define HTTP methods, paths, and which middleware/controller handles each
2. **Middleware** - Cross-cutting concerns (auth, validation, error wrapping)
3. **Controllers** - Handle HTTP request/response, format JSON responses
4. **Services** - Business logic, data transformation, orchestration
5. **Models** - Direct database operations (CRUD queries + aggregation pipelines)
6. **Utils** - Shared utilities (logger, JWT, password hashing, validation schemas)

### Co-Relational Modules (Advanced)

The application includes advanced modules demonstrating MongoDB co-relational patterns with proper type handling:

#### Reviews Module

- **Purpose**: Product rating and review system
- **MongoDB Operators**: `$lookup` (join users/products), `$group` + `$avg` (average rating), `$unwind`, `$sort`, `$skip`, `$limit`
- **Key Features**:
  - One review per user per product (enforced in service layer)
  - Automatic average rating calculation using aggregation
  - Joined queries to include user/product details

#### Wishlist Module

- **Purpose**: Many-to-many relationship between users and products
- **MongoDB Operators**: `$addToSet` (add unique items), `$pull` (remove items), `$lookup` (populate products with categories), `$in` (check membership), `$set` (update timestamps)
- **Key Features**:
  - Uses `$addToSet` to prevent duplicate products in wishlist
  - Maintains `updatedAt` timestamp on all modifications
  - Populated queries with category details

#### Analytics Module

- **Purpose**: Business intelligence and reporting
- **MongoDB Operators**: `$unwind`, `$multiply`, `$sum`, `$group`, `$sort`, `$limit`, `$lookup`, `$month`, `$match` with date ranges, `$toObjectId` (type conversion)
- **Key Features**:
  - Sales analytics with date range filtering
  - Top products by quantity sold and revenue (with proper ObjectId conversion)
  - Category-wise sales breakdown (multi-collection joins)
  - Monthly sales trends using `$month` operator
  - Dashboard combining multiple aggregations

### Request Flow

```
Client Request
    ↓
Express Middleware (JSON parsing, CORS)
    ↓
HTTP Logger (records method, URL, duration)
    ↓
Route Match
    ↓
Authentication Middleware (validates JWT token)
    ↓
Validation Middleware (validates request body against Zod schema)
    ↓
Controller (handles request, calls service)
    ↓
Service (business logic, calls model)
    ↓
Model (database query)
    ↓
Response back through layers
    ↓
Global Error Handler (if error occurs)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6+
- pnpm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd crud-express

# Install dependencies
pnpm install

# Copy and configure environment variables
cp .env.example .env
nano .env
```

### Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=crud-express
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
```

### Running the Server

```bash
# Development (with auto-restart)
pnpm run dev

# Production
pnpm run start
```

The server will start on `http://localhost:3000` (or your configured port).

### Health Check

```bash
curl http://localhost:3000/
# Response: { "statusCode": 200, "status": "ok", "message": "Server is Running" }
```

---

## Configuration

### Subpath Imports

The project uses Node.js subpath imports for clean internal imports:

```js
import logger from '#utils/logger.js';
import * as userModel from '#models/user.model.js';
import { authenticate } from '#middlewares/auth.middleware.js';
```

| Alias            | Path                  |
| ---------------- | --------------------- |
| `#utils/*`       | `./src/utils/*`       |
| `#routes/*`      | `./src/routes/*`      |
| `#models/*`      | `./src/models/*`      |
| `#services/*`    | `./src/services/*`    |
| `#controllers/*` | `./src/controllers/*` |
| `#middlewares/*` | `./src/middlewares/*` |
| `#config/*`      | `./src/config/*`      |

---

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Authentication (`/api/v1/auth`)

| Method | Endpoint         | Auth | Description                    |
| ------ | ---------------- | ---- | ------------------------------ |
| `POST` | `/auth/register` | No   | Register a new user            |
| `POST` | `/auth/login`    | No   | Login and get JWT token        |
| `GET`  | `/auth/whoami`   | Yes  | Get current authenticated user |

### Users (`/api/v1/users`)

**User Roles**: `buyer` (default), `seller`, `admin`

| Method   | Endpoint        | Auth | Description                            |
| -------- | --------------- | ---- | -------------------------------------- |
| `POST`   | `/users/create` | Yes  | Create a new user (with optional role) |
| `GET`    | `/users/`       | Yes  | List all users (paginated)             |
| `GET`    | `/users/:id`    | Yes  | Get user by ID                         |
| `PATCH`  | `/users/:id`    | Yes  | Update user (incl. role change)        |
| `DELETE` | `/users/:id`    | Yes  | Delete user                            |

### Categories (`/api/v1/categories`)

| Method   | Endpoint          | Auth | Description                 |
| -------- | ----------------- | ---- | --------------------------- |
| `POST`   | `/categories/`    | Yes  | Create a category           |
| `GET`    | `/categories/`    | Yes  | List categories (paginated) |
| `GET`    | `/categories/:id` | Yes  | Get category by ID          |
| `PATCH`  | `/categories/:id` | Yes  | Update category             |
| `DELETE` | `/categories/:id` | Yes  | Delete category             |

### Products (`/api/v1/products`)

| Method   | Endpoint        | Auth | Description                           |
| -------- | --------------- | ---- | ------------------------------------- |
| `POST`   | `/products/`    | Yes  | Create a product                      |
| `GET`    | `/products/`    | Yes  | List products (paginated, filterable) |
| `GET`    | `/products/:id` | Yes  | Get product by ID                     |
| `PATCH`  | `/products/:id` | Yes  | Update product                        |
| `DELETE` | `/products/:id` | Yes  | Delete product                        |

### Orders (`/api/v1/orders`)

**Dynamic Order Creation**: When creating an order, only provide `productId` and `quantity`. The system automatically:

- Fetches real product price, name from database
- Calculates item total and order total
- Validates stock availability
- Decreases product stock automatically

| Method   | Endpoint      | Auth | Description                                              |
| -------- | ------------- | ---- | -------------------------------------------------------- |
| `POST`   | `/orders/`    | Yes  | Create an order (dynamic - auto-fetches product details) |
| `GET`    | `/orders/`    | Yes  | List all orders (filterable)                             |
| `GET`    | `/orders/my`  | Yes  | Get current user's orders                                |
| `GET`    | `/orders/:id` | Yes  | Get order by ID                                          |
| `PATCH`  | `/orders/:id` | Yes  | Update order (status, address)                           |
| `DELETE` | `/orders/:id` | Yes  | Delete order                                             |

### Reviews (`/api/v1/reviews`) - NEW

**MongoDB Operators**: `$lookup`, `$group`, `$avg`, `$unwind`, `$match`, `$sort`, `$skip`, `$limit`

| Method   | Endpoint                      | Auth | Description                                                        |
| -------- | ----------------------------- | ---- | ------------------------------------------------------------------ |
| `POST`   | `/reviews/`                   | Yes  | Create a product review (1 per user per product)                   |
| `GET`    | `/reviews/`                   | Yes  | List all reviews (paginated)                                       |
| `GET`    | `/reviews/my`                 | Yes  | Get current user's reviews (joined with products)                  |
| `GET`    | `/reviews/product/:productId` | Yes  | Get reviews for a product (joined with users, includes avg rating) |
| `GET`    | `/reviews/:id`                | Yes  | Get review by ID                                                   |
| `PATCH`  | `/reviews/:id`                | Yes  | Update review (owner only)                                         |
| `DELETE` | `/reviews/:id`                | Yes  | Delete review (owner only, recalculates avg rating)                |

### Wishlist (`/api/v1/wishlist`) - NEW

**MongoDB Operators**: `$addToSet`, `$pull`, `$lookup`, `$in`, `$match`, `$unwind`

| Method   | Endpoint                      | Auth | Description                                                     |
| -------- | ----------------------------- | ---- | --------------------------------------------------------------- |
| `GET`    | `/wishlist/`                  | Yes  | Get user's wishlist (populated with product & category details) |
| `POST`   | `/wishlist/add`               | Yes  | Add product to wishlist (uses `$addToSet` for uniqueness)       |
| `DELETE` | `/wishlist/remove/:productId` | Yes  | Remove product from wishlist (uses `$pull`)                     |
| `DELETE` | `/wishlist/clear`             | Yes  | Clear entire wishlist                                           |
| `GET`    | `/wishlist/check/:productId`  | Yes  | Check if product is in wishlist (uses `$in`)                    |

### Analytics (`/api/v1/analytics`) - NEW

**MongoDB Operators**: `$unwind`, `$multiply`, `$sum`, `$group`, `$sort`, `$limit`, `$lookup`, `$month`, `$match`, `$first`, `$max`

| Method | Endpoint                        | Auth | Description                                                            |
| ------ | ------------------------------- | ---- | ---------------------------------------------------------------------- |
| `GET`  | `/analytics/dashboard`          | Yes  | Get combined dashboard stats (sales, top products, categories, trends) |
| `GET`  | `/analytics/sales`              | Yes  | Get sales analytics with optional date range (`?startDate=&endDate=`)  |
| `GET`  | `/analytics/top-products`       | Yes  | Get top-selling products (`?limit=10`)                                 |
| `GET`  | `/analytics/category-sales`     | Yes  | Get sales breakdown by category                                        |
| `GET`  | `/analytics/user-stats`         | Yes  | Get current user's order statistics                                    |
| `GET`  | `/analytics/user-stats/:userId` | Yes  | Get specific user's order statistics                                   |
| `GET`  | `/analytics/order-status`       | Yes  | Get order status distribution counts                                   |
| `GET`  | `/analytics/monthly-trend`      | Yes  | Get monthly sales trend (`?year=2026`)                                 |

---

## Authentication Flow

### 1. Register (with optional role)

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "username": "johndoe",
    "password": "password123",
    "role": "buyer"  # Optional: buyer (default), seller, or admin
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "status": "ok",
  "data": {
    "userId": "6789abcd...",
    "username": "johndoe",
    "name": "John Doe",
    "role": "buyer"
  }
}
```

### 2. Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
    "username": "johndoe",
    "password": "password123"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "status": "ok",
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": "6789abcd...",
      "username": "johndoe",
      "role": "buyer"
    }
  }
}
```

### 3. Use Token in Requests

```bash
GET /api/v1/users/
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Token Details

- **Algorithm**: HS256
- **Expiration**: 24 hours
- **Payload**: `{ userId, username }`

---

## Testing APIs

### Using .rest Files (VS Code REST Client)

1. Install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension
2. Open any file in `tests/`
3. Click "Send Request" above each request

### Recommended Test Order

1. `auth.rest` - Register and login first to get a token
2. `categories.rest` - Create categories (needed for products)
3. `products.rest` - Create products (needed for orders and reviews)
4. `orders.rest` - Create and manage orders
5. `reviews.rest` - Test review system with `$lookup` and `$avg` operators
6. `wishlist.rest` - Test wishlist with `$addToSet` and `$pull` operators
7. `analytics.rest` - Test analytics with aggregation pipelines
8. `users.rest` - Test user management

### Using curl

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","username":"john","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"password123"}'

# Get users (replace YOUR_TOKEN)
curl http://localhost:3000/api/v1/users/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Query Parameters

**Pagination** (available on all list endpoints):

```
?page=1&limit=10
```

**Filters**:

- Products: `?categoryId=...`
- Orders: `?status=pending`

---

## Logging System

### Console Output (Colorized)

Logs are colorized by level for easy identification:

```
2026-05-02 14:30:00 ℹ INFO  Server running on port 3000
2026-05-02 14:30:05 ⇄ HTTP  GET /api/v1/users/ - 200 (12ms)
2026-05-02 14:30:10 ⚠ WARN  Authentication failed
2026-05-02 14:30:15 ✗ ERROR  Uncaught Exception
  mongodb error: connection refused
  └─ metadata: {
       "stack": "Error: connection refused\n    at..."
     }
```

| Level   | Color   | Icon    | Use Case                                  |
| ------- | ------- | ------- | ----------------------------------------- |
| `error` | Red     | ✗ ERROR | Server errors, exceptions                 |
| `warn`  | Yellow  | ⚠ WARN  | Auth failures, validation errors, 404s    |
| `info`  | Green   | ℹ INFO  | Server start/stop, important events       |
| `http`  | Magenta | ⇄ HTTP  | Every HTTP request with status & duration |
| `debug` | Cyan    | ⚙ DEBUG | Development debugging info                |

### Log Files

All log files are stored in `logs/` as clean JSON (no ANSI color codes):

| File             | Contents                     |
| ---------------- | ---------------------------- |
| `app.log`        | All log entries              |
| `error.log`      | Error-level entries only     |
| `http.log`       | HTTP request logs            |
| `exceptions.log` | Uncaught exceptions          |
| `rejections.log` | Unhandled promise rejections |

### Using the Logger

```js
import logger from '#utils/logger.js';

// Basic
logger.info('Server started');
logger.error('Something broke');

// With metadata
logger.error('Database query failed', {
  stack: err.stack,
  query: 'SELECT * FROM users',
});

// HTTP logging (built-in middleware)
// Automatically logs: method, url, status, duration, ip, user-agent
```

---

## Error Handling

### Automatic Route Protection

All controllers are wrapped in `asyncHandler`, which:

- Catches unhandled async errors
- Logs the full error with stack trace and request context
- Passes the error to Express's global error handler
- **Never crashes the server**

### Global Error Handler

Located in `app.js`, the global error handler:

- Logs the full error details (stack, method, URL, body, query)
- Returns a clean JSON error response
- Hides stack traces in production

### Server Recovery

The server handles these scenarios without crashing:

| Scenario            | Behavior                                        |
| ------------------- | ----------------------------------------------- |
| Uncaught Exception  | Logged, server continues running                |
| Unhandled Rejection | Logged, server continues running                |
| Port in Use         | Retries after 5 seconds                         |
| SIGINT/SIGTERM      | Graceful shutdown (close connections, close DB) |

### Error Response Format

```json
{
  "error": "Validation failed",
  "details": [{ "field": "password", "message": "Password must be at least 6 characters" }]
}
```

---

## Validation

All POST/PATCH endpoints use Zod schemas for input validation:

```js
// Example: Product creation schema
{
    "name": "string (required)",
    "description": "string (optional)",
    "price": "number (positive, required)",
    "stock": "number (non-negative integer, required)",
    "categoryId": "string (required)"
}
```

Invalid requests return `400` with specific field-level error messages.

---

## Deployment

### Production Checklist

1. Change `JWT_SECRET` to a strong random value
2. Set `NODE_ENV=production`
3. Update `MONGODB_URI` to production database
4. Remove default credentials from `.env`
5. Use a process manager (pm2, systemd)

### With PM2

```bash
pnpm add -g pm2
pm2 start src/server.js --name crud-express
pm2 save
pm2 startup
```

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://user:pass@host:port/dbname?authSource=admin
DB_NAME=crud-express
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
```

---

## License

ISC
