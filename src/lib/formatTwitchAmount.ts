import type { TwitchApiGetCharityCampaignAmount } from '@store/apis/twitch/getCharityCampaign';

export const formatTwitchAmount = (
  amount: TwitchApiGetCharityCampaignAmount,
  options: Intl.NumberFormatOptions = {},
): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: amount.currency,
    minimumFractionDigits: 2,
    ...options,
  }).format(amount.value / 10 ** amount.decimal_places);
