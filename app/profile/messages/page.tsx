"use client";

import Link from "next/link";
import { useState } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Instructor Sarah", text: "Hey! How is the project going?", time: "10:30 AM", isMe: false },
    { id: 2, sender: "Me", text: "It's going great! Just working on the dashboard.", time: "10:32 AM", isMe: true },
    { id: 3, sender: "Instructor Sarah", text: "Awesome! Let me know if you need any help with the API integration.", time: "10:35 AM", isMe: false },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessage = {
      id: Date.now(), // Use Date.now() for unique IDs
      sender: "Me",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="h-48 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
      
      <div className="mx-auto -mt-24 max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          
          <aside className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-xl backdrop-blur-xl">
              <div className="p-6">
                <nav className="space-y-1">
                  <Link href="/profile" className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                    <span className="mr-3 text-lg">🏠</span> Overview
                  </Link>
                  <Link href="/profile/courses" className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                    <span className="mr-3 text-lg">📚</span> My Courses
                  </Link>
                  <Link href="/profile/assignments" className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                    <span className="mr-3 text-lg">📝</span> Assignments
                  </Link>
                  <Link href="/profile/messages" className="flex items-center rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 transition-colors">
                    <span className="mr-3 text-lg">💬</span> Messages
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          <section className="flex flex-col rounded-3xl bg-white shadow-xl shadow-slate-100 overflow-hidden">
            <div className="border-b p-6 bg-white/50 backdrop-blur-sm">
              <h1 className="text-2xl font-extrabold text-slate-900">Messages</h1>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">Live Chat with Instructor</p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6 bg-slate-50/30 min-h-[400px]">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                    m.isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                  }`}>
                    {!m.isMe && <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">{m.sender}</p>}
                    <p className="text-sm font-medium">{m.text}</p>
                    <p className={`mt-1 text-[9px] font-bold ${m.isMe ? 'text-indigo-200' : 'text-slate-400'}`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4 bg-white">
              <div className="flex gap-2">
                <input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..." 
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white"
                />
                <button 
                  onClick={handleSend}
                  className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95"
                >
                  Send
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
