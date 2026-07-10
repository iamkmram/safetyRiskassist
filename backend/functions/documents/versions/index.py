"""
Azure Function entry point for retrieving document versions.
"""

def versions(req) -> dict:
    """
    Returns a list of version metadata for a given document.

    Expected query parameters:
        ?document_id=<identifier>

    Returns a JSONserialisable dict containing an array of version info.
    """
    try:
        document_id = req.params.get("document_id")
        if not document_id:
            raise ValueError("Missing 'document_id' parameter")
        # Placeholder: pretend we have three versions.
        version_list = [
            {"version": 1, "created_at": "2023-01-01T12:00:00Z"},
            {"version": 2, "created_at": "2023-06-15T09:30:00Z"},
            {"version": 3, "created_at": "2024-02-20T16:45:00Z"},
        ]
        return {"status": "success", "document_id": document_id, "versions": version_list}
    except Exception as e:
        return {"status": "error", "message": str(e)}
