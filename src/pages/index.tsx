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
       <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
   
    <input
      className="border border-gray-300 p-3 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      type="email"
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      className="border border-gray-300 p-3 w-full mb-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      type="password"
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
    />

    <div className="flex justify-between gap-4">
      <button
        onClick={() => handleAuth('signup')}
        className="flex-1 bg-green-500 hover:bg-green-600 text-white p-3 rounded-md font-semibold transition"
      >
        Sign Up
      </button>
      <button
        onClick={() => handleAuth('login')}
        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md font-semibold transition"
      >
        Login
      </button>
    </div>
  </div>
</div>

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
