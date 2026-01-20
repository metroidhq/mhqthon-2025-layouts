import { css, Global } from '@emotion/react';
import { FlexContainer } from '@components/shared/FlexContainer';
import { TwitchButton } from '@components/shared/TwitchButton';
import * as uuid from 'uuid';
import { useDispatch, useSelector } from '@store';
import { setIncentives } from '@store/slices/info';
import backgroundImage from '@assets/images/background.png';
import { IncentiveFieldset } from '@components/shared/IncentiveFieldset';

export const IncentiveForm = () => {
  const dispatch = useDispatch();
  const incentives = useSelector(({ info }) => info.incentives);

  const cssGlobal = css`
    :root {
      --line-height: calc(((var(--bar-height) - var(--padding)) / 3) / 1.75);
    }
    body,
    #root {
      width: auto;
      height: 100%;
      background-color: #33342b;
    }
    #root {
      justify-content: flex-start;
      padding: 2rem 3rem;
      background-image: url(${backgroundImage});
    }
  `;
  const cssContainer = css`
    gap: 1rem;
    align-items: center;
    justify-content: center;
    filter: var(--shadow);
  `;
  const cssRowHeader = css`
    align-items: center;
  `;
  const cssIncentiveButton = css`
    margin-left: 0.5rem;
    border-radius: calc(0.4rem / 1.75);
    font-size: calc(1.3rem / 1.75);
    height: calc(3rem / 1.75);

    > div {
      padding: 0px calc(1rem / 1.75);
    }
  `;
  const cssAmountSpan = css`
    width: 7rem;
    padding: calc(0.5rem / 1.75) calc(1rem / 1.75) calc(0.5rem / 1.75) calc((1rem / 1.75) + (2rem / 1.75));
    font-size: var(--font-size);
    font-weight: 500;
  `;
  const cssDescriptionSpan = css`
    width: 12rem;
    margin-left: 0.25rem;
    padding: calc(0.5rem / 1.75) calc(1rem / 1.75);
    font-size: var(--font-size);
    font-weight: 500;
  `;
  const cssDurationSpan = css`
    width: 7rem;
    margin-left: 0.25rem;
    padding: calc(0.5rem / 1.75) calc(1rem / 1.75);
    font-size: var(--font-size);
    font-weight: 500;
  `;

  const handleAddIncentiveClick = () => {
    dispatch(setIncentives([...incentives, { id: uuid.v4(), amount: '', description: '', duration: '' }]));
  };

  // Render component
  return (
    <FlexContainer css={cssContainer} column>
      <Global styles={cssGlobal} />
      <FlexContainer column>
        <FlexContainer css={cssRowHeader}>
          <span css={cssAmountSpan}>Amount (USD)</span>
          <span css={cssDescriptionSpan}>Description</span>
          <span css={cssDurationSpan}>Duration (min)</span>

          <TwitchButton css={cssIncentiveButton} onClick={handleAddIncentiveClick}>
            +
          </TwitchButton>
        </FlexContainer>

        {incentives.map(({ id, ...incentive }) => (
          <IncentiveFieldset key={id} incentive={{ id, ...incentive }} />
        ))}
      </FlexContainer>
    </FlexContainer>
  );
};
