import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env["GROQ_API_KEY"], // This is the default and can be omitted
});

const aiResponse = async (model: string, prompt: string) => {
  const chatCompletion = await client.chat.completions.create({
    messages: [
      { role: "user", content: prompt },
      {
        role: "system",
        content:
          "You are a cool chatbot, whose response are concise and highly effective, now answer the question:",
      },
    ],
    model: model,
  });
  const response = chatCompletion.choices[0].message.content;
  return response;
};

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const gemma2Response = await aiResponse("gemma2-9b-it", prompt);
  const mixtralResponse = await aiResponse("mixtral-8x7b-32768", prompt);
  const llamaResponse = await aiResponse("llama-3.3-70b-versatile", prompt);

  return new Response(
    JSON.stringify({
      gemma2Response,
      mixtralResponse,
      llamaResponse,
    }),
    { status: 200 }
  );
}
