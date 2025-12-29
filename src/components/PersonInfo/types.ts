import type { TwitchApiGetUsersResponse } from '@store/apis/twitch/getUsers';

export interface PersonInfoProps {
  person: TwitchApiGetUsersResponse['data'][number];
}
