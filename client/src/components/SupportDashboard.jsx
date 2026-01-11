import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';
import { Users, MessageSquare, AlertCircle, CheckCircle, Send } from 'lucide-react';
import axios from 'axios';

const SupportDashboard = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    // Initial Fetch & Socket Listeners
    useEffect(() => {
        socket.connect();
        fetchConversations();

        const interval = setInterval(fetchConversations, 5000); // Polling for updates simpler than complex socket events for list

        socket.on('support_new_message', () => fetchConversations());
        socket.on('support_update', () => fetchConversations());

        // Listen for messages in the SELECTED chat room
        socket.on('message', (msg) => {
            if (selectedChat && msg.conversation_id === selectedChat.id) {
                setChatMessages(prev => [...prev, msg]);
            }
        });

        return () => {
            socket.disconnect();
            clearInterval(interval);
        };
    }, [selectedChat]);

    // Scroll to bottom when chatting
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const fetchConversations = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/support/conversations');
            setConversations(res.data);
        } catch (e) { console.log(e); }
    };

    const handleSelectChat = async (conv) => {
        setSelectedChat(conv);
        socket.emit('join_room', conv.id);
        try {
            const res = await axios.get(`http://localhost:3000/api/chat/${conv.id}/history`);
            setChatMessages(res.data.messages);
        } catch (e) { console.log(e); }
    };

    const takeOver = async () => {
        if (!selectedChat) return;
        await axios.post('http://localhost:3000/api/support/takeover', { conversationId: selectedChat.id });
        fetchConversations();
        // Update local state manually
        setSelectedChat({ ...selectedChat, handled_by: 'human', needs_human: false });
    };

    const releaseChat = async () => {
        if (!selectedChat) return;
        await axios.post('http://localhost:3000/api/support/release', { conversationId: selectedChat.id });
        fetchConversations();
        setSelectedChat({ ...selectedChat, handled_by: 'ai' });
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedChat) return;

        socket.emit('support_message', { conversationId: selectedChat.id, content: input });
        setInput('');
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Sidebar List */}
            <div className="w-80 border-r border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700 font-bold text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" /> Support Dashboard
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => handleSelectChat(conv)}
                            className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition ${selectedChat?.id === conv.id ? 'bg-gray-800' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-mono text-xs text-gray-500">{conv.id.slice(0, 8)}...</span>
                                {conv.needs_human && <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-xs rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Help</span>}
                                {!conv.needs_human && conv.handled_by === 'human' && <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded-full">Active</span>}
                                {!conv.needs_human && conv.handled_by === 'ai' && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-500 text-xs rounded-full">AI</span>}
                            </div>
                            <div className="text-sm text-gray-300 truncate">{conv.summary || 'No summary'}</div>
                            <div className="text-xs text-gray-600 mt-2">{new Date(conv.updated_at).toLocaleTimeString()}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-900">
                {selectedChat ? (
                    <>
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800">
                            <div>
                                <h2 className="font-semibold">Chat {selectedChat.id.slice(0, 8)}...</h2>
                                <span className="text-xs text-gray-400">Status: {selectedChat.handled_by}</span>
                            </div>
                            <div className="flex gap-2">
                                {selectedChat.handled_by === 'ai' ? (
                                    <button onClick={takeOver} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-semibold transition">Take Over</button>
                                ) : (
                                    <button onClick={releaseChat} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-semibold transition">Release to AI</button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'human' || msg.sender === 'support' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-lg ${(msg.sender === 'human' || msg.sender === 'support')
                                            ? 'bg-green-600 text-white'
                                            : (msg.sender === 'ai' ? 'bg-gray-700 text-gray-200 border border-gray-600' : 'bg-blue-600 text-white')
                                        }`}>
                                        <div className="text-xs opacity-50 mb-1 capitalize">{msg.sender}</div>
                                        <p>{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {selectedChat.handled_by === 'human' ? (
                            <div className="p-4 border-t border-gray-700 bg-gray-800">
                                <form onSubmit={sendMessage} className="flex gap-2">
                                    <input
                                        className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Reply as support..."
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                    />
                                    <button className="bg-green-600 p-2 rounded-lg hover:bg-green-700"><Send className="w-5 h-5" /></button>
                                </form>
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-800 border-t border-gray-700 text-center text-gray-500 text-sm">
                                Conversation is handled by AI. Take over to reply.
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a conversation to manage
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportDashboard;
