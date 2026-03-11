import { useState, useRef } from 'react'
import {Plus , ArrowUp, LoaderCircle, X, FileText, Image, File, AlertCircle} from 'lucide-react';
import { ocrSummarise, ocrBatch } from '../api/ocr';
import OcrResults from './OcrResults';

const Hero = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const isImageFile = (file) => file.type.startsWith('image/');

  const onsubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const imageFiles = files.filter(isImageFile);
      const nonImageFiles = files.filter((f) => !isImageFile(f));

      if (imageFiles.length === 0) {
        setError('Please upload at least one image file (PNG, JPG, GIF, WebP, BMP, TIFF) for OCR.');
        setLoading(false);
        return;
      }

      if (nonImageFiles.length > 0) {
        setError(`${nonImageFiles.length} non-image file(s) skipped — OCR only works on images.`);
      }

      let ocrResults;
      if (imageFiles.length === 1) {
        // Single file → use summarise endpoint for richer output
        const data = await ocrSummarise(imageFiles[0]);
        ocrResults = [data];
      } else {
        // Multiple files → use batch endpoint
        const data = await ocrBatch(imageFiles);
        ocrResults = data.results;
      }

      setResults(ocrResults);
      setFiles([]);
    } catch (err) {
      setError(err.message || 'Something went wrong while processing your files.');
    } finally {
      setLoading(false);
    }
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    // Reset input so the same file can be selected again
    e.target.value = '';
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <Image className='size-4 text-indigo-400' />;
    if (file.type === 'application/pdf' || file.type.includes('document') || file.type.includes('text'))
      return <FileText className='size-4 text-indigo-400' />;
    return <File className='size-4 text-indigo-400' />;
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  return (
    <main className="flex flex-col items-center bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-gradient.png')] bg-cover bg-no-repeat text-sm text-gray-800 max-md:px-4 text-center min-h-[100vh] overflow-y-auto pb-20">

      {/* HERO CONTENT */}
      <div className={`flex flex-col items-center justify-center w-full ${results.length === 0 ? 'absolute top-[50%] translate-y-[-50%]' : 'mt-24'}`}>
        <h1 className='text-4xl md:text-[40px]'>
          {results.length === 0 ? 'Extract text from your documents' : 'OCR Complete'}
        </h1>
        <p className='text-base mt-6'>
          {results.length === 0
            ? 'Upload an image and let our OCR engine do the rest.'
            : 'Here\'s what we extracted from your files.'}
        </p>

        {/* ERROR BANNER */}
        {error && (
          <div className='max-w-xl w-full mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3'>
            <AlertCircle className='size-4 shrink-0' />
            <span>{error}</span>
            <button onClick={() => setError(null)} className='ml-auto'>
              <X className='size-4' />
            </button>
          </div>
        )}

        {/* INPUT BOX */}
        <div className='max-w-xl w-full bg-gray-900 rounded-xl overflow-hidden mt-4'>

          {/* FILE PREVIEWS */}
          {files.length > 0 && (
            <div className='flex flex-wrap gap-2 p-3 pb-0'>
              {files.map((file, index) => (
                <div key={index} className='flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-1.5 text-white text-xs'>
                  {getFileIcon(file)}
                  <span className='max-w-[120px] truncate'>{file.name}</span>
                  <span className='text-gray-400'>({formatFileSize(file.size)})</span>
                  <button onClick={() => removeFile(index)} className='ml-1 hover:text-red-400 transition' aria-label='Remove file'>
                    <X className='size-3.5' />
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea className='w-full p-3 pb-0 resize-none outline-none bg-transparent text-white' placeholder='Upload images and click send to extract text...' rows='3' />

          {/* HIDDEN FILE INPUT */}
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileSelect}
            className='hidden'
            multiple
            accept='.png,.jpg,.jpeg,.gif,.webp,.bmp,.tiff,.tif'
          />

          <div className='flex items-center justify-between pb-3 px-3'>
            <button
              className='flex items-center justify-center bg-gray-500 hover:bg-gray-400 transition p-1 rounded-full size-6'
              aria-label='Upload file'
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus/>
            </button>
            <button
              className={`flex items-center justify-center p-1 rounded size-6 ${
                files.length > 0 && !loading ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-600/50 cursor-not-allowed'
              }`}
              aria-label='Send'
              onClick={onsubmit}
              disabled={files.length === 0 || loading}
            >
              {
                !loading ? <ArrowUp className='text-white'/> : <LoaderCircle className='text-white animate-spin'/>
              }
            </button>
          </div>
        </div>

        {/* OCR RESULTS */}
        {results.length > 0 && (
          <OcrResults
            results={results}
            onClear={() => setResults([])}
          />
        )}

        {/* FAQ LINKS – only show when no results */}
        {results.length === 0 && (
          <div className='grid grid-cols-2 gap-4 mt-8 text-slate-500'>
            <p className='cursor-pointer'>How do I extract text from a photo?</p>
            <p className='cursor-pointer'>What image formats are supported?</p>
            <div className='w-full h-px bg-gray-400/50'></div>
            <div className='w-full h-px bg-gray-400/50'></div>
            <p className='cursor-pointer'>Can I upload multiple images at once?</p>
            <p className='cursor-pointer'>How accurate is the OCR?</p>
          </div>
        )}
      </div>

      <p className='text-gray-500 pb-3 mt-auto pt-8'> By messaging us, you agree to our <a href='#' className='underline'> Terms of Use </a> and confirm you've read our <a href='#' className='underline'> Privacy Policy </a> .</p>
    </main>
  );
}

export default Hero