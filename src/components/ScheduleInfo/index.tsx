import { DateTime, TimeZone } from 'timezonecomplete';
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';

import type { ScheduleInfoProps } from './types';

import { FlexContainer } from '@components/shared/FlexContainer';
import { useGetChannelStreamScheduleQuery } from '@store/apis/twitch/getChannelStreamSchedule';

export const ScheduleInfo = ({ isActive, person }: ScheduleInfoProps) => {
  const {
    data: channelStreamScheduleData,
    error: channelStreamScheduleError,
    isLoading: isChannelStreamScheduleLoading,
    refetch: refetchChannelStreamSchedule,
  } = useGetChannelStreamScheduleQuery({ broadcasterId: person.id });
  const [segments, setSegments] = useState<{ title: string; time: string }[]>([]);
  const scheduleInfoIntervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const isLoading = isChannelStreamScheduleLoading;
  const isRenderable = !!((channelStreamScheduleData || channelStreamScheduleError) && segments.length);

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
    width: calc(100% - ((var(--padding) * 1) + var(--bar-height) - (var(--padding) * 2) + (var(--padding) * 1.75)));
    height: calc(var(--bar-height) - var(--padding));
    margin: calc(var(--padding) / 2) var(--padding) calc(var(--padding) / 2) 0;
    overflow-y: hidden;
    transition: opacity 0.5s;

    > :first-of-type {
      font-size: var(--line-height);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
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

  // Set segments data
  useEffect(() => {
    if (channelStreamScheduleData && channelStreamScheduleData.data.segments) {
      const nextSegments = channelStreamScheduleData.data.segments.slice(0, 3);

      const filteredSegments = nextSegments.reduce((acc, segment) => {
        const { start_time: startTime } = segment;
        let { title } = segment;
        let result = acc;

        const titlePieces = title.split(' Presents: ');
        title = titlePieces[1] ? titlePieces[1] : titlePieces[0];
        title = title.split(' | MHQthon 2025')[0];

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
            <p key={i} css={cssPTopInfo}>
              <span css={cssSpanTime}>{segment.time}&nbsp;</span>
              <span>{segment.title}</span>
            </p>
          ))}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};
