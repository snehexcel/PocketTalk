"use client";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

const AssistantButton = () => {
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [mediaRecorderInitialised, setMediaRecorderInitialised] = useState(false);
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [thinking, setThinking] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null); // Store audio URL

    const playAudio = async (input: string): Promise<void> => {
        console.log("Audio URL:", input); // Check the URL

        if (typeof Audio !== "undefined") {
            try {
                const audio = new Audio(input);

                audio.play();
                setAudioPlaying(true);
                audio.onended = () => setAudioPlaying(false);
                audio.onerror = (error) => {
                    console.error("Error playing audio:", error);
                    setAudioPlaying(false);
                };
            } catch (error) {
                console.error("Error creating Audio object:", error);
                setAudioPlaying(false);
            }
        } else {
            console.error("Audio API is not supported in this environment.");
        }
    };

    const handlePlayButtonClick = (input: string): void => {
        setAudioPlaying(true);
        playAudio(input);
    };

    // ... (rest of the recording functions - startRecording, stopRecording)

    const handleClick = () => {
        // ... (your existing handleClick logic for recording)
    };

    return (
        <div className="relative">
            <div className="fixed top-0 left-0 w-full z-50 bg-transparent">
                <div className="p-4 pt-env(safe-area-inset-top)">
                    <motion.div
                        className="hover:scale-105 ease-in-out duration-500 hover:cursor-pointer text-[70px] relative"
                        onClick={handleClick}
                    >
                        <div className="assistant-container">
                            <div className="green"></div>
                            <div className="pink"></div>
                        </div>
                    </motion.div>
                </div>
            </div>
            {/* ... other content */}
            {audioUrl && ( // Conditionally render the audio element
                <audio controls src={audioUrl} style={{ display: 'none' }}></audio>
            )}
        </div>
    );
};

export default AssistantButton;