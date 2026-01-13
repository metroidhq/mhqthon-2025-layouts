import { css, Global } from '@emotion/react';
import { FlexContainer } from '@components/shared/FlexContainer';
import { TwitchInput } from '@components/shared/TwitchInput';
import { TwitchButton } from '@components/shared/TwitchButton';
import * as uuid from 'uuid';
import { type FocusEvent } from 'react';
import { useDispatch, useSelector } from '@store';
import { type Incentive, setIncentives } from '@store/slices/info';
import backgroundImage from '@assets/images/background.png';

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
  const cssRow = css`
    margin-top: 0.5rem;
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
    padding: calc(0.5rem / 1.75) calc(1rem / 1.75);
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
  const cssAmountInput = css`
    width: 7rem;
    font-size: var(--font-size);
    line-height: var(--line-height);
    border-radius: calc(0.4rem / 1.75);
    height: calc(2rem / 1.75);
    padding: calc(0.5rem / 1.75) calc(1rem / 1.75) !important;
  `;
  const cssDescriptionInput = css`
    width: 12rem;
    margin-left: 0.25rem;
    font-size: var(--font-size);
    line-height: var(--line-height);
    border-radius: calc(0.4rem / 1.75);
    height: calc(2rem / 1.75);
    padding: calc(0.5rem / 1.75) calc(1rem / 1.75) !important;
  `;
  const cssDurationInput = css`
    width: 7rem;
    margin-left: 0.25rem;
    font-size: var(--font-size);
    line-height: var(--line-height);
    border-radius: calc(0.4rem / 1.75);
    height: calc(2rem / 1.75);
    padding: calc(0.5rem / 1.75) calc(1rem / 1.75) !important;
  `;

  const handleAddIncentiveBlur = (id: Incentive['id']) => (event: FocusEvent<HTMLInputElement>) => {
    dispatch(
      setIncentives(
        incentives.map((incentive) =>
          incentive.id === id ? { ...incentive, [event.target.name]: event.target.value } : incentive,
        ),
      ),
    );
  };
  const handleAddIncentiveClick = () => {
    dispatch(setIncentives([...incentives, { id: uuid.v4(), amount: '', description: '', duration: '' }]));
  };
  const handleRemoveIncentiveClick = (id: Incentive['id']) => () => {
    dispatch(setIncentives(incentives.filter((incentive) => incentive.id !== id)));
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

        {incentives.map(({ id, amount, description, duration }) => (
          <FlexContainer key={id} css={cssRow}>
            <TwitchInput
              css={cssAmountInput}
              defaultValue={amount}
              id="incentive-amount"
              name="amount"
              onBlur={handleAddIncentiveBlur(id)}
            />
            <TwitchInput
              css={cssDescriptionInput}
              defaultValue={description}
              id="incentive-description"
              name="description"
              onBlur={handleAddIncentiveBlur(id)}
            />
            <TwitchInput
              css={cssDurationInput}
              defaultValue={duration}
              id="incentive-duration"
              name="duration"
              onBlur={handleAddIncentiveBlur(id)}
            />

            <TwitchButton css={cssIncentiveButton} onClick={handleRemoveIncentiveClick(id)}>
              –
            </TwitchButton>
          </FlexContainer>
        ))}
      </FlexContainer>
    </FlexContainer>
  );
};
