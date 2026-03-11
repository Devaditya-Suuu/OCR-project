"""OCR service – extracts text from images using Pytesseract / Pillow."""

from io import BytesIO

import pytesseract
from PIL import Image


def extract_text_from_image(image_bytes: bytes) -> str:
    """Run Tesseract OCR on raw image bytes and return the extracted text."""
    image = Image.open(BytesIO(image_bytes))

    # Convert to RGB if the image has an alpha channel or is in a different mode
    if image.mode not in ("L", "RGB"):
        image = image.convert("RGB")

    text: str = pytesseract.image_to_string(image)
    return text.strip()


def extract_text_with_details(image_bytes: bytes) -> dict:
    """Run OCR and return rich output including word-level confidence data."""
    image = Image.open(BytesIO(image_bytes))

    if image.mode not in ("L", "RGB"):
        image = image.convert("RGB")

    # Plain text
    text: str = pytesseract.image_to_string(image).strip()

    # Word-level data with bounding boxes and confidence
    data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)

    words = []
    for i, word in enumerate(data["text"]):
        word = word.strip()
        if word:
            words.append(
                {
                    "text": word,
                    "confidence": data["conf"][i],
                    "left": data["left"][i],
                    "top": data["top"][i],
                    "width": data["width"][i],
                    "height": data["height"][i],
                }
            )

    avg_confidence = (
        sum(w["confidence"] for w in words) / len(words) if words else 0.0
    )

    return {
        "text": text,
        "words": words,
        "average_confidence": round(avg_confidence, 2),
        "image_size": {"width": image.width, "height": image.height},
    }
