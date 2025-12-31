import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';

import type { PersonInfoProps } from './types';

import { FlexContainer } from '@components/shared/FlexContainer';
import { useGetChannelStreamScheduleQuery } from '@store/apis/twitch/getChannelStreamSchedule';
import { useGetPronounsQuery } from '@store/apis/chatPronouns/getPronouns';
import { useGetUserQuery } from '@store/apis/chatPronouns/getUser';
import { DateTime, TimeZone } from 'timezonecomplete';

export const PersonInfo = ({ person }: PersonInfoProps) => {
  const {
    data: channelStreamScheduleData,
    error: channelStreamScheduleError,
    isLoading: isChannelStreamScheduleLoading,
    refetch: refetchChannelStreamSchedule,
  } = useGetChannelStreamScheduleQuery({ broadcasterId: person.id });
  const { data: pronounsData, /* error: pronounsError, */ isLoading: isPronounsLoading } = useGetPronounsQuery();
  const { data: userData, /* error: userError, */ isLoading: isUserLoading } = useGetUserQuery({ login: person.login });
  const [segments, setSegments] = useState<{ title: string; time: string }[]>([]);
  const personInfoIntervalIdRef = useRef<NodeJS.Timeout | null>(null);
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
    width: calc(100% - ((var(--padding) * 1) + var(--bar-height) - (var(--padding) * 2) + (var(--padding) * 1.75)));
    max-height: calc(var(--bar-height) - var(--padding));
    margin: calc(var(--padding) / 2) var(--padding) calc(var(--padding) / 2) 0;
    overflow-y: hidden;
    transition: opacity 0.5s;
  `;
  const cssSpanScheduleLabel = css`
    font-family: 'Orbitron';
    font-weight: 700;
    opacity: 0.7;
  `;
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
    font-weight: 500;
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

  // Set person info interval
  useEffect(() => {
    clearInterval(personInfoIntervalIdRef.current);
    personInfoIntervalIdRef.current = setInterval(() => refetchChannelStreamSchedule(), 60 * 1000);

    return () => clearInterval(personInfoIntervalIdRef.current);
  }, [personInfoIntervalIdRef, refetchChannelStreamSchedule]);

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return false;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <FlexContainer cssContainer={cssContainerInfo}>
        <FlexContainer column cssContainer={cssContainerSchedule}>
          <span css={cssSpanScheduleLabel}>Schedule</span>

          {segments.map((segment, i) => (
            <p key={i} css={i === 0 ? cssPTopInfoBold : cssPTopInfo}>
              <span css={cssSpanTime}>{segment.time}:&nbsp;</span>
              <span>{segment.title}</span>
            </p>
          ))}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};
