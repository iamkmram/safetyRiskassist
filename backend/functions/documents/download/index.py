"""
Azure Function entry point for downloading documents.
"""

def download(req) -> dict:
    """
    Handles a document download request.

    Expected query parameters:
        ?file_id=<identifier>

    Returns a JSONserialisable dict with a placeholder download URL.
    """
    try:
        file_id = req.params.get("file_id")
        if not file_id:
            raise ValueError("Missing 'file_id' parameter")
        # Placeholder: in a real system you would locate the file and generate a SAS URL.
        download_url = f"https://example.blob.core.windows.net/documents/{file_id}"
        return {"status": "success", "download_url": download_url}
    except Exception as e:
        return {"status": "error", "message": str(e)}
