import { Box } from '@rocket.chat/fuselage';
import { useResizeObserver } from '@rocket.chat/fuselage-hooks';
import { Meteor } from 'meteor/meteor';
import React, { useRef, useEffect, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { useSession } from '../../contexts/SessionContext';
import { useTranslation } from '../../contexts/TranslationContext';
import { useUserPreference, useUserId } from '../../contexts/UserContext';
import { useEndpointData } from '../../hooks/useEndpointData';
import { useAvatarTemplate } from '../hooks/useAvatarTemplate';
import { usePreventDefault } from '../hooks/usePreventDefault';
import { useRoomList } from '../hooks/useRoomList';
import { useShortcutOpenMenu } from '../hooks/useShortcutOpenMenu';
import { useSidebarPaletteColor } from '../hooks/useSidebarPaletteColor';
import { useTemplateByViewMode } from '../hooks/useTemplateByViewMode';
import Row from './Row';
import ScrollerWithCustomProps from './ScrollerWithCustomProps';

const RoomList = () => {
	useSidebarPaletteColor();
	const listRef = useRef();
	const { ref } = useResizeObserver({ debounceDelay: 100 });

	const openedRoom = useSession('openedRoom');

	const sidebarViewMode = useUserPreference('sidebarViewMode');
	const sideBarItemTemplate = useTemplateByViewMode();
	const avatarTemplate = useAvatarTemplate();
	const extended = sidebarViewMode === 'extended';
	const isAnonymous = !useUserId();

	const t = useTranslation();

	let roomsList = useRoomList();

	const useQuery = ({ text, itemsPerPage, current }, [column, direction], userIdLoggedIn) =>
		useMemo(
			() => ({
				sort: JSON.stringify({ [column]: direction === 'asc' ? 1 : -1 }),
				open: false,
				roomName: text,
				agents: [userIdLoggedIn],
				...(itemsPerPage && { count: itemsPerPage }),
				...(current && { offset: current }),
			}),
			[column, current, direction, itemsPerPage, userIdLoggedIn, text],
		);

	const query = useQuery(
		{ text: '', current: 0, itemsPerPage: 25 },
		['closedAt', 'desc'],
		Meteor.userId(),
	);
	const { value: closedRooms } = useEndpointData('livechat/rooms', query);
	if (closedRooms) {
		roomsList = [
			...roomsList,
			{
				title: 'Closed chats',
				data: closedRooms.rooms.map((room) => ({
					...room,
					rid: room._id,
					_updatedAt: new Date(room._updatedAt),
					lastMessage: { ...room.lastMessage, _updatedAt: new Date(room._updatedAt) },
				})),
			},
		];
	}

	const itemData = useMemo(
		() => ({
			extended,
			t,
			SideBarItemTemplate: sideBarItemTemplate,
			AvatarTemplate: avatarTemplate,
			openedRoom,
			sidebarViewMode,
			isAnonymous,
		}),
		[avatarTemplate, extended, isAnonymous, openedRoom, sideBarItemTemplate, sidebarViewMode, t],
	);

	usePreventDefault(ref);
	useShortcutOpenMenu(ref);

	useEffect(() => {
		listRef.current?.resetAfterIndex(0);
	}, [sidebarViewMode]);

	return (
		<Box h='full' w='full' ref={ref}>
			<Virtuoso
				totalCount={roomsList.length}
				data={roomsList}
				components={{ Scroller: ScrollerWithCustomProps }}
				itemContent={(index, data) => <Row data={itemData} item={data} />}
			/>
		</Box>
	);
};

export default RoomList;
