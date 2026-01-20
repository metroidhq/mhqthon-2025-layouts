import { css } from '@emotion/react';

import type { IconProps } from '@components/shared/svgs/types';

export const DragHandleIcon = ({ colored, cssIcon: cssIconProvided }: IconProps) => {
  const color = '#ffffff';
  const cssSvg = css`
    height: var(--line-height);
    ${cssIconProvided?.styles}
  `;

  // Render component
  return (
    <svg viewBox="0 0 20 20" css={cssSvg}>
      <path
        fill={colored ? color : 'white'}
        d="M12.5 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm0-10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM6 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM12.5 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM6 12.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm5 5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM7.5 16a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"
      />
    </svg>
  );
};
