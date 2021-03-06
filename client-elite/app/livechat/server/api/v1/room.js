import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';
import { Random } from 'meteor/random';
import { TAPi18n } from 'meteor/rocketchat:tap-i18n';

import { settings as rcSettings } from '../../../../settings';
import { Messages, LivechatRooms, LivechatVisitors } from '../../../../models';
import { API } from '../../../../api/server';
import { findGuest, findRoom, getRoom, settings, findAgent, onCheckRoomParams } from '../lib/livechat';
import { Livechat } from '../../lib/Livechat';
import { normalizeTransferredByData, createLivechatRoom, createLivechatInquiry } from '../../lib/Helper';
import { findVisitorInfo } from '../lib/visitors';
import { OmnichannelSourceType } from '../../../../../definition/IRoom';
import { Users, LivechatInquiry } from '../../../../models/server';
import { getDefaultUserFields } from '../../../../utils/server/functions/getDefaultUserFields';
import { addUserToRoom } from '../../../../lib/server/functions/addUserToRoom';
import { QueueManager, queueInquiry } from '../../lib/QueueManager';

API.v1.addRoute('livechat/room/add', { authRequired: true }, {
	post() {
		const fields = getDefaultUserFields();
		const sessionUser = Users.findOneById(this.userId, { fields });
		if (!sessionUser || !sessionUser.roles.includes('admin')) {
			return API.v1.unauthorized();
		}

		const defaultCheckParams = {
			userId: String,
			agentId: Match.Maybe(String),
			roomName: Match.Maybe(String),
		};
		const extraCheckParams = onCheckRoomParams(defaultCheckParams);
		check(this.bodyParams, extraCheckParams);

		const { userId, agentId, roomName, ...extraParams } = this.bodyParams;
		const user = Users.findOneById(userId, { fields });

		const token = user._id;
		const rName = roomName || user.name;
		const visitorId = Livechat.registerGuest({ ...user, token, name: rName });
		const guest = LivechatVisitors.findOneById(visitorId);

		let room;
		room = LivechatRooms.findOneByVisitorToken(token);
		if (room) {
			addUserToRoom(room._id, user);
			return API.v1.success({ room, newRoom: false });
		}

		const rid = Random.id();
		const roomInfo = {
			fname: rName,
			source: {
				type: this.isWidget() ? OmnichannelSourceType.WIDGET : OmnichannelSourceType.API,
			},
		};

		room = LivechatRooms.findOneById(createLivechatRoom(rid, rName, guest, roomInfo, extraParams));
		LivechatRooms.updateRoomCount();

		addUserToRoom(room._id, user);
		return API.v1.success({ room, newRoom: true });
	},
});

API.v1.addRoute('livechat/group/add', { authRequired: true }, {
	post() {
		const fields = getDefaultUserFields();
		const sessionUser = Users.findOneById(this.userId, { fields });
		if (!sessionUser || !sessionUser.roles.includes('admin')) {
			return API.v1.unauthorized();
		}

		const defaultCheckParams = {
			userIds: Match.Maybe(Array),
			batchId: String,
			subBatchId: String,
			agentId: Match.Maybe(String),
			roomName: Match.Maybe(String),
		};
		const extraCheckParams = onCheckRoomParams(defaultCheckParams);
		check(this.bodyParams, extraCheckParams);

		const { userIds, batchId, subBatchId, agentId, roomName, ...extraParams } = this.bodyParams;
		const batchToken = `batch-${ batchId }-${ subBatchId }`;
		const rName = roomName || batchToken.toUpperCase();
		const visitorId = Livechat.registerGuest({
			username: batchToken,
			token: batchToken,
			name: rName,
		});
		const guest = LivechatVisitors.findOneById(visitorId);

		let room;
		room = LivechatRooms.findOneByVisitorToken(batchToken);
		if (room) {
			Users.findByIds(userIds).forEach((user) => addUserToRoom(room._id, user));
			return API.v1.success({ room, newRoom: false });
		}

		const rid = Random.id();
		const roomInfo = {
			fname: rName,
			source: {
				type: this.isWidget() ? OmnichannelSourceType.WIDGET : OmnichannelSourceType.API,
			},
		};

		room = LivechatRooms.findOneById(createLivechatRoom(rid, rName, guest, roomInfo, extraParams));
		LivechatRooms.updateRoomCount();

		Users.findByIds(userIds).forEach((user) => addUserToRoom(room._id, user));
		return API.v1.success({ room, newRoom: true });
	},
});

