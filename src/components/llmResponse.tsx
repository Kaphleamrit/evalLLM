import React, { useEffect, useRef } from "react";
import Typewriter from "typewriter-effect/dist/core";

interface LLMResponseProps {
  response: string; // Prop for the LLM response
}

const LLMResponse: React.FC<LLMResponseProps> = ({ response }) => {
  const typewriterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typewriterRef.current) {
      const typewriter = new Typewriter(typewriterRef.current, {
        loop: false, // Disable looping unless needed
        delay: 75,
      });

      typewriter
        .pauseFor(250)
        .typeString(response || "No response available.")
        .start();

      return () => {
        typewriter.stop(); // Clean up when the component is unmounted
      };
    }
  }, [response]); // Re-run effect when `response` changes

  return (
    <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
        LLM Response
      </h3>
      <div
        ref={typewriterRef}
        className="text-gray-700 dark:text-gray-300"
      ></div>
    </div>
  );
};

export default LLMResponse;
