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

module.exports = { summarizeText };
