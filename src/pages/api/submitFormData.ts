// src/pages/api/submitFormData.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../utils/db'; // Import MySQL connection
import { generateCareerRecommendations } from '../../utils/careerRecommendations';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { hobbies, skills } = req.body;

    try {
      // Generate career recommendations based on user input
      const recommendations = generateCareerRecommendations(hobbies, skills);

      // Insert data into MySQL, storing the recommendations in JSON format
      await pool.query(
        'INSERT INTO user_responses (user_id, hobbies, skills, recommendations) VALUES (?, ?, ?, ?)',
        [
          /* Unique user ID logic here */, 
          hobbies, 
          skills, 
          JSON.stringify(recommendations) // Store recommendations as JSON
        ]
      );

      res.status(200).json({ message: 'Data saved successfully!', recommendations });
    } catch (error) {
      res.status(500).json({ message: 'Error saving data', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
