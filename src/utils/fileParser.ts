import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
try {
  // Use unpkg CDN matching version or fallback to avoid worker bundling issues in Vite
  const version = pdfjsLib.version || '4.10.38';
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker setup note:', e);
}

export interface ParsedDocument {
  text: string;
  fileName: string;
  fileSize: number;
  candidateNameSuggestion?: string;
  roleSuggestion?: string;
}

/**
 * Extracts plain text from a legacy .doc binary file by scanning for printable text segments.
 */
function extractTextFromBinaryDoc(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer);
  let result = '';
  
  // Try UTF-16LE decoding (Word typically encodes text runs in UTF-16LE)
  try {
    const decoder = new TextDecoder('utf-16le');
    const decoded = decoder.decode(bytes);
    // Filter to retain readable sentences and words
    const cleanSegments = decoded
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleanSegments.length > 50) {
      return cleanSegments;
    }
  } catch (err) {
    console.warn('UTF-16LE decode attempt failed:', err);
  }

  // Fallback to ASCII printable extraction
  let currentWord = '';
  for (let i = 0; i < bytes.length; i++) {
    const charCode = bytes[i];
    // Printable ASCII or newline/tab
    if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13 || charCode === 9) {
      currentWord += String.fromCharCode(charCode);
    } else {
      if (currentWord.length >= 3) {
        result += currentWord + ' ';
      }
      currentWord = '';
    }
  }
  if (currentWord.length >= 3) {
    result += currentWord;
  }

  return result.replace(/\s+/g, ' ').trim();
}

/**
 * Parses PDF documents into clean string format using PDF.js
 */
async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Group text items into lines based on vertical position or joined by spaces
    const items = textContent.items as Array<{ str?: string; hasEOL?: boolean }>;
    const pageString = items
      .map((item) => item.str || '')
      .join(' ')
      .replace(/\s+/g, ' ');

    if (pageString.trim()) {
      pageTexts.push(pageString.trim());
    }
  }

  return pageTexts.join('\n\n');
}

/**
 * Extracts candidate name suggestion from filename or first lines of text
 */
function extractNameSuggestion(fileName: string, text: string): string {
  // Try extracting from filename: e.g. "Alex_Rivera_Resume.pdf" -> "Alex Rivera"
  const cleanBaseName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  const nameMatch = cleanBaseName.replace(/\b(resume|cv|profile|doc|pdf|application)\b/gi, '').trim();
  if (nameMatch && nameMatch.length > 2 && nameMatch.length < 35 && !nameMatch.includes('/')) {
    // Capitalize words
    return nameMatch
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  // Look at the first 3 non-empty lines of text
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.length >= 3 && firstLine.length <= 35 && !/resume|curriculum|phone|email|@/i.test(firstLine)) {
      return firstLine;
    }
  }

  return '';
}

/**
 * Main entry point for parsing uploaded documents.
 * Rejects .md files explicitly. Accepts .pdf, .doc, .docx, .txt.
 */
export async function parseUploadedDocument(file: File): Promise<ParsedDocument> {
  const fileName = file.name || 'document';
  const fileExt = (fileName.split('.').pop() || '').toLowerCase();
  const fileType = file.type.toLowerCase();

  // Strict check: DO NOT accept Markdown (.md) files
  if (fileExt === 'md' || fileExt === 'markdown' || fileType.includes('markdown')) {
    throw new Error('Markdown (.md) files are not accepted. Please upload a PDF (.pdf), Word document (.doc, .docx), or plain text (.txt) file.');
  }

  // Verify allowed extensions
  const allowedExtensions = ['pdf', 'doc', 'docx', 'txt'];
  if (!allowedExtensions.includes(fileExt) && !fileType.includes('pdf') && !fileType.includes('word') && !fileType.includes('text')) {
    throw new Error(
      `Unsupported file type ".${fileExt}". Please upload a PDF (.pdf), Word document (.doc, .docx), or plain text (.txt) file.`
    );
  }

  let extractedText = '';

  if (fileExt === 'pdf' || fileType === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    try {
      extractedText = await extractTextFromPdf(arrayBuffer);
    } catch (pdfErr: any) {
      console.error('PDF parsing error:', pdfErr);
      throw new Error(`Failed to parse PDF file "${fileName}": ${pdfErr?.message || 'Invalid or encrypted PDF.'}`);
    }
  } else if (fileExt === 'docx' || fileType.includes('openxmlformats-officedocument.wordprocessingml')) {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const result = await mammoth.extractRawText({ arrayBuffer });
      extractedText = result.value || '';
      if (!extractedText.trim()) {
        throw new Error('The DOCX file did not contain readable text.');
      }
    } catch (docxErr: any) {
      console.error('DOCX parsing error:', docxErr);
      throw new Error(`Failed to parse Word (.docx) file "${fileName}": ${docxErr?.message || 'Invalid DOCX structure.'}`);
    }
  } else if (fileExt === 'doc' || fileType.includes('msword')) {
    const arrayBuffer = await file.arrayBuffer();
    try {
      // First try mammoth in case it's actually docx with doc extension
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result.value && result.value.trim().length > 30) {
        extractedText = result.value;
      } else {
        extractedText = extractTextFromBinaryDoc(arrayBuffer);
      }
    } catch {
      // Fall back to binary string extractor for older Word 97-2004 format
      extractedText = extractTextFromBinaryDoc(arrayBuffer);
    }

    if (!extractedText.trim() || extractedText.length < 20) {
      throw new Error(`Could not extract readable text from binary .doc file "${fileName}". Please save as .docx or .pdf and re-upload.`);
    }
  } else if (fileExt === 'txt' || fileType.startsWith('text/')) {
    extractedText = await file.text();
  } else {
    // Attempt text reading as final fallback
    extractedText = await file.text();
  }

  extractedText = extractedText.trim();
  if (!extractedText) {
    throw new Error(`The uploaded file "${fileName}" appears to be empty or contains no extractable text.`);
  }

  const nameSuggestion = extractNameSuggestion(fileName, extractedText);

  return {
    text: extractedText,
    fileName,
    fileSize: file.size,
    candidateNameSuggestion: nameSuggestion,
  };
}
