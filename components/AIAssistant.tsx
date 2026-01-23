
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PROJECTS, SKILLS, EXPERIENCES } from '../constants';
import { motion, AnimatePresence } from "framer-motion";

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: '¡Hola! Soy el asistente inteligente de John. ¿Quieres saber sobre sus proyectos, habilidades técnicas o trayectoria profesional?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `
        Eres el Asistente de IA de John Dev, un Senior Frontend Engineer con gran talento.
        Tu misión es responder preguntas de posibles clientes o reclutadores basándote en su portfolio.
        
        DATOS DE CONTEXTO:
        PROYECTOS: ${JSON.stringify(PROJECTS)}
        HABILIDADES: ${JSON.stringify(SKILLS)}
        EXPERIENCIA: ${JSON.stringify(EXPERIENCES)}

        DIRECTRICES:
        - Mantén un tono profesional, entusiasta y conciso.
        - Si no tienes información específica sobre algo, di que no tienes el dato pero resalta las habilidades generales de John.
        - Usa Markdown para dar formato a tus respuestas (negritas, listas).
        - Responde siempre en el mismo idioma que el usuario (español por defecto).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const aiText = response.text || "Lo siento, tuve un problema procesando tu mensaje.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Lo siento, mi conexión con los servidores de IA se ha interrumpido. ¡Inténtalo de nuevo en un momento!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="pointer-events-auto w-[350px] sm:w-[420px] h-[550px] bg-[#1c2327]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-primary/20 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-[#101c22] shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-2xl font-bold">auto_awesome</span>
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight">John AI Assistant</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">En línea</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="size-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-primary text-[#101c22] font-semibold rounded-tr-none shadow-lg shadow-primary/10' 
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-black/40 border-t border-white/5">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Pregunta sobre proyectos o stack..."
                  className="w-full bg-[#101c22] border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-white transition-all placeholder:text-slate-600"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-2 size-10 bg-primary text-[#101c22] rounded-lg flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed group-hover:scale-105 active:scale-95 shadow-md"
                >
                  <span className="material-symbols-outlined font-black">send</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto size-16 bg-primary rounded-2xl shadow-2xl shadow-primary/30 flex items-center justify-center text-[#101c22] hover:scale-110 active:scale-90 transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="material-symbols-outlined text-4xl font-black z-10">
          {isOpen ? 'close' : 'smart_toy'}
        </span>
      </button>
    </div>
  );
};

export default AIAssistant;
