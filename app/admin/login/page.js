'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-5">
      <form onSubmit={handleLogin} className="bg-white border border-border rounded-2xl p-7 w-full max-w-[340px]">
        <div className="w-[38px] h-[38px] rounded-[10px] bg-ink flex items-center justify-center mb-3.5 text-white text-lg">
          🔒
        </div>
        <h1 className="font-display text-lg font-bold mb-1">เข้าสู่ระบบ Admin</h1>
        <p className="text-inkSoft text-xs mb-4">สำหรับ Unnaidee เท่านั้น</p>

        <input
          type="email"
          required
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mb-2.5"
        />
        <input
          type="password"
          required
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input mb-2.5"
        />

        {error && <p className="text-coral text-xs mb-2">{error}</p>}

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-ink hover:bg-coral text-white rounded-[9px] py-2.5 text-sm font-semibold mt-1 transition-colors disabled:opacity-60"
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  );
}
