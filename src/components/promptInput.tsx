"use client";
import React, { useState, useEffect } from "react";
import LLMResponse from "../components/llmResponse";

export default function PromptForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [responseGPT4, setResponseGPT4] = useState(""); // Final response
  const [typedResponse, setTypedResponse] = useState(""); // For dynamic typing effect

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTypedResponse(""); // Reset typed response for new typing effect

    try {
      // Example API call
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponseGPT4(data.response); // Assuming `response` is the key in the response
      } else {
        setResponseGPT4("Failed to fetch response from the LLM.");
      }
    } catch (error) {
      setResponseGPT4("An error occurred while querying the LLM.");
    } finally {
      setIsLoading(false);
    }
  };

  // Effect for typing animation
  useEffect(() => {
    if (!responseGPT4) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < responseGPT4.length) {
        setTypedResponse((prev) => prev + responseGPT4[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Typing speed (50ms per character)

    return () => clearInterval(interval);
  }, [responseGPT4]);

  return (
    <div className="max-w-lg mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
          disabled={isLoading} // Disable textarea while loading
        />
        <button
          type="submit"
          className={`text-white ${
            isLoading ? "bg-gray-500" : "bg-blue-700 hover:bg-blue-800"
          } focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* LLMResponse Component */}
      <div className="mt-4">
        <LLMResponse response={typedResponse} />
      </div>
    </div>
  );
}
