var app = require('app');
var browser = require('browser-window');
var electrify = require('electrify')(__dirname);

var window = null;

app.on('ready', function() {

  // electrify start
  electrify.start(function(meteor_root_url) {

    // creates a new electron window
    window = new browser({
      width: 1200,
      height: 900,
      'node-integration': false // node integration must to be off
    });

    // open up meteor root url
    window.loadURL(meteor_root_url);



  });
});


app.on('window-all-closed', function() {
  app.quit();
});


app.on('will-quit', function terminate_and_quit(event) {

  // if electrify is up, cancel exiting with `preventDefault`,
  // so we can terminate electrify gracefully without leaving child
  // processes hanging in background
  if (electrify.isup() && event) {

    // holds electron termination
    event.preventDefault();

    // gracefully stops electrify 
    electrify.stop(function() {

      // and then finally quit app
      app.quit();
    });
  }
});

var SerialPort = require('serialport');
SerialPort.list(function(err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
  })

});

var serialPort = new SerialPort.SerialPort('/dev/ttyUSB0', {
  baudrate: 38400
});
serialPort.on('error', function() {
  console.log('[ERROR] serialport error!');
});

serialPort.on('close', function() {
  console.log('[ERROR] serialport closed!');
});


serialPort.on('open',function(err) {
  if (err) {
    return console.log('[ERROR] opening port!');
  }
  console.log('[OPEN]');
  serialPort.on('data', function(data) {
    console.log('[READ] ', data);
  });
});


electrify.methods({
  'write': function(buffer, done) {
    serialPort.write(buffer, function(err) {
      if (err) {
        console.log('[ERROR] writing');
        done(err);
      }
      console.log('[WRITE] ', buffer);
      done(null, 'ok');
    })
  },
  'listen': function(done) {
    var callback = function(data) {
      done(null, data);
      serialPort.removeListener('data', callback);
    }

    serialPort.on('data', callback)
  }
});

// 
// =============================================================================
// 
// the methods bellow can be called seamlessly from your Meteor's
// client and server code, using:
// 
//    Electrify.call('methodname', [..args..], callback);
// 
// ATENTION:
//    From meteor, you can only call these methods after electrify is fully
//    started, use the Electrify.startup() convenience method for this
// 
// 
// Electrify.startup(function(){
//   Electrify.call(...);
// });
// 
// =============================================================================
// 
// electrify.methods({
//   'method.name': function(name, done) {
//     // do things... and call done(err, arg1, ..., argN)
//     done(null);
//   }
// });
//
