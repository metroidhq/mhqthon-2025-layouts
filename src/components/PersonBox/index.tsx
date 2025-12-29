import { useEffect } from 'react';
import { css } from '@emotion/react';

import { FlexContainer } from '@components/shared/FlexContainer';
import { PersonInfo } from '@components/PersonInfo';
import { useDispatch, useSelector } from '@store';
import { useLazyGetUserChatColorsQuery } from '@store/apis/twitch/getUserChatColors';
import { useLazyGetUsersQuery } from '@store/apis/twitch/getUsers';

export const PersonBox = () => {
  const dispatch = useDispatch();
  const { broadcasterId } = useSelector(({ info }) => info);
  const [
    getUserChatColors,
    { data: userChatColorsData, /* error: userChatColorsError, */ isLoading: isUserChatColorsLoading },
  ] = useLazyGetUserChatColorsQuery();
  const [getUsers, { data: usersData, /* error: usersError, */ isLoading: isUsersLoading }] = useLazyGetUsersQuery();
  const isLoading = isUserChatColorsLoading || isUsersLoading;
  const isRenderable = !!(userChatColorsData && usersData);

  const cssContainer = css`
    position: relative;
    flex: 3;
    /* filter: drop-shadow(#000000 0 0 calc(var(--padding) * 0.375)); */
  `;
  const cssLogo = css`
    margin-left: calc(var(--padding) / 2);
    /* filter: drop-shadow(#000000 0 0 calc(var(--padding) * 0.375)); */
  `;

  // Get supporting person data
  useEffect(() => {
    if (broadcasterId) {
      getUserChatColors({ userIds: [broadcasterId] });
      getUsers({ ids: [broadcasterId] });
    }
  }, [broadcasterId, dispatch, getUserChatColors, getUsers]);

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return false;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <img src={usersData.data[0].profile_image_url} css={cssLogo} />
      <PersonInfo person={usersData.data[0]} />
    </FlexContainer>
  );
};
