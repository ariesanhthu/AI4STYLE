export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}
