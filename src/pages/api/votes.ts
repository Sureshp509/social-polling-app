import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { poll_id, option_id, user_id } = req.body;

  // Check if user has already voted
  const { data: existingVote } = await supabase
    .from('votes')
    .select('*')
    .eq('poll_id', poll_id)
    .eq('user_id', user_id)
    .single();

  if (existingVote) return res.status(400).json({ error: 'User has already voted in this poll' });

  // Insert vote
  const { data, error } = await supabase.from('votes').insert([{ poll_id, option_id, user_id }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ vote: data[0] });
}