API.v1.addRoute('livechat/room/raiseInquiry', { authRequired: true }, {
	post() {
		const now = new Date();
		const fields = getDefaultUserFields();
		const user = Users.findOneById(this.userId, { fields });

		const defaultCheckParams = {
			rid: Match.Maybe(String),
		};

		const extraCheckParams = onCheckRoomParams(defaultCheckParams);
		check(this.bodyParams, extraCheckParams);

		const { rid: roomId } = this.bodyParams;
		const token = user._id;
		const guest = LivechatVisitors.findOneById(Livechat.registerGuest({ ...user, token }));

		const room = LivechatRooms.findOneById(roomId);
		if (!room) {
			return API.v1.failure();
		}

		let inquiry;
		if (room.closedAt) {
			Promise.await(QueueManager.unarchiveRoom({ ...room, servedBy: null }));
			addUserToRoom(room._id, user, user);
			Messages.createRaiseHandByUserWithRoomIdAndUser(room._id, user, { ts: now });
			inquiry = LivechatInquiry.findOneByRoomId(room._id);

			return API.v1.success({ inquiry });
		}

		addUserToRoom(room._id, user, user);

		const name = room.fname || guest.name || guest.username;
		const message = {	msg: '' };

		inquiry = LivechatInquiry.findOneByRoomId(room._id);
		if (inquiry) {
			return API.v1.success({ inquiry });
		}

		inquiry = LivechatInquiry.findOneById(createLivechatInquiry({ rid: room._id, name, guest, message }));
		Promise.await(queueInquiry(room, inquiry));
		Messages.createRaiseHandByUserWithRoomIdAndUser(room._id, user, { ts: now });

		return API.v1.success({ inquiry });
	},
});

API.v1.addRoute('livechat/room', {
	get() {
		const defaultCheckParams = {
			token: String,
			rid: Match.Maybe(String),
			agentId: Match.Maybe(String),
		};

		const extraCheckParams = onCheckRoomParams(defaultCheckParams);

		check(this.queryParams, extraCheckParams);

		const { token, rid: roomId, agentId, ...extraParams } = this.queryParams;

		const guest = findGuest(token);
		if (!guest) {
			throw new Meteor.Error('invalid-token');
		}

		let room;
		if (!roomId) {
			room = LivechatRooms.findOneOpenByVisitorToken(token, {});
			if (room) {
				return API.v1.success({ room, newRoom: false });
			}

			let agent;
			const agentObj = agentId && findAgent(agentId);
			if (agentObj) {
				const { username } = agentObj;
				agent = { agentId, username };
			}

			const rid = Random.id();
			const roomInfo = {
				source: {
					type: this.isWidget() ? OmnichannelSourceType.WIDGET : OmnichannelSourceType.API,
				},
			};

			room = Promise.await(getRoom({ guest, rid, agent, roomInfo, extraParams }));
			return API.v1.success(room);
		}

		room = LivechatRooms.findOneOpenByRoomIdAndVisitorToken(roomId, token, {});
		if (!room) {
			throw new Meteor.Error('invalid-room');
		}

		return API.v1.success({ room, newRoom: false });
	},
});

