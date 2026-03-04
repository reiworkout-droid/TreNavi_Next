type User = {
  id: number;
  name: string;
  roles: string[];
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};