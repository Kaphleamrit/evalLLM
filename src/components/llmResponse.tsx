import React from "react";
import ReactMarkdown from "react-markdown";

interface LLMResponseProps {
  response: string; // Prop for the LLM response
  model: string;
}

const LLMResponse: React.FC<LLMResponseProps> = ({ response, model }) => {
  return (
    <div className="w-1/3 p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-600">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
        {model}
      </h3>
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <ReactMarkdown>{response}</ReactMarkdown>
      </div>
    </div>
  );
};


export default LLMResponse;
