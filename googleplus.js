/***
 * Google+ unoficcial post api
 * Usage : casperjs googleplus.js --username=YOURUSERNAME --password=YOURGOOGLEPASSWORD --text="whatever text you want to post"
 * Optional : --verify_phone=PHONE_NUMBER --verify_email=EMAIL - these are needed when you run this script from a remote host,
 * google is not sure this is you, so either provide a verify email or verify phone
 * This needs to be done 1 time
 *
 * Note :
 */

var casper = require('casper').create(
    { verbose: true, logLevel: "debug"}
);
/**
 * Get the variables from the cli call
 * @type {*}
 */
username = casper.cli.get("username")
password = casper.cli.get("password")
text     = casper.cli.get("text")
verify_email = casper.cli.get("verify_email")
verify_phone = casper.cli.get("verify_phone")

casper.start('https://accounts.google.com/ServiceLogin?hl=en&continue=https://www.google.com/ncr', function() {
    this.viewport(800, 600)
    this.fillSelectors('form#gaia_loginform', {
        'input[name="Email"]':    username,
        'input[name="Passwd"]':    password
    }, true);
});

casper.then(function(){
    _url = this.getCurrentUrl();
    if(_url.indexOf(/SmsAuthInterstitial/) > 0){
        this.open('https://google.com/ncr')
    }
},function(){
    casper.warn('NIGGAH PLEASE1')
})

casper.waitForUrl(/LoginVerification/g,function(){
    console.warn('google asked for login verification')
    this.debugPage()
    challengetype_answer = (verify_email.length > 0) ? 'RecoveryEmailChallenge' : 'PhoneVerificationChallenge' ;
    this.fill('#challengeform',{
        'challengetype' : challengetype_answer,
        'phoneNumber'   : verify_phone,
        'emailAnswer'   : verify_email
    },true)
},function(){
    casper.warn('No verification needed')
})

casper.waitForUrl(/google.com/g,function(){
})

casper.wait(2000)

casper.then(function(){
    this.click('a[href="https://plus.google.com/u/0/stream/all?hl=en"]')
})
casper.wait(5000)

casper.withFrame('gbsf', function() {
    this.click('div[guidedhelpid="sharebox_editor"]')
    this.wait(2000)
    this.sendKeys('div[guidedhelpid="sharebox_editor"] [role="textbox"]',text,{keepFocus: false})
    this.sendKeys('div[guidedhelpid="sharebox_editor"] [role="textbox"]',' ',{keepFocus: false})
    this.wait(3000)
    urls = text.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/)
    if(usharrls && urls.length > 0){
        this.click('span[title="Add link"]')
        this.sendKeys('[guidedhelpid="sharebox_icons"] input[type="text"]',urls[0],{keepFocus:true})
        this.wait(2000,function(){
            this.clickLabel('Add')
        })
    }

    /** THIS IS WHERE I NEED TO FIGURE OUT HOW TO "SUBMIT" THE LINK TO GOOGLE+ TO IDENTIFY! **/

//    this.capture('share1.png', {top: 0, left: 0, width: 960, height: 600 });

    this.clickLabel('Share')
//    this.capture('share2.png', {top: 0, left: 0, width: 960, height: 600 });

});

casper.on('load.failed', function() {
    console.log('Could not load webpage.');
    this.capture('error_1.png', {top: 0, left: 0, width: 800, height: 600 });
    this.exit();
});

casper.on('error', function(msg, backtrace) {
    console.log('Error: ' + msg);
    this.debugPage();
    this.capture('error_2.png', {top: 0, left: 0, width: 800, height: 600 });
    this.exit();
});

casper.on('timeout', function() {
    this.echo('PAGE TIMEOUTED!')
    console.log('The webpage timed out.');
    this.debugPage();
    this.capture('error_3.png', {top: 0, left: 0, width: 800, height: 600 });
    this.exit();
});

casper.on('step.timeout', function() {
    this.echo('PAGE TIMEOUTED!')
    this.debugPage();
    this.capture('error_4.png', {top: 0, left: 0, width: 800, height: 600 });
    this.exit();
});

casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg, "ERROR");
});

casper.on('step.error', function(err) {
    this.debugPage();
    this.capture('error_6.png', {top: 0, left: 0, width: 800, height: 600 });
    this.die("Step has failed: " + err);
});

casper.on('complete.error', function() {
    console.log('Something went wrong!');
    this.debugPage();
    this.capture('error_7.png', {top: 0, left: 0, width: 800, height: 600 });
    this.exit();
});

casper.on('page.error', function(msg, backtrace) {
    console.log('There was an error loading the webpage.');
    this.debugPage();
    this.capture('error_8.png', {top: 0, left: 0, width: 800, height: 600 });
    this.exit();
});


casper.run(function() {
    // echo results in some pretty fashion
    this.exit()
});
