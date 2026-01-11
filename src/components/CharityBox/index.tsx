import { useEffect } from 'react';
import { css } from '@emotion/react';

import { FlexContainer } from '@components/shared/FlexContainer';
import { formatTwitchAmount } from '@lib/formatTwitchAmount';
import { useDispatch, useSelector } from '@store';
import { useLazyGetUserChatColorsQuery } from '@store/apis/twitch/getUserChatColors';
import { useLazyGetUsersQuery } from '@store/apis/twitch/getUsers';
import { useGetCharityCampaignQuery } from '@store/apis/twitch/getCharityCampaign';

export const CharityBox = () => {
  const dispatch = useDispatch();
  const { broadcasterId } = useSelector(({ info }) => info);
  const {
    data: charityCampaignData,
    // error: userChatColorsError,
    isLoading: isCharityCampaignLoading,
  } = useGetCharityCampaignQuery({ broadcasterId });
  const [
    getUserChatColors,
    {
      data: userChatColorsData,
      /* error: userChatColorsError, */ isLoading: isUserChatColorsLoading,
    },
  ] = useLazyGetUserChatColorsQuery();
  const [getUsers, { data: usersData, /* error: usersError, */ isLoading: isUsersLoading }] =
    useLazyGetUsersQuery();
  const isLoading = isCharityCampaignLoading || isUserChatColorsLoading || isUsersLoading;
  const isRenderable = !!(charityCampaignData && userChatColorsData && usersData);
  const {
    charity_logo: charityLogo,
    current_amount: currentAmount,
    target_amount: targetAmount,
  } = charityCampaignData?.data[0] || {};

  const cssContainer = css`
    position: relative;
    flex: 3;
    align-items: center;
    justify-content: flex-end;
    filter: var(--shadow);
  `;
  const cssAmounts = css`
    align-items: flex-end;
  `;
  const cssCurrentAmount = css`
    font-family: 'Orbitron';
    line-height: calc(var(--line-height) * 2);
    font-size: calc(var(--font-size) * 2);
    font-weight: 400;
  `;
  const cssTargetAmount = css`
    opacity: 0.7;
    font-weight: 500;
    /* color: var(--colors-beyond-400); */
  `;
  const cssLogo = css`
    width: calc(var(--bar-height) - var(--padding));
    height: calc(var(--bar-height) - var(--padding));
    margin: calc(var(--padding) / 2) var(--padding);
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
      <FlexContainer column={true} cssContainer={cssAmounts}>
        <span css={cssCurrentAmount}>
          {currentAmount ? formatTwitchAmount(currentAmount) : '$0.00'}
        </span>
        <span css={cssTargetAmount}>
          Donation Goal:{' '}
          {targetAmount
            ? formatTwitchAmount(targetAmount, {
                minimumFractionDigits: 0,
              })
            : '$0.00'}
        </span>
      </FlexContainer>

      <img
        src={
          charityLogo ||
          'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        }
        css={cssLogo}
      />
    </FlexContainer>
  );
};
