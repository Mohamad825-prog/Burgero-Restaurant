import React, { useState } from "react";
import apiService from '../services/apiService';

const Contact = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const messageData = {
                name: name.trim(),
                email: email.trim(),
                message: message.trim()
            };

            const result = await apiService.sendMessage(messageData);

            alert(`Thank you, ${name}! Your message has been sent.\n\nMessage ID: ${result.data.id}`);
            setName("");
            setEmail("");
            setMessage("");
        } catch (error) {
            alert(`Error: ${error.message}\n\nPlease try again.`);
            console.error('Message submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = name.trim() && email.trim() && message.trim();

    return (
        <div className="min-h-screen bg-tertiary flex flex-col justify-center items-center px-6 md:px-32 pt-24">
            <h1 className="text-5xl font-extrabold text-primary mb-10">Contact Us</h1>

            <div className="w-full md:w-2/3 bg-white rounded-xl shadow-md p-8 space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-secondary">Our Info</h2>
                    <p>📍 Near Hussameddine Rafik El Hariri Saida, Lebanon</p>
                    <p>📞 +961 03 299 844</p>
                    <p>✉️ info@burgero.com</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Your Name *"
                        className="w-full border rounded-md p-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                    <input
                        type="email"
                        placeholder="Your Email *"
                        className="w-full border rounded-md p-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                    <textarea
                        placeholder="Your Message *"
                        className="w-full border rounded-md p-2 resize-none h-32"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className={`w-full py-2 rounded-md text-white font-semibold transition duration-300 ${isFormValid && !isSubmitting ? "bg-primary hover:scale-105" : "bg-gray-400 cursor-not-allowed"}`}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>

                <div className="text-xs text-gray-500 text-center">
                    <p>We typically respond within 24 hours.</p>
                </div>
            </div>
        </div>
    );
};

export default Contact;