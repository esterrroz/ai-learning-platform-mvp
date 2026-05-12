const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ACADEMIC_SUBJECTS = 'English, Mathematics, History, Biology, and Grammar';

const ACADEMIC_SYSTEM_BASE = `You are an academic learning assistant specialized in the following subjects: ${ACADEMIC_SUBJECTS}.
You provide clear, accurate, and educationally sound content suitable for students and learners.
Always maintain a professional and academic tone. Do not engage with topics outside these academic subjects.`;

const summarizeText = async (text) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `${ACADEMIC_SYSTEM_BASE}
Your task is to summarize academic texts concisely and clearly, preserving key concepts, definitions, and important facts.`,
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
    console.error('Error calling OpenAI API:', error.message);
    throw new Error(`AI Service Error: ${error.message}`);
  }
};

const generateQuiz = async (category, subCategory, prompt) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    const systemPrompt = `${ACADEMIC_SYSTEM_BASE}
You are an expert academic quiz generator. Create engaging and rigorous quiz questions based on the given subject, sub-topic, and student request.
Format your response as a numbered list with clear questions. Include difficulty indicators (Easy/Medium/Hard) for each question.`;

    const userPrompt = `Subject: ${category}\nTopic: ${subCategory}\n\nStudent Request: ${prompt}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.8,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API for quiz generation:', error.message);
    throw new Error(`AI Service Error: ${error.message}`);
  }
};

const generateLesson = async (category, subCategory, prompt) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    const systemPrompt = `${ACADEMIC_SYSTEM_BASE}
You are an expert academic educator. Create comprehensive, well-structured lessons for the given subject and topic.
Your lessons must:
1. Start with clear learning objectives
2. Provide accurate academic explanations with examples
3. Include key concepts, definitions, and terminology
4. Organize content with clear headers and sections
5. Use a professional and academic tone
6. Include real-world academic applications where relevant
7. End with a summary of key takeaways

Format your response using markdown-style formatting with line breaks between sections.`;

    const userPrompt = `Subject: ${category}
Topic: ${subCategory}

Student Request: ${prompt}

Please create a comprehensive academic lesson covering this topic.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API for lesson generation:', error.message);
    throw new Error(`AI Service Error: ${error.message}`);
  }
};

module.exports = { summarizeText, generateQuiz, generateLesson };
