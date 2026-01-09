# Docker Setup

Run the backend API in a Docker container with persistent database storage.

## Prerequisites

- Docker Desktop installed and running

## Quick Start with Docker Compose (Recommended)

```bash
cd api

# Start the API
docker compose up -d

# With a custom JWT secret
JWT_SECRET=your-secure-secret docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

For production, create a `.env` file:

```bash
echo "JWT_SECRET=your-secure-secret-here" > .env
docker compose up -d
```

## Manual Docker Build & Run

### Build the Docker Image

```bash
cd api
docker build -t feature-voting-api .
```

### Run the Container

```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -e JWT_SECRET=your-secret-key-here \
  --name feature-voting-api \
  feature-voting-api
```

**Important**: Replace `your-secret-key-here` with a secure secret key.

## Container Details

- **Port**: 3000 (mapped to host)
- **Volume**: `./data` directory persists the SQLite database
- **Database**: Stored in `/app/data/features.db` inside container, `api/data/features.db` on host
- **Environment**: `JWT_SECRET` must be set for authentication

## Container Management

### Docker Compose Commands

```bash
# View logs
docker compose logs -f

# Stop containers
docker compose down

# Restart containers
docker compose restart

# Rebuild and restart
docker compose up -d --build
```

### Manual Docker Commands

```bash
# View logs
docker logs -f feature-voting-api

# Stop container
docker stop feature-voting-api

# Start container
docker start feature-voting-api

# Remove container
docker rm feature-voting-api

# Rebuild and restart
docker stop feature-voting-api
docker rm feature-voting-api
docker build -t feature-voting-api .
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -e JWT_SECRET=your-secret-key-here \
  --name feature-voting-api \
  feature-voting-api
```

## Database Persistence

The database file `features.db` is stored in `api/data/` on your host machine and persists even if you stop/remove the container.

## Troubleshooting

### Container Won't Start

- Check if port 3000 is already in use: `lsof -ti:3000`
- Check Docker logs: `docker logs feature-voting-api`
- Ensure Docker Desktop is running

### Database Not Persisting

- Verify volume mount: `docker inspect feature-voting-api | grep Mounts`
- Check `api/data/` directory exists and is writable
