/***
 * Google+ unofficial post api
 * Usage : casperjs googleplus.js --username=YOURUSERNAME --password=YOURGOOGLEPASSWORD --text="whatever text you want to post"
 * google is not sure this is you, so either provide a verify email or verify phone
 * This needs to be done 1 time
 *
 * Note :
 */

var casper = require('casper').create(
    { verbose: false, logLevel: "warning"}
);
/**
 * Get the variables from the cli call
 * @type {*}
 */
username = casper.cli.get("username")
password = casper.cli.get("password")
text     = casper.cli.get("text")


casper.start('https://accounts.google.com/ServiceLogin?hl=en&continue=https://www.google.com/ncr', function LoginWithGoogle() {
    this.viewport(800, 600);
    console.info('Starting Casper');
    this.fillSelectors('form#gaia_loginform', {
        'input[name="Email"]':    username,
        'input[name="Passwd"]':    password
    }, true);
});

casper.then(function CheckIfGoogleWantsVerification(){
    _url = this.getCurrentUrl();
    if(_url.indexOf(/SmsAuthInterstitial/) > 0){
        this.open('https://google.com/ncr')
    }
},function(){
    console.warn('Oops something went wrong')
},1000)

casper.waitForUrl(/LoginVerification/g,function VerifyGoogleAccount(){
    console.warn('google asked for login verification')
//    this.debugPage()
    challengetype_answer = (verify_email.length > 0) ? 'RecoveryEmailChallenge' : 'PhoneVerificationChallenge' ;
    this.fill('#challengeform',{
        'challengetype' : challengetype_answer,
        'phoneNumber'   : verify_phone,
        'emailAnswer'   : verify_email
    },true)
},function(){
//    console.warn('Google did not ask for verification')
},1000)

casper.waitForUrl(/google.com/g,function GoToGoogleCom(){
    _url = this.getCurrentUrl();
    if(_url.indexOf('ServiceLoginAuth') > 0){
        casper.die('Please check your password in config.json and try again')
    }
},function(){

},1000)

casper.waitForSelector('a[href="https://plus.google.com/u/0/stream/all?hl=en"]',function(){
    this.click('a[href="https://plus.google.com/u/0/stream/all?hl=en"]')
});

casper.wait(4000);

casper.withFrame('gbsf', function SubmitPostToGooglePlus() {
    this.click('div[guidedhelpid="sharebox_editor"]')
    this.sendKeys('div[guidedhelpid="sharebox_editor"] [role="textbox"]',text + '\r\n',{keepFocus: true})
    this.wait(2000,function WaitingForShare(){
        this.capture('shared_screenshot.png', {top: 0, left: 0, width: 960, height: 600 });
        this.clickLabel('Share')
    })

    this.wait(5000,function WaitingForGoogleToSubmit(){
        casper.warn('Posted to google+ !')
    })
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
