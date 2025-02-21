import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    console.log("CF_URL:", process.env.CF_URL); // Check CF_URL

    try {
        const req = await request.json();
        const base64audio = req.audio;

        const cloudflareWorkerUrl = `${process.env.CF_URL}tts`; // Use CF_URL here

        const response = await fetch(cloudflareWorkerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ audio: base64audio }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Cloudflare Worker Error:", response.status, errorText);
            throw new Error(`Cloudflare Worker Error: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Transcription Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}