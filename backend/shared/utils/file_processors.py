"""
Utility module for processing uploaded files.
"""

def process_file(file_path: str) -> dict:
    """
    Process the given file and extract basic metadata.

    Args:
        file_path (str): Path to the file on disk.

    Returns:
        dict: A dictionary containing extracted metadata such as
              filename, size (bytes) and a placeholder for content type.
    """
    import os

    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    metadata = {
        "filename": os.path.basename(file_path),
        "size_bytes": os.path.getsize(file_path),
        "content_type": "application/octet-stream",  # default; real logic can improve this
    }
    # Placeholder for actual processing (e.g., OCR, PDF parsing, etc.)
    return metadata
