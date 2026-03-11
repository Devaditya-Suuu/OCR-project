import { useState, useRef } from 'react';
import { Plus, ArrowUp, LoaderCircle, X, Image, AlertCircle } from 'lucide-react';
import { ocrSummarise, ocrBatch } from '../api/ocr';
import OcrResults from './OcrResults';

const OcrPage = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = '';
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const onSubmit = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const imageFiles = files.filter((f) => f.type.startsWith('image/'));

      if (imageFiles.length === 0) {
        setError('Please upload at least one image file (PNG, JPG, GIF, WebP, BMP, TIFF).');
        setLoading(false);
        return;
      }

      if (imageFiles.length < files.length) {
        setError(`${files.length - imageFiles.length} non-image file(s) were skipped.`);
      }

      let ocrResults;
      if (imageFiles.length === 1) {
        const data = await ocrSummarise(imageFiles[0]);
        ocrResults = [data];
      } else {
        const data = await ocrBatch(imageFiles);
        ocrResults = data.results;
      }

      setResults(ocrResults);
      setFiles([]);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      <div className='max-w-3xl mx-auto px-4 pt-8 pb-20'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl md:text-4xl font-semibold text-gray-900'>Image OCR</h1>
          <p className='text-gray-500 mt-2'>
            Upload images and extract text instantly using Tesseract OCR.
          </p>
        </div>

        {/* Upload area */}
        <div className='bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition'>
          <Image className='size-10 text-gray-300 mx-auto mb-3' />
          <p className='text-gray-500 mb-4'>Drag & drop images here, or click to browse</p>

          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileSelect}
            className='hidden'
            multiple
            accept='.png,.jpg,.jpeg,.gif,.webp,.bmp,.tiff,.tif'
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className='px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition'
          >
            <Plus className='size-4 inline mr-1 -mt-0.5' />
            Choose Files
          </button>
        </div>

        {/* Selected files */}
        {files.length > 0 && (
          <div className='mt-4 space-y-2'>
            <p className='text-sm font-medium text-gray-600'>
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </p>
            <div className='flex flex-wrap gap-2'>
              {files.map((file, index) => (
                <div
                  key={index}
                  className='flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-xs'
                >
                  <Image className='size-4 text-indigo-400' />
                  <span className='max-w-[150px] truncate font-medium'>{file.name}</span>
                  <span className='text-gray-400'>({formatFileSize(file.size)})</span>
                  <button
                    onClick={() => removeFile(index)}
                    className='ml-1 text-gray-400 hover:text-red-500 transition'
                  >
                    <X className='size-3.5' />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={onSubmit}
              disabled={loading}
              className={`mt-3 flex items-center gap-2 px-6 py-2.5 text-sm text-white rounded-lg transition ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? (
                <>
                  <LoaderCircle className='size-4 animate-spin' /> Processing...
                </>
              ) : (
                <>
                  <ArrowUp className='size-4' /> Extract Text
                </>
              )}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className='mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3'>
            <AlertCircle className='size-4 shrink-0' />
            <span>{error}</span>
            <button onClick={() => setError(null)} className='ml-auto'>
              <X className='size-4' />
            </button>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <OcrResults results={results} onClear={() => setResults([])} />
        )}
      </div>
    </div>
  );
};

export default OcrPage;
