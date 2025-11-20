import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // NEW

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Start loader

    try {
      const res = await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
      setMsg(res.data.message);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="max-w-md mx-auto mt-32 bg-white p-8 rounded shadow text-center">
      <h2 className="text-2xl mb-4 font-bold">Forgot Password?</h2>
      {sent ? (
        <div className="text-green-600">{msg}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 border rounded mb-4"
            type="email"
            required
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button
            className={`w-full bg-blue-600 text-white p-3 rounded transition duration-200 ${loading ? 'bg-blue-400 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                {/* Spinner */}
                <span className="animate-spin inline-block w-5 h-5 border-2 border-t-transparent border-white rounded-full"></span>
                Sending...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
          {error && <div className="mt-2 text-red-600">{error}</div>}
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
