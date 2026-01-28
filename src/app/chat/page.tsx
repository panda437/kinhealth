"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Send, Bot, User, Loader2, MessageSquare, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Message {
    role: 'user' | 'assistant';
    content: string;
    data?: any;
}

function ChatContent() {
    const searchParams = useSearchParams();
    const initialMsg = searchParams.get("msg");
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm your KinHealth AI. You can tell me things like 'Arham has a mild fever' or 'Dad took his blood pressure medicine' and I'll log them for you." }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (initialMsg && !hasInitialized.current) {
            hasInitialized.current = true;
            handleSendMessage(undefined, initialMsg);
        }
    }, [initialMsg]);

    const handleSendMessage = async (e?: React.FormEvent, directMessage?: string) => {
        if (e) e.preventDefault();
        const messageToSend = directMessage || input.trim();
        if (!messageToSend || loading) return;

        if (!directMessage) setInput("");
        setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: messageToSend }),
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.confirmationMessage,
                    data: data
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I had trouble processing that. Please try again." }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "An error occurred. Check your internet connection." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center">
                        <Sparkles className="mr-2 text-primary" size={32} />
                        AI Inbox
                    </h1>
                    <p className="text-muted-foreground mt-1">Talk to KinHealth AI to log medical events instantly.</p>
                </div>
            </div>

            <div className="flex-1 glass border border-border rounded-3xl overflow-hidden flex flex-col shadow-xl">
                {/* Chat Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
                >
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}`}>
                                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                                </div>
                                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'glass border border-border rounded-tl-none'}`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    {msg.data && msg.data.memberId && (
                                        <div className="mt-3 pt-3 border-t border-primary/20 flex flex-wrap gap-2">
                                            <span className="text-[10px] font-black uppercase bg-primary/20 px-2 py-0.5 rounded text-primary-foreground/90">
                                                {msg.data.category}
                                            </span>
                                            <span className="text-[10px] font-black uppercase bg-primary/20 px-2 py-0.5 rounded text-primary-foreground/90">
                                                Logged for {msg.data.memberName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex flex-row items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                                    <Bot size={18} className="animate-bounce" />
                                </div>
                                <div className="p-4 glass border border-border rounded-2xl rounded-tl-none flex items-center space-x-2">
                                    <Loader2 size={16} className="animate-spin text-primary" />
                                    <span className="text-sm font-medium text-muted-foreground italic">AI is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-muted/20 border-t border-border">
                    <form onSubmit={(e) => handleSendMessage(e)} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g. 'Mom has a mild headache, gave her Panadol'"
                            className="w-full bg-background border border-border rounded-2xl py-4 pl-6 pr-14 focus:ring-2 focus:ring-primary outline-none transition-all shadow-inner"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-95"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </form>
                    <div className="mt-2 flex items-center justify-center space-x-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        <span className="flex items-center"><Sparkles size={12} className="mr-1 text-primary" /> Powered by LLM</span>
                        <span className="flex items-center"><MessageSquare size={12} className="mr-1 text-primary" /> Clinical Parsing</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AIInbox() {
    return (
        <Suspense fallback={<div className="text-center py-20 font-bold text-primary">Loading AI Inbox...</div>}>
            <ChatContent />
        </Suspense>
    );
}

