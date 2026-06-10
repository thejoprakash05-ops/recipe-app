import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
  const { image, mediaType } = await request.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY not configured in .env.local' },
      { status: 500 }
    );
  }

  if (!image) {
    return Response.json({ error: 'No image provided' }, { status: 400 });
  }

  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType || 'image/jpeg',
                data: image,
              },
            },
            {
              type: 'text',
              text: 'List all food ingredients or grocery items visible in this image. Return ONLY a comma-separated list (e.g., "chicken, tomatoes, onion, garlic"). No explanations, just the list.',
            },
          ],
        },
      ],
    });

    const text = message.content[0].text.trim();
    const ingredients = text
      .split(',')
      .map((i) => i.trim().toLowerCase())
      .filter(Boolean);

    return Response.json({ ingredients });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
