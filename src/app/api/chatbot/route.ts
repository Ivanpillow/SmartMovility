import { NextResponse } from 'next/server';
import { createChatReply } from '@/lib/openai';

export async function POST(request: Request) {
  const body = await request.json();
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  try {
    const reply = await createChatReply(message);
    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate reply' }, { status: 500 });
  }
}
