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
    margin-top: 1rem;
  `;
  const cssAddIncentiveButton = css`
    margin-left: 0.5rem;
  `;
  const cssRemoveIncentiveButton = css`
    margin-left: 0.5rem;
  `;
  const cssAmountSpan = css`
    width: 12rem;
    padding: 0 2rem 0 0;
    padding: 0 1rem;
    font-size: var(--font-size);
    font-weight: 500;
  `;
  const cssDescriptionSpan = css`
    width: 25rem;
    margin-left: 0.5rem;
    padding: 0 2rem 0 0;
    padding: 0 1rem;
    font-size: var(--font-size);
    font-weight: 500;
  `;
  const cssDurationSpan = css`
    width: 12rem;
    margin-left: 0.5rem;
    padding: 0 2rem 0 0;
    padding: 0 1rem;
    font-size: var(--font-size);
    font-weight: 500;
  `;
  const cssAmountInput = css`
    width: 12rem;
    font-size: var(--font-size);
    line-height: var(--line-height);
  `;
  const cssDescriptionInput = css`
    width: 25rem;
    margin-left: 0.5rem;
    font-size: var(--font-size);
    line-height: var(--line-height);
  `;
  const cssDurationInput = css`
    width: 12rem;
    margin-left: 0.5rem;
    font-size: var(--font-size);
    line-height: var(--line-height);
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

          <TwitchButton css={cssAddIncentiveButton} onClick={handleAddIncentiveClick}>
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

            <TwitchButton css={cssRemoveIncentiveButton} onClick={handleRemoveIncentiveClick(id)}>
              –
            </TwitchButton>
          </FlexContainer>
        ))}
      </FlexContainer>
    </FlexContainer>
  );
};
