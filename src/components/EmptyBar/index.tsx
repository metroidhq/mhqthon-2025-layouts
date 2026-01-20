import { css } from '@emotion/react';

import { FlexContainer } from '@components/shared/FlexContainer';

export const EmptyBar = () => {
  const cssBar = css`
    position: absolute;
    bottom: 0;
    width: var(--bar-width);
    height: var(--bar-height);
    background-color: var(--colors-mhq-1000);
    background-image: linear-gradient(180deg, var(--colors-mhq-1000), var(--colors-mhq-1100));
    overflow: hidden;
    filter: var(--shadow);
  `;

  // Render component
  return <FlexContainer css={cssBar} />;
};
