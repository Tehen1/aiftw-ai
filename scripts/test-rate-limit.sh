#!/bin/bash

echo "Testing rate limiting..."
for i in {1..15}; do
    echo "\nRequest $i:"
    curl -i http://localhost:3000/api/test \
        -H "Content-Type: application/json" \
        2>/dev/null | grep -A 10 "HTTP/"
    sleep 0.5
done
