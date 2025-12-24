'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiUser, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ username, password, remember }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.success) {
        router.refresh();
        router.push('/');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // prevent background scroll while the login modal is open
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500 text-white rounded-full p-3">
            <FiLock size={20} />
          </div>
          <h2 className="text-xl font-semibold">Masuk ke Catatan Keuangan</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <div className="mt-1 mb-4 relative">
            <FiUser className="absolute left-3 top-3 text-gray-400" />
            <input
              id="username"
              name="username"
              type="text"
              required
              className="pl-10 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="mt-1 mb-4 relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="pl-10 pr-10 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">Ingat saya</span>
            </label>
          </div>

          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none disabled:opacity-60"
          >
            {loading ? 'Memproses...' : (
              <>
                <FiCheck />
                <span>Masuk</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}