import uuid
from typing import Dict, Any, List

class DocumentService:
    """
    Simple inmemory document service.
    Stores documents and their version history in a classlevel dictionary.
    In a real deployment this would integrate with Azure Blob Storage,
    Cosmos DB, etc.
    """
    _store: Dict[str, Dict[str, Any]] = {}

    def __init__(self):
        pass

    def upload_document(self, file_obj, metadata: Dict[str, Any]) -> str:
        """Store a new document and return its generated ID."""
        doc_id = str(uuid.uuid4())
        content = file_obj.read()
        version = {
            "content": content,
            "metadata": metadata,
            "version_number": 1,
        }
        self._store[doc_id] = {"versions": [version]}
        return doc_id

    def download_document(self, doc_id: str, version_number: int = None) -> Dict[str, Any]:
        """Retrieve a document version. Returns latest if version_number is None."""
        doc = self._store.get(doc_id)
        if not doc:
            raise ValueError("Document not found")
        versions = doc["versions"]
        if version_number is None:
            version = versions[-1]
        else:
            if version_number <= 0 or version_number > len(versions):
                raise ValueError("Invalid version number")
            version = versions[version_number - 1]
        return version

    def add_version(self, doc_id: str, file_obj, metadata: Dict[str, Any]) -> int:
        """Append a new version to an existing document."""
        doc = self._store.get(doc_id)
        if not doc:
            raise ValueError("Document not found")
        content = file_obj.read()
        version_number = len(doc["versions"]) + 1
        doc["versions"].append({
            "content": content,
            "metadata": metadata,
            "version_number": version_number,
        })
        return version_number

    def list_versions(self, doc_id: str) -> List[Dict[str, Any]]:
        """Return a summary list of all versions for a document."""
        doc = self._store.get(doc_id)
        if not doc:
            raise ValueError("Document not found")
        return [
            {
                "version_number": v["version_number"],
                "metadata": v["metadata"],
            }
            for v in doc["versions"]
        ]
