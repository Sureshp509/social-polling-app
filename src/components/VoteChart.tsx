import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Poll } from '../types';

interface VoteChartProps {
  poll: Poll;
}

const VoteChart: React.FC<VoteChartProps> = ({ poll }) => {
  if (!poll?.options || poll.options.length === 0) {
    return <p>No data to display.</p>;
  }

  const data = {
    labels: poll.options.map((opt) => opt.text),
    datasets: [
      {
        label: 'Votes',
        data: poll.options.map((opt) => opt.votes),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return <Bar data={data} />;
};

export default VoteChart;
