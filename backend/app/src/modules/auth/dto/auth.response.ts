import { UserProfileResponse } from '../../users/dto/user-profile.response';

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: UserProfileResponse;
}
