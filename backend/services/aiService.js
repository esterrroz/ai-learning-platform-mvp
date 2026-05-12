const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
          content: 'You are a helpful assistant that summarizes text concisely and clearly.',
        },
        {
          role: 'user',
          content: `Please summarize the following text in 2-3 sentences:\n\n${text}`,
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

    const systemPrompt = `You are an expert quiz generator. Create engaging and educational quiz questions based on the given category, subcategory, and custom prompt. 
Format your response as a numbered list with clear questions. Include difficulty indicators (Easy/Medium/Hard) for each question if appropriate.`;

    const userPrompt = `Category: ${category}\nSubcategory: ${subCategory}\n\nUser Request: ${prompt}`;

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

    const systemPrompt = `You are an expert educator and teacher. Create comprehensive, engaging, and well-structured lessons that are lesson-like in nature.
Your lessons should:
1. Start with an introduction to the topic
2. Provide clear explanations with examples
3. Include key concepts and definitions
4. Organize content with headers and sections
5. Use a friendly and approachable tone
6. Include practical applications or use cases
7. Provide learning objectives if relevant
8. End with a summary or key takeaways

Format your response in a clear, readable manner using markdown-style formatting with line breaks between sections.`;

    const userPrompt = `Category: ${category}
Sub-Category: ${subCategory}

User Request: ${prompt}

Please create a comprehensive lesson covering this topic.`;

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
