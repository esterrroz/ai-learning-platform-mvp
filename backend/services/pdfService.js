const pdfParse = require('pdf-parse');

// חילוץ טקסט מקובץ PDF — מקבל Buffer, מחזיר אובייקט עם text, pageCount, characterCount
const extractTextFromPDF = async (fileBuffer) => {
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new Error('לא סופק buffer של קובץ');
  }

  console.log(`[pdfService] 📄 מפרסר PDF — גודל: ${fileBuffer.length} בייטים`);

  let data;
  try {
    data = await pdfParse(fileBuffer);
  } catch (parseError) {
    console.error('[pdfService] ❌ שגיאת pdf-parse:', parseError.message);

    // PDF מוצפן בסיסמה
    if (parseError.message?.toLowerCase().includes('encrypt')) {
      throw new Error('ה-PDF מוגן בסיסמה. הסר את הסיסמה ונסה שוב.');
    }
    throw new Error('לא ניתן לקרוא את ה-PDF. הקובץ עשוי להיות פגום או בפורמט לא נתמך.');
  }

  const rawText = data.text ?? '';

  // בדיקה שיש מספיק תווים משמעותיים (PDF מבוסס תמונה לא יעבור בדיקה זו)
  const meaningfulChars = (rawText.match(/[\p{L}\p{N}]/gu) ?? []).length;
  if (meaningfulChars < 5) {
    throw new Error(
      'לא ניתן לחלץ טקסט מה-PDF. ' +
      'נראה שמדובר במסמך סרוק או PDF מבוסס תמונה. ' +
      'אנא העתק-הדבק את הטקסט ישירות.'
    );
  }

  // ניקוי הטקסט: שמירת מעברי פסקה, כיווץ רווחים מיותרים
  const cleanedText = rawText
    .replace(/\n{2,}/g, ' ¶ ')       // סימון מעברי פסקה
    .replace(/[^\S\n]+/g, ' ')       // כיווץ רווחים אופקיים
    .replace(/ ¶ /g, '\n\n')         // שחזור מעברי פסקה
    .trim();

  console.log(`[pdfService] ✅ חילוץ הצליח — ${cleanedText.length} תווים, ${data.numpages} עמוד/ים`);

  return {
    text: cleanedText,
    pageCount: data.numpages,
    characterCount: cleanedText.length,
  };
};

module.exports = { extractTextFromPDF };
