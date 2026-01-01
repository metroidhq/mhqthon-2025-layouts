import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';

import { BrandInfo } from '@components/BrandInfo';
import { FlexContainer } from '@components/shared/FlexContainer';
import { ScheduleInfo } from '@components/ScheduleInfo';
import { useDispatch, useSelector } from '@store';
import { useLazyGetUserChatColorsQuery } from '@store/apis/twitch/getUserChatColors';
import { useLazyGetUsersQuery } from '@store/apis/twitch/getUsers';

export const InfoBox = () => {
  const dispatch = useDispatch();
  const { broadcasterId } = useSelector(({ info }) => info);
  const [
    getUserChatColors,
    { data: userChatColorsData, /* error: userChatColorsError, */ isLoading: isUserChatColorsLoading },
  ] = useLazyGetUserChatColorsQuery();
  const [getUsers, { data: usersData, /* error: usersError, */ isLoading: isUsersLoading }] = useLazyGetUsersQuery();
  const [activeStates, setActiveStates] = useState<boolean[]>([true, false]);
  const infoBoxIntervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const isLoading = isUserChatColorsLoading || isUsersLoading;
  const isRenderable = !!(userChatColorsData && usersData);

  const cssContainer = css`
    position: relative;
    flex: 3;
    filter: var(--shadow);
  `;
  const cssLogo = css`
    width: calc(var(--bar-height) - var(--padding));s
    height: calc(var(--bar-height) - var(--padding));
    margin: calc(var(--padding) / 2) var(--padding);
    border-radius: 50%;
  `;

  // Get supporting person data
  useEffect(() => {
    if (broadcasterId) {
      getUserChatColors({ userIds: [broadcasterId] });
      getUsers({ ids: [broadcasterId] });
    }
  }, [broadcasterId, dispatch, getUserChatColors, getUsers]);

  // Set info box interval
  useEffect(() => {
    clearInterval(infoBoxIntervalIdRef.current);
    infoBoxIntervalIdRef.current = setInterval(() => setActiveStates((state) => state[state.length - 1] ? ), 60 * 1000);

    return () => clearInterval(infoBoxIntervalIdRef.current);
  }, [infoBoxIntervalIdRef, setActiveStates]);

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return false;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <img src={usersData.data[0].profile_image_url} css={cssLogo} />
      <BrandInfo />
      {/* <ScheduleInfo person={usersData.data[0]} /> */}
    </FlexContainer>
  );
};
