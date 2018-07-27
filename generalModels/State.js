const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * State Model
 * ==========
 */
const State = new keystone.List('State', {
    //track: true
});

State.add({
  name: { type: String, required: true, index: true },
});

State.relationship({ ref: 'LocalGovernment', path: 'localGovernments', refPath: 'state' });

/**
 * Registration
 */
State.defaultSort = 'name';
State.defaultColumns = 'name';
State.register();
