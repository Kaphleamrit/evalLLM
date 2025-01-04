import React from "react";
import ReactMarkdown from "react-markdown";

interface LLMResponseProps {
  response: string; // Prop for the LLM response
  model: string;
}

const LLMResponse: React.FC<LLMResponseProps> = ({ response, model }) => {
  return (
    <div className="w-1/3 p-6 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 dark:border-gray-600">
      {/* Model Title */}
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 text-center uppercase tracking-wide">
        {model}
      </h3>

      {/* Response Content */}
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed overflow-y-auto max-h-64 no-scrollbar">
        <ReactMarkdown>{response}</ReactMarkdown>
      </div>

      {/* Footer */}
      <div className="mt-4 text-right">
        <span className="text-xs text-gray-500 dark:text-gray-400 italic">
          Powered by {model}
        </span>
      </div>
    </div>
  );
};

export default LLMResponse;
