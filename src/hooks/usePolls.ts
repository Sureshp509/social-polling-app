import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Poll } from '../types';

export function usePolls() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const fetchPolls = async () => {
      const { data } = await supabase.from('polls').select('*');
      setPolls(data || []);
    };

    fetchPolls();

    // Listen for votes in real-time
    const subscription = supabase
      .channel('vote-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, fetchPolls)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return polls;
}
