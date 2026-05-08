# Contextual Broadcast Service

A high-performance, real-time messaging service built with **Node.js**, **TypeScript**, and **Socket.io**. This project follows **Clean Architecture** principles and is fully **Dockerized** for seamless deployment.

## 🚀 Overview

This service handles real-time data broadcasting with contextual awareness, utilizing **Redis** for high-speed caching/presence management and **MySQL** for persistent data storage. It is designed to be integrated into larger ecosystems (like school management or chat platforms).

### Key Features

* **Real-time Communication:** Socket.io implementation with room-based broadcasting.
* **Clean Architecture:** Strict separation of concerns between Domain, Application, and Infrastructure layers.
* **Containerized:** Multi-container setup managed via Docker Compose.
* **Dual-Database Strategy:** MySQL for relational data and Redis for real-time presence tracking.
* **Strategy Pattern:** Dynamic relationship discovery for different user roles (Teacher, Student, Parent).

---

## 🏗 Architecture

The project follows a layered architecture to ensure maintainability and testability:

1. **Domain:** Core entities and repository interfaces (Strategy pattern implementation).
2. **Application:** Use cases that orchestrate the business logic (e.g., `ConnectUser`).
3. **Infrastructure:** External implementations (Database, Real-time server, Test Router).

---

## 🧪 Testing Suite

The project implements a comprehensive testing strategy following the **Testing Pyramid**, ensuring both logic isolation and system integration.

### 1. Unit Testing (Vitest)

Isolated tests for business logic using **Mocks** and **Stubs**.

* **Strategy Pattern Tests:** Verified `Teacher`, `Student`, and `Parent` relationship discovery logic using Table-Driven tests.
* **Use Case Tests:** Orchestration logic validation for user connections and broadcasts.
* **Repository Decision Logic:** Ensuring the `MySqlUserRepository` selects the correct strategy based on user roles.

### 2. Integration Testing

Automated scripts that verify the full communication cycle between the Database, Socket server, and Real-time clients.

* **Dev Backdrop:** A dedicated `/api/test/pair` endpoint (enabled only in `dev` mode) allows test scripts to dynamically discover valid test candidates from the DB.
* **Socket Lifecycle:** Real-time verification that an **Observer** correctly receives "User Online" notifications when a linked **Subject** joins.

---

## 🚦 Getting Started

### Prerequisites

* Docker & Docker Compose
* Node.js v20+ (for local development)

### Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/houssam15/contextual-broadcast-service.git
cd contextual-broadcast-service

```


2. **Configure Environment:**
```bash
cp .env.example .env

```


3. **Run with Docker:**
```bash
docker-compose up -d --build

```

---

## 🐳 Docker Image
The pre-built image for this release is available on Docker Hub:
[houssameli/broadcast-app:v1.1](https://hub.docker.com/r/houssameli/broadcast-app)

**Pull Command:**
`docker pull houssameli/broadcast-app:v1.1`

---

## 📜 Scripts

* `npm run dev`: Starts the application with `tsx` watch mode.
* `npm run test`: Executes the full **Unit Testing** suite via Vitest.
* `npm run test:integration`: Executes the end-to-end integration script to verify Socket.io flow.
* `npm run build`: Compiles TypeScript into the `dist` folder.

---

## 🛠 Development & Debugging

To facilitate integration testing without manual data entry, the service includes a **Test Router** accessible in development:

* **Endpoint:** `GET /api/test/pair`
* **Function:** Returns a valid relationship pair (Subject/Observer) from the current database state to prime automated tests.

---

### Author

**Houssam El Atmani**

* [Portfolio](https://elatmani.dev)
* [GitHub](https://github.com/houssam15)
* [LinkedIn](https://www.linkedin.com/in/el-atmani-houssam)
