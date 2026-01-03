import React, { useState } from "react";
import apiService from '../services/apiService';

const OrderModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [order, setOrder] = useState("");
    const [time, setTime] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const orderData = {
                name: name.trim(),
                phone: phone.trim(),
                order: order.trim(),
                time: time
            };

            const result = await apiService.createOrder(orderData);

            alert(
                `Thank you, ${name}! Your order has been received:\n\n` +
                `Order: ${order}\nPhone: ${phone}\nTime: ${time}\n\n` +
                `Order ID: ${result.data.id}\nStatus: ${result.data.status}`
            );

            // Reset form
            setName("");
            setPhone("");
            setOrder("");
            setTime("");
            onClose();

        } catch (error) {
            alert(`Error: ${error.message}\n\nPlease try again.`);
            console.error('Order submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = name.trim() && phone.trim() && order.trim() && time.trim();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-11/12 max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-lg"
                    disabled={isSubmitting}
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold mb-4 text-primary">Place Your Order</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name *"
                        className="w-full border rounded-md p-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number *"
                        className="w-full border rounded-md p-2"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                    <textarea
                        placeholder="Your Order Details *"
                        className="w-full border rounded-md p-2 resize-none h-24"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                    <div>
                        <label className="block text-gray-700 mb-1">Preferred Time *</label>
                        <input
                            type="time"
                            className="w-full border rounded-md p-2"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 rounded-md text-white font-semibold transition duration-300 ${isFormValid && !isSubmitting ? "bg-primary hover:scale-105" : "bg-gray-400 cursor-not-allowed"}`}
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Order'}
                    </button>
                </form>

                <div className="mt-4 text-xs text-gray-500 text-center">
                    <p>Your order will be sent directly to the restaurant.</p>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;