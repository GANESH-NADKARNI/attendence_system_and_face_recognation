# School Attendance Management System

A full-stack attendance management system powered by facial recognition technology. The platform enables automated attendance tracking through a web interface, backend API, and dedicated face recognition service.

## Features

* Automated attendance marking using facial recognition
* Student registration and management
* Secure authentication using JWT
* MySQL database integration
* Dockerized deployment
* Scalable microservice architecture
* RESTful API backend
* Modern web-based frontend

---

## Tech Stack

### Frontend

* HTML/CSS/JavaScript
* Nginx

### Backend

* Node.js
* Express.js
* JWT Authentication

### Face Recognition Service

* Python
* OpenCV
* Face Recognition Libraries

### Database

* MySQL 8.0

### DevOps

* Docker
* Docker Compose

---

## Project Structure

```text
.
├── backend/
│   ├── Dockerfile
│   └── ...
├── frontend/
│   ├── Dockerfile
│   └── ...
├── face-recognition-service/
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Environment Variables

Create a `.env` file in the project root directory.

### .env

```env
# Database Configuration
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=school_attendance
MYSQL_USER=attendance_user
MYSQL_PASSWORD=YourStrongPassword123!

# Backend Configuration
DB_HOST=db
DB_USER=attendance_user
DB_PASSWORD=YourStrongPassword123!
DB_NAME=school_attendance

# Authentication
JWT_SECRET=your_super_secret_jwt_key_that_is_long_and_random

# Face Recognition Service
FACE_SERVICE_URL=http://face-service:5001
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/GANESH-NADKARNI/attendence_system_and_face_recognation.git
cd attendence_system_and_face_recognation
```

### 2. Create Environment File

```bash
cp .env.example .env
```

Update the values inside `.env` if required.

### 3. Build and Start Services

```bash
docker compose up --build -d
```

Docker will:

* Build the frontend image
* Build the backend image
* Build the face recognition service image
* Start MySQL database
* Create the required Docker network

---

## Services

| Service                  | Port |
| ------------------------ | ---- |
| Frontend                 | 80   |
| Backend API              | 5000 |
| Face Recognition Service | 5001 |
| MySQL Database           | 3307 |

---

## Access URLs

```text
Frontend:
http://localhost

Backend API:
http://localhost:5000

Face Recognition Service:
http://localhost:5001

MySQL:
localhost:3307
```

---

## Database Configuration

Default database settings:

```env
MYSQL_DATABASE=school_attendance
MYSQL_USER=attendance_user
MYSQL_PASSWORD=YourStrongPassword123!
MYSQL_ROOT_PASSWORD=rootpassword
```

Database data is persisted using Docker volumes:

```yaml
volumes:
  mysql-data:
```

This ensures data remains available after container restarts.

---

## Container Management

### View Running Containers

```bash
docker compose ps
```

### View Logs

All Services

```bash
docker compose logs -f
```

Backend

```bash
docker compose logs -f backend
```

Frontend

```bash
docker compose logs -f frontend
```

Face Recognition Service

```bash
docker compose logs -f face-service
```

Database

```bash
docker compose logs -f db
```

---

## Rebuild Services

Rebuild all services:

```bash
docker compose up --build -d
```

Rebuild a specific service:

```bash
docker compose build backend
docker compose build frontend
docker compose build face-service
```

---

## Stop Services

Stop containers:

```bash
docker compose down
```

Stop containers and remove volumes:

```bash
docker compose down -v
```

---

## Internal Architecture

```text
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Backend   │
└───┬─────┬───┘
    │     │
    ▼     ▼
 MySQL  Face Service
```

Service Communication:

```text
Frontend → Backend
Backend → Database
Backend → Face Recognition Service
Face Recognition Service → Database
```

---

## Health Checks

The application includes MySQL health checks to ensure dependent services start only after the database is ready.

```yaml
depends_on:
  db:
    condition: service_healthy
```

This prevents startup race conditions.

---

## Security Notes

Before deploying to production:

* Replace default passwords with strong credentials.
* Generate a secure JWT secret.
* Restrict database port exposure if not required.
* Enable HTTPS using a reverse proxy.
* Never commit `.env` files containing secrets.

Add the following to `.gitignore`:

```gitignore
.env
node_modules/
__pycache__/
*.log
```

---

## Quick Start

```bash
git clone <repository-url>
cd <repository-name>

cp .env.example .env

docker compose up --build -d

docker compose ps
```

Open:

```text
http://localhost
```

to access the School Attendance Management System.

---

## License

This project is licensed under the MIT License.

## Contributors

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit a pull request.
