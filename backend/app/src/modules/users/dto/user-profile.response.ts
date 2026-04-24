import { UserRole } from '@prisma/client';

export interface UserProfileResponse {
  id: string;
  email: string;
  phone: string | null;
  fullName: string;
  gender: string | null;
  role: UserRole;
  isActive: boolean;
}
