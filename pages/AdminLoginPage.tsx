import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } 
    // The App component's onAuthStateChange listener will handle navigation.
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-sm text-white">
        <div className="text-center mb-8">
            <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <img 
                    src="https://i.postimg.cc/MKMSvBCd/Leo-Fishbar-Logo-150x150.png" 
                    alt="Leominster Fish Bar Logo" 
                    className="h-20 w-20" 
                />
            </div>
            <h1 className="font-script text-white text-3xl mt-2">Leominster Fish Bar</h1>
            <h2 className="text-2xl font-heading font-bold mt-4">Admin Portal</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-brand-red focus:border-brand-red"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-brand-red focus:border-brand-red"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-brand-red hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-red disabled:bg-gray-500"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
