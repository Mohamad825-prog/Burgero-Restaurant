import React, { useState, useEffect, useCallback } from "react";
import adminApiService from '../services/adminApiService';

const OrderManagementPage = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshCount, setRefreshCount] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const loadOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedOrders = await adminApiService.getOrders();
            console.log('Fetched orders:', fetchedOrders);
            setOrders(fetchedOrders || []);
            setRefreshCount(prev => prev + 1);
        } catch (error) {
            console.error('Error loading orders:', error);
            setError('Failed to load orders from server');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();

        // Set up auto-refresh every 10 seconds
        const intervalId = setInterval(() => {
            loadOrders();
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [loadOrders]);

    const updateOrderStatus = async (id, status) => {
        try {
            console.log(`Updating order ${id} to status: ${status}`);

            await adminApiService.updateOrderStatus(id, status);
            setSuccess(`Order status updated to ${status}`);
            setTimeout(() => setSuccess(null), 3000);

            // Refresh orders list
            loadOrders();

            // Update selected order if it's the one being updated
            if (selectedOrder && selectedOrder.id === id) {
                setSelectedOrder({ ...selectedOrder, status });
            }

        } catch (error) {
            console.error('Error updating order status:', error);
            setError(`Failed to update order status: ${error.message}`);

            // Fallback: Update locally
            const updatedOrders = orders.map(order =>
                order.id === id ? { ...order, status } : order
            );
            setOrders(updatedOrders);

            if (selectedOrder && selectedOrder.id === id) {
                setSelectedOrder({ ...selectedOrder, status });
            }
        }
    };

    const deleteOrder = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await adminApiService.deleteOrder(id);
                setSuccess('Order deleted successfully');
                setTimeout(() => setSuccess(null), 3000);
                loadOrders();
                if (selectedOrder && selectedOrder.id === id) {
                    setSelectedOrder(null);
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                setError('Failed to delete order');

                // Fallback: Delete locally
                const updatedOrders = orders.filter(order => order.id !== id);
                setOrders(updatedOrders);
                if (selectedOrder && selectedOrder.id === id) {
                    setSelectedOrder(null);
                }
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'preparing': return 'bg-blue-100 text-blue-800';
            case 'ready': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTime = (time) => {
        if (!time) return 'Not specified';

        // If time is already in HH:MM format
        if (typeof time === 'string' && time.includes(':')) {
            return time;
        }

        // If time is a Date object or timestamp
        try {
            const date = new Date(time);
            if (!isNaN(date.getTime())) {
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
        } catch (e) {
            console.log('Error formatting time:', e);
        }

        return String(time);
    };

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

    const pendingOrders = orders.filter(o => o.status?.toLowerCase() === 'pending').length;
    const preparingOrders = orders.filter(o => o.status?.toLowerCase() === 'preparing').length;
    const readyOrders = orders.filter(o => o.status?.toLowerCase() === 'ready').length;
    const cancelledOrders = orders.filter(o => o.status?.toLowerCase() === 'cancelled').length;

    return (
        <div className="min-h-screen bg-tertiary px-6 md:px-32 pt-24 pb-10">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-5xl font-extrabold text-primary">Order Management</h1>
                <div className="text-sm text-gray-500">
                    Auto-refresh: {refreshCount} | Last: {new Date().toLocaleTimeString()}
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

            <div className="mb-6 bg-white rounded-xl shadow-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-700">{pendingOrders}</div>
                        <div className="text-gray-600">Pending</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">{preparingOrders}</div>
                        <div className="text-gray-600">Preparing</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">{readyOrders}</div>
                        <div className="text-gray-600">Ready</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-700">{cancelledOrders}</div>
                        <div className="text-gray-600">Cancelled</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Orders List */}
                <div className="lg:w-1/2 bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-secondary">
                            All Orders ({orders.length})
                        </h2>
                        <button
                            onClick={loadOrders}
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                        >
                            ↻ Refresh
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                            <p className="mt-2 text-gray-600">Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No orders yet</p>
                            <p className="text-sm text-gray-400 mt-2">Orders placed on the user website will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedOrder?.id === order.id ? 'border-primary bg-blue-50' : ''
                                        }`}
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                {order.customer_name || order.name || 'No Name'}
                                            </h3>
                                            <p className="text-gray-600">{order.phone || 'No Phone'}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                                            {order.status || 'pending'}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 mt-2 truncate">
                                        {order.order_details || order.order || 'No order details'}
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-gray-500 text-sm">
                                            Time: {formatTime(order.order_time || order.time)}
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            {formatDate(order.created_at || order.date)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order Details */}
                <div className="lg:w-1/2 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-secondary mb-6">Order Details</h2>

                    {selectedOrder ? (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold">{selectedOrder.customer_name || selectedOrder.name || 'No Name'}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600 text-sm">Phone</p>
                                        <p className="font-medium">{selectedOrder.phone || 'No phone'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Order ID</p>
                                        <p className="font-medium text-gray-500">{selectedOrder.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Order Time</p>
                                        <p className="font-medium">{formatTime(selectedOrder.order_time || selectedOrder.time)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Status</p>
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                                            {selectedOrder.status || 'pending'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Order Date</p>
                                    <p className="font-medium">{formatDate(selectedOrder.created_at || selectedOrder.date)}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-bold text-gray-700">Order Details:</h4>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                                    {selectedOrder.order_details || selectedOrder.order || 'No order details available'}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-700">Update Status:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['pending', 'preparing', 'ready', 'cancelled'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                            className={`px-4 py-2 rounded-md capitalize ${selectedOrder.status === status
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t">
                                <button
                                    onClick={() => window.open(`tel:${selectedOrder.phone}`)}
                                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition flex items-center justify-center gap-2"
                                >
                                    📞 Call Customer
                                </button>
                                <button
                                    onClick={() => deleteOrder(selectedOrder.id)}
                                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                                >
                                    Delete Order
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Select an order to view details</p>
                            <p className="text-sm text-gray-400 mt-2">
                                {orders.length > 0
                                    ? `Click on any order from the list`
                                    : 'No orders available'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderManagementPage;