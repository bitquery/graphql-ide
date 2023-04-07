#!/bin/sh

set -e

cp -r /app/build/* /app/static

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
