import { Meteor } from 'meteor/meteor';

const SubSchema = new SimpleSchema({
    x: {type: Number},
    y: {type: Number},
    z: {type: String}
});

const ReproSchema = new SimpleSchema({
    values: {type: [SubSchema]}
});
const ReproCollection = new Mongo.Collection('repro-347');


function makeValues(n, x, y, z) {
    var retval = [];
    for (let i = 0; i < n; i++) {
        retval.push({x: x, y: y, z: z});
    }
    return retval;
}

var schemaAttached = false;

Meteor.methods({
    'attach-schema': function () {
        ReproCollection.attachSchema(ReproSchema);
        schemaAttached = true;
        return 'Attached Schema';
    },

    'benchmark': function(n, m, validate, bypassCollection2) {
        console.log(typeof n, typeof m, typeof validate, typeof bypassCollection2);
        ReproCollection.remove({});

        var retval = [schemaAttached, validate, bypassCollection2, n, m];

        console.log('starting run', n, m, validate, bypassCollection2);

        var start = new Date();
        for (var i = 0; i < n; i++) {
            console.log(i, n, i < n);
            ReproCollection.insert({values: makeValues(m, 10, 20, 'foo')}, {validate: validate, bypassCollection2: bypassCollection2});
        }
        console.log('insert done');
        retval.push(new Date() - start);

        start = new Date();
        ReproCollection.update({}, {$set: {values: makeValues(m, 42, 42, 'bar')}}, {multi: true}, {validate: validate, bypassCollection2: bypassCollection2});
        console.log('update done');
        retval.push(new Date() - start);

        return retval;
    }
});
