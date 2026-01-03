import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminApiService from '../services/adminApiService';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("");  // REMOVED DEFAULT VALUE
    const [password, setPassword] = useState("");  // REMOVED DEFAULT VALUE
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [backendStatus, setBackendStatus] = useState("checking...");
    const [showDebug, setShowDebug] = useState(false);
    const navigate = useNavigate();

    // Check backend status on component mount
    useEffect(() => {
        checkBackendStatus();
    }, []);

    const checkBackendStatus = async () => {
        try {
            setBackendStatus("Checking backend...");
            const response = await fetch('http://localhost:5000/api/health');
            const data = await response.json();
            setBackendStatus(`✅ Backend: ${data.service} (${data.status})`);
            return true;
        } catch (err) {
            setBackendStatus(`❌ Backend not reachable: ${err.message}`);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            console.log('=== LOGIN ATTEMPT ===');
            console.log('Username:', username);
            console.log('Backend URL:', 'http://localhost:5000/api/auth/login');

            // Validate inputs
            if (!username.trim() || !password.trim()) {
                throw new Error('Please enter both username and password');
            }

            // Check backend first
            const backendOk = await checkBackendStatus();
            if (!backendOk) {
                throw new Error('Backend is not reachable. Please start the backend server.');
            }

            // Try real login
            console.log('Attempting real login...');
            const response = await adminApiService.login({
                username: username.trim(),
                password: password.trim()
            });

            console.log('Login response:', response);

            if (response.success && response.token) {
                console.log('✅ Login successful! Token received.');
                onLogin(response.token);
                navigate("/");
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (err) {
            console.error('❌ Login error:', err);

            let errorMessage = err.message || "Login failed";

            // Provide helpful suggestions
            if (err.message.includes('Invalid credentials') || err.message.includes('User not found')) {
                errorMessage = `
                    Invalid credentials.
                    
                    Please use:
                    Username: admin
                    Password: admin123
                `;
            } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                errorMessage = `
                    Cannot connect to backend server.
                    
                    Please ensure:
                    1. Backend is running (cd burgero-backend && npm start)
                    2. You see "Server running on port 5000"
                    3. Open http://localhost:5000/api/health in browser
                `;
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAdmin = async () => {
        try {
            setIsLoading(true);
            setError("Creating admin user...");

            const response = await fetch('http://localhost:5000/api/auth/ensure-admin', {
                method: 'POST'
            });

            const data = await response.json();

            if (data.success) {
                setError(`✅ ${data.message}. Now try logging in with admin/admin123`);
            } else {
                setError(`❌ Failed to create admin: ${data.message}`);
            }
        } catch (err) {
            setError(`❌ Error creating admin: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTestToken = () => {
        const token = localStorage.getItem('auth_token');
        console.log('Current token:', token);
        alert(`Token exists: ${!!token}\nToken length: ${token ? token.length : 0}`);
    };

    const handleClearForm = () => {
        setUsername("");
        setPassword("");
        setError("");
    };

    return (
        <div className="min-h-screen bg-tertiary flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-primary mb-8">
                    Burgero Admin Login
                </h1>

                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-blue-700 text-sm">
                        <strong>Backend Status:</strong> {backendStatus}
                    </p>
                    <div className="mt-2 flex gap-2">
                        <button
                            type="button"
                            onClick={checkBackendStatus}
                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                            Check Again
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowDebug(!showDebug)}
                            className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        >
                            {showDebug ? 'Hide Debug' : 'Show Debug'}
                        </button>
                        <button
                            type="button"
                            onClick={handleClearForm}
                            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                            Clear Form
                        </button>
                    </div>
                </div>

                {showDebug && (
                    <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-md">
                        <h3 className="font-bold text-gray-800 text-sm mb-2">Debug Info:</h3>
                        <p className="text-gray-600 text-xs">
                            Token in localStorage: {localStorage.getItem('auth_token') ? 'Present' : 'Missing'}<br />
                            Backend URL: http://localhost:5000<br />
                            Login endpoint: /api/auth/login<br />
                        </p>
                        <button
                            type="button"
                            onClick={handleTestToken}
                            className="text-xs bg-purple-500 text-white px-2 py-1 rounded mt-2 hover:bg-purple-600"
                        >
                            Test Token
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-gray-700 font-semibold">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter username"
                            required
                            disabled={isLoading}
                            autoComplete="username"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-gray-700 font-semibold">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter password"
                            required
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-700 text-sm whitespace-pre-line">{error}</p>
                            <div className="mt-2 flex gap-2 flex-wrap">
                                <button
                                    type="button"
                                    onClick={handleCreateAdmin}
                                    disabled={isLoading}
                                    className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                >
                                    Create Admin User
                                </button>
                                <a
                                    href="http://localhost:5000/api/health"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    Test Backend
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isLoading || !username || !password}
                            className={`flex-1 font-semibold py-3 rounded-md transition ${isLoading || !username || !password
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-opacity-90'
                                }`}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <h3 className="font-bold text-blue-800 text-sm">Security Note:</h3>
                        <p className="text-blue-700 text-xs">
                            • Never share your admin credentials<br />
                            • Change default password in production<br />
                            • Log out after each session<br />
                            • Use strong, unique passwords
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;