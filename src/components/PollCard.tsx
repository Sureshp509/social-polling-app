import React from 'react';
import { Poll, Option } from '../types';

interface PollCardProps {
  poll: Poll;
  onVote: (optionId: string) => void;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onVote }) => {
  console.log("Poll Data:", poll);

  if (!poll || !poll.options) {
    return <p>Loading poll...</p>; // Prevents crashing when poll data is missing
  }

  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-bold">{poll.title}</h2>
      <div className="mt-2">
        {poll.options.map((option: Option) => (
          <button
            key={option.id}
            onClick={() => onVote(option.id)}
            className="block w-full p-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {option.text} ({option.votes} votes)
          </button>
        ))}
      </div>
    </div>
  );
};

export default PollCard;
