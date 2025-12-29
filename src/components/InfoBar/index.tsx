import { css } from '@emotion/react';

import { CharityBox } from '@components/CharityBox';
import { ChatBox } from '@components/ChatBox';
import { FlexContainer } from '@components/shared/FlexContainer';
import { MessageHandler } from '@components/MessageHandler';
import { PersonBox } from '@components/PersonBox';
import { useDispatch, useSelector } from '@store';
import { useGetUserChatColorsQuery } from '@store/apis/twitch/getUserChatColors';
import { useEffect } from 'react';
import { setInfo } from '@store/slices/info';

export const InfoBar = () => {
  const dispatch = useDispatch();
  const { broadcasterId, broadcasterColor } = useSelector(({ info }) => info);
  const {
    data: userChatColorsData,
    // error: userChatColorsError,
    isLoading: isUserChatColorsLoading,
  } = useGetUserChatColorsQuery({ userIds: [broadcasterId] });
  const isRenderable = !!(broadcasterId && broadcasterColor !== null);

  const cssBar = css`
    position: absolute;
    bottom: 0;
    width: var(--bar-width);
    height: var(--bar-height);
    background-color: #39cb62;
    overflow: hidden;
    filter: drop-shadow(#000000 0 0 calc(var(--padding) * 0.375));
  `;

  // Set broadcaster color if user chat colors data exists
  useEffect(() => {
    if (userChatColorsData) dispatch(setInfo({ broadcasterColor: userChatColorsData.data[0].color }));
  }, [dispatch, userChatColorsData]);

  // Render nothing if data is loading or required data is incomplete
  if (isUserChatColorsLoading || !isRenderable) return false;

  // Render component
  return (
    <FlexContainer css={cssBar}>
      <MessageHandler />
      <PersonBox />
      <ChatBox />
      <CharityBox />
    </FlexContainer>
  );
};
