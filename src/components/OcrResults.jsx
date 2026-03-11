import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, FileText, BarChart3, Sparkles, X } from 'lucide-react';

const OcrResults = ({ results, onClear }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(0);

  if (!results || results.length === 0) return null;

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className='w-full max-w-3xl mx-auto mt-8 space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
          <Sparkles className='size-5 text-indigo-500' />
          OCR Results
          <span className='text-sm font-normal text-gray-500'>
            ({results.length} {results.length === 1 ? 'file' : 'files'})
          </span>
        </h2>
        <button
          onClick={onClear}
          className='text-gray-400 hover:text-red-500 transition p-1'
          aria-label='Clear results'
        >
          <X className='size-5' />
        </button>
      </div>

      {/* Result cards */}
      {results.map((result, index) => (
        <div
          key={index}
          className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden'
        >
          {/* Card header */}
          <button
            className='w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition'
            onClick={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
          >
            <div className='flex items-center gap-3 text-left'>
              <FileText className='size-5 text-indigo-500 shrink-0' />
              <div>
                <p className='font-medium text-gray-800'>{result.filename}</p>
                {result.error ? (
                  <p className='text-xs text-red-500'>{result.error}</p>
                ) : (
                  <p className='text-xs text-gray-400'>
                    {result.word_count !== undefined && `${result.word_count} words`}
                    {result.sentence_count !== undefined && ` · ${result.sentence_count} sentences`}
                    {result.average_confidence !== undefined &&
                      ` · ${result.average_confidence}% confidence`}
                  </p>
                )}
              </div>
            </div>
            {expandedIndex === index ? (
              <ChevronUp className='size-4 text-gray-400' />
            ) : (
              <ChevronDown className='size-4 text-gray-400' />
            )}
          </button>

          {/* Expanded content */}
          {expandedIndex === index && !result.error && (
            <div className='px-5 pb-5 space-y-4'>
              {/* Extracted text */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                    Extracted Text
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.extracted_text, index)}
                    className='flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 transition'
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className='size-3.5' /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className='size-3.5' /> Copy
                      </>
                    )}
                  </button>
                </div>
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto'>
                  <pre className='text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed'>
                    {result.extracted_text || '(No text detected)'}
                  </pre>
                </div>
              </div>

              {/* Summary (if summarise endpoint was used) */}
              {result.summary && (
                <div>
                  <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2'>
                    Summary
                  </span>
                  <div className='bg-indigo-50 border border-indigo-100 rounded-lg p-4'>
                    <p className='text-sm text-gray-700 leading-relaxed'>{result.summary}</p>
                  </div>
                </div>
              )}

              {/* Keywords */}
              {result.keywords && result.keywords.length > 0 && (
                <div>
                  <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2'>
                    Keywords
                  </span>
                  <div className='flex flex-wrap gap-2'>
                    {result.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className='px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium'
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats bar */}
              {(result.word_count !== undefined || result.average_confidence !== undefined) && (
                <div className='flex items-center gap-6 pt-2 border-t border-gray-100'>
                  <div className='flex items-center gap-1.5 text-xs text-gray-500'>
                    <BarChart3 className='size-3.5' />
                    {result.word_count} words · {result.sentence_count} sentences
                  </div>
                  {result.average_confidence !== undefined && (
                    <div className='flex items-center gap-1.5 text-xs text-gray-500'>
                      <span
                        className={`inline-block size-2 rounded-full ${
                          result.average_confidence > 70
                            ? 'bg-green-400'
                            : result.average_confidence > 40
                            ? 'bg-yellow-400'
                            : 'bg-red-400'
                        }`}
                      />
                      {result.average_confidence}% avg confidence
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OcrResults;
