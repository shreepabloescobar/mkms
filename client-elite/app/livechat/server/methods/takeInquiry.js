import { Meteor } from 'meteor/meteor';

import { hasPermission } from '../../../authorization';
import { Users, LivechatInquiry, LivechatRooms } from '../../../models/server';
import { RoutingManager } from '../lib/RoutingManager';
import { userCanTakeInquiry } from '../lib/Helper';
import { QueueManager } from '../lib/QueueManager';
import { addUserToRoom } from '../../../lib/server/functions/addUserToRoom';

Meteor.methods({
	'livechat:takeInquiry'(inquiryId, options) {
		if (!Meteor.userId() || !hasPermission(Meteor.userId(), 'view-l-room')) {
			throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:takeInquiry' });
		}

		const inquiry = LivechatInquiry.findOneById(inquiryId);

		if (!inquiry || inquiry.status === 'taken') {
			throw new Meteor.Error('error-not-allowed', 'Inquiry already taken', { method: 'livechat:takeInquiry' });
		}

		const user = Users.findOneById(Meteor.userId(), { fields: { _id: 1, username: 1, roles: 1, status: 1, statusLivechat: 1 } });
		if (!userCanTakeInquiry(user)) {
			throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:takeInquiry' });
		}

		const agent = {
			agentId: user._id,
			username: user.username,
		};

		return RoutingManager.takeInquiry(inquiry, agent, options);
	},
});

Meteor.methods({
	async 'livechat:reOpen'(roomId, options = { clientAction: false }) {
		const room = await LivechatRooms.findOneById(roomId);
		if (!room || room.t !== 'l') {
			throw new Meteor.Error('error-invalid-room', 'Invalid room', { method: 'livechat:resumeOnHold' });
		}

		const user = options.clientAction ? Meteor.user() : Users.findOneById('rocket.cat');

		if (room.closedAt) {
			Promise.await(QueueManager.unarchiveRoom({ ...room, servedBy: null }));
			addUserToRoom(room._id, user, user);
		}
	},
});
