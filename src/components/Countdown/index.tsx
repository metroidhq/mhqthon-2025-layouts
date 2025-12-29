import CountdownComp from 'react-countdown';
import { useCallback } from 'react';
import { css } from '@emotion/react';
import { FlexContainer } from '@components/shared/FlexContainer';

export const Countdown = () => {
  const renderCountdown = useCallback(({ hours, minutes, seconds, completed }) => {
    let result = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (completed) result = '00:00:00';

    const cssCountdown = css`
      align-items: center;
      justify-content: center;
      width: 100%;
      height: calc(var(--container-height) - var(--bar-height));
      margin-bottom: var(--bar-height);
      font-family: 'Orbitron', Arial, Helvetica, sans-serif;
      font-size: 96px;
      filter: drop-shadow(#000000 0 0 calc(var(--padding) * 0.375));
    `;

    return (
      <FlexContainer css={cssCountdown}>
        <span>{result}</span>
      </FlexContainer>
    );
  }, []);

  // Render component
  return <CountdownComp date={new Date('2024-12-04T12:00:00-08:00')} renderer={renderCountdown} />;
};
