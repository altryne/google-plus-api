var sys = require('sys')
var fs = require('fs');
var exec = require('child_process').exec;
var request = require('request');
var _ = require('underscore');

try {
    var config = require('./config');
} catch (e) {
    console.log('Please check your required config file');
    process.exit(1)
}
var updates = [];
var last_buffer_fetch_utc = parseInt(+Date.now() / 1000);
init();

console.log('Starting monitoring, go to buffer and post something, you will see it appear here');

function init() {
    if (!config.buffer_conf.profile_id) {
        console.log('Getting buffer profile id');
        updateBufferProfileID();
    } else {

    }
    getBufferUpdates();
    setInterval(getBufferUpdates,1000 * 60)

    postUpdatedToGoogle();
    setInterval(postUpdatedToGoogle,1000 * 5)
}

function getBufferUpdates(is_first_time){
    if(!config.buffer_conf.profile_id) return;
    var params = {since : last_buffer_fetch_utc ,count:5};
    url = 'profiles/' + config.buffer_conf.profile_id + '/updates/sent.json';
    bufferAPI(url,function(body){
        if(body.updates.legth > 0){
            console.log('Got ' + body.total + ' updates from buffer, number of new : ' + body.updates.length);
        }
        updates = updates.concat(body.updates);
        last_buffer_fetch_utc = parseInt(+Date.now() / 1000);
    },params)
}

function postUpdatedToGoogle(){
    if(updates.length < 1){
//        console.log('Nothing to post');
        return
    }
    _.each(updates,function(el,i,list){
        console.log('Posting update to google+ : ' ,el.text);
        work_dir = (process.env["WORKING_DIR"])? process.env["WORKING_DIR"] : require('path').join(__dirname);
        exec('cd ' +work_dir+';casperjs googleplus.js --cookies-file=cookies.txt --username='+ config.google_conf.email +' --password='+config.google_conf.password+' --text="'+ el.text +'"',function(e,stdout,stderr){
            sys.puts(stdout);
            console.log(e);
        });
        list.splice(i, 1);
    })

}

function updateBufferProfileID() {
    //get buffer profile id and save to conf
    bufferAPI('profiles.json',function(body){
        arr = body;
        config.buffer_conf.profile_id = _.findWhere(arr, {'service': config.buffer_conf.service}).id
        console.log('Buffer profile ID is ' + config.buffer_conf.profile_id);
        fs.writeFile('./config.json', JSON.stringify(config, null, 4), function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("JSON saved");
            }
        });
    })
}

function bufferAPI(url,callback,params){
    params = params || {}
    params_str = "&";

    if(_.size(params) > 0){
        for (var key in params) {
            if (params_str != "") {
                params_str += "&";
            }
            params_str += key + "=" + params[key];
        }
    }
    url = 'https://api.bufferapp.com/1/' + url + '?access_token=' + config.buffer_conf.access_token + params_str;
//    console.log('Buffer api called', url, params);
    request(url,function(error,response,body){
        if (!error && response.statusCode == 200) {
            callback(JSON.parse(body))
        }else{
            console.log('There was an error with buffer api',error);
        }
    });
}

function puts(error, stdout, stderr) {
    sys.puts(stdout)
}
