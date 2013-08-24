#Buffer to Google+ via casperjs/phantomjs

>A nodejs script/daemon that will connect with Buffer API and post to google+ when new updates were submitted via buffer
#



##How does this work?
If you've ever wondered why buffer does not share to google+, it's because google+ doesn't have an publicly available API.

Using Casper.js, the script opens google+ sharing page in a hidden(headless) browser, and posts the update received from buffer API.


##Requirenments

- Node.js
- Phantomjs
- Casperjs

##Setup
- Clone the repo
- Make sure you have casperjs on your path - ``casperjs --version``
- Install npm requirenments - ``npm install``
- Obtain a buffer __Access Token__
    - Go here : [Buffer Developer site](https://bufferapp.com/developers/apps/create)
    - Create an example app, and copy the __Access Token__ you receive 
    - Wait 2 min and go to [http://bufferapp.com/developers/apps](http://bufferapp.com/developers/apps) to obtain your Access Token.
- Save __example_config.json__ as __config.json__ and edit it with your Access Token, Google+ Username and password.
- In the __service__ field, choose to which of your buffer accounts this script will listen. Can be one of `twitter`, `facebook`, `linkedin`


```json
{
    "buffer_conf": {
        "service": "linkedin",
        "access_token": "BUFFER_ACCESS_TOKEN"
    },
    "google_conf": {
        "email": "YOUREMAILHERE",
        "password": "YOURPASSWORDHERE"
    }
}
```

 - This script requires your google __username/password__, but as it's running locally, it's not a HUGE security risk, just a mild one. 

##Running the server
```bash
node app.js
```

##Installing as a service on mac osx
```
sudo node mac_daemon.js install
```
This will install the node server as a damon on your mac, that should work and reset itself on fails / restarts. 
This requires sudo priveleges.

After service is Installed, logs can be viewed in ``/Library/Logs/Buffer to Google+/buffertogoogle.log``

To uninstall the server ``sudo node mac_daemon.js uninstall``

##Why?
This was done as a proof of concept. Getting Casperjs script to post to google was challenging and it was fun. 

##Known Issues
Because this is a hack, and google+ doesn't have a public API, some issues arrose.

- Doesn't work if you have 2 step authentication enabled
- Doesn't work on remote servers, I initially wanted this to run on heroku, can't be done
- Has to run from any location google already seen you logging in

##Desclaimer
WHile this code doesn't do anything harmful like saving your password (check for youself, it's all here), it doesn't stop someone from accessing your computer and reading the config.json.
###USE AT YOUR OWN RISK
I'm not responsible for any damages that using this script may provide you.





