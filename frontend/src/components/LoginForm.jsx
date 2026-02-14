import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center text-white font-serif font-bold text-3xl shadow-lg">
              A
            </div>
          </div>
          <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
            ABiZ
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold mt-1">
            Connecting students to industries
          </p>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Student ID
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-coral-500 dark:focus:ring-coral-400 focus:border-transparent transition-colors"
                placeholder="cb.sc.u4aie24315"
                value={formData.username}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Format: cb.sc.u4aie24*** (where *** are 3 digits)
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-coral-500 dark:focus:ring-coral-400 focus:border-transparent transition-colors"
                placeholder="Same as your Student ID"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 dark:hover:from-coral-400 dark:hover:to-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Demo Credentials */}
          <div className="bg-coral-50 dark:bg-coral-900/20 border border-coral-200 dark:border-coral-800 rounded-lg p-4">
            <p className="text-xs font-semibold text-coral-700 dark:text-coral-400 mb-2">📌 Demo Credentials:</p>
            <p className="text-xs text-coral-600 dark:text-coral-400 font-medium">
              <span className="block">ID: cb.sc.u4aie24315</span>
              <span className="block">Pass: cb.sc.u4aie24315</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}