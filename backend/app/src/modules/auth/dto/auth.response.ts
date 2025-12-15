import { UserProfileResponse } from '../../users/dto/user-profile.response';

export interface AuthResponse {
  token: string;
  user: UserProfileResponse;
}
