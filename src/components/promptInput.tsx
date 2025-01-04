"use client";
import React, { useState } from "react";
import LLMResponse from "../components/llmResponse";
import Evals from "./evals";

export default function PromptForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [gemma2Response, setGemma2Response] = useState("");
  const [mixtralResponse, setMixtralResponse] = useState("");
  const [llamaResponse, setLlamaResponse] = useState("");

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
    <div className="max-w-screen-lg mx-auto p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Multi-Model LLM Response Generator
      </h1>
      <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-8">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="flex-grow bg-white border border-gray-300 text-gray-800 text-base rounded-lg shadow-md focus:ring-blue-500 focus:border-blue-500 p-3 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`text-white font-bold px-6 py-3 rounded-lg shadow-md transition ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>

      {/* LLMResponse Components */}
      <div className="mt-4 flex flex-nowrap gap-4 overflow-x-auto">
        <LLMResponse response={gemma2Response} model="gemma2-9b-it" />
        <LLMResponse response={mixtralResponse} model="mixtral-8x7b-32768" />
        <LLMResponse response={llamaResponse} model="llama-3.3-70b-versatile" />
      </div>
          <hr className="my-8" />
      <div className="max-w-4xl mx-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
        <Evals />
      </div>
    </div>
  );
}
