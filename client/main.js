import { Template } from 'meteor/templating';

import './main.html';

function n() {
    return parseInt(document.getElementById('n').value, 10);
}

function m() {
    return parseInt(document.getElementById('m').value, 10);
}

function log(err, msg) {
    console.log(err, msg);
    var $tr = $('<tr>');
    msg.forEach((field) => $tr.append($('<td>').text(field)));
    $("#result").find("tbody").append($tr);
}

Template.content.events({
    'click #attach-schema'() {
        Meteor.call('attach-schema', log);
    },
    
    'click #run-with-validate'() {
        Meteor.call('benchmark', n(), m(), true, false, log);
    },

    'click #run-without-validate'() {
        Meteor.call('benchmark', n(), m(), false, false, log);
    },

    'click #run-bypass'() {
        Meteor.call('benchmark', n(), m(), false, true, log);
    }
});
