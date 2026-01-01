import { DateTime, TimeZone } from 'timezonecomplete';
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';

import type { ScheduleInfoProps } from './types';

import { FlexContainer } from '@components/shared/FlexContainer';
import { useGetChannelStreamScheduleQuery } from '@store/apis/twitch/getChannelStreamSchedule';
import { useGetPronounsQuery } from '@store/apis/chatPronouns/getPronouns';
import { useGetUserQuery } from '@store/apis/chatPronouns/getUser';

export const ScheduleInfo = ({ isActive, person }: ScheduleInfoProps) => {
  const {
    data: channelStreamScheduleData,
    error: channelStreamScheduleError,
    isLoading: isChannelStreamScheduleLoading,
    refetch: refetchChannelStreamSchedule,
  } = useGetChannelStreamScheduleQuery({ broadcasterId: person.id });
  const { data: pronounsData, /* error: pronounsError, */ isLoading: isPronounsLoading } = useGetPronounsQuery();
  const { data: userData, /* error: userError, */ isLoading: isUserLoading } = useGetUserQuery({ login: person.login });
  const [segments, setSegments] = useState<{ title: string; time: string }[]>([]);
  const scheduleInfoIntervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const isLoading = isChannelStreamScheduleLoading || isPronounsLoading || isUserLoading;
  const isRenderable = !!(
    (channelStreamScheduleData || channelStreamScheduleError) &&
    pronounsData &&
    segments.length &&
    userData
  );

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
  const cssContainerSchedule = css`
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
  // const cssSpanScheduleLabel = css`
  //   display: none;
  //   font-family: 'Orbitron';
  //   /* font-weight: 700; */
  //   color: var(--colors-beyond-400);
  //   opacity: 0.7;
  // `;
  const cssPTopInfo = css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  `;
  const cssPTopInfoBold = css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    font-weight: 500;
    font-size: var(--line-height);
  `;
  const cssSpanTime = css`
    opacity: 0.7;
  `;

  // Set segments data
  useEffect(() => {
    if (channelStreamScheduleData && channelStreamScheduleData.data.segments) {
      const nextSegments = channelStreamScheduleData.data.segments.slice(0, 2);

      const filteredSegments = nextSegments.reduce((acc, segment) => {
        const { start_time: startTime } = segment;
        let { title } = segment;
        let result = acc;

        const titlePieces = title.split(' Presents: ');
        title = titlePieces[1] ? titlePieces[1] : titlePieces[0];
        title = title.split(' | MHQthon 2024')[0];

        const time = new DateTime(new Date(startTime).toISOString(), 'y-MM-ddTHH:mm:ss.SSSZ')
          .toZone(TimeZone.zone(Intl.DateTimeFormat().resolvedOptions().timeZone))
          .format('h:mmaaaaa z')
          .split(' ')
          .map((time, i) => (i === 0 ? time.toLowerCase() : time))
          .join(' ');

        if (startTime) {
          result = [...acc, { title, time }];
          if (new Date(startTime).getTime() - new Date().getTime() < 0) result[result.length - 1].time = 'Now';
        }

        return result;
      }, []);

      setSegments(filteredSegments);
    }
  }, [channelStreamScheduleData, setSegments]);

  // Set schedule info interval
  useEffect(() => {
    clearInterval(scheduleInfoIntervalIdRef.current);
    scheduleInfoIntervalIdRef.current = setInterval(() => refetchChannelStreamSchedule(), 60 * 1000);

    return () => clearInterval(scheduleInfoIntervalIdRef.current);
  }, [scheduleInfoIntervalIdRef, refetchChannelStreamSchedule]);

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return false;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <FlexContainer cssContainer={cssContainerInfo}>
        <FlexContainer column cssContainer={cssContainerSchedule}>
          {segments.map((segment, i) => (
            <p key={i} css={i === 0 ? cssPTopInfoBold : cssPTopInfo}>
              <span css={cssSpanTime}>{segment.time}:&nbsp;</span>
              <span>{segment.title}</span>
            </p>
          ))}

          {/* <span css={cssSpanScheduleLabel}>Schedule</span> */}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};
