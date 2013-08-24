var Service = require('node-mac').Service;
var exec = require('child_process').exec;

// Create a new service object
var svc = new Service({
    name: 'Buffer to Google+',
    description: 'Daemon waiting on buffer to post something and cross-post it to google+',
    script: 'app.js',
    env: [{
        name: "PATH",
        value: process.env["PATH"] // service is now able to access the user who created its home directory
    },{
        name : "WORKING_DIR",
        value: require('path').join(__dirname)
    }]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
    svc.start();
});

svc.on('uninstall', function () {
    console.log('Uninstall complete.');
});

svc.on('alreadyinstalled', function () {
    svc.restart();
});

var args = process.argv.splice(2);

//svc.install();
switch(args[0]){
	case "install":
        svc.install();
	break;
	case "uninstall":
        svc.uninstall();
	break;
    case "restart":
        svc.restart();
	break;
    case "test":
        console.log('HERE BE DRAGONS');
        console.log(process.env["WORKING_DIR"]);
	break;
    default:
        console.log('Please run with install,uninstall,restart args');
    break;
}

