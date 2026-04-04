export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not set in environment variables' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: message }] 
                }],
                systemInstruction: {
                    parts: [{ text: "Your name is CareBot. You are a friendly, professional, and knowledgeable medical assistant for the CareBuddy app. Provide concise, helpful, and empathetic health advice. Always remind the user to consult a professional for serious concerns." }]
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ 
                error: `Gemini API Error: ${data.error.message}`,
                code: data.error.code,
                status: data.error.status
            });
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return res.status(500).json({ 
                error: 'Empty response from Gemini',
                raw: data 
            });
        }

        res.status(200).json({ reply: text });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
