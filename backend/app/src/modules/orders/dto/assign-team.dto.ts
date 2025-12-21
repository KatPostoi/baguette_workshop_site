import { IsUUID } from 'class-validator';

export class AssignTeamDto {
  @IsUUID()
  teamId!: string;
}
