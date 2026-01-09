# Docker Setup

Run the backend API in a Docker container with persistent database storage.

## Prerequisites

- Docker Desktop installed and running

## Build the Docker Image

```bash
cd api
docker build -t feature-voting-api .
```

## Run the Container

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

### View Logs

```bash
# Follow logs in real-time
docker logs -f feature-voting-api

# View last 50 lines
docker logs --tail 50 feature-voting-api
```

### Stop Container

```bash
docker stop feature-voting-api
```

### Start Container

```bash
docker start feature-voting-api
```

### Remove Container

```bash
docker rm feature-voting-api
```

### Rebuild and Restart

```bash
# Stop and remove existing container
docker stop feature-voting-api
docker rm feature-voting-api

# Rebuild image
docker build -t feature-voting-api .

# Run new container
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
