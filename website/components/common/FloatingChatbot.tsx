"use client";

import Link from "next/link";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useState } from "react";

type Message = {
  id: number;
  sender: "agent" | "user";
  text: string;
};

const quickQuestions = ["Help me choose a car", "Compare two cars", "Book a test drive"];

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "agent", text: "Hi, I am your Apnicars assistant. What kind of car are you looking for?" },
  ]);

  function sendMessage(text: string) {
    const cleanMessage = text.trim();
    if (!cleanMessage) return;

    setMessages((current) => [
      ...current,
      { id: Date.now(), sender: "user", text: cleanMessage },
      { id: Date.now() + 1, sender: "agent", text: "Thanks. Share your budget and city, and our car expert will help you with the right options." },
    ]);
    setMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(message);
  }

  return (
    <div id="chat-assistant" className="fixed bottom-5 right-4 z-[80] sm:bottom-7 sm:right-7">
      {isOpen && (
        <section aria-label="Apnicars chat assistant" className="mb-3 flex h-[470px] max-h-[calc(100vh-120px)] w-[calc(100vw-32px)] max-w-[360px] flex-col overflow-hidden rounded-[8px] border border-black/10 bg-white text-[#14241e] shadow-[0_22px_65px_rgba(6,31,27,.22)] dark:border-white/10 dark:bg-[#0c241e] dark:text-white">
          <header className="flex items-center gap-3 bg-[#082d26] px-4 py-4 text-white">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#c9ff49] text-[#153027]"><Bot size={19} /></span>
            <div className="min-w-0 flex-1"><h2 className="text-[13px] font-semibold">Apnicars assistant</h2><p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white/65"><span className="h-1.5 w-1.5 rounded-full bg-[#c9ff49]" /> Online now</p></div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/75 transition-colors hover:bg-white/10 hover:text-white"><X size={17} /></button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f5f7f5] p-4 dark:bg-[#081b16]">
            {messages.map((item) => (
              <p key={item.id} className={`max-w-[86%] rounded-[7px] px-3.5 py-2.5 text-[11px] leading-5 ${item.sender === "user" ? "ml-auto bg-[#173e34] text-white" : "border border-black/[0.06] bg-white text-[#45564f] shadow-sm dark:border-white/10 dark:bg-[#102c24] dark:text-white/75"}`}>{item.text}</p>
            ))}

            {messages.length === 1 && (
              <div className="grid gap-2 pt-1">
                {quickQuestions.map((question) => <button key={question} type="button" onClick={() => sendMessage(question)} className="rounded-[6px] border border-[#bfd09d] bg-white px-3 py-2.5 text-left text-[10px] font-semibold text-[#2b493f] transition-colors hover:border-[#94b02d] hover:bg-[#f4f8eb] dark:border-white/15 dark:bg-white/[0.04] dark:text-white/75 dark:hover:border-[#c9ff49]/55 dark:hover:bg-white/[0.08]">{question}</button>)}
              </div>
            )}
          </div>

          <div className="border-t border-black/[0.07] bg-white p-3 dark:border-white/10 dark:bg-[#0c241e]">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <label htmlFor="chat-message" className="sr-only">Write your message</label>
              <input id="chat-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about a car..." className="h-11 min-w-0 flex-1 rounded-[6px] border border-black/10 bg-[#f5f7f5] px-3 text-[11px] outline-none transition-colors placeholder:text-[#87918c] focus:border-[#7f9d20] dark:border-white/10 dark:bg-[#081b16] dark:text-white" />
              <button type="submit" aria-label="Send message" className="grid h-11 w-11 shrink-0 place-items-center rounded-[6px] bg-[#c9ff49] text-[#10271f] transition-colors hover:bg-[#b7ec3d]"><Send size={16} /></button>
            </form>
            <p className="mt-2 text-center text-[9px] text-[#7a8781]">Need a person? <Link href="/contact" className="font-semibold text-[#365d50] hover:text-[#6d880d] dark:text-[#c9ff49]">Contact our team</Link></p>
          </div>
        </section>
      )}

      <button type="button" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? "Close chat" : "Open chat with an agent"} title={isOpen ? "Close chat" : "Chat with an agent"} aria-expanded={isOpen} aria-controls="chat-assistant" className="ml-auto grid h-12 w-12 place-items-center rounded-full bg-[#082d26] text-white shadow-[0_12px_30px_rgba(5,34,28,.25)] transition-all hover:-translate-y-0.5 hover:bg-[#061f1b] dark:border dark:border-[#c9ff49]/25">
        {isOpen ? <X size={17} /> : <MessageCircle size={17} className="text-[#c9ff49]" />}
      </button>
    </div>
  );
}
