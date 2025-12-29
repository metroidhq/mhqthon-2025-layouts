import useWebSocket from 'react-use-websocket';
import { useCallback, useEffect, useRef } from 'react';
import * as uuid from 'uuid';

import type { TwitchEventSubMessage, TwitchPubSubMessage } from '@components/types';
import type { TwitchPubSubPinnedChatUpdatesMessageMessage } from '@components/MessageHandler/types';

import {
  addChat,
  clearChats,
  removeChatPinId,
  setChatDeletedTimestamp,
  setChatPinId,
  setUserChatsDeletedTimestamp,
} from '@store/slices/info';
import { addTwitchEventSubMessageId, setTwitchEventSub } from '@store/slices/twitchEventSub';
import { addTwitchPubSubMessageId } from '@store/slices/twitchPubSub';
import { invalidateCharityCampaignTags } from '@store/apis/twitch/getCharityCampaign';
import { namespace } from '@config';
import { updateChatSettingsData } from '@store/apis/twitch/getChatSettings';
import { useDispatch, useSelector } from '@store';
import { useLazyCreateEventSubSubscriptionChannelChatClearQuery } from '@store/apis/twitch/createEventSubSubscription/channelChatClear';
import { useLazyCreateEventSubSubscriptionChannelChatClearUserMessagesQuery } from '@store/apis/twitch/createEventSubSubscription/channelChatClearUserMessages';
import { useLazyCreateEventSubSubscriptionChannelChatMessageDeleteQuery } from '@store/apis/twitch/createEventSubSubscription/channelChatMessageDelete';
import { useLazyCreateEventSubSubscriptionChannelChatMessageQuery } from '@store/apis/twitch/createEventSubSubscription/channelChatMessage';
import { useLazyCreateEventSubSubscriptionChannelChatNotificationQuery } from '@store/apis/twitch/createEventSubSubscription/channelChatNotification';
import { useLazyCreateEventSubSubscriptionChannelChatSettingsUpdateQuery } from '@store/apis/twitch/createEventSubSubscription/channelChatSettingsUpdate';
import { useLazyCreateEventSubSubscriptionChannelSharedChatBeginQuery } from '@store/apis/twitch/createEventSubSubscription/channelSharedChatBegin';
import { useLazyCreateEventSubSubscriptionChannelSharedChatEndQuery } from '@store/apis/twitch/createEventSubSubscription/channelSharedChatEnd';
import { useLazyCreateEventSubSubscriptionChannelSharedChatUpdateQuery } from '@store/apis/twitch/createEventSubSubscription/channelSharedChatUpdate';
import { useLazyGetSharedChatSessionQuery } from '@store/apis/twitch/getSharedChatSession';

export const announcementColors = {
  BLUE: 'linear-gradient(#00d6d6, #9146ff)',
  GREEN: 'linear-gradient(#00db84, #57bee6)',
  ORANGE: 'linear-gradient(#ffb31a, #e0e000)',
  PURPLE: 'linear-gradient(#9146ff, #ff75e6)',
} as const;

