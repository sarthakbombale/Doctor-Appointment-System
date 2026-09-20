import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";
import "../../styles/GeminiBot.css";

const GeminiBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I am your MedConnect AI assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        // FIXED: Fetch the key dynamically at runtime execution 
        const activeKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!activeKey || activeKey === "YOUR_GEMINI_API_KEY_HERE") {
            console.error("Vite Env Error: VITE_GEMINI_API_KEY is missing or unreadable.");
            setMessages((prev) => [...prev, { text: "System Configuration Error: API Key configuration missing locally.", isBot: true }]);
            return;
        }

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
        setIsLoading(true);

        try {
            // FIXED: Initialize client freshly inside handler
            const genAI = new GoogleGenerativeAI(activeKey);

            // 1. Attempt using the primary high-quota model
            let model = genAI.getGenerativeModel({
                model: "gemini-3.5-flash",
                systemInstruction: "You are MedConnect AI, a helpful medical dashboard assistant. Help users understand how to book appointments, manage profile data, or contact doctors. Keep answers concise.",
            });

            let result;
            try {
                result = await model.generateContent(userMessage);
            } catch (innerError) {
                console.warn("Primary model error:", innerError);
                console.warn("Switching down to fallback instance...");

                // FIXED: Direct the fallback to a distinct generation model asset safely
                model = genAI.getGenerativeModel({
                    model: "gemini-2.0-flash",
                    systemInstruction: "You are MedConnect AI, a helpful medical dashboard assistant. Help users understand how to book appointments, manage profile data, or contact doctors. Keep answers concise.",
                });
                result = await model.generateContent(userMessage);
            }

            const responseText = result.response.text();
            setMessages((prev) => [...prev, { text: responseText, isBot: true }]);
        } catch (error) {
            console.error("Gemini Engine Failure:", error);
            setMessages((prev) => [...prev, { text: "Our servers are experiencing heavy traffic right now. Please try sending your message again in a few seconds!", isBot: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="gemini-bot-container">
            {!isOpen && (
                <button className="bot-fab" onClick={() => setIsOpen(true)}>
                    <FaRobot size={24} />
                </button>
            )}

            {isOpen && (
                <div className="bot-window">
                    <div className="bot-header">
                        <div className="d-flex align-items-center gap-2">
                            <FaRobot />
                            <span className="fw-bold">MedConnect AI</span>
                        </div>
                        <button className="btn-close-bot" onClick={() => setIsOpen(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="bot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`msg-bubble ${msg.isBot ? "bot-msg" : "user-msg"}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && <div className="msg-bubble bot-msg loading-dots">Thinking...</div>}
                    </div>

                    <form className="bot-input-area" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Ask anything about MedConnect..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}>
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default GeminiBot;