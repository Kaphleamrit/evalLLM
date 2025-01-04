import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env["GROQ_API_KEY"], // This is the default and can be omitted
});

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama3-8b-8192",
  });
  const aiResponse = chatCompletion.choices[0].message.content;
  return new Response(JSON.stringify({"message": aiResponse}), { status: 200 });
 
}
