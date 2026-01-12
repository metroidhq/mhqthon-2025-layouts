import { createHashRouter } from 'react-router-dom';

import { Container } from '@components/Container';
import { Countdown } from '@components/Countdown';
import { InfoBar } from '@components/InfoBar';
import { BigText } from '@components/BigText';
import { IncentiveForm } from '@components/IncentiveForm';

export const router = createHashRouter([
  {
    path: '/',
    element: <Container />,
    errorElement: false,
    children: [
      {
        path: 'global-info',
        element: <InfoBar />,
      },
      // {
      //   path: 'schedule',
      //   element: <Schedule />,
      // },
    ],
  },
  {
    path: 'countdown',
    element: <Countdown />,
  },
  {
    path: 'be-right-back',
    element: <BigText text="Be right back" />,
  },
  {
    path: 'be-right-back-segment',
    element: <BigText text="Be right back" subtext="while we set up for the next segment" />,
  },
  {
    path: 'be-right-back-speedrun',
    element: (
      <BigText
        text="Be right back"
        subtext="enjoy Dyceron's run of Metroid Prime: Federation Force"
      />
    ),
  },
  {
    path: 'be-back-later',
    element: <BigText text="Be back later" subtext="with more Metroid content tomorrow morning" />,
  },
  {
    path: 'be-back-later-speedrun',
    element: (
      <BigText
        text="Be back later"
        subtext="enjoy Dyceron's run of Metroid Prime: Federation Force"
      />
    ),
  },
  {
    path: 'thanks',
    element: <BigText text="Thanks for watching!" subtext="See you next year, and Beyond!" />,
  },
  {
    path: 'incentives',
    element: <IncentiveForm />,
  },
]);
