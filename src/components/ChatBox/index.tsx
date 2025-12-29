import { css } from '@emotion/react';

import { ChatMessage } from '@components/ChatMessage';
import { FlexContainer } from '@components/shared/FlexContainer';
import { useGetChatSettingsQuery } from '@store/apis/twitch/getChatSettings';
import { useSelector } from '@store';
import { useGetSharedChatSessionQuery } from '@store/apis/twitch/getSharedChatSession';

export const ChatBox = () => {
  const { broadcasterId, chats } = useSelector(({ info }) => info);
  const {
    data: chatSettingsData,
    // error: chatSettingsError,
    isLoading: isChatSettingsLoading,
  } = useGetChatSettingsQuery({ broadcasterId });
  const {
    data: sharedChatSessionData,
    // error: sharedChatSessionError,
    isLoading: isSharedChatSessionLoading,
  } = useGetSharedChatSessionQuery({ broadcasterId });
  const isLoading = isChatSettingsLoading || isSharedChatSessionLoading;
  const isRenderable = !!(chatSettingsData && sharedChatSessionData);

  const cssContainer = css`
    flex: 3;
  `;
  const cssContainerMessages = css`
    flex: 1;
    gap: calc(var(--padding) / 4);
    justify-content: flex-end;
    line-height: calc((var(--bar-height) - (var(--padding) * 1.5)) / 3);
    padding: 0 var(--padding) calc(var(--padding) / 2) var(--padding);
  `;

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return false;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <FlexContainer column cssContainer={cssContainerMessages}>
        {chats.map((chat, i) => (
          <ChatMessage key={i} event={chat} />
        ))}
      </FlexContainer>
    </FlexContainer>
  );
};
