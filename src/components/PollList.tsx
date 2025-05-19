'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import PollCard from '../components/PollCard';
import { useUser } from '@supabase/auth-helpers-react';
import { Poll } from '../types';

const PollList = () => {
  const user = useUser();
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const fetchPolls = async () => {
      const { data, error } = await supabase
        .from('polls')
        .select('id, title, options(id, text, votes)')
        .order('created_at', { ascending: false });

      if (data) setPolls(data as Poll[]);
    };

    fetchPolls();
  }, []);

  const handleVote = async (pollId: string, optionId: string) => {
    if (!user) return alert('You must be logged in to vote.');

    // Check if already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('poll_id', pollId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingVote) {
      alert('You have already voted on this poll.');
      return;
    }

    // Insert vote
    const { error } = await supabase.from('votes').insert([
      {
        poll_id: pollId,
        option_id: optionId,
        user_id: user.id,
      },
    ]);

    if (error) {
      alert('Failed to vote.');
      return;
    }

    // Increment vote count in options table (optional — if you're storing it)
    await supabase.rpc('increment_vote', { option_id_input: optionId });

    // Re-fetch polls
    const { data } = await supabase
      .from('polls')
      .select('id, title, options(id, text, votes)');
    if (data) setPolls(data as Poll[]);
  };

  return (
    <div className="space-y-4 p-4 max-w-xl mx-auto">
     
      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          poll={poll}
          onVote={(optionId) => handleVote(poll.id, optionId)}
        />
      ))}
    </div>
  );
};

export default PollList;
