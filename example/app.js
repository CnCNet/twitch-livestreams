/// <reference path="typings/index.d.ts" />
window.onload = function () {
    // TODO Tidy up into something simple
    // Basic Usuage Example
    var container = document.querySelector(".twitch-container");
    var config = {
        clientId: "cds8o89o71q4a4us2desr58fo3tyizd",
        url: "app.json" // "https://cncnet.org/app_json/streams.php"
    };
    var filters = ["tom Clancy's Rainbow Six: siege", "red alert"];
    var stream = new cncnet.Stream(config);
    var streamEmbed = new cncnet.StreamEmbed(container);
    var timer = setInterval(function () {
        var liveProfiles = stream.liveProfiles;
        if (liveProfiles != null) {
            for (var i = 0; i < liveProfiles.length; i++) {
                var profile = liveProfiles[i];
                streamEmbed.addProfile(profile);
            }
        }
    }, 3000);
};
var cncnet;
(function (cncnet) {
    var Stream = (function () {
        function Stream(config, filters) {
            if (filters === void 0) { filters = null; }
            this.TWITCH_API_URL = "https://api.twitch.tv/kraken/streams/";
            this.url = config.url;
            this.clientId = config.clientId;
            this.filters = filters;
            this.profiles = [];
            this.profilesLive = [];
            this.getProfiles();
        }
        Object.defineProperty(Stream.prototype, "liveProfiles", {
            get: function () {
                this.getProfiles();
                return this.profilesLive;
            },
            enumerable: true,
            configurable: true
        });
        Stream.prototype.getProfiles = function () {
            var _this = this;
            $.ajax(this.url).done(function (response) { return _this.onProfilesFound(response); });
        };
        Stream.prototype.onProfilesFound = function (response) {
            this.profiles = response;
            this.getLiveTwitchProfiles();
        };
        Stream.prototype.getLiveTwitchProfiles = function () {
            var _this = this;
            // TODO - Rate limit
            this.profilesLive = [];
            for (var i = 0; i < this.profiles.length; i++) {
                var profile = this.profiles[i];
                $.ajaxSetup({ headers: { "Client-ID": this.clientId } });
                $.ajax(this.TWITCH_API_URL + profile['name'])
                    .done(function (response) { return _this.onLiveTwitchProfilesFound(response); });
            }
        };
        Stream.prototype.onLiveTwitchProfilesFound = function (response) {
            // If stream is live
            if (response.stream != null) {
                if (this.filters != null) {
                    // Filter channels by game
                    var arr = this.filters.map(function (x) { return x.toLowerCase(); });
                    if (arr.indexOf(response.stream.game.toLowerCase()) != -1) {
                        this.profilesLive.push(response);
                    }
                }
                else {
                    // No filters supplied
                    this.profilesLive.push(response);
                }
            }
        };
        return Stream;
    }());
    cncnet.Stream = Stream;
})(cncnet || (cncnet = {}));
var cncnet;
(function (cncnet) {
    var StreamEmbed = (function () {
        function StreamEmbed(container) {
            this.container = container;
            this.embedded = [];
            this.profiles = [];
        }
        StreamEmbed.prototype.addProfile = function (profile) {
            if (this.profiles.indexOf(profile) == -1)
                this.profiles.push(profile);
            this.updateEmbed(profile);
        };
        StreamEmbed.prototype.updateEmbed = function (profile) {
            var streamId = this.getUniqueStreamId(profile);
            var embed = document.getElementById(streamId);
            if (embed == null) {
                embed = document.createElement("div");
                embed.id = this.createUniqueStreamId(profile);
                embed.classList.add("twitch-profile-embed");
                this.container.appendChild(embed);
                // This only gets called once
                this.addTwitchPlayer(profile, embed);
            }
            else {
                // TODO - Bit messy tidy at some point.
                var profileInfo = document.getElementById("profile_" + embed.id);
                if (profileInfo == null) {
                    profileInfo = document.createElement("div");
                    embed.appendChild(profileInfo);
                }
                profileInfo.id = "profile_" + embed.id;
                profileInfo.classList.add("twitch-profile-bio");
                profileInfo.innerHTML =
                    "<div class='bio'>"
                        + "<div class='profile'>"
                        + "<h3><span class='badge'>Live</span>"
                        + profile.stream.channel.display_name
                        + "<span class='badge badge-right'> Viewers: "
                        + profile.stream.viewers
                        + "</span>"
                        + "</h3>"
                        + "</div>"
                        + "<ul class='list-unstyled'>"
                        + "<li>Playing : " + profile.stream.game + "</li>"
                        + "<li>Average FPS: " + profile.stream.average_fps.toFixed(1) + "</li>"
                        + "<li>Total Views: " + profile.stream.channel.views.toLocaleString() + "</li>"
                        + "<li>Followers: " + profile.stream.channel.followers.toLocaleString() + "</li>"
                        + "</ul>";
                +"</div>";
            }
        };
        StreamEmbed.prototype.addTwitchPlayer = function (profile, embed) {
            var options = {
                width: 854,
                height: 380,
                channel: profile.stream.channel.display_name
            };
            var player = new Twitch.Player(embed.id, options);
            player.pause();
            // If Twitch exists already, no need to add another
            var iframe = embed.getElementsByTagName("iframe")[0];
            if (iframe == null) {
                embed.appendChild(player);
            }
        };
        StreamEmbed.prototype.createUniqueStreamId = function (profile) {
            return "stream_" + profile.stream.channel.display_name;
        };
        StreamEmbed.prototype.getUniqueStreamId = function (profile) {
            return "stream_" + profile.stream.channel.display_name;
        };
        return StreamEmbed;
    }());
    cncnet.StreamEmbed = StreamEmbed;
})(cncnet || (cncnet = {}));
