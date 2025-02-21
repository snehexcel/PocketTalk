import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
    try {
        const { question } = await request.json();

        const response = await axios.post(
            `https://api.openai.com/v1/chat/completions`,
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: question }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const content = response.data.choices[0].message.content;

        // *** Text-to-Speech (TTS) Integration ***
        const ttsResponse = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
            {
                method: "POST",
                headers: {
                    "xi-api-key": process.env.ELEVENLABS_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "audio/mpeg", // Important: Request audio
                },
                body: JSON.stringify({
                    text: content,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: {
                        stability: 0,
                        similarity_boost: 0,
                    },
                }),
            }
        );


        if (!ttsResponse.ok) {
            const ttsError = await ttsResponse.text();
            console.error("TTS Error:", ttsResponse.status, ttsError);
            throw new Error(`TTS Error: ${ttsResponse.status} - ${ttsError}`);
        }

        const audioBlob = await ttsResponse.blob();
        const audioBuffer = await audioBlob.arrayBuffer();
        const audioBase64 = Buffer.from(audioBuffer).toString("base64");


        return NextResponse.json({
            content: content,
            audioBase64: audioBase64
        });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}