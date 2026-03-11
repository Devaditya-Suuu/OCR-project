"""API routes for OCR operations."""

from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

from services.ocr_service import extract_text_from_image, extract_text_with_details
from utils.text_processing import summarise_text

router = APIRouter(tags=["OCR"])

SUPPORTED_IMAGE_TYPES = {
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/tiff",
}


@router.post("/ocr")
async def ocr_simple(file: UploadFile = File(...)):
    """Upload an image and get back the extracted text."""
    if file.content_type not in SUPPORTED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. "
            f"Supported types: {', '.join(sorted(SUPPORTED_IMAGE_TYPES))}",
        )

    try:
        contents = await file.read()
        text = extract_text_from_image(contents)
        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "extracted_text": text,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")


@router.post("/ocr/detailed")
async def ocr_detailed(file: UploadFile = File(...)):
    """Upload an image and get detailed OCR output (word-level data + confidence)."""
    if file.content_type not in SUPPORTED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. "
            f"Supported types: {', '.join(sorted(SUPPORTED_IMAGE_TYPES))}",
        )

    try:
        contents = await file.read()
        result = extract_text_with_details(contents)
        result["filename"] = file.filename
        result["content_type"] = file.content_type
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")


@router.post("/ocr/summarise")
async def ocr_summarise(file: UploadFile = File(...), num_sentences: int = 5):
    """Upload an image, extract text via OCR, then return an NLP summary."""
    if file.content_type not in SUPPORTED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. "
            f"Supported types: {', '.join(sorted(SUPPORTED_IMAGE_TYPES))}",
        )

    try:
        contents = await file.read()
        text = extract_text_from_image(contents)
        summary = summarise_text(text, num_sentences=num_sentences)
        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "extracted_text": text,
            **summary,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@router.post("/ocr/batch")
async def ocr_batch(files: list[UploadFile] = File(...)):
    """Upload multiple images and get extracted text for each."""
    results = []
    for file in files:
        if file.content_type not in SUPPORTED_IMAGE_TYPES:
            results.append(
                {
                    "filename": file.filename,
                    "error": f"Unsupported file type: {file.content_type}",
                }
            )
            continue

        try:
            contents = await file.read()
            text = extract_text_from_image(contents)
            results.append(
                {
                    "filename": file.filename,
                    "content_type": file.content_type,
                    "extracted_text": text,
                }
            )
        except Exception as e:
            results.append({"filename": file.filename, "error": str(e)})

    return {"results": results, "total": len(results)}
