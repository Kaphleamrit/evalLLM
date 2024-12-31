import React from "react";

interface LLMResponseProps {
  response: string; // Prop for the LLM response
}

const LLMResponse: React.FC<LLMResponseProps> = ({ response }) => {
  return (
    <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
        LLM Response
      </h3>
      {response ? (
        <p className="text-gray-700 dark:text-gray-300">{response}</p>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
            {response}
        </p>
      )}
    </div>
  );
};

export default LLMResponse;
