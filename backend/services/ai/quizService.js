const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateQuizFromSummary = async (summary) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    const systemPrompt = `You are an expert quiz generator. Create 3 engaging and educational multiple-choice quiz questions based on the provided summary. 
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
- Difficulty levels are appropriately mixed (Easy, Medium, Hard)
- All options are plausible but only one is correct`;

    const userPrompt = `Create quiz questions based on this summary:\n\n${summary}`;

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
      max_tokens: 2000,
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    
    // Parse JSON response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse quiz JSON from AI response');
    }
    
    const quiz = JSON.parse(jsonMatch[0]);
    return quiz;
  } catch (error) {
    console.error('Error calling OpenAI API for quiz generation:', error.message);
    throw new Error(`AI Service Error: ${error.message}`);
  }
};

module.exports = { generateQuizFromSummary };
