if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click #write': function (e, tmpl) {
      var $buffer = tmpl.$('#buffer');
      console.log($buffer.val());
      val = $buffer.val();
      // increment the counter when button is clicked
      Electrify.call('write', [val], function(err, res) {
        if (err) {
          return console.log('[ERR]', err);
        }
        console.log ('[OK] ', res);
      })
    },
    'click #listen': function() {
      console.log('listening!');
      Electrify.call('listen', [], function(err, data) {
        console.log(data);
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
