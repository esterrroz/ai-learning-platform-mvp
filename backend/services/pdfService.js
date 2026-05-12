const pdfParse = require('pdf-parse');

const extractTextFromPDF = async (fileBuffer) => {
  try {
    if (!fileBuffer) {
      throw new Error('No file buffer provided');
    }

    // Parse PDF
    const data = await pdfParse(fileBuffer);

    // Extract text from all pages
    const text = data.text;

    if (!text || text.trim().length === 0) {
      throw new Error('No text content found in PDF. The PDF may be image-based or encrypted.');
    }

    // Clean up the text: remove extra whitespace and line breaks
    const cleanedText = text
      .replace(/\s+/g, ' ') // Replace multiple spaces/newlines with single space
      .trim();

    return {
      text: cleanedText,
      pageCount: data.numpages,
      characterCount: cleanedText.length,
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error.message);
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
};

module.exports = { extractTextFromPDF };
