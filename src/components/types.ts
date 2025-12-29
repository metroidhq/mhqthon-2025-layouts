import type {
  TwitchEventSubKeepaliveMessage,
  TwitchEventSubReconnectMessage,
  TwitchEventSubWelcomeMessage,
  TwitchPubSubAuthRevokedMessage,
  TwitchPubSubMessageMessage,
  TwitchPubSubPongMessage,
  TwitchPubSubReconnectMessage,
  TwitchPubSubResponseMessage,
} from '@store/apis/twitch';
import type {
  TwitchEventSubChannelChatClearNotificationMessage,
  TwitchEventSubChannelChatClearRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatClear';
import type {
  TwitchEventSubChannelChatClearUserMessagesNotificationMessage,
  TwitchEventSubChannelChatClearUserMessagesRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatClearUserMessages';
import type {
  TwitchEventSubChannelChatMessageDeleteNotificationMessage,
  TwitchEventSubChannelChatMessageDeleteRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatMessageDelete';
import type {
  TwitchEventSubChannelChatMessageNotificationMessage,
  TwitchEventSubChannelChatMessageRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatMessage';
import type {
  TwitchEventSubChannelChatNotificationNotificationMessage,
  TwitchEventSubChannelChatNotificationRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatNotification';
import type {
  TwitchEventSubChannelChatSettingsUpdateNotificationMessage,
  TwitchEventSubChannelChatSettingsUpdateRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelChatSettingsUpdate';
import type {
  TwitchEventSubChannelSharedChatBeginNotificationMessage,
  TwitchEventSubChannelSharedChatBeginRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelSharedChatBegin';
import type {
  TwitchEventSubChannelSharedChatEndNotificationMessage,
  TwitchEventSubChannelSharedChatEndRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelSharedChatEnd';
import type {
  TwitchEventSubChannelSharedChatUpdateNotificationMessage,
  TwitchEventSubChannelSharedChatUpdateRevocationMessage,
} from '@store/apis/twitch/createEventSubSubscription/channelSharedChatUpdate';

export type TwitchEventSubMessage =
  | TwitchEventSubWelcomeMessage
  | TwitchEventSubKeepaliveMessage
  | TwitchEventSubReconnectMessage
  | TwitchEventSubChannelChatClearNotificationMessage
  | TwitchEventSubChannelChatClearRevocationMessage
  | TwitchEventSubChannelChatClearUserMessagesNotificationMessage
  | TwitchEventSubChannelChatClearUserMessagesRevocationMessage
  | TwitchEventSubChannelChatMessageNotificationMessage
  | TwitchEventSubChannelChatMessageRevocationMessage
  | TwitchEventSubChannelChatMessageDeleteNotificationMessage
  | TwitchEventSubChannelChatMessageDeleteRevocationMessage
  | TwitchEventSubChannelChatNotificationNotificationMessage
  | TwitchEventSubChannelChatNotificationRevocationMessage
  | TwitchEventSubChannelChatSettingsUpdateNotificationMessage
  | TwitchEventSubChannelChatSettingsUpdateRevocationMessage
  | TwitchEventSubChannelSharedChatBeginNotificationMessage
  | TwitchEventSubChannelSharedChatBeginRevocationMessage
  | TwitchEventSubChannelSharedChatEndNotificationMessage
  | TwitchEventSubChannelSharedChatEndRevocationMessage
  | TwitchEventSubChannelSharedChatUpdateNotificationMessage
  | TwitchEventSubChannelSharedChatUpdateRevocationMessage;

export type TwitchPubSubMessage =
  | TwitchPubSubPongMessage
  | TwitchPubSubReconnectMessage
  | TwitchPubSubAuthRevokedMessage
  | TwitchPubSubResponseMessage
  | TwitchPubSubMessageMessage;
