set -e

# ------------------------------------------------------------------
# This script reindexes all KnowledgeItem records into the search engine.
# It is deliberately defensive: any failure aborts the run and logs
# a clear message to STDOUT/STDERR.
# ------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "[INFO] Starting search index update at $(date)"

# Ensure required environment variables are present
if [[ -z "$DATABASE_URL" ]]; then
  echo "[ERROR] DATABASE_URL is not set"
  exit 1
fi

if [[ -z "$SEARCH_ENDPOINT" ]]; then
  echo "[ERROR] SEARCH_ENDPOINT is not set"
  exit 1
fi

# Pull all knowledge items (using psql for simplicity)
# In a real system this would be a proper service call.
psql "$DATABASE_URL" -Atc "
SELECT json_build_object(
  'id', id,
  'title', title,
  'content', content,
  'created_at', created_at,
  'updated_at', updated_at
) FROM knowledge_items;
" > /tmp/knowledge_items.json

if [[ ! -s /tmp/knowledge_items.json ]]; then
  echo "[WARN] No knowledge items found to index."
  exit 0
fi

# Send bulk request to the search endpoint
curl -s -X POST "$SEARCH_ENDPOINT/bulk-index" \
  -H "Content-Type: application/json" \
  --data-binary @/tmp/knowledge_items.json \
  -w "\n[INFO] HTTP status: %{http_code}\n"

echo "[INFO] Search index update completed at $(date)"
