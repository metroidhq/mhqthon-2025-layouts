import { css } from '@emotion/react';
import { FlexContainer } from '@components/shared/FlexContainer';
import { TwitchInput } from '@components/shared/TwitchInput';
import { TwitchButton } from '@components/shared/TwitchButton';
import { type FocusEvent } from 'react';
import { useDispatch, useSelector } from '@store';
import { Incentive, setIncentives } from '@store/slices/info';
import { DragHandleIcon } from '@components/shared/svgs/DragHandle';
import { useDrag, useDrop } from 'react-dnd';
import { IncentiveFieldsetProps } from './types';

export const IncentiveFieldset = ({ incentive: { id, amount, description, duration } }: IncentiveFieldsetProps) => {
  const dispatch = useDispatch();
  const incentives = useSelector(({ info }) => info.incentives);
  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag(
    () => ({
      type: 'incentiveFieldset',
      item: { id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    [],
  );

  const handleMoveIncentive = (
    dragItemId: Incentive['id'],
    dropItemId: Incentive['id'],
    currentIncentives: Incentive[],
  ) => {
    const dragItemIndex = incentives.findIndex(({ id }) => id === dragItemId);
    const dropItemIndex = incentives.findIndex(({ id }) => id === dropItemId);
    const incentivesUpdated = [...currentIncentives];
    const [dragItem] = incentivesUpdated.splice(dragItemIndex, 1);

    incentivesUpdated.splice(dropItemIndex, 0, dragItem);

    dispatch(setIncentives(incentivesUpdated));
  };

  const [_, dropRef] = useDrop(
    () => ({
      accept: 'incentiveFieldset',
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
      drop: ({ id: dragItemId }) => handleMoveIncentive(dragItemId, id, incentives),
    }),
    [id, incentives],
  );

  const cssRow = css`
    align-items: center;
    height: calc((2rem / 1.75) + (1rem / 1.75));
    margin-top: 0.5rem;
  `;
  const cssDragHandle = css`
    width: calc(2rem / 1.75);
    height: calc(2rem / 1.75);
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
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

  const handleIncentiveBlur = (event: FocusEvent<HTMLInputElement>) => {
    dispatch(
      setIncentives(
        incentives.map((incentive) =>
          incentive.id === id ? { ...incentive, [event.target.name]: event.target.value } : incentive,
        ),
      ),
    );
  };
  const handleRemoveIncentiveClick = () => {
    dispatch(setIncentives(incentives.filter((incentive) => incentive.id !== id)));
  };

  if (isDragging) return <FlexContainer css={cssRow} ref={dragPreviewRef} />;

  // Render component
  return (
    <FlexContainer ref={dropRef}>
      <FlexContainer css={cssRow} ref={dragRef}>
        <DragHandleIcon cssIcon={cssDragHandle} />

        <TwitchInput
          css={cssAmountInput}
          defaultValue={amount}
          id="incentive-amount"
          name="amount"
          onBlur={handleIncentiveBlur}
        />
        <TwitchInput
          css={cssDescriptionInput}
          defaultValue={description}
          id="incentive-description"
          name="description"
          onBlur={handleIncentiveBlur}
        />
        <TwitchInput
          css={cssDurationInput}
          defaultValue={duration}
          id="incentive-duration"
          name="duration"
          onBlur={handleIncentiveBlur}
        />

        <TwitchButton css={cssIncentiveButton} onClick={handleRemoveIncentiveClick}>
          –
        </TwitchButton>
      </FlexContainer>
    </FlexContainer>
  );
};
