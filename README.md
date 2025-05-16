# 🛒 Multi-Database eCommerce API

A scalable and modular eCommerce backend built with **Node.js** and **Express**, supporting multiple databases including **MongoDB** and **MySQL**. This project follows clean architecture principles with clear separation of concerns between configuration, models, repositories, services, and routes.

---

## 📦 Features

- 🔐 JWT-based authentication and refresh tokens
- 🔑 API key management
- 🛍 Product catalog (Clothing, Electronics, Furniture)
- 🛒 Shopping cart system
- 🎟 Discount and promotion management
- 📦 Inventory tracking
- 🏪 Shop and user management
- 🧩 Middleware-driven request validation
- 🌐 Modular route handling
- ☁ Environment-based configuration support

---

## 🧱 Project Structure

```plaintext
src/
├─ config/          # Environment, DB, and JWT configuration
├─ controllers/     # Handle API logic for each route
├─ database/        # DB connection factories (Mongo, MySQL)
├─ helpers/         # Utility helpers (e.g., async error wrapper)
├─ middlewares/     # Validators and error handlers
├─ models/          # Mongoose/Sequelize models and constants
├─ repositories/    # Data access abstraction layer
├─ routes/          # API route definitions
├─ services/        # Business logic layer
├─ utils/           # HTTP, JWT, response formatting utilities
├─ app.js           # Express app setup
└─ server.js        # Entry point and server configuration
```

---

## 🧪 Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **MySQL (Sequelize or native driver)**
- **JWT (jsonwebtoken)**
- **dotenv** for environment management
- **Custom error handling and response utils**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ecommerce-api.git
```
### 2. Install dependecies and run app
```bash
cd ecommerce-api

npm install
```
### 3. Run app
```bash
npm start
```

