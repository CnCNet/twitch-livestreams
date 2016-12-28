/// <reference path="typings/index.d.ts" />

window.onload = function() {
    // TODO Tidy up into something simple
    // Basic Usuage Example

    var container : HTMLDivElement = document.querySelector(".twitch-container") as HTMLDivElement;
    
    var config : IStreamConfig = {
        clientId: "cds8o89o71q4a4us2desr58fo3tyizd",
        url: "app.json" // "https://cncnet.org/app_json/streams.php"
    };

    var stream = new cncnet.Stream(config);
    var streamEmbed = new cncnet.StreamEmbed(container);
    
    var timer = setInterval(function(){
        var liveUsernames = stream.liveUsernames;
        
        if(liveUsernames != null)
        {
            for (var i: number = 0; i < liveUsernames.length; i++)
            {
                var user : ITwitchProfile = liveUsernames[i];
                streamEmbed.addProfile(user);
            }
        }

        console.log("Live Usernames: ", liveUsernames);
    }, 3000);    
};
