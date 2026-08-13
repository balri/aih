#!/bin/bash

ENDPOINT="https://aih-rose.vercel.app/api/cron/refresh-testimonials"

start=$(date +%s)
body=$(mktemp)

cleanup() {
  rm -f "$body"
  end=$(date +%s)
  elapsed=$((end - start))
  echo "Script runtime: ${elapsed} seconds"
}
trap cleanup EXIT

status=$(curl -Ls -o "$body" -w "%{http_code}" -H "Authorization: Bearer $CRON_SECRET" "$ENDPOINT")

if [ "$status" -eq 200 ]; then
  echo "Testimonials: $(cat "$body")"
else
  echo "Failed to fetch: HTTP $status"
  exit 1
fi
