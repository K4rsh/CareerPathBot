// File: src/utils/careerRecommendations.ts

export const generateCareerRecommendations = async (hobbies: string, skills: string): Promise<string[]> => {
  const recommendations: string[] = [];

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/YOUR_MODEL_NAME', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`, // Secure API key usage
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hobbies, skills }), // Sending hobbies and skills as input
    });

    const data = await response.json();

    if (response.ok) {
      // Assume API returns recommendations as an array of strings
      return data.recommendations || [];
    } else {
      console.error('Failed to fetch recommendations:', data.error);
      return recommendations;
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return recommendations;
  }
};
