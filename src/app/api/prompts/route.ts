import { APIResource } from "groq-sdk/resource.mjs";
import { connectToDB } from "../../../lib/db";
import Groq from 'groq-sdk';

const client = new Groq({
    apiKey: process.env['GROQ_API_KEY'], // This is the default and can be omitted
  });

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const db = await connectToDB();
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama3-8b-8192',
  });
const aiResponse = chatCompletion.choices[0].message.content;
  const result = await db.collection("prompts").insertOne({ prompt, timestamp: new Date(), response: aiResponse });
  if (result.acknowledged) {
  return new Response(JSON.stringify(aiResponse), { status: 200 });
}
    return new Response("Failed to insert prompt into the database.", { status: 500 });
}
