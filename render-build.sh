#!/usr/bin/env bash
# Exit on error
set -o errexit
set -o pipefail

# Print commands as they are executed
set -x

# Install dependencies
echo "=== Installing dependencies ==="
npm ci --prefer-offline --no-audit --progress=false

# Build the application
echo -e "\n=== Building client ==="
npm run build:client

echo -e "\n=== Building server ==="
npm run build:server

echo -e "\n=== Running post-build steps ==="
npm run postbuild:server

echo -e "\n=== Build completed successfully ==="
# Print disk usage for debugging
du -sh .
