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
    { data: userChatColorsData, /* error: userChatColorsError, */ isLoading: isUserChatColorsLoading },
  ] = useLazyGetUserChatColorsQuery();
  const [getUsers, { data: usersData, /* error: usersError, */ isLoading: isUsersLoading }] = useLazyGetUsersQuery();
  const isLoading = isCharityCampaignLoading || isUserChatColorsLoading || isUsersLoading;
  const isRenderable = !!(charityCampaignData && userChatColorsData && usersData);

  const cssContainer = css`
    position: relative;
    flex: 3;
    align-items: center;
    justify-content: flex-end;
    filter: drop-shadow(#000000 0 0 calc(var(--padding) * 0.375));
  `;
  const cssAmounts = css`
    align-items: flex-end;
    font-family: 'Orbitron';
    font-weight: 700;
  `;
  const cssCurrentAmount = css`
    font-size: 48px;
  `;
  const cssTargetAmount = css`
    font-size: 24px;
  `;
  const cssLogo = css`
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
        <span css={cssCurrentAmount}>{formatTwitchAmount(charityCampaignData.data[0].current_amount)}</span>
        <span css={cssTargetAmount}>
          Next Goal:{' '}
          {formatTwitchAmount(charityCampaignData.data[0].target_amount, {
            minimumFractionDigits: 0,
          })}
        </span>
      </FlexContainer>

      <img src={charityCampaignData.data[0].charity_logo} css={cssLogo} />
    </FlexContainer>
  );
};
