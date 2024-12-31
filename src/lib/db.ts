import { MongoClient } from "mongodb";

const uri = process.env.DB_URI as string;
let client: MongoClient;

export async function connectToDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db("llm_metrics_db");
}
