import { useState } from 'react';
import { User } from '@supabase/auth-js';
import { supabase } from '../lib/supabase';
import PollCard from '../components/PollCard';
import polls from './api/polls';
import Dashboard from './dashboard';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [pollTitle, setPollTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['']);

  // Handle authentication
  const handleAuth = async (action: 'signup' | 'login') => {
    const { data, error } =
      action === 'signup'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
      return;
    }

    setUser(data.user);
  };

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Handle poll creation
  const addOption = () => setOptions([...options, '']);
  const handleOptionChange = (index: number, text: string) => {
    const updated = [...options];
    updated[index] = text;
    setOptions(updated);
  };

  const createPoll = async () => {
    const { data, error } = await supabase
      .from('polls')
      .insert([{ title: pollTitle }])
      .select(); // Ensure data is returned

    if (!data || error) {
      alert(error?.message || "Failed to create poll.");
      return;
    }

    console.log("Poll created:", data);

    const pollId = data[0].id;
    const optionData = options.map((text) => ({ poll_id: pollId, text }));
    await supabase.from('options').insert(optionData);

    alert('Poll created successfully!');
    setPollTitle('');
    setOptions(['']);
};


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Social Polling App</h1>

      {!user ? (
        <>
          <input className="border p-2 w-full mt-2" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input className="border p-2 w-full mt-2" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => handleAuth('signup')} className="mt-2 bg-green-500 text-white p-2 rounded-md">Sign Up</button>
          <button onClick={() => handleAuth('login')} className="mt-2 bg-blue-500 text-white p-2 rounded-md">Login</button>
        </>
      ) : (
        <>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleLogout} className="mt-2 bg-red-500 text-white p-2 rounded-md">Logout</button>

          {/* Poll Creation UI */}
          <div className="mt-4">
            <h2 className="text-lg font-bold">Create a Poll</h2>
            <input
              className="border p-2 w-full mt-2"
              value={pollTitle}
              onChange={(e) => setPollTitle(e.target.value)}
              placeholder="Poll Title"
            />
            {options.map((option, index) => (
              <input
                key={index}
                className="border p-2 w-full mt-2"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
            ))}
            <button onClick={addOption} className="mt-2 bg-green-500 text-white p-2 rounded-md">Add Option</button>
            <button onClick={createPoll} className="mt-2 bg-blue-500 text-white p-2 rounded-md">Create Poll</button>
          </div>
       <Dashboard />
        </>
      )}
    </div>
  );
}
