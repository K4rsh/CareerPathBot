"use client"; // Marking this component as a client component

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { generateCareerRecommendations } from '../../utils/careerRecommendations'; // Ensure the correct path


const QuestionnairePage = () => {
  const [formData, setFormData] = useState({ hobbies: '', skills: '' });
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

    const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const generatedRecommendations = await generateCareerRecommendations(formData.hobbies, formData.skills);
    setRecommendations(generatedRecommendations);
  
    // Sending data to the API
    try {
      const response = await fetch('/api/submitFormData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Data submitted successfully:', data);
      } else {
        console.error('Failed to submit data');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400"> {/* Gradient background */}
      <h1 className="text-5xl font-extrabold mb-6 text-yellow-200 drop-shadow-lg"> {/* Bold and intriguing header */}
        Career Path Questionnaire
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md">
        <input
          type="text"
          name="hobbies"
          placeholder="Enter your hobbies"
          value={formData.hobbies}
          onChange={handleChange}
          className="p-2 border border-yellow-300 rounded focus:outline-none focus:ring focus:ring-yellow-500"
        />
        <input
          type="text"
          name="skills"
          placeholder="Enter your skills"
          value={formData.skills}
          onChange={handleChange}
          className="p-2 border border-yellow-300 rounded focus:outline-none focus:ring focus:ring-yellow-500"
        />
        <button
          type="submit"
          className="bg-purple-700 text-yellow-100 px-6 py-3 rounded-full hover:bg-orange-500 transition-transform transform hover:scale-105"
        >
          Submit
        </button>
      </form>
      {recommendations.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-yellow-200">Recommended Careers:</h2>
          <ul className="list-disc ml-6 text-yellow-100">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuestionnairePage;
