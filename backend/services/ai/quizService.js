const OpenAI = require('openai');

// אתחול לקוח OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// יצירת 3 שאלות חידון רב-ברירה מסיכום טקסט — מחזיר מערך JSON מובנה
// lang: 'he' לעברית, 'en' לאנגלית (ברירת מחדל: עברית)
const generateQuizFromSummary = async (summary, lang = 'he') => {
  try {
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY לא מוגדר');

    const isHebrew = lang === 'he';

    // הנחיית שפה — מורה ל-AI לכתוב בשפה הנכונה
    const languageInstruction = isHebrew
      ? 'IMPORTANT: Write ALL questions, options, and difficulty labels in Hebrew (עברית). Use Easy=קל, Medium=בינוני, Hard=קשה.'
      : 'Write all questions and options in English.';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert academic quiz generator specializing in English, Mathematics, History, Biology, and Grammar.
${languageInstruction}
Create 3 rigorous multiple-choice quiz questions based on the provided academic summary.
Format your response as a JSON array with the following structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "difficulty": "Easy|Medium|Hard"
  }
]
Ensure:
- The correctAnswer index refers to the correct option in the options array (0, 1, 2, or 3)
- Each question tests understanding of key concepts from the summary
- Difficulty levels are appropriately mixed
- All options are plausible but only one is correct`,
        },
        {
          role: 'user',
          content: `Create quiz questions based on this summary:\n\n${summary}`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;

    // חילוץ ה-JSON מהתשובה (AI עשוי להוסיף טקסט לפני/אחרי המערך)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('לא ניתן לפרסר JSON מתשובת ה-AI');

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('שגיאת OpenAI API ביצירת חידון מסיכום:', error.message);
    throw new Error(`שגיאת שירות AI: ${error.message}`);
  }
};

module.exports = { generateQuizFromSummary };
