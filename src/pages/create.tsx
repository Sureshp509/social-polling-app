import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function CreatePoll() {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['']);

  const addOption = () => setOptions([...options, '']);
  const handleOptionChange = (index: number, text: string) => {
    const updated = [...options];
    updated[index] = text;
    setOptions(updated);
  };

  const createPoll = async () => {
    await supabase.from('polls').insert([{ title }]);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Create a Poll</h1>
      <input
        className="border p-2 w-full mt-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
      <button onClick={addOption} className="mt-2 bg-green-500 text-white p-2 rounded-md">
        Add Option
      </button>
      <button onClick={createPoll} className="mt-2 bg-blue-500 text-white p-2 rounded-md">
        Create Poll
      </button>
    </div>
  );
}
