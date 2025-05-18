import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, action } = req.body;

    if (action === 'signup') {
      const { user, error } = await supabase.auth.signUp({ email, password });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ user });
    }

    if (action === 'login') {
      const { user, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ user });
    }

    if (action === 'logout') {
      const { error } = await supabase.auth.signOut();
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ message: 'Logged out' });
    }
  }

  res.status(405).end();
}
