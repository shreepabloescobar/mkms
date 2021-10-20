import { Sidebar, Box, Accordion } from '@rocket.chat/fuselage';
import React, { memo } from 'react';

import Omnichannel from '../sections/Omnichannel';
import SideBarItemTemplateWithData from './SideBarItemTemplateWithData';

const sections = {
	Omnichannel,
};

const Row = ({ data, item }) => {
	const { extended, t, SideBarItemTemplate, AvatarTemplate, openedRoom, sidebarViewMode } = data;

	if (typeof item === 'string') {
		const Section = sections[item];
		return Section ? (
			<Section aria-level='1' />
		) : (
			<Sidebar.Section.Title aria-level='1'>{t(item)}</Sidebar.Section.Title>
		);
	}
	return (
		<div>
			<Accordion>
				<Accordion.Item
					title={t(item.title)}
					aria-level='1'
					color='white'
					style={{ color: 'white' }}
				>
					{item.data.map((itemData, index) => (
						<Box color='default' fontScale='p1' marginBlockEnd='x16' key={index}>
							<SideBarItemTemplateWithData
								sidebarViewMode={sidebarViewMode}
								selected={itemData.rid === openedRoom}
								t={t}
								room={itemData}
								extended={extended}
								SideBarItemTemplate={SideBarItemTemplate}
								AvatarTemplate={AvatarTemplate}
							/>
						</Box>
					))}
				</Accordion.Item>
			</Accordion>
		</div>
	);
};

export default memo(Row);