API.v1.addRoute('livechat/room.close', {
	post() {
		try {
			check(this.bodyParams, {
				rid: String,
				token: String,
			});

			const { rid, token } = this.bodyParams;

			const visitor = findGuest(token);
			if (!visitor) {
				throw new Meteor.Error('invalid-token');
			}

			const room = findRoom(token, rid);
			if (!room) {
				throw new Meteor.Error('invalid-room');
			}

			if (!room.open) {
				throw new Meteor.Error('room-closed');
			}

			const language = rcSettings.get('Language') || 'en';
			const comment = TAPi18n.__('Closed_by_visitor', { lng: language });

			if (!Livechat.closeRoom({ visitor, room, comment })) {
				return API.v1.failure();
			}

			return API.v1.success({ rid, comment });
		} catch (e) {
			return API.v1.failure(e);
		}
	},
});

API.v1.addRoute('livechat/room.transfer', {
	post() {
		try {
			check(this.bodyParams, {
				rid: String,
				token: String,
				department: String,
			});

			const { rid, token, department } = this.bodyParams;

			const guest = findGuest(token);
			if (!guest) {
				throw new Meteor.Error('invalid-token');
			}

			let room = findRoom(token, rid);
			if (!room) {
				throw new Meteor.Error('invalid-room');
			}

			// update visited page history to not expire
			Messages.keepHistoryForToken(token);

			const { _id, username, name } = guest;
			const transferredBy = normalizeTransferredByData({ _id, username, name, userType: 'visitor' }, room);

			if (!Promise.await(Livechat.transfer(room, guest, { roomId: rid, departmentId: department, transferredBy }))) {
				return API.v1.failure();
			}

			room = findRoom(token, rid);
			return API.v1.success({ room });
		} catch (e) {
			return API.v1.failure(e);
		}
	},
});

API.v1.addRoute('livechat/room.survey', {
	post() {
		try {
			check(this.bodyParams, {
				rid: String,
				token: String,
				data: [Match.ObjectIncluding({
					name: String,
					value: String,
				})],
			});

			const { rid, token, data } = this.bodyParams;

			const visitor = findGuest(token);
			if (!visitor) {
				throw new Meteor.Error('invalid-token');
			}

			const room = findRoom(token, rid);
			if (!room) {
				throw new Meteor.Error('invalid-room');
			}

			const config = settings();
			if (!config.survey || !config.survey.items || !config.survey.values) {
				throw new Meteor.Error('invalid-livechat-config');
			}

			const updateData = {};
			for (const item of data) {
				if ((config.survey.items.includes(item.name) && config.survey.values.includes(item.value)) || item.name === 'additionalFeedback') {
					updateData[item.name] = item.value;
				}
			}

			if (Object.keys(updateData).length === 0) {
				throw new Meteor.Error('invalid-data');
			}

			if (!LivechatRooms.updateSurveyFeedbackById(room._id, updateData)) {
				return API.v1.failure();
			}

			return API.v1.success({ rid, data: updateData });
		} catch (e) {
			return API.v1.failure(e);
		}
	},
});

API.v1.addRoute('livechat/room.forward', { authRequired: true }, {
	post() {
		API.v1.success(Meteor.runAsUser(this.userId, () => Meteor.call('livechat:transfer', this.bodyParams)));
	},
});

API.v1.addRoute('livechat/room.visitor', { authRequired: true }, {
	put() {
		try {
			check(this.bodyParams, {
				rid: String,
				oldVisitorId: String,
				newVisitorId: String,
			});

			const { rid, newVisitorId, oldVisitorId } = this.bodyParams;

			const { visitor } = Promise.await(findVisitorInfo({ userId: this.userId, visitorId: newVisitorId }));
			if (!visitor) {
				throw new Meteor.Error('invalid-visitor');
			}

			let room = LivechatRooms.findOneById(rid, { _id: 1 }); // TODO: check _id
			if (!room) {
				throw new Meteor.Error('invalid-room');
			}

			const { v: { _id: roomVisitorId } = {} } = room; // TODO: v it will be undefined
			if (roomVisitorId !== oldVisitorId) {
				throw new Meteor.Error('invalid-room-visitor');
			}

			room = Livechat.changeRoomVisitor(this.userId, rid, visitor);

			return API.v1.success({ room });
		} catch (e) {
			return API.v1.failure(e);
		}
	},
});
