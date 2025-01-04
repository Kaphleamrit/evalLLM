"use client";
import React, { useState } from "react";
import LLMResponse from "../components/llmResponse";
import MetricsChart from "./charts";

interface Metrics {
  accuracy: number;
  hallucination_rate: number;
  relevance: number;
  coherence: number;
  response_completeness: number;
  response_length: {
    expected: number;
    real: number;
  };
}

interface EvaluationResult {
  prompt: string;
  expected_response: string;
  real_response: string;
  metrics: Metrics;
}

function parseEvaluationData(jsonString: string): EvaluationResult {
  try {
    const prompt = jsonString.match(/"prompt":\s*"([^"]+)"/)?.[1] || "";
    const expectedResponse = jsonString.match(/"expected_response":\s*"([^"]+)"/)?.[1] || "";
    const realResponse = jsonString.match(/"real_response":\s*"([^"]+)"/)?.[1] || "";
    const accuracy = parseInt(jsonString.match(/"accuracy":\s*(\d+)/)?.[1] || "0");
    const hallucinationRate = parseInt(jsonString.match(/"hallucination_rate":\s*(\d+)/)?.[1] || "0");
    const relevance = parseInt(jsonString.match(/"relevance":\s*(\d+)/)?.[1] || "0");
    const coherence = parseInt(jsonString.match(/"coherence":\s*(\d+)/)?.[1] || "0");
    const responseCompleteness = parseInt(
      jsonString.match(/"response_completeness":\s*(\d+)/)?.[1] || "0"
    );
    const responseLengthExpected = parseInt(jsonString.match(/"expected":\s*(\d+)/)?.[1] || "0");
    const responseLengthReal = parseInt(jsonString.match(/"real":\s*(\d+)/)?.[1] || "0");

    return {
      prompt,
      expected_response: expectedResponse,
      real_response: realResponse,
      metrics: {
        accuracy,
        hallucination_rate: hallucinationRate,
        relevance,
        coherence,
        response_completeness: responseCompleteness,
        response_length: {
          expected: responseLengthExpected,
          real: responseLengthReal,
        },
      },
    };
  } catch (error) {
    console.error("Error parsing evaluation data:", error);
    throw new Error("Invalid JSON structure");
  }
}


export default function PromptForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [expectedResponse, setExpectedResponse] = useState("");
  const [gemma2Response, setGemma2Response] = useState("");
  const [mixtralResponse, setMixtralResponse] = useState("");
  const [llamaResponse, setLlamaResponse] = useState("");
  const [gemma2Metrics, setGemma2Metrics] = useState<Metrics>({
    accuracy: 0,
    hallucination_rate: 0,
    relevance: 0,
    coherence: 0,
    response_completeness: 0,
    response_length: {
      expected: 0,
      real: 0,
    },
  });
  const [mixtralMetrics, setMixtralMetrics] = useState<Metrics>({
    accuracy: 0,
    hallucination_rate: 0,
    relevance: 0,
    coherence: 0,
    response_completeness: 0,
    response_length: {
      expected: 0,
      real: 0,
    },
  });
  const [llamaMetrics, setLlamaMetrics] = useState<Metrics>({
    accuracy: 0,
    hallucination_rate: 0,
    relevance: 0,
    coherence: 0,
    response_completeness: 0,
    response_length: {
      expected: 0,
      real: 0,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, expectedResponse }),
      });

      if (res.ok) {
        const data = await res.json();
        setGemma2Response(data.gemma2Response);
        setMixtralResponse(data.mixtralResponse);
        setLlamaResponse(data.llamaResponse);
       
        setGemma2Metrics(parseEvaluationData(data.gemma2EvalPromptResponse).metrics);
        setMixtralMetrics(parseEvaluationData(data.mixtralEvalPromptResponse).metrics);
        setLlamaMetrics(parseEvaluationData(data.llamaEvalPromptResponse).metrics);

        
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
        LLM Evals
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-4 mb-8"
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="flex-grow bg-white border border-gray-300 text-gray-800 text-base rounded-lg shadow-md focus:ring-blue-500 focus:border-blue-500 p-3 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
          disabled={isLoading}
        />
        <textarea
          value={expectedResponse}
          onChange={(e) => setExpectedResponse(e.target.value)}
          placeholder="Enter your expected response here..."
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
      <div className="flex gap-4 p-4 bg-gray-900 rounded-lg overflow-x-auto">
        <LLMResponse response={gemma2Response} model="gemma2-9b-it" />
        <LLMResponse response={mixtralResponse} model="mixtral-8x7b-32768" />
        <LLMResponse response={llamaResponse} model="llama-3.3-70b-versatile" />
      </div>
      <hr className="my-8" />
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
  <h2 className="text-center text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
    Metrics Visualization
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Gemma2 Metrics */}
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
      <h3 className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Gemma2 Metrics
      </h3>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full h-40">
          <MetricsChart metrics={gemma2Metrics} />
        </div>
      </div>
    </div>

    {/* Mixtral Metrics */}
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
      <h3 className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Mixtral Metrics
      </h3>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full h-40">
          <MetricsChart metrics={mixtralMetrics} />
        </div>
      </div>
    </div>

    {/* Llama Metrics */}
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
      <h3 className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Llama Metrics
      </h3>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full h-40">
          <MetricsChart metrics={llamaMetrics} />
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  );
}
