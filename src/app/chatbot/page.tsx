"use client"; // Marking this component as a client component

import React, { useState } from 'react';

const ChatbotPage = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]); // Stores chat messages
  const [userInput, setUserInput] = useState(''); // Stores the user's input
  const [isLoading, setIsLoading] = useState(false); // Indicates if the bot is processing

  // Function to handle sending a message
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInput.trim()) return; // Do nothing if input is empty

    // Add user's message to the chat
    setMessages((prev) => [...prev, { sender: 'user', text: userInput }]);

    setIsLoading(true); // Show a loading state while waiting for the bot's response

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to get a response from the chatbot.');
      }

      const data = await response.json();

      // Add bot's reply to the chat
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Something went wrong. Please try again later.' },
      ]);
    } finally {
      setIsLoading(false); // Hide the loading state
      setUserInput(''); // Clear the input field
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400">
      <h1 className="text-5xl font-extrabold mb-6 text-yellow-200 drop-shadow-lg">Chat with Our Bot</h1>
      <div className="w-full max-w-md bg-white rounded shadow-lg p-4 flex flex-col space-y-4">
        {/* Chat window */}
        <div className="flex flex-col space-y-2 overflow-y-auto h-80 p-2 bg-gray-100 rounded">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white self-end'
                  : 'bg-gray-300 text-gray-900 self-start'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="p-2 bg-gray-300 text-gray-900 self-start rounded">
              Bot is typing...
            </div>
          )}
        </div>
        {/* Input form */}
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPage;