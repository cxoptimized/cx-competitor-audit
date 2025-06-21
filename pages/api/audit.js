import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { query } = req.body;

  if (!query || query.trim() === "") {
    res.status(400).json({ error: "Query is required" });
    return;
  }

  try {
    const prompt = `
You are a CX Competitor Auditor. Based on the following business or competitor info, provide a detailed, structured customer experience competitor audit report with key insights and comparison metrics:

${query}

Return the report in a clear, concise, professional tone.
`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
    });

    res.status(200).json({ text: completion.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message || "OpenAI API error" });
  }
}
