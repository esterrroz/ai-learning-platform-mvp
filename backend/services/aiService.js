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
      model: 'gpt-3.5-turbo',
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
      model: 'gpt-3.5-turbo',
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

module.exports = { summarizeText, generateQuiz };
