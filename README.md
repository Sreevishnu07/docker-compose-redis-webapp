# Multi-Container Web Application with Docker Compose

A practical DevOps project demonstrating container orchestration with **Nginx**, **Node.js**, and **Redis** — wired together using Docker Compose with persistent storage, internal networking, and automatic restarts.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Volumes & Persistence](#volumes--persistence)

---

## Overview

This project showcases a production-style multi-container setup where:

- **Nginx** serves as the frontend reverse proxy on port `3000`
- **Node.js** handles backend API logic on port `5000`
- **Redis** persists data using AOF (Append-Only File) logging

All containers communicate over a shared internal Docker network, with Redis data surviving container restarts via named volumes.

---

## Architecture

```
                        ┌─────────────────────────────────────────┐
                        │           Docker Network                │
                        │                                         │
   Browser ────────►  Nginx      ────────►  Node.js  ────────►  Redis
          port 3000  (Frontend)  port 5000  (Backend)           (Cache/DB)
                        │                                         │
                        └─────────────────────────────────────────┘
                                          │
                                    Named Volume
                                   (Redis AOF data)
```

---

## Tech Stack

| Layer     | Technology        | Purpose                       |
|-----------|-------------------|-------------------------------|
| Proxy     | Nginx             | Frontend / Reverse Proxy      |
| Backend   | Node.js           | REST API                      |
| Database  | Redis             | Persistence & Visit Counter   |
| DevOps    | Docker Compose    | Container Orchestration       |

---

## Features

- **Multi-container orchestration** via Docker Compose
- **Internal container networking** — services communicate by name
- **Redis AOF persistence** — data survives restarts
- **Named Docker volumes** for durable storage
- **Restart policies** — containers auto-recover on failure
- **Visit counter** backed by Redis

---

## Project Structure

```
.
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── index.js
└── README.md
```

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) v20+
- [Docker Compose](https://docs.docker.com/compose/install/) v2+

### Run the Application

```bash
# Clone the repository
git clone <your-repo-url>
cd <project-folder>

# Build and start all containers
docker compose up --build

# Run in detached (background) mode
docker compose up --build -d
```

### Stop the Application

```bash
# Stop containers (preserves volumes)
docker compose down

# Stop and remove volumes (wipes Redis data)
docker compose down -v
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
```

---

## Access

| Service      | URL                            |
|--------------|--------------------------------|
| Frontend     | http://localhost:3000          |
| Backend API  | http://localhost:5000/api      |

---

## API Reference

### `GET /api`

Returns a welcome message and the current Redis-backed visit count.

**Response**

```json
{
  "message": "Hello from Node.js backend!",
  "visits": 42
}
```

---

## Configuration

Key settings in `docker-compose.yml`:

```yaml
services:
  nginx:
    restart: unless-stopped
    ports:
      - "3000:80"

  backend:
    restart: unless-stopped
    ports:
      - "5000:5000"
    depends_on:
      - redis

  redis:
    restart: always
    command: redis-server --appendonly yes   
```

---

## Volumes & Persistence

Redis data is stored in a named Docker volume, ensuring visit counts and any cached data survive container restarts:

```yaml
volumes:
  redis-data:
    driver: local
```

Data is written using **AOF (Append-Only File)** mode — every write operation is logged for durability.

---
