export interface Poll {
  id: string;
  title: string;
  options: Option[];
  created_at: string;
}

export interface Option {
  id: string;
  text: string;
  votes: number;
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
}
