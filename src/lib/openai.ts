import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY ?? '';
const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function createChatReply(message: string): Promise<string> {
  if (!openai) {
    return 'Configura OPENAI_API_KEY para activar el chatbot.';
  }

  const completion = await openai.chat.completions.create({
    model,
    temperature: 0.4,
    messages: [
      {
        role: 'system',
        content:
          'Eres un asistente de SmartMovility. Responde con consejos breves sobre estacionamientos en CUCEI.',
      },
      {
        role: 'user',
        content: message,
      },
    ],
  });

  return completion.choices[0]?.message?.content?.trim() || 'Sin respuesta disponible.';
}
