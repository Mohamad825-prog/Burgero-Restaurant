// admin-frontend/src/pages/ContactMessagesPage.js
import React, { useState, useEffect, useCallback } from "react";
import adminApiService from '../services/adminApiService';

const ContactMessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const loadMessages = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedMessages = await adminApiService.getMessages();
            console.log('Fetched messages:', fetchedMessages);
            setMessages(fetchedMessages || []);
        } catch (error) {
            console.error('Error loading messages:', error);
            setError('Failed to load messages from server');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMessages();

        // Set up auto-refresh every 10 seconds
        const intervalId = setInterval(() => {
            loadMessages();
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [loadMessages]);

    const handleViewMessage = async (message) => {
        setSelectedMessage(message);
        if (!message.is_read && !message.read) {
            try {
                await adminApiService.markMessageAsRead(message.id);
                loadMessages();
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        }
    };

    const handleDeleteMessage = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await adminApiService.deleteMessage(id);
                setSuccess('Message deleted successfully');
                setTimeout(() => setSuccess(null), 3000);
                loadMessages();
                if (selectedMessage && selectedMessage.id === id) {
                    setSelectedMessage(null);
                }
            } catch (error) {
                console.error('Error deleting message:', error);
                setError('Failed to delete message');
            }
        }
    };

    const handleDeleteAll = async () => {
        if (window.confirm('Are you sure you want to delete ALL messages?')) {
            try {
                await adminApiService.deleteAllMessages();
                setSuccess('All messages deleted successfully');
                setTimeout(() => setSuccess(null), 3000);
                loadMessages();
                setSelectedMessage(null);
            } catch (error) {
                console.error('Error deleting all messages:', error);
                setError('Failed to delete all messages');
            }
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await adminApiService.markAllMessagesAsRead();
            setSuccess('All messages marked as read');
            setTimeout(() => setSuccess(null), 3000);
            loadMessages();
        } catch (error) {
            console.error('Error marking all as read:', error);
            setError('Failed to mark all messages as read');
        }
    };

    const filteredMessages = messages.filter(msg => {
        if (filter === 'unread') return !msg.is_read && !msg.read;
        if (filter === 'read') return msg.is_read || msg.read;
        return true;
    });

    const unreadCount = messages.filter(m => !m.is_read && !m.read).length;
    const readCount = messages.filter(m => m.is_read || m.read).length;

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';

        try {
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toLocaleString();
            }
        } catch (e) {
            console.log('Error formatting date:', e);
        }

        return String(dateString);
    };

    return (
        <div className="min-h-screen bg-tertiary px-6 md:px-32 pt-24 pb-10">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-5xl font-extrabold text-primary">Contact Messages</h1>
                <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700">{success}</p>
                </div>
            )}

            {/* Stats */}
            <div className="mb-6 bg-white rounded-xl shadow-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">{messages.length}</div>
                        <div className="text-gray-600">Total Messages</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-700">{unreadCount}</div>
                        <div className="text-gray-600">Unread</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">{readCount}</div>
                        <div className="text-gray-600">Read</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Messages List */}
                <div className="lg:w-1/2 bg-white rounded-xl shadow-md p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-secondary">
                            Messages ({filteredMessages.length})
                            {filter !== 'all' && (
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    ({filter})
                                </span>
                            )}
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="border rounded-md p-2 text-sm"
                            >
                                <option value="all">All Messages</option>
                                <option value="unread">Unread Only</option>
                                <option value="read">Read Only</option>
                            </select>

                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
                                >
                                    Mark All as Read
                                </button>
                            )}

                            {messages.length > 0 && (
                                <button
                                    onClick={handleDeleteAll}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm"
                                >
                                    Delete All
                                </button>
                            )}

                            <button
                                onClick={loadMessages}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
                            >
                                ↻ Refresh
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                            <p className="mt-2 text-gray-600">Loading messages...</p>
                        </div>
                    ) : filteredMessages.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">
                                {messages.length === 0 ? 'No messages yet' : 'No messages match the filter'}
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                                Messages sent from the user website will appear here
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto">
                            {filteredMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedMessage?.id === message.id ? 'border-primary bg-blue-50' : ''
                                        } ${(!message.is_read && !message.read) ? 'border-l-4 border-l-red-500' : ''}`}
                                    onClick={() => handleViewMessage(message)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                {message.name || 'No Name'}
                                                {(!message.is_read && !message.read) && (
                                                    <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                                                        NEW
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-gray-600 text-sm">{message.email || 'No Email'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-gray-400 text-sm">
                                                {formatDate(message.created_at || message.date)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mt-2 line-clamp-2">
                                        {message.message || message.body || 'No message content'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Message Details */}
                <div className="lg:w-1/2 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-secondary mb-6">Message Details</h2>

                    {selectedMessage ? (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold">{selectedMessage.name || 'No Name'}</h3>
                                        <p className="text-gray-600">{selectedMessage.email || 'No Email'}</p>
                                    </div>
                                    {(!selectedMessage.is_read && !selectedMessage.read) && (
                                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                                            UNREAD
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Message ID</p>
                                        <p className="font-medium text-gray-500">{selectedMessage.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Received</p>
                                        <p className="font-medium">
                                            {formatDate(selectedMessage.created_at || selectedMessage.date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Status</p>
                                        <p className="font-medium">
                                            {(selectedMessage.is_read || selectedMessage.read) ? '✓ Read' : '○ Unread'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-bold text-gray-700">Message:</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {selectedMessage.message || selectedMessage.body || 'No message content'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t">
                                <button
                                    onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=Re: Your message to Burgero&body=Dear ${selectedMessage.name},%0D%0A%0D%0A`}
                                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition flex items-center justify-center gap-2"
                                >
                                    ✉️ Reply via Email
                                </button>
                                <button
                                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                                >
                                    Delete Message
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Select a message to view details</p>
                            <p className="text-sm text-gray-400 mt-2">
                                {messages.length > 0
                                    ? 'Click on any message from the list'
                                    : 'No messages available'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactMessagesPage;