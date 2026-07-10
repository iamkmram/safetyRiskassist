"""
Azure Function entry point for uploading documents.
"""

def upload(req) -> dict:
    """
    Handles a document upload request.

    Expected request shape (simplified):
        {
            "file_name": "example.pdf",
            "content": "<base64-encoded bytes>"
        }

    Returns a JSONserialisable dict with upload status.
    """
    # In a real implementation you would decode the content,
    # store the file (e.g., in Blob storage), and record metadata.
    # Here we simply echo back the received file name.
    try:
        body = req.get_json()
        file_name = body.get("file_name", "unknown")
        # Placeholder: pretend we stored the file successfully.
        return {"status": "success", "file_name": file_name}
    except Exception as e:
        return {"status": "error", "message": str(e)}
