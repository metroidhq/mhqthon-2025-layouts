import type { BigTextProps } from './types';

import { css } from '@emotion/react';
import { FlexContainer } from '@components/shared/FlexContainer';

export const BigText = ({ text, subtext }: BigTextProps) => {
  const cssContainer = css`
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(var(--container-height) - var(--bar-height));
    margin-bottom: var(--bar-height);
    font-family: 'Orbitron', Arial, Helvetica, sans-serif;
    font-size: 96px;
    filter: var(--shadow);
  `;
  const cssSubText = css`
    font-size: 48px;
  `;

  // Render component
  return (
    <FlexContainer column={true} css={cssContainer}>
      <span>{text}</span>
      {subtext ? <span css={cssSubText}>{subtext}</span> : null}
    </FlexContainer>
  );
};
