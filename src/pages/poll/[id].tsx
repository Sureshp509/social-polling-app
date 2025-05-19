import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Poll } from '../../types';
import PollCard from '../../components/PollCard';

export default function PollDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchPoll = async () => {
      const { data } = await supabase.from('polls').select('*').eq('id', id).single();
      setPoll(data);
    };

    fetchPoll();
  }, [id]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };

    getUser();
  }, []);

  const handleVote = async (optionId: string) => {
    if (!user) {
      alert("Please login to vote!");
      return;
    }

    // Check if user has already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('poll_id', id)
      .eq('user_id', user.id)
      .single();

    if (existingVote) {
      alert("You have already voted in this poll.");
      return;
    }

    // Insert vote into Supabase
    const { error } = await supabase.from('votes').insert([{ poll_id: id, option_id, user_id: user.id }]);

    if (error) {
      alert(error.message);
    } else {
      alert("Vote cast successfully!");
    }
  };

  if (!poll) return <p>Loading poll...</p>;

  return (
    <div className="p-4">
      <PollCard poll={poll} onVote={handleVote} />
    </div>
  );
}
