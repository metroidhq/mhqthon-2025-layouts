import { css } from '@emotion/react';

import { FlexContainer } from '@components/shared/FlexContainer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import { Incentive, setIncentives } from '@store/slices/info';
import * as layoutVars from '@lib/generateLayout';

export const IncentiveInfo = ({ isActive }: { isActive: boolean }) => {
  const dispatch = useDispatch();
  const incentives = useSelector(({ info }) => info.incentives);
  const incentiveInfoIntervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const [incentivesDisplayed, setIncentivesDisplayed] = useState<Incentive[]>(incentives);

  const cssContainer = css`
    position: absolute;
    box-sizing: border-box;
    max-width: 100%;
    min-width: 100%;
    padding-left: calc(var(--bar-height) + var(--padding));
    line-height: var(--line-height);
    opacity: ${isActive ? '1' : '0'};
    transition: opacity 0.5s;
  `;
  const cssContainerInfo = css`
    position: absolute;
    box-sizing: border-box;
    max-width: calc(100% - (var(--padding) * 2));
    width: calc(100% - (var(--padding) * 2));
    height: calc(100% - (var(--padding) * 2));
  `;
  const cssContainerIncentives = css`
    flex: 1;
    position: absolute;
    display: flex;
    flex-direction: column;
    width: calc(100% - ((var(--padding) * 1) + var(--bar-height) - (var(--padding) * 2) + (var(--padding) * 1.75)));
    height: calc(var(--bar-height) - var(--padding));
    margin: calc(var(--padding) / 2) var(--padding) calc(var(--padding) / 2) 0;
    overflow-y: hidden;
    transition: opacity 0.5s;

    > :first-of-type {
      font-size: var(--line-height);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      line-clamp: 3;
    }

    > :not(:first-of-type) {
      white-space: nowrap;
    }
  `;
  const cssPTopInfo = css`
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    min-height: fit-content;
  `;
  const cssSpanTime = css`
    font-weight: 500;
    opacity: 0.7;
  `;

  Object.entries(layoutVars).forEach(([key, value]) => {
    if (typeof value !== 'function') console.log(key, value);
  });

  // Listen for localStorage changes from other windows
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'incentives' && event.newValue) {
        try {
          const newIncentives = JSON.parse(event.newValue);
          dispatch(setIncentives(newIncentives));
        } catch (e) {
          // ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [dispatch]);

  // Sync incentives to incentivesDisplayed
  useEffect(() => {
    setIncentivesDisplayed(incentives);
  }, [incentives, setIncentivesDisplayed]);

  // Set info box interval
  useEffect(() => {
    clearInterval(incentiveInfoIntervalIdRef.current);
    incentiveInfoIntervalIdRef.current = setInterval(
      () =>
        setIncentivesDisplayed(
          incentivesDisplayed.length ? [...incentivesDisplayed.slice(1), incentivesDisplayed[0]] : [],
        ),
      (60 * 1000) / incentivesDisplayed.length,
    );

    return () => clearInterval(incentiveInfoIntervalIdRef.current);
  }, [incentiveInfoIntervalIdRef, incentivesDisplayed, setIncentivesDisplayed]);

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <FlexContainer cssContainer={cssContainerInfo}>
        <FlexContainer column cssContainer={cssContainerIncentives}>
          {incentivesDisplayed.map(({ id, description, duration, amount }) => (
            <p key={id} css={cssPTopInfo}>
              {amount ? (
                <span css={cssSpanTime}>
                  {!isNaN(Number(amount))
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(Number(amount))
                    : amount}
                  &nbsp;
                </span>
              ) : null}

              <span>{description || '???'}</span>
              {duration ? <span>&nbsp;({!isNaN(Number(duration)) ? `${duration} min` : duration})</span> : null}
            </p>
          ))}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};
