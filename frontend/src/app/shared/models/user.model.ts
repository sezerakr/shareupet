
export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Added password property
  role: string;
  birthdate?: Date;
  displayName?: string;
  avatar?: string;
}
