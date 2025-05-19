import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, options, user_id } = req.body;
    const { data, error } = await supabase.from('polls').insert([{ title, user_id }]).select();

    if (!data || error) return res.status(500).json({ error: error?.message || "Failed to create poll." });

    const pollId = data[0].id;
    const optionData = options.map((text: string) => ({ poll_id: pollId, text }));
    await supabase.from('options').insert(optionData);

    res.status(201).json({ poll: data[0] });
  }

  res.status(405).end();
}
