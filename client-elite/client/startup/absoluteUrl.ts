import { Meteor } from 'meteor/meteor';

import { baseURI } from '../lib/baseURI';

Meteor.absoluteUrl.defaultOptions = { ...Meteor.absoluteUrl.defaultOptions, rootUrl: baseURI };
