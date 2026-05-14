const OpenAI = require('openai');

// אתחול לקוח OpenAI עם מפתח ה-API מהסביבה
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ACADEMIC_SUBJECTS = 'English, Mathematics, History, Biology, and Grammar';

// הנחיית מערכת בסיסית לכל הקריאות ל-AI
const ACADEMIC_SYSTEM_BASE = `You are an academic learning assistant specialized in the following subjects: ${ACADEMIC_SUBJECTS}.
You provide clear, accurate, and educationally sound content suitable for students and learners.
Always maintain a professional and academic tone. Do not engage with topics outside these academic subjects.`;

// סיכום טקסט אקדמי ב-2-3 משפטים
const summarizeText = async (text) => {
  try {
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY לא מוגדר');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `${ACADEMIC_SYSTEM_BASE}\nYour task is to summarize academic texts concisely and clearly, preserving key concepts, definitions, and important facts.`,
        },
        {
          role: 'user',
          content: `Please summarize the following academic text in 2-3 sentences:\n\n${text}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('שגיאת OpenAI API:', error.message);
    throw new Error(`שגיאת שירות AI: ${error.message}`);
  }
};

// יצירת שאלות חידון מפרומפט חופשי (מחזיר טקסט מפורמט)
const generateQuiz = async (category, subCategory, prompt) => {
  try {
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY לא מוגדר');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `${ACADEMIC_SYSTEM_BASE}\nYou are an expert academic quiz generator. Create engaging and rigorous quiz questions based on the given subject, sub-topic, and student request.\nFormat your response as a numbered list with clear questions. Include difficulty indicators (Easy/Medium/Hard) for each question.`,
        },
        {
          role: 'user',
          content: `Subject: ${category}\nTopic: ${subCategory}\n\nStudent Request: ${prompt}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.8,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('שגיאת OpenAI API ביצירת חידון:', error.message);
    throw new Error(`שגיאת שירות AI: ${error.message}`);
  }
};

// יצירת שיעור אקדמי מפורט מפרומפט חופשי
const generateLesson = async (category, subCategory, prompt) => {
  try {
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY לא מוגדר');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `${ACADEMIC_SYSTEM_BASE}\nYou are an expert academic educator. Create comprehensive, well-structured lessons for the given subject and topic.\nYour lessons must:\n1. Start with clear learning objectives\n2. Provide accurate academic explanations with examples\n3. Include key concepts, definitions, and terminology\n4. Organize content with clear headers and sections\n5. Use a professional and academic tone\n6. Include real-world academic applications where relevant\n7. End with a summary of key takeaways\n\nFormat your response using markdown-style formatting with line breaks between sections.`,
        },
        {
          role: 'user',
          content: `Subject: ${category}\nTopic: ${subCategory}\n\nStudent Request: ${prompt}\n\nPlease create a comprehensive academic lesson covering this topic.`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('שגיאת OpenAI API ביצירת שיעור:', error.message);
    throw new Error(`שגיאת שירות AI: ${error.message}`);
  }
};

module.exports = { summarizeText, generateQuiz, generateLesson };
