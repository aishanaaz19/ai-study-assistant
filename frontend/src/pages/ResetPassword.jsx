import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Password validation function
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!passwordRegex.test(password)) {
      setError('Password must contain at least one letter, one number, and one special character.');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3000/api/auth/reset-password/${token}`, { password });
      setMsg(res.data.message);
      setSuccess(true);
      setTimeout(() => navigate('/auth'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-32 bg-white p-8 rounded shadow">
      <h2 className="text-2xl mb-4 font-bold">Reset Your Password</h2>
      {success && <div className="text-green-600">{msg} Redirecting...</div>}
      <form onSubmit={handleSubmit}>
        <input
          className="w-full p-3 border rounded mb-4"
          type="password"
          required
          placeholder="New password (min 6 chars, 1 letter, 1 number, 1 special char)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white p-3 rounded" type="submit">
          Reset Password
        </button>
        {error && <div className="mt-2 text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default ResetPassword;
