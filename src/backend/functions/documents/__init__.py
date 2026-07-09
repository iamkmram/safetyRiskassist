from fastapi import APIRouter, HTTPException, UploadFile, File

router = APIRouter(prefix="/documents", tags=["documents"])

@router.get("/", summary="List all documents")
async def list_documents():
    # Placeholder implementation - return empty list
    return {"documents": []}

@router.post("/upload", summary="Upload a new document")
async def upload_document(file: UploadFile = File(...)):
    # Real implementation will store to Azure Blob Storage
    raise HTTPException(status_code=501, detail="Not implemented yet")
