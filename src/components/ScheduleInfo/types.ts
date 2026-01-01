import type { TwitchApiGetUsersResponse } from '@store/apis/twitch/getUsers';

export interface ScheduleInfoProps {
  isActive: boolean;
  person: TwitchApiGetUsersResponse['data'][number];
}