export const MessageHandler = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector(({ twitchAuth }) => twitchAuth);
  const { broadcasterId } = useSelector(({ info }) => info);
  const { messageIds: twitchMessageIds, sessionId } = useSelector(({ twitchEventSub }) => twitchEventSub);
  const { messageIds: twitchPSMessageIds } = useSelector(({ twitchPubSub }) => twitchPubSub);
  const { lastJsonMessage: twitchMessage } = useWebSocket<TwitchEventSubMessage>('wss://eventsub.wss.twitch.tv/ws', {
    share: true,
  });
  const {
    lastJsonMessage: twitchPSMessage,
    readyState: twitchPSReadyState,
    sendJsonMessage: sendTwitchPSMessage,
  } = useWebSocket<TwitchPubSubMessage>('wss://pubsub-edge.twitch.tv', {
    share: true,
  });
  const [createEventSubSubscriptionChannelChatClear /* , { error: eventSubSubscriptionChannelChatClearError } */] =
    useLazyCreateEventSubSubscriptionChannelChatClearQuery();
  const [
    createEventSubSubscriptionChannelChatClearUserMessages,
    // { error: eventSubSubscriptionChannelChatClearUserMessagesError },
  ] = useLazyCreateEventSubSubscriptionChannelChatClearUserMessagesQuery();
  const [createEventSubSubscriptionChannelChatMessage /* , { error: eventSubSubscriptionChannelChatMessageError } */] =
    useLazyCreateEventSubSubscriptionChannelChatMessageQuery();
  const [
    createEventSubSubscriptionChannelChatMessageDelete,
    // { error: eventSubSubscriptionChannelChatMessageDeleteError },
  ] = useLazyCreateEventSubSubscriptionChannelChatMessageDeleteQuery();
  const [
    createEventSubSubscriptionChannelChatNotification,
    // { error: eventSubSubscriptionChannelChatNotificationError },
  ] = useLazyCreateEventSubSubscriptionChannelChatNotificationQuery();
  const [
    createEventSubSubscriptionChannelChatSettingsUpdate,
    // { error: eventSubSubscriptionChannelChatSettingsUpdateError },
  ] = useLazyCreateEventSubSubscriptionChannelChatSettingsUpdateQuery();
  const [
    createEventSubSubscriptionChannelSharedChatBegin,
    // { error: eventSubSubscriptionChannelSharedChatBeginError },
  ] = useLazyCreateEventSubSubscriptionChannelSharedChatBeginQuery();
  const [
    createEventSubSubscriptionChannelSharedChatEnd,
    // { error: eventSubSubscriptionChannelSharedChatEndError },
  ] = useLazyCreateEventSubSubscriptionChannelSharedChatEndQuery();
  const [
    createEventSubSubscriptionChannelSharedChatUpdate,
    // { error: eventSubSubscriptionChannelSharedChatUpdateError },
  ] = useLazyCreateEventSubSubscriptionChannelSharedChatUpdateQuery();
  const [getSharedChatSession /* , { error: sharedChatSessionError } */] = useLazyGetSharedChatSessionQuery();
  const pingIntervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const unpinTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Handle reset of upin timeout
  const handleResetUnpinTimeout = useCallback(
    ({ pinId, updatedAt, endsAt }: { pinId?: string; updatedAt?: number; endsAt?: number } = {}) => {
      clearTimeout(unpinTimeoutIdRef.current);

      if (pinId && endsAt && updatedAt) {
        unpinTimeoutIdRef.current = setTimeout(
          () => {
            dispatch(removeChatPinId({ pinId }));
          },
          (endsAt - updatedAt) * 1000,
        );
      }
    },
    [dispatch, unpinTimeoutIdRef],
  );

  // Subscribe to twitch event sub events on first connection
  useEffect(() => {
    if (broadcasterId && sessionId) {
      createEventSubSubscriptionChannelChatClear({ broadcasterId, sessionId });
      createEventSubSubscriptionChannelChatClearUserMessages({ broadcasterId, sessionId });
      createEventSubSubscriptionChannelChatMessage({ broadcasterId, sessionId });
      createEventSubSubscriptionChannelChatMessageDelete({ broadcasterId, sessionId });
      createEventSubSubscriptionChannelChatNotification({ broadcasterId, sessionId });
      createEventSubSubscriptionChannelChatSettingsUpdate({ broadcasterId, sessionId });
      createEventSubSubscriptionChannelSharedChatBegin({ broadcasterId, sessionId });
      createEventSubSubscriptionChannelSharedChatEnd({ broadcasterId, sessionId });
      createEventSubSubscriptionChannelSharedChatUpdate({ broadcasterId, sessionId });
    }
  }, [broadcasterId, dispatch, sessionId]);

  // Handle twitch event sub messages
  useEffect(() => {
    if (twitchMessage) {
      const { metadata, payload } = twitchMessage;
      const { message_id: messageId, message_type: messageType } = metadata;

      if (!twitchMessageIds.includes(messageId)) {
        // const { payload } = twitchMessage;

        if (messageType === 'session_welcome' && 'session' in payload) {
          dispatch(setTwitchEventSub({ sessionId: payload.session.id }));
        } else if (messageType === 'notification' && 'event' in payload) {
          const { type: subscriptionType } = payload.subscription;
          const { event } = payload;

          if (subscriptionType === 'channel.chat.clear') {
            dispatch(clearChats());
          } else if (subscriptionType === 'channel.chat.clear_user_messages') {
            if ('target_user_id' in event) {
              dispatch(
                setUserChatsDeletedTimestamp({
                  chatterUserId: event.target_user_id,
                  deletedTimestamp: metadata.message_timestamp,
                }),
              );
            }
          } else if (subscriptionType === 'channel.chat.message' || subscriptionType === 'channel.chat.notification') {
            if ('message' in event && !('bits' in event) && 'text' in event.message && event.message.text) {
              const { message_timestamp: messageTimestamp } = metadata;

              if (typeof event.message === 'object') dispatch(addChat({ ...event, messageTimestamp }));
            }

            if ('notice_type' in event && event.charity_donation) {
              dispatch(invalidateCharityCampaignTags(['CHARITY_CAMPAIGN_DATA']));
            }
          } else if (subscriptionType === 'channel.chat.message_delete') {
            if ('message_id' in event) {
              dispatch(
                setChatDeletedTimestamp({ messageId: event.message_id, deletedTimestamp: metadata.message_timestamp }),
              );
              dispatch(addTwitchEventSubMessageId(messageId));
            }
          } else if (subscriptionType === 'channel.chat_settings.update') {
            dispatch(
              updateChatSettingsData('getChatSettings', { broadcasterId }, (state) => {
                const { broadcaster_user_id, broadcaster_user_login, broadcaster_user_name, ...eventData } = event;
                if (state) Object.assign(state.data[0], eventData);
              }),
            );
          } else if (
            subscriptionType === 'channel.shared_chat.begin' ||
            subscriptionType === 'channel.shared_chat.end' ||
            subscriptionType === 'channel.shared_chat.update'
          ) {
            getSharedChatSession({ broadcasterId });
          }
        }

        dispatch(addTwitchEventSubMessageId(messageId));
      }
    }
  }, [broadcasterId, dispatch, twitchMessage, twitchMessageIds]);

  // Subscribe to twitch pub sub pinned chat events on first connection
  useEffect(() => {
    if (twitchPSReadyState === 1) {
      const nonce = uuid.v4();

      sendTwitchPSMessage({
        type: 'LISTEN',
        nonce,
        data: {
          topics: [`pinned-chat-updates-v1.${broadcasterId}`],
          auth_token: accessToken,
        },
      });

      clearInterval(pingIntervalIdRef.current);

      pingIntervalIdRef.current = setInterval(
        () => {
          sendTwitchPSMessage({ type: 'PING' });
        },
        5 * 60 * 1000,
      );
    }

    return () => clearInterval(pingIntervalIdRef.current);
  }, [pingIntervalIdRef, sendTwitchPSMessage, twitchPSReadyState]);

  // Handle twitch pub sub messages
  useEffect(() => {
    if (twitchPSMessage) {
      const messageId = uuid.v5(JSON.stringify(twitchPSMessage), namespace);

      if (!twitchPSMessageIds.includes(messageId) && twitchPSMessage.type === 'MESSAGE') {
        try {
          const message = JSON.parse(twitchPSMessage.data.message);

          if (twitchPSMessage.data.topic === `pinned-chat-updates-v1.${broadcasterId}`) {
            const { type, data }: TwitchPubSubPinnedChatUpdatesMessageMessage = message;

            if (type === 'pin-message') {
              handleResetUnpinTimeout({
                pinId: data.id,
                updatedAt: data.message.updated_at,
                endsAt: data.message.ends_at,
              });
              dispatch(setChatPinId({ messageId: data.message.id, pinId: data.id }));
              dispatch(addTwitchPubSubMessageId(messageId));
            } else if (type === 'update-message') {
              handleResetUnpinTimeout({ pinId: data.id, updatedAt: data.updated_at, endsAt: data.ends_at });
              dispatch(addTwitchPubSubMessageId(messageId));
            } else if (type === 'unpin-message') {
              handleResetUnpinTimeout();
              dispatch(removeChatPinId({ pinId: data.id }));
              dispatch(addTwitchPubSubMessageId(messageId));
            }
          }
        } catch (error) {
          //
        }
      }
    }
  }, [dispatch, handleResetUnpinTimeout, twitchPSMessage]);

  // Render component
  return false;
};
