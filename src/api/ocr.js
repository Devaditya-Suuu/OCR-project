const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Send a single image file to the OCR endpoint and get back extracted text.
 */
export async function ocrSimple(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/api/ocr`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'OCR request failed');
  }

  return res.json();
}

/**
 * Detailed OCR – returns word-level data with bounding boxes & confidence.
 */
export async function ocrDetailed(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/api/ocr/detailed`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Detailed OCR request failed');
  }

  return res.json();
}

/**
 * OCR + NLP summarisation – returns extracted text, summary, keywords, stats.
 */
export async function ocrSummarise(file, numSentences = 5) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(
    `${API_BASE_URL}/api/ocr/summarise?num_sentences=${numSentences}`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Summarise request failed');
  }

  return res.json();
}

/**
 * Batch OCR – send multiple image files at once.
 */
export async function ocrBatch(files) {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const res = await fetch(`${API_BASE_URL}/api/ocr/batch`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Batch OCR request failed');
  }

  return res.json();
}

/**
 * Health check.
 */
export async function healthCheck() {
  const res = await fetch(`${API_BASE_URL}/health`);
  return res.json();
}
