import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (action: 'signup' | 'login') => {
    const { error } = await supabase.auth[action]({ email, password });
    if (error) alert(error.message);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Auth Page</h1>
      <input className="border p-2 w-full mt-2" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2 w-full mt-2" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => handleAuth('signup')} className="mt-2 bg-green-500 text-white p-2 rounded-md">Sign Up</button>
      <button onClick={() => handleAuth('login')} className="mt-2 bg-blue-500 text-white p-2 rounded-md">Login</button>
    </div>
  );
}
