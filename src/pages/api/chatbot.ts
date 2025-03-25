import { NextApiRequest, NextApiResponse } from 'next';

interface ConversationState {
  step: number;
  responses: {
    hobbies?: string;
    skills?: string;
    goals?: string;
  };
}

const questions = [
  "What are your hobbies?",
  "What skills do you have?",
  "What are your career goals?"
];

const initialState: ConversationState = {
  step: 0,
  responses: {}
};

let conversationState: ConversationState = { ...initialState };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid request: "message" is required and must be a string.' });
    }

    try {
      // Update conversation state based on the current step
      switch (conversationState.step) {
        case 0:
          conversationState.responses.hobbies = message;
          break;
        case 1:
          conversationState.responses.skills = message;
          break;
        case 2:
          conversationState.responses.goals = message;
          break;
        default:
          break;
      }

      // Move to the next step
      conversationState.step += 1;

      // Check if all questions are answered
      if (conversationState.step >= questions.length) {
        // Form a conclusion based on the responses
        const { hobbies, skills, goals } = conversationState.responses;
        const prompt = `
        You are a career path advisor. Based on the following information, provide a career recommendation:
        Hobbies: ${hobbies}
        Skills: ${skills}
        Goals: ${goals}
        Advisor:`;

        // Make a request to Hugging Face API using BlenderBot model
        const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: prompt }),
        });

        // Check if the response is not successful
        if (!response.ok) {
          const errorBody = await response.text();
          console.error('Hugging Face API Error:', errorBody);
          throw new Error(`Hugging Face API responded with status: ${response.status}`);
        }

        // Parse the response from Hugging Face
        const data = await response.json();

        // Validate and format the response
        const generatedText = Array.isArray(data) && data[0]?.generated_text 
          ? data[0].generated_text 
          : data.generated_text;

        if (!generatedText) {
          throw new Error('Hugging Face API did not return "generated_text".');
        }

        // Reset conversation state
        conversationState = { ...initialState };

        // Return the generated text to the client
        res.status(200).json({ reply: generatedText });
      } else {
        // Ask the next question
        const nextQuestion = questions[conversationState.step];
        res.status(200).json({ reply: nextQuestion });
      }
    } catch (error) {
      console.error('Error in handler:', error);

      // Return an error response
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}