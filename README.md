# Twitch.tv Livestreams
Easily embed a list of streamers into your website. Twitch-livestreams works by checking a supplied list of Twitch.tv usernames. 
If they are online it will embed them into the page.

## Features
**Find online streamers automatically**<br/>
You can supply an array of usernames, the app will look through the list and return the ones that are live.

**Find online streams by game**<br/>
You can supply an optional array of game titles you only want displayed into your page. For example, if a username is online 
and streaming C&C Red Alert 1, but you've supplied a list of games that doesn't include Red Alert 1, it will not display.

**Embedding**<br/>
Optionally add embedded streams to your page

**Chat**<br/>
Optionally add stream chat to your embedded streams.

--

## Usage

### Basic setup
    var config = {
      clientId: "xxx",
      url: "app.json"
    };
    var filters = ["red alert", "Red Alert 1"];
    var stream = new cncnet.Stream(config, filters);
    var streamEmbed = new cncnet.StreamEmbed(container);
    
### Check usernames for updates every X seconds

    var timer = setInterval(function(){
        var liveProfiles = stream.liveProfiles;
        
        if(liveProfiles != null)
        {
            for (var i = 0; i < liveProfiles.length; i++)
            {
                var profile = liveProfiles[i];
                streamEmbed.addProfile(profile);
            }
        }
    }, 3000);    

## Methods
#### Returns array of live profiles
    stream.liveProfiles
    
#### Add a profile to be embedded
    streamEmbed.addProfile(...)
