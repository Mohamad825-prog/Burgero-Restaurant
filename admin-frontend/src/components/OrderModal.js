import React, { useState } from "react";

const OrderModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [order, setOrder] = useState("");
    const [time, setTime] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(
            `Thank you, ${name}! Your order has been received:\n\n` +
            `Order: ${order}\nPhone: ${phone}\nTime: ${time}`
        );
        // Reset form
        setName("");
        setPhone("");
        setOrder("");
        setTime("");
        onClose();
    };

    // Button enabled only if all fields are filled
    const isFormValid = name.trim() && phone.trim() && order.trim() && time.trim();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-11/12 max-w-md p-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-lg"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold mb-4 text-primary">Place Your Order</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full border rounded-md p-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full border rounded-md p-2"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Your Order"
                        className="w-full border rounded-md p-2 resize-none h-24"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        required
                    />
                    <input
                        type="time"
                        className="w-full border rounded-md p-2"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className={`w-full py-2 rounded-md text-white font-semibold transition duration-300 ${isFormValid ? "bg-primary hover:scale-105" : "bg-gray-400 cursor-not-allowed"
                            }`}
                        disabled={!isFormValid}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrderModal;