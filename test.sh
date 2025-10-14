#!/bin/bash

# Stop and clean up everything
echo "Cleaning up previous containers..."
docker rm -f crag-mongo crag-redis crag-app 2>/dev/null
docker network rm crag-net 2>/dev/null

# Create fresh network
echo "Creating network..."
docker network create crag-net

# Start databases
echo "Starting databases..."
docker run -d --name crag-mongo --network crag-net \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secure123 \
  -e MONGO_INITDB_DATABASE=crag_global \
  mongo:7

docker run -d --name crag-redis --network crag-net \
  redis:7-alpine

# Wait for databases
echo "Waiting for databases to be ready..."
sleep 8

# Build the frontend
echo "Building frontend..."
npm run build

# Rebuild Docker image with the fixed server
echo "Building Docker image..."
docker build -f Dockerfile.production -t crag-global:latest .

# Generate JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# Run the application
echo "Starting application..."
docker run -d --name crag-app --network crag-net -p 4000:4000 \
  -e NODE_ENV=production \
  -e HOST=0.0.0.0 \
  -e PORT=4000 \
  -e JWT_SECRET="$JWT_SECRET" \
  -e FRONTEND_ORIGIN=http://localhost:4000 \
  -e MONGODB_URI='mongodb://admin:secure123@crag-mongo:27017/crag_global?authSource=admin' \
  -e REDIS_URL=redis://crag-redis:6379 \
  crag-global:latest

# Wait and check status
echo "Waiting for app to initialize..."
sleep 10

# Check if it's running
if docker ps | grep -q crag-app; then
    echo "✅ Container is running"
    echo "Checking application logs:"
    docker logs crag-app --tail=10

    echo "Testing health endpoint..."
    curl -f http://localhost:4000/api/health && \
        echo "✅ App is running successfully!" || \
        (echo "❌ Health check failed. Checking logs..." && docker logs crag-app)
else
    echo "❌ Container failed to start. Full logs:"
    docker logs crag-app
fi
