const pdfParse = require('pdf-parse');

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

    if (parseError.message?.toLowerCase().includes('encrypt')) {
      throw new Error('This PDF is password-protected. Please remove the password and try again.');
    }
    throw new Error('Could not read this PDF. The file may be corrupted or in an unsupported format.');
  }

  console.log(`[pdfService] 📊 Pages: ${data.numpages} | Raw text length: ${data.text?.length ?? 0}`);

  const rawText = data.text ?? '';

  const meaningfulChars = (rawText.match(/[\p{L}\p{N}]/gu) ?? []).length;
  console.log(`[pdfService] 🔤 Meaningful characters found: ${meaningfulChars}`);

  if (meaningfulChars < 5) {
    console.error(
      `[pdfService] ❌ Not enough text extracted (${meaningfulChars} meaningful chars). ` +
      'PDF is likely image-based or scanned.'
    );
    throw new Error(
      'No text could be extracted from this PDF. ' +
      'It appears to be a scanned document or image-based PDF. ' +
      'Please copy-paste the text directly instead.'
    );
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
