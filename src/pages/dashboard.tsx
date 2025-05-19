import { usePolls } from '../hooks/usePolls';
import PollCard from '../components/PollCard';

export default function Dashboard() {
  const polls = usePolls();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Poll Results Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} onVote={() => {}} /> 
        ))}
      </div>
    </div>
  );
}
