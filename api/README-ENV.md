# Environment Variables

Configuration for the Feature Voting API backend.

## Required Variables

### JWT_SECRET

Secret key used to sign and verify JWT tokens. **Must be set** for authentication to work.

**Security Note**: Use a strong, random secret key in production. Never commit this to version control.

**Local Development**:

Create `api/.env` file:
```
JWT_SECRET=your-secret-key-here-change-in-production
```

Or set as environment variable:
```bash
export JWT_SECRET=your-secret-key-here
```

**Docker**:

Set when running container:
```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -e JWT_SECRET=your-secret-key-here \
  --name feature-voting-api \
  feature-voting-api
```

## Optional Variables

### DB_PATH

Path to the SQLite database file. Defaults to `./features.db` if not set.

**Local Development**:
```
DB_PATH=./features.db
```

**Docker**:
The Dockerfile sets `DB_PATH=/app/data/features.db` by default. This is where the volume is mounted.

## Example .env File

Create `api/.env`:

```
JWT_SECRET=my-super-secret-jwt-key-change-this-in-production
DB_PATH=./features.db
```

## Loading Environment Variables

The application reads environment variables from:
1. System environment variables
2. `.env` file (if using a package like `dotenv` - not currently configured)
3. Docker environment variables (when running in container)

For local development, set variables before running:
```bash
export JWT_SECRET=test-secret-key
export DB_PATH=./features.db
npm start
```
