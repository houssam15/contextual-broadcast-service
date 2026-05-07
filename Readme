# Contextual Broadcast Service

A high-performance, real-time messaging service built with **Node.js**, **TypeScript**, and **Socket.io**. This project follows **Clean Architecture** principles and is fully **Dockerized** for seamless deployment.

## 🚀 Overview
This service handles real-time data broadcasting with contextual awareness, utilizing **Redis** for high-speed caching/presence management and **MySQL** for persistent data storage. It is designed to be integrated into larger ecosystems (like school management or chat platforms).

### Key Features
* **Real-time Communication:** Socket.io implementation with room-based broadcasting.
* **Clean Architecture:** Separation of concerns between Domain, Application, and Infrastructure layers.
* **Containerized:** Multi-container setup using Docker Compose.
* **Dual-Database Strategy:** MySQL for relational data and Redis for real-time presence/caching.
* **Environment Agnostic:** Dynamic configuration handling for Dev, Prod, and Docker environments.

---

## 🛠 Tech Stack
* **Runtime:** [Node.js](https://nodejs.org/) (v20+)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Real-time:** [Socket.io](https://socket.io/)
* **Database:** [MySQL 8.0](https://www.mysql.com/)
* **Caching/Presence:** [Redis](https://redis.io/)
* **DevOps:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## 🏗 Architecture
The project follows a layered architecture to ensure maintainability and testability:
1.  **Domain:** Core entities and repository interfaces.
2.  **Application:** Use cases that orchestrate the flow of data.
3.  **Infrastructure:** Implementation details (Database, Real-time server, Config).

---

## 🚦 Getting Started

### Prerequisites
* Docker & Docker Compose
* (Optional) Node.js installed locally for development

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/houssam15/contextual-broadcast-service.git
    cd contextual-broadcast-service
    ```

2.  **Configure Environment:**
    Create a `.env` file based on the example:
    ```bash
    cp .env.example .env
    ```
    *Update the `.env` file with your local credentials (DB host, ports, etc.).*

3.  **Run with Docker:**
    The project is configured to run in a containerized environment.
    ```bash
    docker-compose up -d --build
    ```

4.  **Local Development:**
    If running outside of Docker:
    ```bash
    npm install
    npm run dev
    ```

---

## 🐳 Docker Workflow
This project utilizes a "Pass-Through" environment variable strategy, similar to the **Jitsi Meet** architecture. The `docker-compose.yml` acts as the single source of truth, injecting variables from the host's `.env` directly into the Node.js process.

### Service Network
* **App:** Listening on port `3000`
* **MySQL:** Integrated via external bridge or standalone container.
* **Redis:** Handled via internal Docker network.

---

## 📜 Scripts
* `npm run dev`: Starts the application with `tsx` watch mode for development.
* `npm start`: Runs the application using `tsx` (production/docker entry point).
* `npm run build`: Compiles TypeScript to JavaScript.

---

### Author
**Houssam elatmani**
* [GitHub](https://github.com/houssam15)
* [LinkedIn](www.linkedin.com/in/el-atmani-houssam)

