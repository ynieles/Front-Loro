export interface LoginPayLoad {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string | number;
  nombre?: string;
  email?: string;
  rol?: string;
}

export interface LoginResponse {
  status: string;
  token?: string;
  data?: UserProfile;
}
