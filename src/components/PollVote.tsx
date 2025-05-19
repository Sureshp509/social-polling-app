// components/PollVote.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '@supabase/auth-helpers-react';

interface Option {
  id: string;
  text: string;
}

interface Poll {
  id: string;
  title: string;
  options: Option[];
}

interface PollVoteProps {
  poll: Poll;
}

export default function PollVote({ poll }: PollVoteProps) {
  const user = useUser();
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user has already voted
  useEffect(() => {
    const checkVote = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', poll.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) setHasVoted(true);
    };

    checkVote();
  }, [user, poll.id]);

  // Handle vote
  const handleVote = async (optionId: string) => {
    if (!user || hasVoted) return;
    setLoading(true);

    const { error } = await supabase.from('votes').insert([
      {
        poll_id: poll.id,
        option_id: optionId,
        user_id: user.id,
      },
    ]);

    if (!error) setHasVoted(true);
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded shadow bg-white w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">{poll.title}</h2>
      {poll.options.map((option) => (
        <button
          key={option.id}
          className={`block w-full text-left px-4 py-2 my-2 border rounded hover:bg-blue-100 transition ${
            hasVoted ? 'cursor-not-allowed opacity-50' : 'bg-white'
          }`}
          onClick={() => handleVote(option.id)}
          disabled={hasVoted || loading}
        >
          {option.text}
        </button>
      ))}

      {hasVoted && (
        <p className="text-green-600 font-medium mt-4">✅ You have voted!</p>
      )}
    </div>
  );
}
