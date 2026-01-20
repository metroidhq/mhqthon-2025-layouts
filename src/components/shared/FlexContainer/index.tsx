import { css } from '@emotion/react';

import type { FlexContainerProps } from '@components/shared/FlexContainer/types';
import { forwardRef } from 'react';

export const FlexContainer = forwardRef<HTMLDivElement, FlexContainerProps>(
  ({ children, column, cssContainer: cssContainerProvided, reverse, ...propsDiv }, ref) => {
    let flexDirection = 'row';

    if (reverse) flexDirection = 'row-reverse';

    if (column) {
      if (reverse) flexDirection = 'column-reverse';
      flexDirection = 'column';
    }

    const cssDiv = css`
      display: flex;
      flex-direction: ${flexDirection};
      ${cssContainerProvided?.styles}
    `;

    // Render component
    return (
      <div ref={ref} css={cssDiv} {...propsDiv}>
        {children}
      </div>
    );
  },
);
