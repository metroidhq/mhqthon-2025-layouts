import { css } from '@emotion/react';

import { FlexContainer } from '@components/shared/FlexContainer';

export const BrandInfo = ({ isActive }: { isActive: boolean }) => {
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
  const cssContainerBrand = css`
    flex: 1;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: calc(100% - ((var(--padding) * 1) + var(--bar-height) - (var(--padding) * 2) + (var(--padding) * 1.75)));
    height: calc(var(--bar-height) - var(--padding));
    margin: calc(var(--padding) / 2) var(--padding) calc(var(--padding) / 2) 0;
    overflow-y: hidden;
    transition: opacity 0.5s;
  `;
  const cssSpanTitle = css`
    font-family: 'Orbitron';
    font-size: calc(var(--font-size) * 1.5);
    line-height: calc(var(--font-size) * 1.5);
  `;
  const cssSpanBeyond = css`
    font-family: 'Ethnocentric';
    font-weight: 300;
    font-size: calc(var(--font-size) * 1.45);
    line-height: calc(var(--font-size) * 1.45);
    color: var(--colors-beyond-400);
  `;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <FlexContainer cssContainer={cssContainerInfo}>
        <FlexContainer column cssContainer={cssContainerBrand}>
          <span css={cssSpanTitle}>MHQthon</span>
          <span css={cssSpanBeyond}>Beyond</span>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};
