import React, { useState } from "react";

const Contact = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Thank you, ${name}! Your message has been sent:\n\n${message}`);
        setName(""); setEmail(""); setMessage("");
    };

    const isFormValid = name.trim() && email.trim() && message.trim();

    return (
        <div className="min-h-screen bg-tertiary flex flex-col justify-center items-center px-6 md:px-32 pt-24">
            <h1 className="text-5xl font-extrabold text-primary mb-10">Contact Us</h1>

            <div className="w-full md:w-2/3 bg-white rounded-xl shadow-md p-8 space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-secondary">Our Info</h2>
                    <p>Near Hussameddine Rafik El Hariri Saida, Lebanon</p>
                    <p>+961 03 299 844</p>
                    <p>info@burgero.com</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" className="w-full border rounded-md p-2" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" className="w-full border rounded-md p-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <textarea placeholder="Your Message" className="w-full border rounded-md p-2 resize-none h-32" value={message} onChange={(e) => setMessage(e.target.value)} required />
                    <button type="submit" disabled={!isFormValid} className={`w-full py-2 rounded-md text-white font-semibold transition duration-300 ${isFormValid ? "bg-primary hover:scale-105" : "bg-gray-400 cursor-not-allowed"}`}>
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;