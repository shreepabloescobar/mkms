import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Subscriptions } from '../../app/models';
import { hasPermission } from '../../app/authorization';
import { settings } from '../../app/settings';
import { loadMessageHistory } from '../../app/lib/server';

Meteor.methods({
	loadHistory(rid, end, limit = 20, ls, showThreadMessages = true) {
		check(rid, String);

		if (!Meteor.userId() && settings.get('Accounts_AllowAnonymousRead') === false) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'loadHistory',
			});
		}

		const fromId = Meteor.userId();
		const room = Meteor.call('canAccessRoom', rid, fromId);

		if (!room) {
			return false;
		}

		const canAnonymous = settings.get('Accounts_AllowAnonymousRead');
		const canPreview = hasPermission(fromId, 'preview-c-room');

		if (room.t === 'c' && !canAnonymous && !canPreview && !Subscriptions.findOneByRoomIdAndUserId(rid, fromId, { fields: { _id: 1 } })) {
			return false;
		}

		return loadMessageHistory({ userId: fromId, rid, end, limit, ls, showThreadMessages });
	},
});
