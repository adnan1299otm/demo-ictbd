import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';
import { Send, Menu, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const UserChat = () => {
    const [conversationId, setConversationId] = useState(localStorage.getItem('conversationId'));
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Initialize Chat
    useEffect(() => {
        socket.connect();

        const initChat = async () => {
            if (!conversationId) {
                // Start new conversation
                try {
                    const res = await axios.post('http://localhost:3000/api/chat/start', { userId: 'guest' });
                    const newId = res.data.id;
                    conversationId(newId);
                    localStorage.setItem('conversationId', newId);
                    setConversationId(newId);
                    socket.emit('join_room', newId);
                } catch (e) { console.error(e); }
            } else {
                // Load history and join
                socket.emit('join_room', conversationId);
                try {
                    const res = await axios.get(`http://localhost:3000/api/chat/${conversationId}/history`);
                    setMessages(res.data.messages);
                } catch (e) {
                    // If ID invalid, clear it
                    localStorage.removeItem('conversationId');
                    setConversationId(null);
                }
            }
        };

        initChat();

        socket.on('message', (msg) => {
            setMessages((prev) => [...prev, msg]);
            setIsTyping(false);
        });

        socket.on('status_change', (data) => {
            console.log("Status changed:", data);
        });

        return () => {
            socket.off('message');
            socket.off('status_change');
            socket.disconnect();
        };
    }, [conversationId]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Optimistic update? No, let's wait for socket echo for simplicity or add immediately
        // socket.emit('user_message', { conversationId, content: input });
        // Actually, good UX is optimistic:
        // setMessages(prev => [...prev, { sender: 'user', content: input }]); 
        // BUT we rely on ID from server usually. For now, rely on server echo.
        socket.emit('user_message', { conversationId, content: input });
        setInput('');
        setIsTyping(true); // Expecting AI response
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans selection:bg-green-500/30">
            {/* Sidebar (Hidden on mobile) */}
            <div className="w-72 bg-gray-950 border-r border-gray-800 hidden md:flex flex-col">
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-400">History</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {/* Placeholder for history items */}
                    <div className="p-3 bg-gray-900/50 border border-gray-800 rounded-lg cursor-pointer hover:bg-gray-800 transition group">
                        <div className="text-sm text-gray-300 font-medium group-hover:text-white truncate">New Conversation</div>
                        <div className="text-xs text-gray-500 mt-1">Just now</div>
                    </div>
                </div>
            </div>

            {/* Main Chat */}
            <div className="flex-1 flex flex-col relative bg-gray-900">
                {/* Header (Slim & Professional) */}
                <div className="h-16 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center">
                        <img src="/logo-official.png" alt="ICT Bangladesh" className="h-9 w-auto object-contain select-none opacity-90 hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Mobile Sidebar Toggle */}
                    <Menu className="w-5 h-5 md:hidden text-gray-400 hover:text-white cursor-pointer transition" />
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center space-y-8 animate-in fade-in duration-500">
                            {/* Subtle Brand Mark */}
                            <img
                                src="/logo-official.png"
                                alt="ICT Bangladesh"
                                className="h-14 w-auto opacity-80 mb-2"
                            />

                            <div className="space-y-4">
                                <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight leading-snug">Welcome to ICT Bangladesh AI Assistant</h1>
                                <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
                                    This assistant helps you with courses, admissions, services, and general information about ICT Bangladesh.
                                </p>
                                <p className="text-sm text-gray-500">
                                    If needed, a human support agent can assist you.
                                </p>
                            </div>

                            {/* Guidance Chips */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-lg">
                                {[
                                    "Ask about courses",
                                    "Admission information",
                                    "Talk to support"
                                ].map((hint) => (
                                    <button
                                        key={hint}
                                        onClick={() => { setInput(hint); }}
                                        className="px-5 py-2.5 bg-transparent border border-[#00A651]/40 hover:border-[#00A651] text-gray-300 hover:text-[#00A651] rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-[0_0_12px_rgba(0,166,81,0.15)]"
                                    >
                                        {hint}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] md:max-w-[75%] px-5 py-4 rounded-2xl shadow-sm ${msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-sm'
                                    : 'bg-gray-800 text-gray-200 border border-gray-700/50 rounded-bl-sm'
                                    }`}>
                                    {msg.role === 'ai' && (
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700/50">
                                            <div className="w-4 h-4 rounded-sm bg-green-500/20 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            </div>
                                            <span className="text-xs font-semibold text-green-400 tracking-wide uppercase">AI Assistant</span>
                                        </div>
                                    )}
                                    {msg.role === 'human' && (
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-green-500/20">
                                            <div className="w-4 h-4 rounded-sm bg-green-500/20 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            </div>
                                            <span className="text-xs font-semibold text-green-400 tracking-wide uppercase">Support Agent</span>
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-700/50 flex gap-1.5 items-center">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gray-900 border-t border-gray-800">
                    <form onSubmit={sendMessage} className="max-w-4xl mx-auto relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question about ICT Bangladesh..."
                            className="w-full bg-gray-950 text-white rounded-xl pl-5 pr-12 py-4 border border-gray-800 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 focus:outline-none transition-all placeholder:text-gray-600"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="absolute right-3 top-3 p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <p className="text-[10px] uppercase tracking-widest text-gray-600">Official AI Assistant of ICT Bangladesh</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserChat;
