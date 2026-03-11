# DocReader - OCR Document Reader

A full-stack web application that extracts text from images using OCR (Optical Character Recognition). Upload images through a clean React UI and get back extracted text, summaries, keywords, and confidence scores — powered by Tesseract OCR and NLTK on the backend.

---

## Features

- **Image OCR** — Upload images (PNG, JPG, GIF, WebP, BMP, TIFF) and extract text instantly
- **Text Summarisation** — Get an extractive summary, word count, sentence count, and top keywords (NLTK)
- **Detailed OCR** — Word-level bounding boxes and confidence scores
- **Batch Processing** — Upload multiple images at once
- **Responsive UI** — Mobile-friendly slide-in navigation and adaptive layout
- **Copy to Clipboard** — One-click copy of extracted text

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| Tailwind CSS 4 | Styling |
| React Router 7 | Client-side routing |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| Pytesseract | Tesseract OCR wrapper |
| Pillow | Image processing |
| NLTK | Text tokenisation, summarisation, keyword extraction |
| python-multipart | File upload handling |

---

## Project Structure

```
OCR-project/
├── src/                        # React frontend
│   ├── api/
│   │   └── ocr.js              # API client functions
│   ├── assets/
│   │   └── logo.png            # App logo
│   ├── components/
│   │   ├── Hero.jsx            # Home page with inline OCR
│   │   ├── Navbar.jsx          # Responsive navigation bar
│   │   ├── OcrPage.jsx         # Dedicated OCR page
│   │   └── OcrResults.jsx      # OCR results display component
│   ├── App.jsx                 # Route definitions
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles
├── backend/                    # FastAPI backend
│   ├── main.py                 # App entry, CORS, lifespan
│   ├── routers/
│   │   └── ocr.py              # OCR API endpoints
│   ├── services/
│   │   └── ocr_service.py      # Tesseract OCR logic
│   ├── utils/
│   │   └── text_processing.py  # NLTK text processing
│   └── requirements.txt        # Python dependencies
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **Python** >= 3.10
- **Tesseract OCR** installed on your system

```bash
# macOS
brew install tesseract

# Ubuntu/Debian
sudo apt install tesseract-ocr

# Windows — download installer from:
# https://github.com/UB-Mannheim/tesseract/wiki
```

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Devaditya-Suuu/OCR-project.git
cd OCR-project
```

**2. Set up the frontend**

```bash
npm install
```

**3. Set up the backend**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # macOS/Linux
# venv\Scripts\activate       # Windows
pip install -r requirements.txt
```

### Running the App

**Terminal 1 — Backend (port 8000)**

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend (port 5173)**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/ocr` | Extract text from a single image |
| `POST` | `/api/ocr/detailed` | OCR with word-level data & confidence |
| `POST` | `/api/ocr/summarise` | OCR + NLP summary & keywords |
| `POST` | `/api/ocr/batch` | Extract text from multiple images |

Interactive API docs available at [http://localhost:8000/docs](http://localhost:8000/docs) when the backend is running.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL (frontend) |

---

## License

This project is open source and available under the [MIT License](LICENSE).
