const pdfParse = require('pdf-parse');

const IMAGE_PDF_MESSAGE =
  'This PDF seems to be an image. Please upload a text-based PDF or copy-paste the text.';

const extractTextFromPDF = async (fileBuffer) => {
  if (!fileBuffer || fileBuffer.length === 0) {
    console.error('[pdfService] ❌ No file buffer provided');
    throw new Error('No file buffer provided');
  }

  console.log(`[pdfService] 📄 Parsing PDF buffer — size: ${fileBuffer.length} bytes`);

  let data;
  try {
    data = await pdfParse(fileBuffer);
  } catch (parseError) {
    console.error('[pdfService] ❌ pdf-parse threw an error:');
    console.error('  message :', parseError.message);
    console.error('  stack   :', parseError.stack);
    // pdf-parse can throw on encrypted / corrupted files
    throw new Error(IMAGE_PDF_MESSAGE);
  }

  console.log(`[pdfService] 📊 Pages: ${data.numpages} | Raw text length: ${data.text?.length ?? 0}`);

  const rawText = data.text ?? '';

  // Count meaningful characters (letters + digits) to distinguish real text from
  // whitespace-only or symbol-only output that image-based PDFs sometimes produce
  const meaningfulChars = (rawText.match(/[\p{L}\p{N}]/gu) ?? []).length;
  console.log(`[pdfService] 🔤 Meaningful characters found: ${meaningfulChars}`);

  if (meaningfulChars < 20) {
    console.error(
      `[pdfService] ❌ Not enough text extracted (${meaningfulChars} meaningful chars). ` +
      'PDF is likely image-based, scanned, or encrypted.'
    );
    throw new Error(IMAGE_PDF_MESSAGE);
  }

  // Preserve paragraph breaks (double newline → placeholder → restore)
  // then collapse remaining whitespace runs to a single space
  const cleanedText = rawText
    .replace(/\n{2,}/g, ' ¶ ')      // mark paragraph breaks
    .replace(/[^\S\n]+/g, ' ')      // collapse horizontal whitespace
    .replace(/ ¶ /g, '\n\n')        // restore paragraph breaks
    .trim();

  console.log(`[pdfService] ✅ Extraction successful — ${cleanedText.length} characters, ${data.numpages} page(s)`);

  return {
    text: cleanedText,
    pageCount: data.numpages,
    characterCount: cleanedText.length,
  };
};

module.exports = { extractTextFromPDF };
