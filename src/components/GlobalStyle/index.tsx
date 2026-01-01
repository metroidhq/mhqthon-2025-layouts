import { Global, css } from '@emotion/react';

import backgroundImage from '@assets/images/background.png';
import orbitronBoldFont from '@assets/fonts/Orbitron-Bold.ttf';
import orbitronRegularFont from '@assets/fonts/Orbitron-Regular.ttf';
import robotoLightFont from '@assets/fonts/Roboto-Light.ttf';
import robotoRegularFont from '@assets/fonts/Roboto-Regular.ttf';
import robotoMediumFont from '@assets/fonts/Roboto-Medium.ttf';

export const mhqPalette = {
  100: '#eff5f1',
  200: '#cfe8d6',
  300: '#aae0b9',
  400: '#81dc9a',
  500: '#5dd27d',
  600: '#3ac861',
  700: '#2fa64f',
  800: '#25833e',
  900: '#19612c',
  1000: '#0e3f1b',
  1100: '#051a0b',
};

export const beyondPalette = {
  100: '#f4edf7',
  200: '#e1c6f1',
  300: '#d195f5',
  400: '#c25dff',
  500: '#b130ff',
  600: '#a003ff',
  700: '#8500d4',
  800: '#6800a7',
  900: '#4c007a',
  1000: '#30004d',
  1100: '#13001f',
};

export const GlobalStyle = () => {
  const bodyBackgroundColor = window.obsstudio ? 'transparent' : '#33342b';
  const rootBackgroundColor = window.obsstudio ? 'transparent' : '#33342b';
  const rootBackgroundImage = window.obsstudio ? 'none' : `url("${backgroundImage}")`;

  const cssGlobal = css`
    @font-face {
      font-family: 'Orbitron';
      font-style: normal;
      font-weight: 400;
      src: url(${orbitronRegularFont}) format('truetype');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC,
        U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    @font-face {
      font-family: 'Orbitron';
      font-style: normal;
      font-weight: 700;
      src: url(${orbitronBoldFont}) format('truetype');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC,
        U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 300;
      src: url(${robotoLightFont}) format('truetype');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC,
        U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      src: url(${robotoRegularFont}) format('truetype');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC,
        U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 500;
      src: url(${robotoMediumFont}) format('truetype');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC,
        U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    @keyframes rotate {
      to {
        transform: translate(-50%, -50%) rotate(1turn);
      }
    }

    :root {
      --safe-area-inset-top: env(safe-area-inset-top);
      --safe-area-inset-left: env(safe-area-inset-left);
      --safe-area-inset-right: env(safe-area-inset-right);
      --safe-area-inset-bottom: env(safe-area-inset-bottom);

      --container-width: 1920px;
      --container-height: 1080px;
      --bar-width: 1920px;
      --bar-height: 120px;
      --padding: 24px;
      --line-height: calc((var(--bar-height) - var(--padding)) / 3);
      --font-size: calc(var(--line-height) / 8 * 7);
      --shadow: drop-shadow(#000000 0 0 calc(var(--padding) * 0.375));

      ${Object.entries(mhqPalette)
        .map(([weight, hexcode]) => `--colors-mhq-${weight}: ${hexcode};`)
        .join('')}

      ${Object.entries(beyondPalette)
        .map(([weight, hexcode]) => `--colors-beyond-${weight}: ${hexcode};`)
        .join('')}
    }

    * {
      margin: 0px;
      outline: 0px;
      border: 0px;
      padding: 0px;
    }

    html,
    body,
    #root {
      overflow: hidden;
      height: 100%;
    }

    body,
    #root {
      position: relative;
      display: flex;
      flex-direction: column;
      width: var(--container-width);
      height: var(--container-height);
    }

    body {
      font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
      background-color: ${bodyBackgroundColor};
      color: #ffffff;
      font-size: var(--font-size);
      font-weight: 400;
    }

    #root {
      align-items: center;
      justify-content: center;
      background-color: ${rootBackgroundColor};
      background-image: ${rootBackgroundImage};
      background-size: cover;
    }
  `;

  return <Global styles={cssGlobal} />;
};
