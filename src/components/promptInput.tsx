"use client";
import React, { useState } from "react";
import LLMResponse from "../components/llmResponse";

export default function PromptForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [gemma2Response, setGemma2Response] = useState(""); // Final response
  const [mixtralResponse, setMixtralResponse] = useState(""); // Final response
  const [llamaResponse, setLlamaResponse] = useState(""); // Final response

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        const data = await res.json();
        setGemma2Response(data.gemma2Response);
        setMixtralResponse(data.mixtralResponse);
        setLlamaResponse(data.llamaResponse);
      } else {
        setGemma2Response("An error occurred while querying the LLM.");
        setMixtralResponse("An error occurred while querying the LLM.");
        setLlamaResponse("An error occurred while querying the LLM.");
      }
    } catch (error) {
      console.error(error);
      setGemma2Response("An error occurred while querying the LLM.");
      setMixtralResponse("An error occurred while querying the LLM.");
      setLlamaResponse("An error occurred while querying the LLM.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
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

      {/* LLMResponse Components */}
      <div className="mt-4 flex justify-between gap-4">
        <LLMResponse response={gemma2Response} model="gemma2-9b-it" />
        <LLMResponse response={mixtralResponse} model="mixtral-8x7b-32768" />
        <LLMResponse response={llamaResponse} model="llama-3.3-70b-versatile" />
      </div>
    </div>
  );
}
